const idleMessage = 'Ready when you are. Ask about memberships, access, or finding the gym.';

function errorMessage(error) {
  const details = `${error?.name ?? ''} ${error?.message ?? ''} ${error?.error?.message ?? ''}`;
  if (/NotAllowed|PermissionDenied|permission|microphone/i.test(details)) {
    return 'Allow microphone access in your browser, then try again. You can also contact the team below.';
  }
  if (/NotFound|NotReadable/i.test(details)) {
    return 'Check that your microphone is connected and available, then try again.';
  }
  return 'The voice assistant could not connect. Try again or contact the team below.';
}

export function createVoiceController({ assistantId, loadClient, prepareMicrophone, onChange }) {
  let phase = 'idle';
  let active = null;
  function update(next, message) {
    phase = next;
    onChange({ phase, message });
  }
  update('idle', idleMessage);

  async function fail(session, error) {
    if (active !== session) return;
    active = null;
    update('ending', 'Closing the connection…');
    try { await session.client?.stop(); } catch { /* Still show the original failure. */ }
    update('error', errorMessage(error));
  }

  return {
    async start() {
      if (phase !== 'idle' && phase !== 'error') return;
      const session = { client: null };
      active = session;
      update('connecting', 'Allow microphone access. Connecting to Kilo Culture…');
      try {
        // Check permission before creating a billable Vapi call.
        await prepareMicrophone();
        if (active !== session) return;
        const client = await loadClient();
        session.client = client;
        if (active !== session) {
          await client.stop();
          return;
        }
        const whenActive = handler => (...args) => {
          if (active === session) handler(...args);
        };
        client.on('call-start', whenActive(() => update('listening', 'Listening. What would you like to know?')));
        client.on('speech-start', whenActive(() => {
          if (phase === 'listening') update('speaking', 'Kilo Culture Assistant is speaking.');
        }));
        client.on('speech-end', whenActive(() => {
          if (phase === 'speaking') update('listening', 'Listening. Go ahead.');
        }));
        client.on('call-end', whenActive(() => {
          active = null;
          update('idle', 'Conversation ended. You can start another call.');
        }));
        client.on('error', whenActive(error => { void fail(session, error); }));
        const call = await client.start(assistantId);
        if (active !== session) {
          await client.stop();
        } else if (!call) {
          await fail(session, new Error('Call did not start'));
        }
      } catch (error) {
        await fail(session, error);
      }
    },
    async end() {
      if (!active || phase === 'ending') return;
      const session = active;
      active = null;
      update('ending', 'Ending the conversation…');
      try {
        await session.client?.stop();
        update('idle', 'Conversation ended. You can start another call.');
      } catch (error) {
        update('error', errorMessage(error));
      }
    },
  };
}
