// 音声読み上げ: ブラウザが持つ英語音声の中から最も自然なものを自動選択する

// 自然さの優先順位（上ほど高品質）
const VOICE_PRIORITY_PATTERNS = [
  /natural/i, // Microsoft Edge の Natural 音声 (例: "Microsoft Ava Online (Natural)")
  /online/i, // Edge のオンライン音声
  /google us english/i, // Chrome の Google 音声
  /google uk english/i,
  /google/i,
  /samantha|karen|daniel/i // macOS / iOS の高品質音声
];

/**
 * 利用可能な英語音声を自然な順に並べて返す
 */
export function getEnglishVoices() {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis
    .getVoices()
    .filter(voice => voice.lang.toLowerCase().startsWith('en'));

  const priorityOf = voice => {
    const index = VOICE_PRIORITY_PATTERNS.findIndex(pattern => pattern.test(voice.name));
    return index === -1 ? VOICE_PRIORITY_PATTERNS.length : index;
  };

  return voices.sort((a, b) => {
    const diff = priorityOf(a) - priorityOf(b);
    if (diff !== 0) return diff;
    // 同順位なら en-US を優先
    const aUs = a.lang.toLowerCase() === 'en-us' ? 0 : 1;
    const bUs = b.lang.toLowerCase() === 'en-us' ? 0 : 1;
    return aUs - bUs;
  });
}

/**
 * 保存済みのvoiceURI、なければ最も自然な音声を返す
 */
export function resolveVoice(voiceURI) {
  const voices = getEnglishVoices();
  if (voices.length === 0) return null;
  if (voiceURI) {
    const saved = voices.find(voice => voice.voiceURI === voiceURI);
    if (saved) return saved;
  }
  return voices[0];
}

/**
 * 英文を読み上げる
 */
export function speak(text, { voiceURI, rate }) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  const voice = resolveVoice(voiceURI);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  window.speechSynthesis.speak(utterance);
}

/**
 * 音声リストは非同期で読み込まれるため、変更を監視するためのヘルパー
 */
export function onVoicesChanged(callback) {
  if (!window.speechSynthesis) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', callback);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', callback);
}
