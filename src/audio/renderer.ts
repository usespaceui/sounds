import type { FmLayer, NoiseLayer, Shimmer, ToneLayer } from '../sounds/types'

/**
 * Render Tone Layer with Apple Acoustic Warmth Filter & Silky Envelope Decay.
 */
export function renderTone(context: AudioContext, destination: AudioNode, layer: ToneLayer, startTime: number): void {
  const osc = context.createOscillator()
  osc.type = layer.waveform
  osc.frequency.setValueAtTime(layer.frequency, startTime)

  if (layer.detune) osc.detune.value = layer.detune

  if (layer.glideTo !== undefined) {
    const glideDur = layer.glideTime ?? layer.attack + layer.decay
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, layer.glideTo), startTime + glideDur)
  }

  // 1. Acoustic Lowpass Filter (eliminates digital harshness > 8.5kHz)
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 8800
  filter.Q.value = 0.5

  // 2. Silky Envelope (Smooth Attack + Asymptotic Exponential Decay via setTargetAtTime)
  const gain = context.createGain()
  const attackEnd = startTime + Math.max(0.001, layer.attack)
  const peakVal = Math.max(0.0001, layer.peak)
  const decayTimeConst = Math.max(0.003, layer.decay / 3.2)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peakVal, attackEnd)
  gain.gain.setTargetAtTime(0.00001, attackEnd, decayTimeConst)

  osc.connect(filter).connect(gain).connect(destination)

  const duration = layer.attack + layer.decay * 3 + 0.05
  osc.start(startTime)
  osc.stop(startTime + duration)
}

/**
 * Render Filtered Noise Layer for soft contact ticks & air sweeps.
 */
export function renderNoise(context: AudioContext, destination: AudioNode, layer: NoiseLayer, startTime: number): void {
  const duration = layer.attack + layer.decay * 3 + 0.05
  const length = Math.max(1, Math.floor(duration * context.sampleRate))
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)

  // Pink noise curve smoothing (1/f power density for softer acoustic feel)
  let b0 = 0,
    b1 = 0,
    b2 = 0
  for (let i = 0; i < length; i++) {
    const white = 2 * Math.random() - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11
  }

  const source = context.createBufferSource()
  source.buffer = buffer

  const filter = context.createBiquadFilter()
  filter.type = layer.filterType
  filter.frequency.setValueAtTime(Math.max(20, layer.filterFrequency), startTime)

  if (layer.filterSweepTo !== undefined) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(20, layer.filterSweepTo),
      startTime + layer.attack + layer.decay,
    )
  }

  if (layer.filterQ !== undefined) filter.Q.value = layer.filterQ

  const gain = context.createGain()
  const attackEnd = startTime + Math.max(0.001, layer.attack)
  const peakVal = Math.max(0.0001, layer.peak)
  const decayTimeConst = Math.max(0.003, layer.decay / 3.0)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peakVal, attackEnd)
  gain.gain.setTargetAtTime(0.00001, attackEnd, decayTimeConst)

  source.connect(filter).connect(gain).connect(destination)
  source.start(startTime)
  source.stop(startTime + duration)
}

/**
 * Render 2-Operator FM Layer with Apple Glass/Wood acoustic resonance & smooth index decay.
 */
export function renderFm(context: AudioContext, destination: AudioNode, layer: FmLayer, startTime: number): void {
  const carrier = context.createOscillator()
  carrier.type = 'sine'
  carrier.frequency.setValueAtTime(Math.max(20, layer.from), startTime)
  if (layer.from !== layer.to) {
    carrier.frequency.exponentialRampToValueAtTime(Math.max(20, layer.to), startTime + layer.duration)
  }

  const modulator = context.createOscillator()
  modulator.type = 'sine'
  const modFreq = Math.max(10, layer.from * layer.ratio)
  modulator.frequency.setValueAtTime(modFreq, startTime)

  const modGain = context.createGain()
  const initialDepth = modFreq * layer.index
  modGain.gain.setValueAtTime(initialDepth, startTime)
  modGain.gain.setTargetAtTime(0.01, startTime, Math.max(0.004, layer.duration / 3.5))

  modulator.connect(modGain).connect(carrier.frequency)

  // Acoustic Warmth Lowpass Filter for FM body
  const filter = context.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 9200
  filter.Q.value = 0.5

  const masterGain = context.createGain()
  const attackEnd = startTime + 0.002
  const peakVal = Math.max(0.0001, layer.peak)
  const decayTimeConst = Math.max(0.004, layer.duration / 3.2)

  masterGain.gain.setValueAtTime(0.0001, startTime)
  masterGain.gain.linearRampToValueAtTime(peakVal, attackEnd)
  masterGain.gain.setTargetAtTime(0.00001, attackEnd, decayTimeConst)

  carrier.connect(filter).connect(masterGain).connect(destination)

  const totalDur = layer.duration * 3 + 0.05
  carrier.start(startTime)
  modulator.start(startTime)
  carrier.stop(startTime + totalDur)
  modulator.stop(startTime + totalDur)
}

/**
 * Attach Shimmer Reverb Tail node chain.
 */
export function attachShimmer(
  context: AudioContext,
  source: AudioNode,
  destination: AudioNode,
  shimmer: Shimmer,
): AudioNode[] {
  const delay = context.createDelay(1)
  delay.delayTime.value = shimmer.delay

  const feedbackFilter = context.createBiquadFilter()
  feedbackFilter.type = 'lowpass'
  feedbackFilter.frequency.value = shimmer.lowpass

  const feedbackGain = context.createGain()
  feedbackGain.gain.value = shimmer.feedback

  const wetGain = context.createGain()
  wetGain.gain.value = shimmer.wet

  source.connect(delay)
  delay.connect(feedbackFilter)
  feedbackFilter.connect(feedbackGain)
  feedbackGain.connect(delay)
  feedbackFilter.connect(wetGain)
  wetGain.connect(destination)

  return [delay, feedbackFilter, feedbackGain, wetGain]
}
