import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createContext, SourceTextModule } from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

test('production voice button loads the real SDK and starts the configured assistant', async () => {
  const result = await build({
    configFile: fileURLToPath(new URL('../vite.config.js', import.meta.url)),
    logLevel: 'silent',
    build: {
      write: false,
      rolldownOptions: { input: fileURLToPath(new URL('./fixtures/voice-entry.js', import.meta.url)) },
    },
  });
  const chunks = result.output.filter(item => item.type === 'chunk');
  const entry = chunks.find(chunk => chunk.isEntry);
  const start = { addEventListener(event, handler) { this[event] = handler; } };
  const end = { addEventListener() {} };
  const status = {};
  const root = {
    dataset: {},
    querySelector: selector => selector === '[data-voice-start]' ? start : selector === '[data-voice-end]' ? end : status,
  };
  let stoppedTracks = 0;
  let startedAssistant;
  let loadedSdk = false;
  const context = createContext({
    document: { querySelector: () => root },
    window: { isSecureContext: true, addEventListener() {} },
    navigator: { mediaDevices: { getUserMedia: async () => ({
      getTracks: () => [{ stop() { stoppedTracks++; } }],
    }) } },
    URL, console, setTimeout, clearTimeout,
  });
  const modules = new Map();
  function getModule(name) {
    if (modules.has(name)) return modules.get(name);
    const chunk = chunks.find(item => item.fileName === name);
    assert.ok(chunk, `Production chunk must exist: ${name}`);
    const module = new SourceTextModule(chunk.code, {
      context,
      identifier: name,
      initializeImportMeta(meta) { meta.url = `https://example.com/${name}`; },
      async importModuleDynamically(specifier, referencingModule) {
        const dependency = getModule(resolve(specifier, referencingModule.identifier));
        await dependency.link(linker);
        await dependency.evaluate();
        // Stub only the network call, preserving the real bundled SDK's export shape.
        const exported = dependency.namespace.default;
        const Vapi = typeof exported === 'function' ? exported : exported.default;
        Vapi.prototype.start = async function (assistantId) {
          startedAssistant = assistantId;
          this.emit('call-start');
          return { id: 'test-call' };
        };
        loadedSdk = true;
        return dependency;
      },
    });
    modules.set(name, module);
    return module;
  }
  function resolve(specifier, from) {
    return new URL(specifier, `https://example.com/${from}`).pathname.slice(1);
  }
  const linker = (specifier, module) => getModule(resolve(specifier, module.identifier));
  const module = getModule(entry.fileName);
  await module.link(linker);
  await module.evaluate();
  assert.equal(loadedSdk, false, 'The SDK stays unloaded until the button is clicked');
  start.click();
  for (let attempts = 0; attempts < 50 && root.dataset.phase === 'connecting'; attempts++) {
    await new Promise(resolve => setImmediate(resolve));
  }
  assert.equal(loadedSdk, true);
  assert.equal(root.dataset.phase, 'listening', status.textContent);
  assert.equal(startedAssistant, 'test-assistant');
  assert.equal(stoppedTracks, 1, 'Release the microphone permission check stream');
});
