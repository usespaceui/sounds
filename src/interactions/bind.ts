import { playByName } from '../index'
import type { SpatialPosition } from '../sounds/types'

const HOVER_GAP_MS = 140
const boundRoots = new WeakSet<ParentNode>()
const handledEvents = new WeakSet<Event>()

let lastHoverTime = -Infinity

function isFineMouse(event: PointerEvent): boolean {
  return event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function findTarget(root: ParentNode, event: Event, attr: string): HTMLElement | null {
  if (!(event.target instanceof Element)) return null
  const element = event.target.closest<HTMLElement>(`[${attr}]`)
  return element && (root as Node).contains(element) ? element : null
}

function calculateSpatialPos(element: HTMLElement): SpatialPosition | undefined {
  const explicitX = element.getAttribute('data-space-x')
  const explicitY = element.getAttribute('data-space-y')
  const isSpatialAuto = element.hasAttribute('data-space-spatial')

  if (explicitX || explicitY) {
    return {
      x: explicitX ? parseFloat(explicitX) : 0,
      y: explicitY ? parseFloat(explicitY) : 0,
    }
  }

  if (isSpatialAuto && typeof window !== 'undefined') {
    const rect = element.getBoundingClientRect()
    const windowWidth = window.innerWidth || 1
    const windowHeight = window.innerHeight || 1

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Normalize to -1.0 (left/bottom) .. +1.0 (right/top)
    const normX = (centerX / windowWidth - 0.5) * 2
    const normY = (0.5 - centerY / windowHeight) * 2

    return { x: normX, y: normY }
  }

  return undefined
}

function listen(root: ParentNode, eventName: string, attr: string, fallbackSound: string, mouseOnly = false): void {
  ;(root as EventTarget).addEventListener(
    eventName,
    (event) => {
      const element = findTarget(root, event, attr)
      if (!element || handledEvents.has(event)) return
      if (mouseOnly && 'pointerType' in event && !isFineMouse(event as PointerEvent)) return

      if (eventName === 'pointerenter') {
        const relatedTarget = (event as PointerEvent).relatedTarget
        if (relatedTarget instanceof Node && element.contains(relatedTarget)) return

        const now = performance.now()
        if (now - lastHoverTime < HOVER_GAP_MS) return
        lastHoverTime = now
      }

      handledEvents.add(event)

      const soundRequested = element.getAttribute(attr) || fallbackSound
      const spatial = calculateSpatialPos(element)

      playByName(soundRequested, { spatial })
    },
    true,
  )
}

/**
 * Delegated listener initialization under root (default: document).
 * Safe for SSR and safe to call repeatedly.
 */
export function bind(root?: ParentNode): void {
  if (typeof document === 'undefined') return
  const scope = root ?? document
  if (boundRoots.has(scope)) return
  boundRoots.add(scope)

  listen(scope, 'pointerenter', 'data-space-hover', 'tick', true)
  listen(scope, 'pointerdown', 'data-space-press', 'press')
  listen(scope, 'pointerup', 'data-space-release', 'release')
  listen(scope, 'click', 'data-space-click', 'tap')
  listen(scope, 'click', 'data-space-toggle', 'toggle-on')
  listen(scope, 'click', 'data-space-sound', 'confirm')
  listen(scope, 'contextmenu', 'data-space-contextmenu', 'open')
  listen(scope, 'copy', 'data-space-copy', 'copy')
  listen(scope, 'paste', 'data-space-paste', 'paste')
}
