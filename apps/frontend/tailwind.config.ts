/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        surface: "#101419",
        "surface-dim": "#0B0F14",
        "surface-bright": "#1C2025",
        "surface-container-lowest": "#080A0D",
        "surface-container-low": "#181c21",
        "surface-container": "#1c2025",
        "surface-container-high": "#262a30",
        "surface-container-highest": "#31353b",
        "on-surface": "#e0e2ea",
        "on-surface-variant": "#c1c6d6",
        outline: "#8b919f",
        "outline-variant": "#414753",
        primary: "#a9c7ff",
        "on-primary": "#003062",
        "primary-container": "#2D8CFF",
        "on-primary-container": "#e0e2ea",
        secondary: "#fcbb4d",
        "on-secondary": "#432c00",
        tertiary: "#c5c0ff",
        error: "#ffb4ab",
        "functional-red": "#E3432B",
        "functional-amber": "#E8A93D",
        "functional-blue": "#2D8CFF",
        "surface-tint": "#a9c7ff",
        "surface-variant": "#414753",
        "inverse-surface": "#e0e2ea",
        "inverse-on-surface": "#101419",
        "primary-fixed": "#d3e3ff",
        "primary-fixed-dim": "#a9c7ff",
        "secondary-fixed": "#ffdea5",
        "secondary-fixed-dim": "#fcbb4d",
        "secondary-container": "#604100",
        "tertiary-container": "#454085",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6"
      },
      fontFamily: {
        "display-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "data-mono-lg": ["JetBrains Mono", "monospace"],
        "data-mono-sm": ["JetBrains Mono", "monospace"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "display-lg-mobile": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "data-mono-lg": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "data-mono-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "label-caps": ["10px", { lineHeight: "12px", letterSpacing: "0.08em", fontWeight: "700" }],
        "display-lg-mobile": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "700" }]
      },
      spacing: {
        unit: "8px",
        "container-margin": "24px",
        gutter: "16px",
        "component-padding-xs": "4px",
        "component-padding-sm": "8px",
        "component-padding-md": "16px"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      }
    }
  },
  plugins: [],
}
