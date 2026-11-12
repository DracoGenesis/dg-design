# @dracogenesis/design

The Draco Genesis design system as code: tokens, self-hosted fonts, brand assets and framework-free CSS components, plus an optional dependency-free behaviour script. One source of truth for the website, the public player tools and DG Forge.

The visual reference is the Brand Guidelines design file. This package is its implementation — `demo/index.html` shows every component live.

## What's inside

| Path | What it is |
| --- | --- |
| `dist/dg.css` / `dg.min.css` | Everything: tokens, fonts, base, layout, components, textures |
| `dist/css/*.css` | The same, split by layer (`tokens.css`, `fonts.css`, `buttons.css`, …) |
| `dist/dg.js` | Optional behaviours: menus, mobile nav, tabs, modals, toasts, stepper, card fans |
| `dist/tokens.json` · `.mjs` · `.cjs` · `.d.ts` | Tokens for JavaScript / TypeScript |
| `dist/tailwind-preset.cjs` | Tailwind preset, if a project uses Tailwind |
| `dist/assets/` | Logos, icons, scale tile, card back |
| `dist/fonts/` | Cinzel, Inter, JetBrains Mono, Crimson Pro (woff2, OFL) |

## Use it

**Website (PHP / plain HTML)** — pin a version from the CDN:

```html
<link rel="preload" href="https://cdn.jsdelivr.net/gh/DracoGenesis/dg-design@1.0.0/dist/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/DracoGenesis/dg-design@1.0.0/dist/dg.min.css">
<script src="https://cdn.jsdelivr.net/gh/DracoGenesis/dg-design@1.0.0/dist/dg.js" defer></script>
```

Or copy `dist/` into the site (e.g. `/assets/dg/`) during deploy and link it locally.

**DG Forge (Electron) or any npm project:**

```bash
npm install github:DracoGenesis/dg-design#v1.0.0
```

```js
import '@dracogenesis/design/css';     // bundlers
import tokens from '@dracogenesis/design';
```

Forge works offline because fonts and assets ship inside the package.

**Themes:** dark is the default. Add `data-theme="parchment"` to `<html>` (or any container) for the light mode.

## Change it

1. Edit `tokens/tokens.json` (values) or `src/css/*.css` (components).
2. `npm run build`, then check `demo/index.html` (`npm run demo` serves it).
3. Bump `version` in `package.json` (semver: patch = fix, minor = new component, major = breaking class or token rename).
4. `npm run release` commits `dist/` and tags `vX.Y.Z`. Push with `git push --follow-tags`.
5. Update the version pin in each project when you want the change there.

## Rules for Claude Code

`CLAUDE.md` holds the brand and code rules. Copy it into every Draco Genesis project so future sessions use the package instead of improvising.
