// Browser text-to-speech, used only when a pre-generated mp3 is missing or fails to load.
let voice: SpeechSynthesisVoice | undefined

function pickVoice() {
  voice = speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith('ru'))
}

if (typeof speechSynthesis !== 'undefined') {
  pickVoice()
  speechSynthesis.addEventListener('voiceschanged', pickVoice)
}

export function stopSpeech() {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}

export function speak(text: string, onEnd?: () => void) {
  if (typeof speechSynthesis === 'undefined') return onEnd?.()
  stopSpeech()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ru-RU'
  utterance.rate = 0.9
  utterance.pitch = 1.1
  if (voice) utterance.voice = voice
  if (onEnd) utterance.onend = onEnd
  speechSynthesis.speak(utterance)
}
