# Draco Genesis design system — rules for Claude Code

Copy this file (or the section below) into the CLAUDE.md of every Draco Genesis project:
the website, player tools, DG Forge (Electron). It keeps every project on the system.

## Use the package, never re-invent it
- All styling comes from `@dracogenesis/design` (`dg.css` + optional `dg.js`). Load it before any page CSS.
- Use `dg-` classes for every component that exists in the package (buttons, fields, cards, nav, modal, alerts, badges, tabs, table, footer, textures). Check `demo/index.html` in the package for markup.
- Never hard-code hex colors, font stacks, font sizes, radii, shadows or spacing. Use `var(--dg-*)` tokens. Semantic tokens (`--dg-surface`, `--dg-text-muted`, `--dg-accent`) beat primitives (`--dg-obsidian-900`).
- If a page needs something the package lacks, add it to the package (tokens/ or src/css/), release a new version, then use it. Don't patch a look locally in a project.

## Brand rules that code must respect
- Fonts: Cinzel for display / H1 / H2 only — never below 24px, never on buttons, labels or body. Inter for all UI. JetBrains Mono for numbers, prices, life totals, codes. Crimson Pro for lore/flavor only. Cinzel Decorative is logo artwork only — never set it as a font.
- Ember (`--dg-accent`) points and ignites; it never fills large areas. Ember buttons carry Obsidian text (`--dg-on-accent`).
- One hero CTA (`.dg-btn--hero`, Scale Notch) per page. Scale Notch otherwise only on product cards.
- Primary button is rightmost on desktop; on mobile, actions are full width and stacked with primary on top (`.dg-actions` does this).
- Spacing (4px scale): label → helper 4 · helper/label → field 8 · field → field 24 · last field → actions 32 · button → button 12. Desktop: 48 margins, 96 between sections. Mobile (<768): 24 margins, 48 between sections. `.dg-container`, `.dg-section`, `.dg-form`, `.dg-field` already encode this.
- Helper and error text sit between the label and the field (`.dg-field__head`).
- Accent lines are the straight Ember tick (`.dg-tick`, `.dg-card--accent`) — never a rounded accent border.
- The dragon-scale texture is never raw: only `.dg-tx--scrim | --glow | --sweep | --spotlight | --smolder | --band`. Max ~20% of a layout; never behind body text. Tools and forms sit on plain Obsidian.
- Tabs switch views of the same content; navigation moves between pages.
- Status = `.dg-badge` (pill). Filters = `.dg-tag` (6px). Errors and destructive use Bloodroot and always pair with an icon.
- Notice banner (`.dg-notice`) for persistent policy; announcement bar (`.dg-announcement.dg-tx.dg-tx--band`) for dismissible promos.
- Every website page carries the proxy disclaimer in the footer.

## Accessibility baseline
44px touch targets, visible focus (`--dg-focus`), 4.5:1 text contrast, `aria-label` on icon buttons, honour `prefers-reduced-motion`.
