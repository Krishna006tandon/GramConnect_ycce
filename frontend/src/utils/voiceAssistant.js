/**
 * Web Speech API Voice Assistant for Low-Literacy Rural & Slum Users.
 * 100% Free, runs directly in browser (Chrome / Edge / Android / Safari).
 */

export function isSpeakingSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeaking() {
  if (isSpeakingSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text, lang = "mr", onStateChange = null) {
  if (!isSpeakingSupported() || !text) {
    if (onStateChange) onStateChange(false);
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Normalize lang tag
  let langCode = "mr-IN";
  if (lang === "hi") langCode = "hi-IN";
  else if (lang === "en") langCode = "en-IN";

  const cleanText = text.replace(/[*_#`[\]()]/g, " ").replace(/\s+/g, " ").trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langCode;
  utterance.rate = 0.95; // slightly slower for rural clarity
  utterance.pitch = 1.0;

  // Try to find matching voice
  const voices = window.speechSynthesis.getVoices() || [];
  const matchedVoice = voices.find((v) => v.lang === langCode || v.lang.startsWith(lang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    if (onStateChange) onStateChange(true);
  };

  utterance.onend = () => {
    if (onStateChange) onStateChange(false);
  };

  utterance.onerror = () => {
    if (onStateChange) onStateChange(false);
  };

  window.speechSynthesis.speak(utterance);
  return true;
}
