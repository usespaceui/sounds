import type { Voice } from '../sounds/types'

export type { Voice }

let activeVoice: Voice | null = null

function hashString(str: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function voiceFor(seed: string): Voice {
  const hash = hashString(seed)
  const rand = seededRandom(hash)

  const register = 0.85 + rand() * 0.45
  const brightness = 0.8 + rand() * 0.5
  const material = 0.9 + rand() * 0.4
  const pace = 0.85 + rand() * 0.3

  return {
    seed,
    register,
    brightness,
    material,
    pace,
  }
}

export function setVoice(seed: string | null): void {
  if (!seed || seed.trim() === '') {
    activeVoice = null
  } else {
    activeVoice = voiceFor(seed.trim())
  }
}

export function getVoice(): Voice | null {
  return activeVoice
}
