---
name: Aegis Command
colors:
  surface: '#101419'
  surface-dim: '#101419'
  surface-bright: '#36393f'
  surface-container-lowest: '#0a0e13'
  surface-container-low: '#181c21'
  surface-container: '#1c2025'
  surface-container-high: '#262a30'
  surface-container-highest: '#31353b'
  on-surface: '#e0e2ea'
  on-surface-variant: '#c1c6d6'
  inverse-surface: '#e0e2ea'
  inverse-on-surface: '#2d3136'
  outline: '#8b919f'
  outline-variant: '#414753'
  surface-tint: '#a9c7ff'
  primary: '#a9c7ff'
  on-primary: '#003063'
  primary-container: '#3a90ff'
  on-primary-container: '#002957'
  inverse-primary: '#005db6'
  secondary: '#fcbb4d'
  on-secondary: '#442c00'
  secondary-container: '#bf8619'
  on-secondary-container: '#3b2500'
  tertiary: '#ffb4a6'
  on-tertiary: '#660700'
  tertiary-container: '#fe563c'
  on-tertiary-container: '#5a0500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468b'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#fcbb4d'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a6'
  on-tertiary-fixed: '#3f0300'
  on-tertiary-fixed-variant: '#900d00'
  background: '#101419'
  on-background: '#e0e2ea'
  surface-variant: '#31353b'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  data-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin: 24px
  gutter: 16px
  component-padding-xs: 4px
  component-padding-sm: 8px
  component-padding-md: 16px
---

## Brand & Style
This design system is engineered for mission-critical B2G environments where split-second decision-making and data integrity are paramount. The aesthetic is defined by "High-Fidelity Utility"—a synthesis of technical precision and cognitive clarity. 

The visual language utilizes a **Dark-Mode-First** approach to reduce eye strain during long-term monitoring. It leans into **Glassmorphism** and **Modern Corporate** influences, creating a layered interface that feels like a physical command deck. The atmospheric depth helps users distinguish between background infrastructure and high-priority telemetry overlays.

**Emotional Response:**
- **Authoritative:** Commands respect through structured density.
- **Reliable:** Zero-latency visual feedback and stable layouts.
- **Urgent:** High-contrast functional colors that cut through the interface during critical events.

## Colors
The palette is rooted in a deep charcoal base to maximize the luminance of data visualizations. 

- **Primary (#2D8CFF):** Used for baseline operations, active states, and non-critical data pathways.
- **Warning (#E8A93D):** Reserved for preventative maintenance alerts and caution-level telemetry.
- **Critical (#E3432B):** Used exclusively for system failures, hazards, and emergency overrides.
- **Structural:** A scale of Neutral Grays (Slates) is used to define the interface skeleton, ensuring content hierarchy without competing for attention.

**Implementation Note:** Glass surfaces use the base `#0B0F14` with an alpha channel (approx. 60-80%) and a `backdrop-filter: blur(12px)`.

## Typography
The system employs a dual-font strategy: 
1. **Inter** handles all structural UI, navigation, and instructional text, providing high legibility and a professional tone.
2. **JetBrains Mono** is the technical workhorse, used for all numerical data, timestamps, coordinates, and telemetry streams. The monospaced nature ensures that fluctuating numbers do not cause layout "jitter" during real-time updates.

Small labels should frequently use `label-caps` to distinguish metadata from actionable content.

## Layout & Spacing
The system uses a **Compact 8px Grid** to maximize information density—essential for command center displays where "scrolling" is a failure state. 

- **Desktop:** A 12-column fluid grid. Panels are typically docked.
- **Tablet/Control Pad:** 8-column grid with increased hit targets for touch interaction.
- **Mobile:** 4-column grid, limited to high-level status monitoring and emergency alerts.

Containers should prioritize horizontal alignment to maintain the "control dashboard" feel. Padding inside data-heavy cards is reduced to `8px` (sm) to allow for more rows in tables and list views.

## Elevation & Depth
Depth is communicated through **Glassmorphism** rather than traditional drop shadows. This maintains a "HUD" (Heads-Up Display) aesthetic.

1. **Base Layer:** `#0B0F14` solid background.
2. **Intermediate Layer:** Secondary navigation and sidebar panels using low-transparency overlays.
3. **Active Surface Layer:** Main content cards using `backdrop-filter: blur(12px)` and a `1px` inner border (Stroke) at 15% white opacity.
4. **Overlay Layer:** Modals and urgent alerts use a higher blur radius and a subtle outer glow matching the functional color (e.g., a soft red glow for critical alerts).

**Shadows:** When used, shadows should be extremely subtle, sharp, and neutral (0px 2px 4px rgba(0,0,0,0.5)).

## Shapes
The system utilizes a precise, geometric shape language. 
- **Standard Cards/Panels:** 8px radius.
- **Input Fields/Buttons:** 6px radius for a sharper, more technical appearance.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.

Corners must remain consistent across nested elements to maintain the "machined" aesthetic.

## Components

**Buttons & Inputs:**
- **Primary:** Solid `#2D8CFF` with white text. 
- **Ghost:** Transparent background with the 1px white-opacity border and `JetBrains Mono` text.
- **Inputs:** Darker than the card surface, with a primary blue focus ring.

**Information-Dense Cards:**
- Cards feature a header area with `label-caps` text and a 1px divider. Content should utilize the 8px grid strictly.

**Status & Alerting:**
- **Status Pills:** Small, non-interactive badges with a background opacity of 20% and 100% text color (e.g., Warning pill has `#E8A93D` text).
- **Critical Alert Badges:** These include a **Pulse Effect**—a secondary, expanding ring of `#E3432B` at 30% opacity that animates to draw immediate attention.

**Data Tables:**
- High-density rows (32px height).
- Alternating row highlights at 5% opacity.
- Numeric columns must use `JetBrains Mono` and be right-aligned for easy comparison.

**Gauges & Visuals:**
- Use thin stroke weights (1.5pt - 2pt). 
- Avoid gradients in data visualizations unless representing a spectrum (e.g., heatmaps). Use solid functional colors.