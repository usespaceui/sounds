import type { SpatialPosition } from '../sounds/types'

/**
 * Creates and configures a 3D Web Audio HRTF PannerNode for spatial audio positioning.
 * Follows visionOS & Apple Spatial Audio distance attenuation curves.
 */
export function createSpatialPanner(context: AudioContext, pos: SpatialPosition): PannerNode {
  const panner = context.createPanner()

  // HRTF binaural panning (highest spatial fidelity for headphones & stereo speakers)
  panner.panningModel = 'HRTF'
  panner.distanceModel = 'inverse'
  panner.refDistance = 1
  panner.maxDistance = 10
  panner.rolloffFactor = 1.2
  panner.coneInnerAngle = 360

  const x = Math.min(2, Math.max(-2, pos.x))
  const y = Math.min(2, Math.max(-2, pos.y ?? 0))
  const z = Math.min(3, Math.max(-1, pos.z ?? 0))

  if (panner.positionX) {
    panner.positionX.value = x
    panner.positionY.value = y
    panner.positionZ.value = z
  } else {
    panner.setPosition(x, y, z)
  }

  return panner
}
