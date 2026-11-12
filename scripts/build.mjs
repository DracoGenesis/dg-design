// Draco Genesis design system build.
// tokens/tokens.json + src/ → dist/. No runtime dependencies.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const T = JSON.parse(readFileSync(join(root, 'tokens/tokens.json'), 'utf8'));
const banner = `/*! @dracogenesis/design v${pkg.version} · generated — edit tokens/ or src/, not dist/ */\n`;

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'css'), { recursive: true });

// ---------- resolve {refs} ----------
const get = (path) => path.split('.').reduce((o, k) => o?.[k], T);
const resolve = (v) => typeof v === 'string'
  ? v.replace(/\{([^}]+)\}/g, (_, p) => { const r = get(p); if (r == null) throw new Error(`Unknown token ref {${p}}`); return resolve(r); })
  : v;

// ---------- CSS custom properties ----------
const lines = [];
const prim = [];
for (const [scale, val] of Object.entries(T.color)) {
  if (typeof val === 'string') prim.push(`--dg-${scale}: ${val};`);
  else for (const [step, hex] of Object.entries(val)) prim.push(`--dg-${scale}-${step}: ${hex};`);
}
prim.push(`--dg-ember-gradient: linear-gradient(180deg, ${T.color.ember[400]}, ${T.color.ember[500]});`);
for (const [k, v] of Object.entries(T.font.family)) prim.push(`--dg-font-${k}: ${v};`);
for (const [k, v] of Object.entries(T.font.weight)) prim.push(`--dg-weight-${k}: ${v};`);
for (const [k, v] of Object.entries(T.space)) prim.push(`--dg-space-${k}: ${v};`);
for (const [k, v] of Object.entries(T.layout)) prim.push(`--dg-${k}: ${v};`);
for (const [k, v] of Object.entries(T.radius)) prim.push(`--dg-radius-${k}: ${v};`);
for (const [k, v] of Object.entries(T.notch)) prim.push(`--dg-notch-${k}: ${v};`);
for (const [k, v] of Object.entries(T.shadow)) prim.push(`--dg-shadow-${k}: ${v};`);
for (const [k, v] of Object.entries(T.control)) prim.push(`--dg-control-${k}: ${v};`);
for (const [k, v] of Object.entries(T.motion)) prim.push(`--dg-${k.startsWith('ease') ? k : 'duration-' + k}: ${v};`);
for (const [k, v] of Object.entries(T.z)) prim.push(`--dg-z-${k}: ${v};`);
// type: desktop values; mobile values swap in below md
const typeLg = [], typeSm = [];
for (const [k, t] of Object.entries(T.type)) {
  prim.push(`--dg-type-${k}-family: var(--dg-font-${t.family});`, `--dg-type-${k}-weight: ${t.weight};`, `--dg-type-${k}-tracking: ${t.tracking};`);
  typeLg.push(`--dg-type-${k}-size: ${t.size};`, `--dg-type-${k}-line: ${t.line};`);
  typeSm.push(`--dg-type-${k}-size: ${t['size-sm']};`, `--dg-type-${k}-line: ${t['line-sm']};`);
}
const sem = (mode) => Object.entries(T.semantic[mode]).map(([k, v]) => `--dg-${k}: ${resolve(v)};`);
const ind = (a) => a.map((l) => '  ' + l).join('\n');

const tokensCss = `${banner}
:root {
${ind(prim)}
${ind(typeLg)}
  /* layout — desktop */
  --dg-margin: var(--dg-margin-lg);
  --dg-gutter: var(--dg-gutter-lg);
  --dg-section: var(--dg-section-lg);
}
:root, [data-theme="dark"] {
  color-scheme: dark;
${ind(sem('dark'))}
}
[data-theme="parchment"] {
  color-scheme: light;
${ind(sem('parchment'))}
}
@media (max-width: ${parseInt(T.breakpoint.lg) - 0.02}px) {
  :root { --dg-margin: var(--dg-margin-md); --dg-gutter: var(--dg-gutter-md); }
}
@media (max-width: ${parseInt(T.breakpoint.md) - 0.02}px) {
  :root {
${ind(typeSm).replace(/^/gm, '  ')}
    --dg-margin: var(--dg-margin-sm);
    --dg-gutter: var(--dg-gutter-sm);
    --dg-section: var(--dg-section-sm);
  }
}
`;
writeFileSync(join(dist, 'css/tokens.css'), tokensCss);

// ---------- fonts (self-hosted woff2, latin subset) ----------
const require = createRequire(import.meta.url);
const FONTS = [
  ['Cinzel', '@fontsource/cinzel', 'cinzel', [400, 600, 700], false],
  ['Inter', '@fontsource/inter', 'inter', [400, 500, 600, 700], false],
  ['JetBrains Mono', '@fontsource/jetbrains-mono', 'jetbrains-mono', [400, 500, 600], false],
  ['Crimson Pro', '@fontsource/crimson-pro', 'crimson-pro', [400, 600], true],
];
mkdirSync(join(dist, 'fonts'), { recursive: true });
let fontsCss = `${banner}/* Self-hosted, OFL-licensed. Cinzel Decorative is intentionally absent: it lives in the logo artwork only. */\n`;
for (const [family, mod, slug, weights, italic] of FONTS) {
  const dir = join(dirname(require.resolve(`${mod}/package.json`)), 'files');
  const styles = italic ? ['normal', 'italic'] : ['normal'];
  for (const w of weights) for (const s of styles) {
    if (s === 'italic' && w !== 400) continue;
    const file = `${slug}-latin-${w}-${s}.woff2`;
    if (!existsSync(join(dir, file))) throw new Error(`Missing font ${file}`);
    cpSync(join(dir, file), join(dist, 'fonts', file));
    fontsCss += `@font-face{font-family:'${family}';font-style:${s};font-weight:${w};font-display:swap;src:url('../fonts/${file}') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}\n`;
  }
}
writeFileSync(join(dist, 'css/fonts.css'), fontsCss);

// ---------- component CSS ----------
const srcCss = readdirSync(join(root, 'src/css')).filter((f) => f.endsWith('.css')).sort();
const parts = [];
for (const f of srcCss) {
  const css = readFileSync(join(root, 'src/css', f), 'utf8');
  writeFileSync(join(dist, 'css', f.replace(/^\d+-/, '')), banner + css);
  parts.push(`/* ==== ${f} ==== */\n${css}`);
}
// dg.css lives at dist/ root, so asset/font urls move up one level
const bundle = [tokensCss.replace(banner, ''), fontsCss.replace(banner, ''), ...parts].join('\n')
  .replace(/url\('\.\.\/fonts\//g, "url('./fonts/")
  .replace(/url\('\.\.\/assets\//g, "url('./assets/");
writeFileSync(join(dist, 'dg.css'), banner + bundle);
writeFileSync(join(dist, 'dg.min.css'), banner + minify(bundle));

function minify(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}

// ---------- JS / JSON / Tailwind ----------
const resolved = JSON.parse(JSON.stringify(T, (k, v) => (k === '$description' ? undefined : resolve(v))));
writeFileSync(join(dist, 'tokens.json'), JSON.stringify(resolved, null, 2));
writeFileSync(join(dist, 'tokens.mjs'), `${banner}export const tokens = ${JSON.stringify(resolved, null, 2)};\nexport default tokens;\n`);
writeFileSync(join(dist, 'tokens.cjs'), `${banner}module.exports = ${JSON.stringify(resolved, null, 2)};\n`);
writeFileSync(join(dist, 'tokens.d.ts'), `${banner}declare const tokens: ${JSON.stringify(resolved, (k, v) => typeof v === 'string' ? 'string' : v, 2).replace(/"string"/g, 'string')};\nexport { tokens };\nexport default tokens;\n`);

const semVars = Object.fromEntries(Object.keys(T.semantic.dark).map((k) => [k, `var(--dg-${k})`]));
const tw = {
  theme: {
    screens: T.breakpoint,
    extend: {
      colors: { ember: T.color.ember, obsidian: T.color.obsidian, aether: T.color.aether, gold: T.color.gold, verdant: T.color.verdant, bloodroot: T.color.bloodroot, dg: semVars },
      fontFamily: Object.fromEntries(Object.entries(T.font.family).map(([k, v]) => [k, v.split(',').map((s) => s.trim())])),
      spacing: T.space,
      borderRadius: T.radius,
      boxShadow: T.shadow,
      transitionDuration: { fast: T.motion.fast, base: T.motion.base, slow: T.motion.slow, ritual: T.motion.ritual },
      transitionTimingFunction: { forge: T.motion['ease-forge'] },
      maxWidth: { content: T.layout['content-max'], prose: T.layout['prose-max'] },
    },
  },
};
writeFileSync(join(dist, 'tailwind-preset.cjs'), `${banner}/** Use: presets: [require('@dracogenesis/design/tailwind')] — load dist/css/tokens.css too, for the dg-* semantic colors. */\nmodule.exports = ${JSON.stringify(tw, null, 2)};\n`);

// ---------- JS behaviours + assets ----------
cpSync(join(root, 'src/js/dg.js'), join(dist, 'dg.js'));
writeFileSync(join(dist, 'dg.js'), banner + readFileSync(join(dist, 'dg.js'), 'utf8'));
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });

console.log(`Built @dracogenesis/design v${pkg.version}: ${srcCss.length} component files, ${readdirSync(join(dist, 'fonts')).length} fonts.`);
