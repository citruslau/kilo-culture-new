import { createVoiceController } from './voice-controller.js';

export function setupVoiceAssistant(root, { publicKey, assistantId }) {
  const start = root.querySelector('[data-voice-start]');
  const end = root.querySelector('[data-voice-end]');
  const status = root.querySelector('[data-voice-status]');
  if (!publicKey || !assistantId) {
    start.disabled = true;
    status.textContent = 'Voice assistance is unavailable right now. Contact the team below.';
    return;
  }

  const controller = createVoiceController({
    assistantId,
    async prepareMicrophone() {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone unavailable');
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    },
    async loadClient() {
      // Load the voice SDK only when a visitor chooses to talk.
      const { default: Vapi } = await import('@vapi-ai/web');
      return new Vapi(publicKey);
    },
    onChange({ phase, message }) {
      root.dataset.phase = phase;
      status.textContent = message;
      start.disabled = phase !== 'idle' && phase !== 'error';
      start.textContent = phase === 'error' ? 'Try voice again' : 'Talk to Kilo Culture';
      end.hidden = phase === 'idle' || phase === 'error';
      end.disabled = phase === 'ending';
      end.textContent = phase === 'connecting' ? 'Cancel call' : 'End call';
    },
  });
  start.addEventListener('click', () => { void controller.start(); });
  end.addEventListener('click', () => { void controller.end(); });
  window.addEventListener('pagehide', () => { void controller.end(); });
}
