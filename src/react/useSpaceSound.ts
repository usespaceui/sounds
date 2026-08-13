import { useSyncExternalStore } from 'react'
import {
  getSettings,
  hydrate,
  setEnabled,
  setOutputProfile,
  setRespectReducedMotion,
  setVolume,
  subscribe,
  setVoiceSeed,
} from '../audio/engine'
import type { OutputProfile } from '../sounds/types'

let hydrated = false

function getServerSnapshot() {
  return getSettings()
}

function getClientSnapshot() {
  if (!hydrated) {
    hydrated = true
    hydrate()
  }
  return getSettings()
}

export function useSpaceSound() {
  const settings = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  return {
    enabled: settings.enabled,
    volume: settings.volume,
    voiceSeed: settings.voiceSeed,
    outputProfile: settings.outputProfile,
    respectReducedMotion: settings.respectReducedMotion,
    setEnabled,
    setVolume,
    setOutputProfile: (profile: OutputProfile) => {
      setOutputProfile(profile)
    },
    setVoice: (seed: string | null) => {
      setVoiceSeed(seed)
    },
    setRespectReducedMotion,
  }
}
