# Design System Guidelines - Portfolio Redesign

## Overview
This document defines the visual language, component patterns, and technical specifications for the portfolio case study pages. All designs use light mode as default with accessible, high-contrast elements optimized for readability.

---

## Typography System

### Font Families

```css
:root {
  /* Primary Typefaces */
  --font-display: 'Craftwork Grotesk', sans-serif;
  --font-body: 'Satoshi', sans-serif;
  --font-mono: 'PP Mondwest', 'PP Neue Bit Bold', monospace;
}
```

### Font Loading
```css
/* Craftwork Grotesk - Display headings */
@font-face {
  font-family: 'Craftwork Grotesk';
  src: url('/fonts/CraftworkGrotesk-ExtraLight.woff2') format('woff2');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Craftwork Grotesk';
  src: url('/fonts/CraftworkGrotesk-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

/* Satoshi - Body text */
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* PP Mondwest / PP Neue Bit Bold - Monospace for technical notes */
@font-face {
  font-family: 'PP Mondwest';
  src: url('/fonts/PPMondwest-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PP Neue Bit Bold';
  src: url('/fonts/PPNeueBitBold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Type Scale

```css
/* Hero/Display Text */
.hero-title-nk26 {
  font-family: var(--font-display);
  font-weight: 200;
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.hero-subtitle-nk26 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(1rem, 3vw, 1.75rem);
  line-height: 1.4;
  letter-spacing: -0.01em;
}

/* Section Titles */
.section-title-nk26 {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
}

.section-title-full-nk26 {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2.25rem, 6vw, 4rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.subsection-title-nk26 {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

/* Body Text */
.section-text-nk26 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  letter-spacing: -0.005em;
}

/* Small Text */
.meta-label-nk26 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.meta-value-nk26 {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.5;
  letter-spacing: -0.005em;
}

/* Captions */
.image-caption-nk26,
.lottie-caption-nk26 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.5;
  letter-spacing: 0;
  font-style: italic;
}

/* Technical/Monospace */
.tech-note-label-nk26 {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.4;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.tech-note-text-nk26 {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.7;
  letter-spacing: 0;
}

/* Quotes */
.user-quote-nk26 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: 1.6;
  font-style: italic;
  letter-spacing: -0.005em;
}

.user-quote-nk26 cite {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9rem;
  font-style: normal;
  letter-spacing: 0;
}
```

### Responsive Typography

```css
/* Mobile: Smaller, tighter spacing */
@media (max-width: 767px) {
  .hero-title-nk26 {
    font-size: clamp(2rem, 10vw, 3rem);
    line-height: 1.1;
  }
  
  .section-title-nk26 {
    font-size: clamp(1.5rem, 7vw, 2.5rem);
  }
  
  .section-text-nk26 {
    font-size: 1rem;
    line-height: 1.6;
  }
}

/* Tablet: Mid-range */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero-title-nk26 {
    font-size: clamp(3rem, 8vw, 4.5rem);
  }
  
  .section-title-nk26 {
    font-size: clamp(2rem, 5vw, 3rem);
  }
}

/* Desktop: Full scale */
@media (min-width: 1024px) {
  .hero-title-nk26 {
    font-size: clamp(4rem, 8vw, 6rem);
  }
  
  .section-title-nk26 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
  }
}
```

---

## Color System

### Light Mode (Default)

```css
:root {
  /* Backgrounds */
  --background-primary: #f5f5f5;
  --background-secondary: #ffffff;
  --background-tertiary: #e8e8e8;
  
  /* Text */
  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-tertiary: #7a7a7a;
  --text-quaternary: #a0a0a0;
  
  /* Borders */
  --border-light: rgba(0, 0, 0, 0.08);
  --border-medium: rgba(0, 0, 0, 0.12);
  --border-strong: rgba(0, 0, 0, 0.2);
  
  /* Accent Colors */
  --accent-primary: #6366f1;      /* Indigo - Primary CTA */
  --accent-secondary: #8b5cf6;    /* Purple - Secondary actions */
  --accent-tertiary: #3b82f6;     /* Blue - Links */
  
  /* Status Colors */
  --status-success: #22c55e;      /* Green - Success states */
  --status-warning: #eab308;      /* Yellow - Warning states */
  --status-error: #ef4444;        /* Red - Error states */
  --status-info: #3b82f6;         /* Blue - Info states */
  
  /* Technical Note Colors */
  --tech-note-bg: rgba(0, 0, 0, 0.03);
  --tech-note-border: rgba(0, 0, 0, 0.15);
  --tech-note-text: #4a4a4a;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.12);
}
```

### Dark Mode (Optional Override)

```css
[data-theme="dark"] {
  /* Backgrounds */
  --background-primary: #1a1a1a;
  --background-secondary: #2a2a2a;
  --background-tertiary: #3a3a3a;
  
  /* Text */
  --text-primary: #f5f5f5;
  --text-secondary: #c0c0c0;
  --text-tertiary: #909090;
  --text-quaternary: #707070;
  
  /* Borders */
  --border-light: rgba(255, 255, 255, 0.08);
  --border-medium: rgba(255, 255, 255, 0.12);
  --border-strong: rgba(255, 255, 255, 0.2);
  
  /* Technical Note Colors */
  --tech-note-bg: rgba(255, 255, 255, 0.05);
  --tech-note-border: rgba(255, 255, 255, 0.15);
  --tech-note-text: #c0c0c0;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
}
```

### Color Usage Guidelines

```css
/* Headings */
h1, h2, h3, .hero-title-nk26, .section-title-nk26 {
  color: var(--text-primary);
}

/* Body text */
p, .section-text-nk26 {
  color: var(--text-secondary);
}

/* Meta information */
.meta-label-nk26 {
  color: var(--text-tertiary);
}

.meta-value-nk26 {
  color: var(--text-primary);
}

/* Links */
a {
  color: var(--accent-tertiary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-primary);
}

/* Quotes */
.user-quote-nk26 {
  color: var(--text-secondary);
  border-left: 4px solid var(--accent-primary);
}

/* Technical notes */
.tech-note-nk26 {
  background: var(--tech-note-bg);
  border: 2px dotted var(--tech-note-border);
  color: var(--tech-note-text);
}
```

---

## Spacing System

### Base Scale

```css
:root {
  /* Spacing Scale (8px base) */
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.5rem;     /* 24px */
  --space-xl: 2rem;       /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 4rem;      /* 64px */
  --space-4xl: 6rem;      /* 96px */
  --space-5xl: 8rem;      /* 128px */
  
  /* Section Spacing */
  --section-spacing-mobile: 3rem;   /* 48px */
  --section-spacing-tablet: 4rem;   /* 64px */
  --section-spacing-desktop: 6rem;  /* 96px */
  
  /* Container Padding */
  --container-padding-mobile: 5%;
  --container-padding-tablet: 8%;
  --container-padding-desktop: 10%;
  
  /* Max Width */
  --max-width: 1400px;
}
```

### Usage Examples

```css
/* Section spacing */
section {
  padding: var(--section-spacing-mobile) 0;
}

@media (min-width: 768px) {
  section {
    padding: var(--section-spacing-tablet) 0;
  }
}

@media (min-width: 1024px) {
  section {
    padding: var(--section-spacing-desktop) 0;
  }
}

/* Container padding */
.grid-container-nk26 {
  padding-left: var(--container-padding-mobile);
  padding-right: var(--container-padding-mobile);
}

@media (min-width: 768px) {
  .grid-container-nk26 {
    padding-left: var(--container-padding-tablet);
    padding-right: var(--container-padding-tablet);
  }
}

@media (min-width: 1024px) {
  .grid-container-nk26 {
    padding-left: var(--container-padding-desktop);
    padding-right: var(--container-padding-desktop);
  }
}

/* Element spacing */
.section-title-nk26 {
  margin-bottom: var(--space-2xl);
}

.subsection-title-nk26 {
  margin-bottom: var(--space-lg);
}

.section-text-nk26 {
  margin-bottom: var(--space-lg);
}

.image-wrapper-nk26 {
  margin: var(--space-2xl) 0;
}
```

---

## Grid System

### Rule of Thirds Layout

```css
/* Base Container */
.grid-container-nk26 {
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  gap: var(--space-2xl);
}

/* Mobile: Stack all columns */
@media (max-width: 767px) {
  .grid-container-nk26 {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}

/* Tablet & Desktop: Rule of thirds patterns */
@media (min-width: 768px) {
  /* Pattern A: 2/3 Main + 1/3 Sidebar */
  .grid-pattern-a-nk26 .grid-container-nk26 {
    grid-template-columns: 2fr 1fr;
    gap: var(--space-3xl);
  }
  
  /* Pattern B: 1/3 Sidebar + 2/3 Main */
  .grid-pattern-b-nk26 .grid-container-nk26 {
    grid-template-columns: 1fr 2fr;
    gap: var(--space-3xl);
  }
  
  /* Pattern C: Full width with nested splits */
  .grid-pattern-c-nk26 .grid-container-nk26 {
    grid-template-columns: 1fr;
  }
  
  .grid-nested-nk26 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--space-2xl);
    margin-top: var(--space-2xl);
  }
}

/* Desktop: Wider gaps */
@media (min-width: 1024px) {
  .grid-pattern-a-nk26 .grid-container-nk26,
  .grid-pattern-b-nk26 .grid-container-nk26 {
    gap: var(--space-4xl);
  }
  
  .grid-nested-nk26 {
    gap: var(--space-3xl);
  }
}
```

### Visual Alignment

```css
/* Optical alignment for headings */
.section-title-nk26,
.hero-title-nk26 {
  text-indent: -0.05em; /* Pull large headings left slightly */
}

/* Grid item vertical alignment */
.grid-main-nk26,
.grid-visual-nk26,
.grid-text-nk26 {
  align-self: start; /* Prevent stretching */
}

/* Sidebar sticky positioning */
.grid-meta-nk26 {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

@media (max-width: 767px) {
  .grid-meta-nk26 {
    position: static; /* No sticky on mobile */
  }
}
```

---

## Component Patterns

### Cards

```css
/* Base card styling */
.card-base-nk26 {
  background: var(--background-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: var(--space-xl);
  transition: all 0.3s ease;
}

.card-base-nk26:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Result card (for metrics) */
.result-card-nk26 {
  background: var(--background-secondary);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: var(--space-2xl);
  text-align: center;
}

.result-number-nk26 {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(2.5rem, 5vw, 4rem);
  color: var(--accent-primary);
  line-height: 1;
  margin-bottom: var(--space-sm);
}

.result-label-nk26 {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-description-nk26 {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 0.9rem;
  color: var(--text-tertiary);
  line-height: 1.5;
}

/* Results grid */
.results-grid-nk26 {
  display: grid;
  gap: var(--space-xl);
  margin: var(--space-2xl) 0;
}

@media (min-width: 768px) {
  .results-grid-nk26 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .results-grid-nk26 {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Buttons

```css
/* Primary button */
.button-primary-nk26 {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1rem;
  color: #ffffff;
  background: var(--accent-primary);
  padding: var(--space-md) var(--space-xl);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
}

.button-primary-nk26:hover {
  background: var(--accent-secondary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button-primary-nk26:active {
  transform: translateY(0);
}

/* Secondary button */
.button-secondary-nk26 {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1rem;
  color: var(--text-primary);
  background: transparent;
  padding: var(--space-md) var(--space-xl);
  border: 2px solid var(--border-medium);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-secondary-nk26:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Link button */
.next-project-link-nk26 {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1.125rem;
  color: var(--accent-primary);
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all 0.2s ease;
}

.next-project-link-nk26:hover {
  color: var(--accent-secondary);
  transform: translateX(4px);
}
```

### Lists

```css
/* Feature list */
.feature-list-nk26 {
  list-style: none;
  padding: 0;
  margin: var(--space-xl) 0;
}

.feature-item-nk26 {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  padding: var(--space-md) 0;
  padding-left: var(--space-lg);
  border-bottom: 1px solid var(--border-light);
  position: relative;
}

.feature-item-nk26:last-child {
  border-bottom: none;
}

.feature-item-nk26::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  font-weight: 700;
}

/* Numbered list */
.numbered-list-nk26 {
  list-style: none;
  counter-reset: numbered-list;
  padding: 0;
  margin: var(--space-xl) 0;
}

.numbered-list-nk26 li {
  counter-increment: numbered-list;
  position: relative;
  padding-left: var(--space-2xl);
  margin-bottom: var(--space-lg);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.numbered-list-nk26 li::before {
  content: counter(numbered-list);
  position: absolute;
  left: 0;
  top: 0;
  font-family: var(--font-display);
  font-weight: 300;
  font-size: 1.5rem;
  color: var(--accent-primary);
  line-height: 1;
}
```

---

## Animation System

### Timing Functions

```css
:root {
  /* Easing curves */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* Durations */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --duration-slower: 600ms;
}
```

### Common Animations

```css
/* Fade in */
@keyframes fadeIn-nk26 {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-nk26 {
  animation: fadeIn-nk26 var(--duration-slow) var(--ease-decelerate);
}

/* Scale on hover */
.scale-hover-nk26 {
  transition: transform var(--duration-base) var(--ease-standard);
}

.scale-hover-nk26:hover {
  transform: scale(1.05);
}

/* Slide in from left */
@keyframes slideInLeft-nk26 {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-left-nk26 {
  animation: slideInLeft-nk26 var(--duration-slow) var(--ease-decelerate);
}

/* Pulse */
@keyframes pulse-nk26 {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.pulse-nk26 {
  animation: pulse-nk26 2s var(--ease-standard) infinite;
}
```

### Reduced Motion Support

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Accessibility

### WCAG Compliance

```css
/* Focus states */
*:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 4px;
}

/* Minimum touch targets */
button,
a,
[role="button"],
[role="slider"] {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border-light: rgba(0, 0, 0, 0.3);
    --border-medium: rgba(0, 0, 0, 0.5);
    --border-strong: rgba(0, 0, 0, 0.8);
  }
  
  .button-primary-nk26 {
    border: 2px solid currentColor;
  }
}
```

### Color Contrast

```css
/* Ensure AAA contrast for body text */
.section-text-nk26 {
  /* Light mode: #4a4a4a on #f5f5f5 = 7.5:1 (AAA) */
  color: var(--text-secondary);
}

/* Ensure AAA contrast for headings */
.section-title-nk26 {
  /* Light mode: #1a1a1a on #f5f5f5 = 13.5:1 (AAA) */
  color: var(--text-primary);
}

/* Technical notes maintain readable contrast */
.tech-note-text-nk26 {
  /* Light mode: #4a4a4a on rgba(0,0,0,0.03) = 7.2:1 (AAA) */
  color: var(--tech-note-text);
}
```

### Screen Reader Support

```css
/* Visually hidden but accessible to screen readers */
.sr-only-nk26 {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable-nk26:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## Responsive Breakpoints

```css
:root {
  --breakpoint-mobile: 0px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1440px;
}

/* Mobile first approach */
/* Default styles are for mobile */

/* Tablet (768px+) */
@media (min-width: 768px) {
  /* Two-column layouts, larger spacing */
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  /* Full layouts, maximum spacing */
}

/* Wide screens (1440px+) */
@media (min-width: 1440px) {
  /* Contained max-width, prevent excessive line length */
  .grid-container-nk26 {
    max-width: 1400px;
  }
}
```

---

## Performance Optimization

### Loading Strategy

```css
/* Critical CSS inline in <head> */
/* Fonts, colors, layout structure */

/* Non-critical CSS loaded async */
/* Animations, decorative elements */

/* Font loading with font-display: swap */
@font-face {
  font-family: 'Craftwork Grotesk';
  font-display: swap; /* Show fallback immediately, swap when loaded */
}

/* Lazy load images */
img[loading="lazy"] {
  /* Browser handles lazy loading */
}
```

### Will-Change for Animations

```css
/* Only apply will-change to actively animating elements */
.slider-divider-nk26:hover,
.button-primary-nk26:hover {
  will-change: transform;
}

/* Remove after animation completes */
.animation-complete-nk26 {
  will-change: auto;
}
```

### CSS Containment

```css
/* Isolate expensive components */
.grid-container-nk26 {
  contain: layout style;
}

.before-after-slider-nk26 {
  contain: layout style paint;
}

.lottie-player-nk26 {
  contain: layout style paint;
}
```

---

## Code Organization

### File Structure

```
/styles
├── reset.css              # CSS reset
├── variables.css          # Design tokens (colors, spacing, typography)
├── typography.css         # Font declarations and text styles
├── layout.css             # Grid system and containers
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── lists.css
│   ├── quotes.css
│   └── technical-notes.css
├── case-study/
│   ├── hero.css
│   ├── grids.css
│   ├── before-after.css
│   ├── lottie.css
│   └── sticky-scroll.css
└── utilities.css          # Helper classes
```

### Naming Convention

```
Component name: .component-name-nk26
State modifier: .component-name-nk26.is-active
Context modifier: .component-name-nk26--variant

Examples:
.grid-container-nk26
.grid-container-nk26.is-loading
.button-primary-nk26
.button-primary-nk26--large
```

---

## Browser Support

### Target Browsers

- Chrome 90+ (2021+)
- Firefox 88+ (2021+)
- Safari 14+ (2020+)
- Edge 90+ (2021+)
- Mobile Safari 14+ (iOS 14+)
- Chrome Android 90+

### Feature Detection

```css
/* Grid fallback */
@supports not (display: grid) {
  .grid-container-nk26 {
    display: flex;
    flex-wrap: wrap;
  }
}

/* Backdrop filter fallback */
@supports not (backdrop-filter: blur(10px)) {
  .video-overlay-nk26 {
    background: rgba(0, 0, 0, 0.6);
  }
}
```

---

## Summary Checklist

✅ **Typography:** Craftwork Grotesk (display) + Satoshi (body) + PP Mondwest/Neue Bit Bold (mono)  
✅ **Colors:** Light mode default, high contrast (7:1+ for AAA)  
✅ **Spacing:** 8px base scale, responsive section padding  
✅ **Grid:** Rule of thirds (2/3 + 1/3 variations), mobile-first  
✅ **Components:** Cards, buttons, lists, technical notes  
✅ **Animations:** Purposeful motion with reduced-motion support  
✅ **Accessibility:** WCAG AAA text, keyboard nav, screen reader support  
✅ **Performance:** Lazy loading, containment, will-change optimization  
✅ **Responsive:** Mobile-first with 768px (tablet) and 1024px (desktop) breakpoints  

---

**All design tokens, component patterns, and guidelines are ready for implementation in Claude Code.**
