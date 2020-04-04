export function getSpeechRecognition() {
  // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  try {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    return recognition;
  } catch (e) {
    console.warn(e);
    return null;
  }
}
