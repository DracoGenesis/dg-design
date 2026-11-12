/*! @dracogenesis/design v1.0.0 · generated — edit tokens/ or src/, not dist/ */
/** Use: presets: [require('@dracogenesis/design/tailwind')] — load dist/css/tokens.css too, for the dg-* semantic colors. */
module.exports = {
  "theme": {
    "screens": {
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px"
    },
    "extend": {
      "colors": {
        "ember": {
          "50": "#FFF1EE",
          "100": "#FFDCD5",
          "200": "#FFB9AB",
          "300": "#FF9A88",
          "400": "#FF6B55",
          "500": "#FF3B1F",
          "600": "#D92B12",
          "700": "#A81F0B",
          "800": "#741608",
          "900": "#4A1006",
          "950": "#2A0A05"
        },
        "obsidian": {
          "50": "#FAF6F3",
          "100": "#F2E9E4",
          "200": "#DDD3CE",
          "300": "#BDB2AF",
          "400": "#978A8B",
          "500": "#6E6264",
          "600": "#4A4041",
          "700": "#342C2D",
          "800": "#241E1F",
          "850": "#1B1617",
          "900": "#141011",
          "950": "#0D0A0B"
        },
        "aether": "#6CC4D9",
        "gold": "#E8B04A",
        "verdant": "#46C08A",
        "bloodroot": "#F0566E",
        "dg": {
          "bg": "var(--dg-bg)",
          "surface": "var(--dg-surface)",
          "surface-raised": "var(--dg-surface-raised)",
          "surface-overlay": "var(--dg-surface-overlay)",
          "surface-sunken": "var(--dg-surface-sunken)",
          "border": "var(--dg-border)",
          "border-strong": "var(--dg-border-strong)",
          "border-control": "var(--dg-border-control)",
          "text": "var(--dg-text)",
          "text-secondary": "var(--dg-text-secondary)",
          "text-label": "var(--dg-text-label)",
          "text-muted": "var(--dg-text-muted)",
          "text-disabled": "var(--dg-text-disabled)",
          "accent": "var(--dg-accent)",
          "accent-hover": "var(--dg-accent-hover)",
          "accent-text": "var(--dg-accent-text)",
          "accent-text-hover": "var(--dg-accent-text-hover)",
          "on-accent": "var(--dg-on-accent)",
          "accent-tint": "var(--dg-accent-tint)",
          "accent-wash": "var(--dg-accent-wash)",
          "accent-rule": "var(--dg-accent-rule)",
          "focus": "var(--dg-focus)",
          "info": "var(--dg-info)",
          "warning": "var(--dg-warning)",
          "success": "var(--dg-success)",
          "danger": "var(--dg-danger)",
          "danger-wash": "var(--dg-danger-wash)"
        }
      },
      "fontFamily": {
        "display": [
          "'Cinzel'",
          "Georgia",
          "serif"
        ],
        "sans": [
          "'Inter'",
          "system-ui",
          "-apple-system",
          "'Segoe UI'",
          "sans-serif"
        ],
        "mono": [
          "'JetBrains Mono'",
          "'SF Mono'",
          "Menlo",
          "monospace"
        ],
        "lore": [
          "'Crimson Pro'",
          "Georgia",
          "serif"
        ]
      },
      "spacing": {
        "0": "0px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
        "32": "128px"
      },
      "borderRadius": {
        "xs": "4px",
        "chip": "6px",
        "sm": "8px",
        "alert": "10px",
        "md": "12px",
        "tile": "16px",
        "lg": "20px",
        "pill": "999px"
      },
      "boxShadow": {
        "e0": "none",
        "e1": "inset 0 1px 0 rgba(242,233,228,.05), 0 4px 12px rgba(0,0,0,.4)",
        "e2": "inset 0 1px 0 rgba(242,233,228,.07), 0 12px 32px rgba(0,0,0,.55)",
        "e3": "inset 0 1px 0 rgba(242,233,228,.08), 0 24px 64px rgba(0,0,0,.7)",
        "ember": "0 0 0 4px rgba(255,59,31,.15), 0 12px 40px rgba(255,59,31,.18)",
        "focus-field": "0 0 0 3px rgba(255,107,85,.2)"
      },
      "transitionDuration": {
        "fast": "120ms",
        "base": "200ms",
        "slow": "320ms",
        "ritual": "600ms"
      },
      "transitionTimingFunction": {
        "forge": "cubic-bezier(.2,.8,.2,1)"
      },
      "maxWidth": {
        "content": "1280px",
        "prose": "72ch"
      }
    }
  }
};
