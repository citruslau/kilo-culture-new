import { setupVoiceAssistant } from '../../src/voice.js';

setupVoiceAssistant(document.querySelector('.voice-assistant'), {
  publicKey: 'test-public-key',
  assistantId: 'test-assistant',
});
