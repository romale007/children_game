// Sound effects synthesized with Web Audio: nothing to download and no licenses to track.
let context: AudioContext | undefined
let noise: AudioBuffer | undefined

function audio() {
  context ??= new AudioContext()
  if (context.state === 'suspended') void context.resume()
  return context
}

function noiseBuffer(ctx: AudioContext) {
  if (!noise) {
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return noise
}

/** Soft applause, like a few people clapping. Kept quiet for children sensitive to noise. */
export function applause(seconds = 1.6, volume = 0.1) {
  const ctx = audio()
  const now = ctx.currentTime
  const out = ctx.createGain()
  out.gain.setValueAtTime(0, now)
  out.gain.linearRampToValueAtTime(volume, now + 0.2)
  out.gain.setValueAtTime(volume, now + seconds - 0.5)
  out.gain.linearRampToValueAtTime(0, now + seconds)
  out.connect(ctx.destination)

  // Every clap is a short burst of band-passed noise at a random moment.
  for (let i = 0; i < seconds * 26; i++) {
    const t = now + Math.random() * (seconds - 0.1)
    const source = ctx.createBufferSource()
    source.buffer = noiseBuffer(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 900 + Math.random() * 1500
    filter.Q.value = 1.2
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.6 + Math.random() * 0.4, t + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06 + Math.random() * 0.05)
    source.connect(filter).connect(gain).connect(out)
    source.start(t, Math.random() * 0.08, 0.12)
  }
}

/** A gentle «bloop» for a wrong answer: a falling sine, nothing harsh. */
export function bloop(volume = 0.15) {
  const ctx = audio()
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.frequency.setValueAtTime(520, now)
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.25)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.3)
}

/** A short rising tune for the end of a game. */
export function fanfare(volume = 0.08) {
  const ctx = audio()
  const notes = [523.25, 659.25, 783.99, 1046.5]
  let t = ctx.currentTime
  notes.forEach((frequency, i) => {
    const length = i === notes.length - 1 ? 0.5 : 0.16
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = frequency
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(volume, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + length)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + length)
    t += 0.15
  })
}
