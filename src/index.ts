import { playSpec } from './audio/engine'
import {
  bloom as bloomSpec,
  chime as chimeSpec,
  close as closeSpec,
  confirm as confirmSpec,
  copy as copySpec,
  deny as denySpec,
  droplet as dropletSpec,
  loading as loadingSpec,
  open as openSpec,
  nudge as nudgeSpec,
  page as pageSpec,
  paste as pasteSpec,
  press as pressSpec,
  ready as readySpec,
  release as releaseSpec,
  remove as removeSpec,
  slide as slideSpec,
  sparkle as sparkleSpec,
  tap as tapSpec,
  tick as tickSpec,
  toggle as toggleSpec,
  turn as turnSpec,
  whisper as whisperSpec,
} from './sounds/recipes'
import type { PageDirection, PlayOptions, SpatialDirection, ToggleState, VerticalDirection } from './sounds/types'

/* --- 26 Individual Sound Triggers --- */

/** Neutral percussive click for small, frequent interactions. */
export const tap = (options?: PlayOptions) => playSpec(tapSpec(), options)
/** Key/button press down. */
export const press = (options?: PlayOptions) => playSpec(pressSpec(), options)
/** Key/button release up. */
export const release = (options?: PlayOptions) => playSpec(releaseSpec(), options)
/** Fine tick for sliders and focus. */
export const tick = (options?: PlayOptions) => playSpec(tickSpec(), options)
/** Papery flick for pagination/carousels. */
export const page = (options?: PlayOptions) => playSpec(pageSpec(), options)

/** Overlay arriving on z-axis strike gliding up a fourth + shimmer. */
export const open = (options?: PlayOptions) => playSpec(openSpec(), options)
/** Overlay leaving z-axis strike gliding down + shimmer. */
export const close = (options?: PlayOptions) => playSpec(closeSpec(), options)

/** Duplicating an element strike and its echo. */
export const copy = (options?: PlayOptions) => playSpec(copySpec(), options)
/** Placing an element landing strike. */
export const paste = (options?: PlayOptions) => playSpec(pasteSpec(), options)
/** Item destroyed short dead strike. */
export const remove = (options?: PlayOptions) => playSpec(removeSpec(), options)

/** Outcome worth marking rising major third chime. */
export const confirm = (options?: PlayOptions) => playSpec(confirmSpec(), options)
/** Refusal / Warning low tone, informing not punishing. */
export const deny = (options?: PlayOptions) => playSpec(denySpec(), options)

/** Task starting lift. */
export const loading = (options?: PlayOptions) => playSpec(loadingSpec(), options)
/** Task ready bloom. */
export const ready = (options?: PlayOptions) => playSpec(readySpec(), options)

/** Two-note ascending bell chime. */
export const chime = (options?: PlayOptions) => playSpec(chimeSpec(), options)
/** 4-note ascending twinkle arpeggio. */
export const sparkle = (options?: PlayOptions) => playSpec(sparkleSpec(), options)
/** Single note gliding downward. */
export const droplet = (options?: PlayOptions) => playSpec(dropletSpec(), options)
/** Warm detuned pad swell. */
export const bloom = (options?: PlayOptions) => playSpec(bloomSpec(), options)
/** Breathy filtered noise bed. */
export const whisper = (options?: PlayOptions) => playSpec(whisperSpec(), options)

/** Directional pitch adjustment step. */
export const nudge = (direction: VerticalDirection, options?: PlayOptions) => playSpec(nudgeSpec(direction), options)
/** Binary state switch (on/off). */
export const toggle = (state: ToggleState, options?: PlayOptions) => playSpec(toggleSpec(state), options)
/** Spatial directional noise sweep (in/out). */
export const slide = (direction: SpatialDirection, options?: PlayOptions) => playSpec(slideSpec(direction), options)
/** Directional page travel (forward/back). */
export const turn = (direction: PageDirection, options?: PlayOptions) => playSpec(turnSpec(direction), options)
/** Helper lookup map for playing sounds dynamically by string name. */
export function playByName(name: string, options?: PlayOptions): void {
  switch (name) {
    case 'tap':
      return playSpec(tapSpec(), options)
    case 'press':
      return playSpec(pressSpec(), options)
    case 'release':
      return playSpec(releaseSpec(), options)
    case 'tick':
      return playSpec(tickSpec(), options)
    case 'page':
      return playSpec(pageSpec(), options)
    case 'open':
      return playSpec(openSpec(), options)
    case 'close':
      return playSpec(closeSpec(), options)
    case 'copy':
      return playSpec(copySpec(), options)
    case 'paste':
      return playSpec(pasteSpec(), options)
    case 'remove':
      return playSpec(removeSpec(), options)
    case 'confirm':
    case 'success':
      return playSpec(confirmSpec(), options)
    case 'deny':
    case 'error':
      return playSpec(denySpec(), options)
    case 'loading':
      return playSpec(loadingSpec(), options)
    case 'ready':
      return playSpec(readySpec(), options)
    case 'chime':
      return playSpec(chimeSpec(), options)
    case 'sparkle':
      return playSpec(sparkleSpec(), options)
    case 'droplet':
      return playSpec(dropletSpec(), options)
    case 'bloom':
      return playSpec(bloomSpec(), options)
    case 'whisper':
      return playSpec(whisperSpec(), options)
    case 'nudge-up':
    case 'nudgeUp':
      return playSpec(nudgeSpec('up'), options)
    case 'nudge-down':
    case 'nudgeDown':
      return playSpec(nudgeSpec('down'), options)
    case 'toggle-on':
    case 'toggleOn':
      return playSpec(toggleSpec('on'), options)
    case 'toggle-off':
    case 'toggleOff':
      return playSpec(toggleSpec('off'), options)
    case 'slide-in':
    case 'slideIn':
      return playSpec(slideSpec('in'), options)
    case 'slide-out':
    case 'slideOut':
      return playSpec(slideSpec('out'), options)
    case 'turn-forward':
    case 'turnForward':
      return playSpec(turnSpec('forward'), options)
    case 'turn-back':
    case 'turnBack':
      return playSpec(turnSpec('back'), options)
    default:
      return playSpec(tapSpec(), options)
  }
}

export {
  getSettings,
  hydrate,
  playRecipe,
  playSpec,
  setEnabled,
  setOutputProfile,
  setRespectReducedMotion,
  setVolume,
  subscribe,
} from './audio/engine'

export { bind } from './interactions/bind'

export { getVoice, setVoice, voiceFor } from './voice/voice'

export type {
  FmLayer,
  NoiseLayer,
  OutputProfile,
  PageDirection,
  PlayOptions,
  Shimmer,
  SpaceLayer,
  SpaceSoundName,
  SpaceSoundSettings,
  SpaceSoundSpec,
  SpatialDirection,
  SpatialPosition,
  ToggleState,
  ToneLayer,
  VerticalDirection,
  Voice,
} from './sounds/types'
