import type { OutputProfile, PlayOptions, SpaceLayer, SpaceSoundSettings, SpaceSoundSpec } from '../sounds/types'

import { getVoice, type Voice } from '../voice/voice'
import { createMasteringChain, type MasteringChain } from './mastering'
import { attachShimmer, renderFm, renderNoise, renderTone } from './renderer'
import { createSpatialPanner } from './spatial'

const STORAGE_KEY = 'spacesound-settings'
const isBrowser = typeof window !== 'undefined'

let settings: SpaceSoundSettings = {
  enabled: true,
  volume: 0.8,
  voiceSeed: null,
  respectReducedMotion: true,
  outputProfile: 'auto',
}

let loaded = false
let snapshot: SpaceSoundSettings = settings
const listeners = new Set<() => void>()

function loadSettings() {
  if (loaded || !isBrowser) return
  loaded = true
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) settings = { ...settings, ...JSON.parse(raw) }
  } catch {
    /* private mode fallback */
  }
  snapshot = { ...settings }
}

function saveSettings() {
  snapshot = { ...settings }
  for (const fn of listeners) fn()
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* ignore storage errors */
  }
}

export function setEnabled(enabled: boolean): void {
  loadSettings()
  settings.enabled = enabled
  saveSettings()
}

export function setVolume(volume: number): void {
  loadSettings()
  settings.volume = Math.min(Math.max(volume, 0), 1)
  saveSettings()
}

export function setRespectReducedMotion(respect: boolean): void {
  loadSettings()
  settings.respectReducedMotion = respect
  saveSettings()
}

export function setOutputProfile(profile: OutputProfile): void {
  loadSettings()
  settings.outputProfile = profile
  masteringChain = null // reset mastering chain to rebuild EQ
  saveSettings()
}

export function getSettings(): SpaceSoundSettings {
  return snapshot
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function hydrate(): void {
  const before = snapshot
  loadSettings()
  if (
    snapshot.enabled !== before.enabled ||
    snapshot.volume !== before.volume ||
    snapshot.respectReducedMotion !== before.respectReducedMotion ||
    snapshot.voiceSeed !== before.voiceSeed ||
    snapshot.outputProfile !== before.outputProfile
  ) {
    for (const fn of listeners) fn()
  }
}

/* --- Web Audio Context & Mastering Chain --- */

let sharedContext: AudioContext | null = null
let masteringChain: MasteringChain | null = null

function getAudioContext(): AudioContext | null {
  if (sharedContext) return sharedContext
  if (!isBrowser) return null

  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null

  try {
    sharedContext = new Ctor()
  } catch {
    return null
  }
  return sharedContext
}

function getMasterInput(context: AudioContext, profileOverride?: OutputProfile): GainNode {
  const targetProfile = profileOverride ?? settings.outputProfile
  if (masteringChain && !profileOverride) return masteringChain.input

  const chain = createMasteringChain(context, targetProfile)
  if (!profileOverride) masteringChain = chain

  chain.input.gain.value = settings.volume
  return chain.input
}

/* --- Anti-Fatigue Rapid Trigger Protection --- */
let lastPlayTime = -Infinity
let rapidTriggerCount = 0

function getFatigueDampening(): { freqScale: number; volScale: number } {
  const now = performance.now()
  const delta = now - lastPlayTime
  lastPlayTime = now

  if (delta < 65) {
    rapidTriggerCount = Math.min(6, rapidTriggerCount + 1)
  } else {
    rapidTriggerCount = Math.max(0, rapidTriggerCount - 1)
  }

  if (rapidTriggerCount > 1) {
    // Dampen high frequencies by 4% per rapid trigger & volume by 8% to prevent ear fatigue
    const freqScale = Math.max(0.75, 1 - rapidTriggerCount * 0.04)
    const volScale = Math.max(0.6, 1 - rapidTriggerCount * 0.08)
    return { freqScale, volScale }
  }

  return { freqScale: 1.0, volScale: 1.0 }
}

/* --- Voice & Fatigue Transformation Engine --- */

function voiced(
  spec: SpaceSoundSpec,
  voice?: Voice,
  fatigueDampening: { freqScale: number; volScale: number } = { freqScale: 1, volScale: 1 },
): SpaceSoundSpec {
  const v = voice
  const fDamp = fatigueDampening.freqScale

  const layers: SpaceLayer[] = spec.layers.map((l) => {
    if (l.kind === 'tone') {
      const baseFreq = l.fixed ? l.frequency : l.frequency * (v ? v.register : 1)
      const freq = baseFreq * fDamp
      const glideTo =
        l.glideTo !== undefined ? (l.fixed ? l.glideTo : l.glideTo * (v ? v.register : 1)) * fDamp : undefined
      return {
        ...l,
        frequency: freq,
        glideTo,
        attack: l.attack * (v ? v.pace : 1),
        decay: l.decay * (v ? v.pace : 1),
        offset: (l.offset ?? 0) * (v ? v.pace : 1),
      }
    }

    if (l.kind === 'noise') {
      return {
        ...l,
        filterFrequency: l.filterFrequency * (v ? v.brightness : 1) * fDamp,
        filterSweepTo: l.filterSweepTo !== undefined ? l.filterSweepTo * (v ? v.brightness : 1) * fDamp : undefined,
        attack: l.attack * (v ? v.pace : 1),
        decay: l.decay * (v ? v.pace : 1),
        offset: (l.offset ?? 0) * (v ? v.pace : 1),
      }
    }

    // FM Layer
    const from = (l.fixed ? l.from : l.from * (v ? v.register : 1)) * fDamp
    const to = (l.fixed ? l.to : l.to * (v ? v.register : 1)) * fDamp
    const ratio = l.fixed ? l.ratio : l.ratio * (v ? v.material : 1)
    const index = l.fixed ? l.index : l.index * (v ? v.brightness : 1)

    return {
      ...l,
      from,
      to,
      ratio,
      index,
      duration: l.duration * (v ? v.pace : 1),
      offset: (l.offset ?? 0) * (v ? v.pace : 1),
    }
  })

  return {
    ...spec,
    layers,
  }
}

/* --- Main Playback Dispatcher --- */

export function playSpec(spec: SpaceSoundSpec, options?: PlayOptions): void {
  loadSettings()
  if (!settings.enabled) return

  if (settings.respectReducedMotion && isBrowser && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const fatigue = getFatigueDampening()
  const volumeScale = settings.volume * (options?.volume ?? 1) * fatigue.volScale
  if (volumeScale === 0) return

  const context = getAudioContext()
  if (!context) return

  const finalSpec = voiced(spec, getVoice() ?? undefined, fatigue)
  const now = context.currentTime
  const masterInput = getMasterInput(context, options?.profile)

  // Sub-master node for this sound instance
  const subMaster = context.createGain()
  const baseGain = (finalSpec.masterGain ?? 0.5) * volumeScale
  subMaster.gain.value = baseGain

  // Check if 3D Spatial Position is provided
  if (options?.spatial) {
    const panner = createSpatialPanner(context, options.spatial)
    subMaster.connect(panner).connect(masterInput)
  } else {
    subMaster.connect(masterInput)
  }

  const shimmerNodes = finalSpec.shimmer ? attachShimmer(context, subMaster, masterInput, finalSpec.shimmer) : []

  for (const layer of finalSpec.layers) {
    const startTime = now + (layer.offset ?? 0)
    if (layer.kind === 'tone') renderTone(context, subMaster, layer, startTime)
    else if (layer.kind === 'noise') renderNoise(context, subMaster, layer, startTime)
    else if (layer.kind === 'fm') renderFm(context, subMaster, layer, startTime)
  }

  setTimeout(() => {
    subMaster.disconnect()
    for (const node of shimmerNodes) node.disconnect()
  }, 1200)
}

export function playRecipe(recipe: SpaceSoundSpec, options?: PlayOptions): void {
  playSpec(recipe, options)
}
