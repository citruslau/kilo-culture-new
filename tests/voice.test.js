import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createVoiceController } from '../src/voice-controller.js';

function setup(options = {}) {
  const handlers = {};
  const calls = [];
  const client = {
    on(event, handler) { handlers[event] = handler; },
    async start(...args) { calls.push(args); return { id: 'call' }; },
    async stop() { calls.push('stop'); },
  };
  let state;
  const controller = createVoiceController({
    assistantId: 'assistant',
    loadClient: async () => client,
    prepareMicrophone: async () => {},
    onChange: value => { state = value; },
    ...options,
  });
  return { controller, handlers, calls, client, state: () => state };
}

test('starts only once and waits for call-start before showing a live call', async () => {
  const fixture = setup();
  await Promise.all([fixture.controller.start(), fixture.controller.start()]);
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.calls[0][0], 'assistant');
  assert.equal(fixture.state().phase, 'connecting');
  fixture.handlers['call-start']();
  assert.equal(fixture.state().phase, 'listening');
  fixture.handlers['speech-start']();
  assert.equal(fixture.state().phase, 'speaking');
  fixture.handlers['speech-end']();
  assert.equal(fixture.state().phase, 'listening');
  await fixture.controller.end();
  assert.equal(fixture.state().phase, 'idle');
  assert.ok(fixture.calls.includes('stop'));
  fixture.handlers['speech-start']();
  assert.equal(fixture.state().phase, 'idle', 'Late SDK events cannot revive an ended call');
});

test('microphone denial avoids starting a paid call and allows a retry', async () => {
  let denied = true;
  const fixture = setup({ prepareMicrophone: async () => {
    if (denied) throw Object.assign(new Error(), { name: 'NotAllowedError' });
  } });
  await fixture.controller.start();
  assert.equal(fixture.state().phase, 'error');
  assert.match(fixture.state().message, /microphone/i);
  assert.equal(fixture.calls.length, 0);
  denied = false;
  await fixture.controller.start();
  assert.equal(fixture.calls.length, 1);
});

test('a null start result is a failure even without an error event', async () => {
  const fixture = setup();
  fixture.client.start = async () => null;
  await fixture.controller.start();
  assert.equal(fixture.state().phase, 'error');
  assert.ok(fixture.calls.includes('stop'));
});

test('SDK errors release the call and preserve the helpful error through call-end', async () => {
  const fixture = setup();
  await fixture.controller.start();
  fixture.handlers.error({ error: { message: 'Origin not allowed' } });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(fixture.state().phase, 'error');
  assert.match(fixture.state().message, /contact the team/i);
  fixture.handlers['call-end']();
  assert.equal(fixture.state().phase, 'error');
  assert.ok(fixture.calls.includes('stop'));
});

test('assistant end-call returns controls to idle', async () => {
  const fixture = setup();
  await fixture.controller.start();
  fixture.handlers['call-start']();
  fixture.handlers['call-end']();
  assert.equal(fixture.state().phase, 'idle');
});

test('cancelling while microphone permission is pending never starts a call', async () => {
  let grantPermission;
  const fixture = setup({ prepareMicrophone: () => new Promise(resolve => { grantPermission = resolve; }) });
  const pending = fixture.controller.start();
  await fixture.controller.end();
  grantPermission();
  await pending;
  assert.equal(fixture.calls.length, 0);
  assert.equal(fixture.state().phase, 'idle');
});

test('cancelling during SDK loading does not start a late call', async () => {
  let finishLoading;
  const fixture = setup({ loadClient: () => new Promise(resolve => { finishLoading = resolve; }) });
  const pending = fixture.controller.start();
  await new Promise(resolve => setImmediate(resolve));
  await fixture.controller.end();
  finishLoading(fixture.client);
  await pending;
  assert.deepEqual(fixture.calls, ['stop']);
  assert.equal(fixture.state().phase, 'idle');
});
