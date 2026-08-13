import type { OutputProfile } from '../sounds/types'

export interface MasteringChain {
  input: GainNode
  output: AudioNode
}

/**
 * Apple Acoustic Mastering Chain.
 * Applies high-pass sub-bass cut (protects mobile/laptop speakers),
 * high-frequency warmth de-essing filter (protects headphones/AirPods),
 * and output profile EQ optimization (Headphones vs Speakers vs Studio).
 */
export function createMasteringChain(context: AudioContext, profile: OutputProfile = 'auto'): MasteringChain {
  const input = context.createGain()

  // 1. High-Pass Sub-bass Cut Filter (cuts rumble < 90Hz to prevent mobile speaker distortion)
  const highpass = context.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 90
  highpass.Q.value = 0.7

  // 2. High-Frequency De-Essing / Warmth Filter (softens harsh digital transients > 13.5kHz)
  const warmthFilter = context.createBiquadFilter()
  warmthFilter.type = 'lowpass'
  warmthFilter.frequency.value = profile === 'headphones' ? 12000 : 14000
  warmthFilter.Q.value = 0.6

  // 3. Profile Equalizer (Presence boost for small speakers / warmth for headphones)
  const profileEq = context.createBiquadFilter()
  if (profile === 'speakers') {
    // Boost presence (2.5kHz) slightly so sounds cut through small phone/laptop speakers
    profileEq.type = 'peaking'
    profileEq.frequency.value = 2800
    profileEq.gain.value = 2.5
    profileEq.Q.value = 1.0
  } else if (profile === 'headphones') {
    // Gentle high shelf dip to prevent ear fatigue during long sessions
    profileEq.type = 'highshelf'
    profileEq.frequency.value = 8000
    profileEq.gain.value = -1.5
  } else {
    // Studio / Auto flat profile
    profileEq.type = 'allpass'
  }

  // 4. Output Boost Gain (amplifies overall sound level to match rich cuelume loudness)
  const boostGain = context.createGain()
  boostGain.gain.value = 3.6

  // 5. Peak Compressor / Soft Limiter (prevents clipping when multiple sounds play simultaneously)
  const limiter = context.createDynamicsCompressor()
  limiter.threshold.value = -6
  limiter.knee.value = 6
  limiter.ratio.value = 12
  limiter.attack.value = 0.002
  limiter.release.value = 0.08

  input
    .connect(highpass)
    .connect(warmthFilter)
    .connect(profileEq)
    .connect(boostGain)
    .connect(limiter)
    .connect(context.destination)

  return {
    input,
    output: limiter,
  }
}
