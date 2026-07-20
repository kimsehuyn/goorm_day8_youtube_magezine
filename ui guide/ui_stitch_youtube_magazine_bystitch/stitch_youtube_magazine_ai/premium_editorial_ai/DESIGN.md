---
name: Premium Editorial AI
colors:
  surface: '#FFFFFF'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#410003'
  on-tertiary-container: '#f2403c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#93000e'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  gold: '#E3B341'
  border: '#ECECEC'
  muted: '#666666'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 20px
  gutter: 24px
  max-width: 1440px
  content-width: 1200px
---

## Brand & Style

This design system is built for an AI-native magazine that bridges the gap between digital video content and high-end print journalism. The target audience includes tastemakers, tech-forward professionals, and creators who value depth over noise.

The visual style is **Minimalist / Modern Luxury**. It draws inspiration from the layout rigor of *GQ* and *Esquire*, the functional elegance of Apple’s Human Interface Guidelines, and the clean, systematic efficiency of modern SaaS platforms like Linear. The aesthetic prioritizes "content as hero," utilizing expansive whitespace, bold typographic contrast, and subtle depth to create an environment that feels curated, quiet, and expensive. It avoids the chaotic "feed" look of traditional social media in favor of a structured, calm reading experience.

## Colors

The color palette is rooted in a high-contrast monochromatic base, accented by "Editorial Red" and "Luxury Gold."

- **Primary & Secondary:** These deep grays serve as the foundation for text and structural elements. In dark mode, these shift to soft dark grays rather than pure black to maintain an Apple News-like sophisticated depth.
- **Accent (Red):** Used sparingly for urgent trend indicators, high-impact categories, or "Live" status. 
- **Gold:** Reserved for premium AI-generated insights, scores, and "Editor's Choice" highlights, signaling a higher tier of information.
- **Background & Surface:** A layered approach using `#F7F7F7` for the page canvas and pure `#FFFFFF` for cards and interactive containers to create a subtle sense of elevation.

## Typography

The typographic hierarchy is the primary driver of the "Magazine" feel. 

**Playfair Display** is used for all headlines and display text. It should be set with tight letter-spacing for large titles to maintain a premium, editorial punch.

**Inter** handles all functional and long-form reading tasks. For body text, generous line-height (1.6x) is mandatory to ensure readability across long AI-generated articles. Label styles utilize uppercase with increased letter-spacing to distinguish metadata (categories, timestamps, stats) from the narrative flow.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy centered within a 1440px viewport.

- **Grid:** A 12-column grid on desktop, 8-column on tablet, and single-column on mobile.
- **Rhythm:** Spacing follows a 4px/8px baseline, but editorial sections should favor larger steps (48px, 64px, 96px) to maintain "breathability."
- **Margins:** Intentional whitespace is a luxury signifier. Large margins on the outer edges of the content container prevent the UI from feeling crowded on wide displays.
- **Responsive Behavior:** On mobile, the editorial composition reflows into a seamless vertical stack, but maintains larger-than-standard padding (20px) to preserve the premium feel.

## Elevation & Depth

The system uses **Tonal Layers** combined with **Ambient Shadows** to create a sophisticated sense of hierarchy without excessive clutter.

- **Surface Tiers:** The background uses the neutral gray. Interactive cards sit on top of this in pure white.
- **Shadows:** Shadows are highly diffused and low-opacity (e.g., `0 20px 40px rgba(0,0,0,0.04)`). They should feel like a soft glow rather than a harsh drop-shadow.
- **Glassmorphism:** Reserved strictly for the navigation bar and specific AI "overlay" widgets. Use a heavy backdrop blur (20px+) and a 1px low-contrast border to simulate frosted glass, ensuring content remains legible underneath while scrolling.

## Shapes

The shape language is refined and "Soft-Rounded." While a luxury aesthetic often trends toward sharp corners, this system uses a `0.5rem` (8px) base radius to bridge the gap between "hard news" and "modern technology."

- **Cards & Containers:** Use `rounded-lg` (16px) to feel approachable.
- **Buttons & Chips:** Use `rounded-xl` (24px) or full pill-shape for high-action items like "Read Story" or category tags.
- **Media:** Images and video thumbnails should match the container's roundedness to maintain visual harmony.

## Components

### Buttons
Primary buttons are bold, using the primary `#111111` color with white Inter Medium text. Hover states should include a subtle scale-up (1.02x) and a slight shift in shadow depth. Ghost buttons for secondary actions use the `#ECECEC` border.

### Article Cards
The centerpiece of the homepage. These feature large aspect-ratio thumbnails (16:9), a floating gold or red category badge in the top-left, and typography-led content below. The headline uses Playfair Display.

### Ranking Cards
Inspired by high-performance data dashboards but styled for a magazine. These include minimal line charts (sparklines) in Gold, rank numbers in a large, light-weight Playfair Display font, and trend indicators (arrows) using the Accent red.

### AI Widgets
AI Summary and Insight widgets should use a subtle background tint of Gold (at 5-10% opacity) or a Glassmorphism effect to distinguish them as "machine-generated" enhancements to the editorial text.

### Navigation
The navigation is a sticky, Apple-inspired bar. It starts transparent at the top of the page (with text over the hero image) and transitions to a white-glass (frosted) blur upon scrolling. The logo should be a minimalist typographic mark.

### Inputs & Search
The search experience is a full-screen overlay with large Playfair Display type for the input field. Results appear instantly in an editorial grid as the user types.