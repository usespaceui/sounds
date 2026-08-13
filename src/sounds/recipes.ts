import type { PageDirection, SpaceSoundSpec, SpatialDirection, ToggleState, VerticalDirection } from './types'

/** Apple UI Acoustic Material Ratios & Anchors */
const GLASS_MATERIAL = 2.76 // Crystalline glass / marimba resonance
const WOOD_MATERIAL = 1.82 // Muted organic wood resonance
const SILK_GLASS = 2.34 // Final Studio selections retained after A/B listening

/** Neutral percussive click for small, frequent interactions (iOS keyboard / picker). */
export function tap(): SpaceSoundSpec {
  return {
    name: 'tap',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 4200,
        filterQ: 1.5,
        attack: 0.001,
        decay: 0.015,
        peak: 0.14,
      },
      { kind: 'fm', from: 523.25, to: 523.25, ratio: GLASS_MATERIAL, index: 1.1, duration: 0.028, peak: 0.14 },
    ],
  }
}

/** Muted knock — press down state (iOS button down). */
export function press(): SpaceSoundSpec {
  return {
    name: 'press',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 1800,
        filterQ: 1.2,
        attack: 0.001,
        decay: 0.02,
        peak: 0.15,
      },
      { kind: 'fm', from: 260, to: 260, ratio: WOOD_MATERIAL, index: 0.8, duration: 0.026, peak: 0.12 },
    ],
  }
}

/** Springy tick — release state (iOS button return). */
export function release(): SpaceSoundSpec {
  return {
    name: 'release',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 4400,
        filterQ: 1.6,
        attack: 0.001,
        decay: 0.016,
        peak: 0.14,
      },
      { kind: 'tone', waveform: 'sine', frequency: 3200, offset: 0.004, attack: 0.001, decay: 0.045, peak: 0.06 },
    ],
  }
}

/** Crisp Apple Watch Crown tick. */
export function tick(): SpaceSoundSpec {
  return {
    name: 'tick',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 5200,
        filterQ: 1.8,
        attack: 0.001,
        decay: 0.015,
        peak: 0.16,
      },
      { kind: 'tone', waveform: 'sine', frequency: 2600, attack: 0.001, decay: 0.012, peak: 0.05 },
    ],
  }
}

/** Papery flick for iOS Books / carousels. */
export function page(): SpaceSoundSpec {
  return {
    name: 'page',
    masterGain: 0.52,
    layers: [
      {
        kind: 'noise',
        filterType: 'lowpass',
        filterFrequency: 1800,
        filterQ: 0.6,
        attack: 0.005,
        decay: 0.075,
        peak: 0.14,
      },
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 4200,
        filterQ: 1.2,
        offset: 0.035,
        attack: 0.003,
        decay: 0.06,
        peak: 0.12,
      },
      { kind: 'tone', waveform: 'sine', frequency: 2400, offset: 0.065, attack: 0.002, decay: 0.045, peak: 0.04 },
    ],
  }
}

/** Focused overlay arrival. */
export function open(): SpaceSoundSpec {
  return {
    name: 'open',
    masterGain: 0.48,
    layers: [
      { kind: 'noise', filterType: 'bandpass', filterFrequency: 2100, filterSweepTo: 3300, filterQ: 0.9, attack: 0.004, decay: 0.04, peak: 0.06 },
      { kind: 'fm', from: 440, to: 659.25, ratio: SILK_GLASS, index: 0.68, duration: 0.08, peak: 0.11 },
    ],
    shimmer: { delay: 0.075, feedback: 0.13, wet: 0.1, lowpass: 3600 },
  }
}

/** Focused overlay departure. */
export function close(): SpaceSoundSpec {
  return {
    name: 'close',
    masterGain: 0.48,
    layers: [
      { kind: 'noise', filterType: 'bandpass', filterFrequency: 2700, filterSweepTo: 1500, filterQ: 0.9, attack: 0.003, decay: 0.035, peak: 0.055 },
      { kind: 'fm', from: 659.25, to: 440, ratio: SILK_GLASS, index: 0.6, duration: 0.072, peak: 0.1 },
    ],
    shimmer: { delay: 0.07, feedback: 0.11, wet: 0.08, lowpass: 3000 },
  }
}

/** Duplicating an element (strike + echo response). */
export function copy(): SpaceSoundSpec {
  return {
    name: 'copy',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 3800,
        filterQ: 1.5,
        attack: 0.001,
        decay: 0.015,
        peak: 0.13,
      },
      { kind: 'fm', from: 659.25, to: 659.25, ratio: GLASS_MATERIAL, index: 1.1, duration: 0.035, peak: 0.14 },
      {
        kind: 'fm',
        from: 659.25,
        to: 659.25,
        ratio: GLASS_MATERIAL,
        index: 0.6,
        offset: 0.045,
        duration: 0.03,
        peak: 0.07,
      },
    ],
  }
}

/** Placing an element (copy reversed — landing strike). */
export function paste(): SpaceSoundSpec {
  return {
    name: 'paste',
    masterGain: 0.55,
    layers: [
      { kind: 'fm', from: 523.25, to: 523.25, ratio: GLASS_MATERIAL, index: 0.5, duration: 0.02, peak: 0.06 },
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 3400,
        filterQ: 1.5,
        offset: 0.03,
        attack: 0.001,
        decay: 0.015,
        peak: 0.13,
      },
      {
        kind: 'fm',
        from: 523.25,
        to: 523.25,
        ratio: GLASS_MATERIAL,
        offset: 0.03,
        index: 1.2,
        duration: 0.038,
        peak: 0.14,
      },
    ],
  }
}

/** Item destroyed — dead strike. */
export function remove(): SpaceSoundSpec {
  return {
    name: 'remove',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 1500,
        filterQ: 1.2,
        attack: 0.001,
        decay: 0.024,
        peak: 0.15,
      },
      { kind: 'fm', from: 220, to: 180, ratio: WOOD_MATERIAL, index: 1.2, duration: 0.038, peak: 0.13 },
    ],
  }
}

/** Outcome worth marking — rising major triad chime (C5 -> E5 -> G5). */
export function confirm(): SpaceSoundSpec {
  return {
    name: 'confirm',
    masterGain: 0.56,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 3400,
        filterQ: 1.2,
        attack: 0.001,
        decay: 0.015,
        peak: 0.09,
      },
      { kind: 'fm', from: 523.25, to: 523.25, ratio: GLASS_MATERIAL, index: 1.0, duration: 0.055, peak: 0.11 },
      {
        kind: 'fm',
        from: 659.25,
        to: 659.25,
        ratio: GLASS_MATERIAL,
        offset: 0.035,
        index: 1.0,
        duration: 0.065,
        peak: 0.12,
      },
      {
        kind: 'fm',
        from: 783.99,
        to: 783.99,
        ratio: GLASS_MATERIAL,
        offset: 0.07,
        index: 1.2,
        duration: 0.095,
        peak: 0.15,
      },
    ],
    shimmer: { delay: 0.1, feedback: 0.22, wet: 0.15, lowpass: 4800 },
  }
}

/** Warning / Refusal tone — low soft double tap. */
export function deny(): SpaceSoundSpec {
  return {
    name: 'deny',
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 1300,
        filterQ: 1.2,
        attack: 0.001,
        decay: 0.022,
        peak: 0.12,
      },
      { kind: 'fm', from: 220, to: 196, ratio: WOOD_MATERIAL, index: 1.0, duration: 0.045, peak: 0.12 },
      { kind: 'fm', from: 196, to: 174.61, ratio: WOOD_MATERIAL, offset: 0.05, index: 0.9, duration: 0.055, peak: 0.1 },
    ],
  }
}

/** Unresolved task lift. */
export function loading(): SpaceSoundSpec {
  return {
    name: 'loading',
    masterGain: 0.52,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 1800,
        filterSweepTo: 3800,
        filterQ: 1.2,
        attack: 0.01,
        decay: 0.065,
        peak: 0.11,
      },
      {
        kind: 'tone',
        waveform: 'sine',
        frequency: 440,
        glideTo: 587.33,
        glideTime: 0.07,
        attack: 0.005,
        decay: 0.07,
        peak: 0.1,
      },
    ],
  }
}

/** Calm completion response. */
export function ready(): SpaceSoundSpec {
  return {
    name: 'ready',
    masterGain: 0.48,
    layers: [
      { kind: 'tone', waveform: 'sine', frequency: 659.25, attack: 0.003, decay: 0.04, peak: 0.06 },
      { kind: 'fm', from: 987.77, to: 987.77, ratio: SILK_GLASS, offset: 0.022, index: 0.65, duration: 0.075, peak: 0.1 },
    ],
    shimmer: { delay: 0.075, feedback: 0.14, wet: 0.1, lowpass: 3900 },
  }
}

/**
 * CHIME: Iconic Apple 2-Note Ascending Bell (A5 880Hz -> E6 1318.51Hz).
 * Calm, elegant, crystalline notification bell.
 */
export function chime(): SpaceSoundSpec {
  return {
    name: 'chime',
    masterGain: 0.58,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: 4500,
        filterQ: 1.5,
        attack: 0.001,
        decay: 0.012,
        peak: 0.08,
      },
      { kind: 'fm', from: 880, to: 880, ratio: GLASS_MATERIAL, index: 1.1, duration: 0.06, peak: 0.13 },
      {
        kind: 'fm',
        from: 1318.51,
        to: 1318.51,
        ratio: GLASS_MATERIAL,
        offset: 0.045,
        index: 1.3,
        duration: 0.09,
        peak: 0.15,
      },
    ],
    shimmer: { delay: 0.09, feedback: 0.24, wet: 0.16, lowpass: 5200 },
  }
}

/**
 * SPARKLE: Shimmering 5-Note Rapid Cascading Twinkle (C5 -> G5 -> C6 -> E6 -> G6).
 * High crystalline arpeggio with bright magical sparkle tail!
 */
export function sparkle(): SpaceSoundSpec {
  return {
    name: 'sparkle',
    masterGain: 0.58,
    layers: [
      { kind: 'fm', from: 523.25, to: 523.25, ratio: GLASS_MATERIAL, index: 0.9, duration: 0.035, peak: 0.08 },
      {
        kind: 'fm',
        from: 783.99,
        to: 783.99,
        ratio: GLASS_MATERIAL,
        offset: 0.02,
        index: 1.0,
        duration: 0.04,
        peak: 0.1,
      },
      {
        kind: 'fm',
        from: 1046.5,
        to: 1046.5,
        ratio: GLASS_MATERIAL,
        offset: 0.04,
        index: 1.2,
        duration: 0.045,
        peak: 0.12,
      },
      {
        kind: 'fm',
        from: 1318.51,
        to: 1318.51,
        ratio: GLASS_MATERIAL,
        offset: 0.06,
        index: 1.4,
        duration: 0.05,
        peak: 0.14,
      },
      {
        kind: 'fm',
        from: 1567.98,
        to: 1567.98,
        ratio: GLASS_MATERIAL,
        offset: 0.08,
        index: 1.5,
        duration: 0.08,
        peak: 0.16,
      },
    ],
    shimmer: { delay: 0.07, feedback: 0.28, wet: 0.22, lowpass: 6500 },
  }
}

/** Rounded downward water drop. */
export function droplet(): SpaceSoundSpec {
  return {
    name: 'droplet',
    masterGain: 0.47,
    layers: [
      { kind: 'tone', waveform: 'sine', frequency: 1174.66, glideTo: 698.46, glideTime: 0.07, attack: 0.003, decay: 0.065, peak: 0.09 },
      { kind: 'tone', waveform: 'sine', frequency: 174.61, offset: 0.035, attack: 0.002, decay: 0.05, peak: 0.025 },
    ],
  }
}

/** Warm detuned pad swell. */
export function bloom(): SpaceSoundSpec {
  return {
    name: 'bloom',
    masterGain: 0.56,
    layers: [
      { kind: 'tone', waveform: 'sine', frequency: 261.63, detune: -6, attack: 0.02, decay: 0.16, peak: 0.09 },
      { kind: 'tone', waveform: 'sine', frequency: 329.63, detune: 6, attack: 0.02, decay: 0.16, peak: 0.09 },
      { kind: 'tone', waveform: 'sine', frequency: 392.0, offset: 0.015, attack: 0.025, decay: 0.18, peak: 0.1 },
      { kind: 'tone', waveform: 'sine', frequency: 493.88, offset: 0.025, attack: 0.03, decay: 0.2, peak: 0.12 },
    ],
    shimmer: { delay: 0.12, feedback: 0.32, wet: 0.22, lowpass: 4200 },
  }
}

/** Breathy quiet noise bed. */
export function whisper(): SpaceSoundSpec {
  return {
    name: 'whisper',
    masterGain: 0.52,
    layers: [
      {
        kind: 'noise',
        filterType: 'lowpass',
        filterFrequency: 1600,
        filterQ: 0.5,
        attack: 0.01,
        decay: 0.085,
        peak: 0.13,
      },
    ],
  }
}

/** Directional pitch adjustment step. */
export function nudge(direction: VerticalDirection): SpaceSoundSpec {
  const up = direction === 'up'
  return {
    name: `nudge-${direction}`,
    masterGain: 0.54,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: up ? 4000 : 2400,
        filterQ: 1.4,
        attack: 0.001,
        decay: 0.014,
        peak: 0.11,
      },
      {
        kind: 'tone',
        waveform: 'sine',
        frequency: up ? 440 : 587.33,
        glideTo: up ? 587.33 : 440,
        glideTime: 0.03,
        attack: 0.001,
        decay: 0.038,
        peak: 0.11,
      },
    ],
  }
}

/** Binary state switch (on/off). */
export function toggle(state: ToggleState): SpaceSoundSpec {
  const on = state === 'on'
  return {
    name: `toggle-${state}`,
    masterGain: 0.55,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: on ? 4400 : 1900,
        filterQ: 1.6,
        attack: 0.001,
        decay: 0.015,
        peak: 0.12,
      },
      {
        kind: 'fm',
        from: on ? 440 : 659.25,
        to: on ? 659.25 : 440,
        ratio: GLASS_MATERIAL,
        index: 1.0,
        duration: 0.038,
        peak: 0.13,
      },
    ],
  }
}

/** Directional noise sweep (in/out). */
export function slide(direction: SpatialDirection): SpaceSoundSpec {
  const isIn = direction === 'in'
  return {
    name: `slide-${direction}`,
    masterGain: 0.54,
    layers: [
      {
        kind: 'noise',
        filterType: 'bandpass',
        filterFrequency: isIn ? 1600 : 3800,
        filterSweepTo: isIn ? 3800 : 1600,
        filterQ: 1.2,
        attack: 0.004,
        decay: 0.048,
        peak: 0.13,
      },
    ],
  }
}

/** Page travel (forward/back). */
export function turn(direction: PageDirection): SpaceSoundSpec {
  const forward = direction === 'forward'
  return {
    name: `turn-${direction}`,
    masterGain: 0.54,
    layers: [
      {
        kind: 'noise',
        filterType: 'lowpass',
        filterFrequency: forward ? 1800 : 1400,
        filterQ: 0.7,
        attack: 0.004,
        decay: 0.065,
        peak: 0.12,
      },
      {
        kind: 'fm',
        from: forward ? 523.25 : 659.25,
        to: forward ? 659.25 : 523.25,
        ratio: GLASS_MATERIAL,
        offset: 0.02,
        index: 0.9,
        duration: 0.042,
        peak: 0.1,
      },
    ],
  }
}
