/**
 * @usespaceui/sounds — Types & Data Structures
 * Apple-inspired procedural Web Audio UI sound engine with 3D Spatial Audio & Device Output Mastering.
 */

export type VerticalDirection = 'up' | 'down'
export type ToggleState = 'on' | 'off'
export type SpatialDirection = 'in' | 'out'
export type PageDirection = 'forward' | 'back'

/** 3D Spatial Position in Normalized Screen / World Coordinates (-1.0 .. +1.0) */
export interface SpatialPosition {
  /** Horizontal position (-1.0 = left, 0.0 = center, +1.0 = right) */
  x: number
  /** Vertical position (-1.0 = bottom, 0.0 = center, +1.0 = top) */
  y?: number
  /** Depth position (-1.0 = near, 0.0 = surface, +2.0 = far) */
  z?: number
}

/** Apple Device Output Profile EQ presets */
export type OutputProfile = 'auto' | 'headphones' | 'speakers' | 'studio'

export interface PlayOptions {
  volume?: number
  /** 3D Spatial position for HRTF binaural panning */
  spatial?: SpatialPosition
  /** Override output mastering profile for this call */
  profile?: OutputProfile
}

/** A single tone layer (sine, triangle, square, sawtooth) with optional pitch glide & detune. */
export interface ToneLayer {
  kind: 'tone'
  waveform: OscillatorType
  fixed?: boolean
  frequency: number
  glideTo?: number
  glideTime?: number
  detune?: number
  offset?: number
  attack: number
  decay: number
  peak: number
}

/** Filtered noise layer for organic contact ticks, flicks, and air sweeps. */
export interface NoiseLayer {
  kind: 'noise'
  filterType: BiquadFilterType
  filterFrequency: number
  filterSweepTo?: number
  filterQ?: number
  offset?: number
  attack: number
  decay: number
  peak: number
}

/** 2-Operator FM Synthesis body for Apple-like glass, wood, and crystal strikes. */
export interface FmLayer {
  kind: 'fm'
  from: number
  to: number
  /** Modulator/carrier ratio (2.76 = glass/marimba). */
  ratio: number
  /** Initial modulation index; decays exponentially across duration. */
  index: number
  fixed?: boolean
  offset?: number
  duration: number
  peak: number
}

export type SpaceLayer = ToneLayer | NoiseLayer | FmLayer

/** Echo / Reverb tail for spatial depth. */
export interface Shimmer {
  delay: number
  feedback: number
  wet: number
  lowpass: number
}

/** Complete sound spec produced by pure data functions. */
export interface SpaceSoundSpec {
  name: string
  masterGain?: number
  layers: SpaceLayer[]
  shimmer?: Shimmer
}

/** Brand voice configuration derived from a seed string. */
export interface Voice {
  seed: string
  register: number
  brightness: number
  material: number
  pace: number
}

export interface SpaceSoundSettings {
  enabled: boolean
  volume: number
  voiceSeed: string | null
  respectReducedMotion: boolean
  outputProfile: OutputProfile
}

export type SpaceSoundName =
  | 'tap'
  | 'press'
  | 'release'
  | 'tick'
  | 'page'
  | 'open'
  | 'close'
  | 'copy'
  | 'paste'
  | 'remove'
  | 'confirm'
  | 'deny'
  | 'loading'
  | 'ready'
  | 'chime'
  | 'sparkle'
  | 'droplet'
  | 'bloom'
  | 'whisper'
  | 'nudge-up'
  | 'nudge-down'
  | 'toggle-on'
  | 'toggle-off'
  | 'slide-in'
  | 'slide-out'
  | 'turn-forward'
  | 'turn-back'
