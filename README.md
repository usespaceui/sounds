<p align="center">
  <a href="https://sounds.spaceui.one" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://sounds.spaceui.one/logo.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://sounds.spaceui.one/logo.svg">
      <img alt="Space UI logo" src="https://sounds.spaceui.one/logo.svg" width="100" />
    </picture>
  </a>
</p>

<h1 align="center">
  @usespaceui/sounds
</h1>

<p align="center">
  Procedural Web Audio UI sound engine. Spatial HRTF, brand voice seeding, and zero network requests.
</p>

<p align="center">
  <a href="https://sounds.spaceui.one">Preview</a> • 
  <a href="https://github.com/usespaceui/sounds">Source Code</a> • 
  <a href="https://www.spaceui.one">SpaceUI.one</a>
</p>

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=usespaceui">
    <img src="https://img.shields.io/twitter/follow/usespaceui.svg?label=Follow%20@usespaceui" alt="Follow @usespaceui" />
  </a>
</p>

<div align="center">
  <a href="https://www.npmjs.com/package/@usespaceui/sounds">
    <img src="https://img.shields.io/npm/v/@usespaceui/sounds?color=%23fa6400&label=version" />
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/sounds">
    <img src="https://img.shields.io/npm/unpacked-size/%40usespaceui%2Fsounds?label=install%20size">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/sounds">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Fsounds?format=min">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/sounds">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Fsounds">
  </a>
  <a href="https://github.com/usespaceui/sounds">
    <img src="https://img.shields.io/github/repo-size/usespaceui/sounds">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/sounds">
    <img src="https://img.shields.io/npm/dm/@usespaceui/sounds" />
  </a>
  <a href="https://github.com/usespaceui/sounds/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@usespaceui/sounds" />
  </a>
  <br><br>
</div>

---

## ✨ Overview

`@usespaceui/sounds` is a highly-optimized procedural sound engine for the web.
No `.mp3` or `.wav` files to load. Everything is generated entirely in the browser using the Web Audio API with Apple device output mastering and 3D spatial panning.

---

## 📦 Installation

```bash
pnpm add @usespaceui/sounds
# or
npm install @usespaceui/sounds
# or
yarn add @usespaceui/sounds
```

Zero dependencies. `react >= 18` is an optional peer dependency, only needed if you use the `useSpaceSound` hook.

---

## 🚀 Usage

### 1. HTML Data Attributes (Vanilla JS)

You can automatically bind sounds to DOM events without writing repetitive event listeners. Call `bind()` once in your app entry point, and then use `data-space-*` attributes on any element. If you leave the attribute empty, it will use its sensible default.

```js
import { bind } from '@usespaceui/sounds'

// Call once at app startup
bind()
```

```html
<!-- Automatically plays "tap" on click (default behavior) -->
<button data-space-click>Submit</button>

<!-- Plays a specific sound ("confirm") overriding the default -->
<button data-space-click="confirm">Save Changes</button>

<!-- Plays "tick" on mouse hover (debounced automatically) -->
<a href="#" data-space-hover>Hover me</a>

<!-- Plays "press" on pointerdown, and "release" on pointerup -->
<div data-space-press data-space-release>Press me</div>

<!-- Automatically calculates 3D spatial panning based on element position on screen -->
<button data-space-click="sparkle" data-space-spatial>Spatial Sound</button>
```

#### Available HTML Attributes & Defaults

- `data-space-click` -> Defaults to **`tap`** _(Listens to the `click` event)_
- `data-space-hover` -> Defaults to **`tick`** _(Listens to the `pointerenter` event. Automatically debounced and ignores touch/coarse pointers)_
- `data-space-press` -> Defaults to **`press`** _(Listens to the `pointerdown` event)_
- `data-space-release` -> Defaults to **`release`** _(Listens to the `pointerup` event)_
- `data-space-toggle` -> Defaults to **`toggle-on`** _(Listens to the `click` event. Ideal for switches/checkboxes)_
- `data-space-sound` -> Defaults to **`confirm`** _(Listens to the `click` event. Ideal for primary actions)_
- `data-space-contextmenu` -> Defaults to **`open`** _(Listens to the `contextmenu` right-click event)_
- `data-space-copy` -> Defaults to **`copy`** _(Listens to the native `copy` event)_
- `data-space-paste` -> Defaults to **`paste`** _(Listens to the native `paste` event)_

#### Global Page Audio (Adding to `<body>`)

Because `bind()` uses delegated event listeners, you can attach attributes directly to your `<body>` (or root layout) to enable app-wide audio interactions:

```html
<!-- Enables app-wide sound feedback for click, right-click, copy, and paste -->
<body data-space-click data-space-contextmenu data-space-copy data-space-paste>
  ...
</body>
```

| Attribute | Default Sound | Description |
| :--- | :--- | :--- |
| `data-space-click` | `tap` | Plays on general clicks across elements without specific sound overrides. |
| `data-space-contextmenu` | `open` | Plays on every right-click context menu event anywhere on the page. |
| `data-space-copy` | `copy` | Plays on any native copy action (via <kbd>Ctrl+C</kbd> / <kbd>Cmd+C</kbd> or context menu). |
| `data-space-paste` | `paste` | Plays on any native paste action into inputs or editable areas (via <kbd>Ctrl+V</kbd> / <kbd>Cmd+V</kbd>). |

### 2. React Hook

If you use React, the `useSpaceSound` hook gives you bound functions to trigger sounds and manage engine settings inside your components.

```tsx
import { useSpaceSound } from '@usespaceui/sounds'

export default function Demo() {
  const { tap, confirm, slide, setVolume } = useSpaceSound()

  return (
    <button
      onPointerDown={() => tap()}
      onClick={() => {
        confirm()
        slide('in')
      }}
    >
      Submit Action
    </button>
  )
}
```

> **Note for React users**: You can absolutely use the HTML data attributes approach in React instead of hooks! It's often cleaner for simple buttons. Just call `bind()` once in a root layout or a generic Provider:

```tsx
// components/SoundProvider.tsx
'use client'
import { useEffect } from 'react'
import { bind } from '@usespaceui/sounds'

export function SoundProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    bind() // Safely binds delegated event listeners to document
  }, [])

  return <>{children}</>
}
```

Then sprinkle the data attributes on your standard HTML elements anywhere in your app:

```tsx
<button data-space-click="sparkle">I play a sound!</button>
```

### 3. Programmatic Usage

You can also trigger sounds procedurally and adjust the engine settings globally via direct imports.

```ts
import { tap, slide, setVoice, play } from '@usespaceui/sounds'

// Set an optional global brand voice seed (alters the tonality of all sounds)
setVoice('Space UI')

// Trigger directly via dedicated functions
tap()
slide('in') // Some triggers accept parameters

// Or dynamically by name (useful for CMS or dynamic mappings)
play('slide-in', { volume: 0.8 })
```

---

## 🧩 Sound Triggers

There are multiple ways to trigger sounds:

1. **Direct method imports**: `import { tap } from "@usespaceui/sounds"`
2. **React Hook**: `const { tap } = useSpaceSound()`
3. **Dynamic String**: `play("tap")`
4. **HTML attribute**: `<button data-space-click="tap">`

The package includes 24 procedural interactions:

- **Core**: `tap`, `press`, `release`, `tick`, `page`
- **Actions**: `copy`, `paste`, `remove`, `confirm`, `deny`
- **Overlays**: `open`, `close`
- **Status**: `loading`, `ready`
- **Tones**: `chime`, `sparkle`, `droplet`, `bloom`, `whisper`
- **Directional (requires argument)**:
  - `nudge('up' | 'down')`
  - `toggle('on' | 'off')`
  - `slide('in' | 'out')`
  - `turn('forward' | 'back')`

_Note: When using `play` or HTML attributes, directional triggers use hyphenated strings (e.g. `play("slide-in")` or `data-space-click="toggle-on"`)._

---

## 🧰 Utilities Included

- `useSpaceSound()`
  React hook providing all sound trigger methods, properly bound to the engine, as well as state for `volume` and `enabled`.

- `play(name: string, options?: PlayOptions)`
  Helper to play any sound dynamically using its string name.

- `setVoice(seed: string | null)`
  Set a deterministic brand voice seed to slightly alter the tonality of all sounds.

- `setOutputProfile(profile: OutputProfile)`
  Adjusts the mastering EQ curve applied to all sounds, optimizing them for different listening environments. Profiles available:
  - `"auto"`: Detects the device and picks the best EQ curve automatically. _(Default)_
  - `"headphones"`: Flatter frequency response with a subtle bass lift, optimized for close-ear listening and binaural spatial panning.
  - `"speakers"`: Compensates for the limited frequency range of typical laptop and monitor speakers by boosting presence and low-end.
  - `"studio"`: Completely flat, uncolored output designed for high-fidelity studio monitors and mixing environments.

  ```ts
  import { setOutputProfile } from '@usespaceui/sounds'

  setOutputProfile('headphones')
  ```

- `setRespectReducedMotion(respect: boolean)`
  If enabled, completely mutes sounds when the user prefers reduced motion (enabled by default).

- `bind(root?: ParentNode)`
  Utility to automatically bind DOM interactions to a sound via event delegation. Safe to call multiple times.

---

## 📦 Related Packages

| Package                                                          | Description                                    |
| ---------------------------------------------------------------- | ---------------------------------------------- |
| [`@usespaceui/avatars`](https://github.com/usespaceui/avatars)   | Generative deterministic avatars               |
| [`@usespaceui/squircle`](https://github.com/usespaceui/squircle) | Figma-style corner smoothing (Apple squircles) |

---

## 🪪 License

MIT — Free for commercial and personal use.

---

## 📚 Resources

- 🔍 [Explore the sounds & Playground](https://sounds.spaceui.one)
- 🌍 [Space UI Official Site](https://www.spaceui.one)

---

## 🛠 Maintenance

If you find a bug or have a feature request, please open an [issue on GitHub](https://github.com/usespaceui/sounds/issues).
Engine internals are intentionally not part of the public API.

---

<p align="center">
  <a href="https://www.spaceui.one" target="_blank">
    <img src="https://www.spaceui.one/favicon.ico" width="60" style="border-radius: 50%" alt="Space UI Logo" />
  </a>
  <br />
  <b>Maintained by the Space UI Team</b>
</p>
