# Case Study Cards & Navbar Hover Updates

## Overview

This document outlines two key design updates:
1. **Case Study Cards** - Full-width video covers with blurred info overlays
2. **Navbar Hover Animation** - Vertical mask reveal animation on hover

---

## 1. Case Study Cards Redesign

### Current State
- Static cover images
- Info sections with solid backgrounds
- Video plays only during page transition

### New Design

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  [info-top with blur backdrop]          │  ← Title, tags, etc.
│                                         │
│                                         │
│         FULL-WIDTH VIDEO                │  ← Hero video (slowed, dark overlay)
│         (paused by default)             │
│                                         │
│                                         │
│  [info-bottom with blur backdrop]       │  ← Metrics, CTA, etc.
└─────────────────────────────────────────┘
```

#### Video Behavior
| State | Behavior |
|-------|----------|
| Default | Video paused on first frame |
| Hover | Video plays (slowed to ~0.5x speed) |
| Hover Out | Video pauses |
| Click | Existing transition animation plays |

#### Styling Specs

**Video Layer:**
```css
.case-study-card-nk26 {
  position: relative;
  overflow: hidden;
}

.case-study-video-nk26 {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.case-study-video-overlay-nk26 {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* Black overlay - adjust opacity as needed */
  pointer-events: none;
}
```

**Blur Backdrop for Info Sections:**
```css
.case-study-info-top-nk26,
.case-study-info-bottom-nk26 {
  position: relative;
  z-index: 2;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(0, 0, 0, 0.2); /* Subtle tint for better blur visibility */
}

/* Light mode adjustment */
[data-theme="light"] .case-study-info-top-nk26,
[data-theme="light"] .case-study-info-bottom-nk26 {
  background: rgba(255, 255, 255, 0.2);
}
```

**Video Playback Control (JS):**
```jsx
const handleMouseEnter = () => {
  videoRef.current.playbackRate = 0.5; // Slowed playback
  videoRef.current.play();
};

const handleMouseLeave = () => {
  videoRef.current.pause();
};
```

#### Video Sources
Each case study card uses its corresponding hero video:

| Case Study | Video Source |
|------------|--------------|
| Christine Valmy | `/videos/Case Studies/CV/cv-hero.mp4` |
| Manage Farms | `/videos/Case Studies/MF/mf-hero.mp4` |
| Influencer Marketing | `/videos/Case Studies/IM/im-hero.mp4` |

---

## 2. Navbar Hover Animation

### Reference
Based on the design reference showing navigation items with small downward arrows.

### Animation Concept: Vertical Mask Reveal

The hover effect creates a "text swap" animation where:
1. Original text slides **up and out** (masked)
2. Duplicate text slides **up and in** from below (masked)

```
Default State:
┌──────────────┐
│   about      │  ← visible
└──────────────┘
    (hidden)      ← duplicate text below

Hover State (animating):
┌──────────────┐
│   abo...     │  ← sliding up & out
└──────────────┘
    ...ut         ← sliding up & in

Hover Complete:
    (hidden)      ← original text above
┌──────────────┐
│   about      │  ← duplicate now visible
└──────────────┘
```

### Implementation

**HTML Structure:**
```jsx
<nav className="navbar-nk26">
  <a href="/about" className="nav-item-nk26">
    <span className="nav-arrow-nk26">↘</span>
    <span className="nav-text-wrapper-nk26">
      <span className="nav-text-nk26">about</span>
      <span className="nav-text-nk26 nav-text-clone-nk26">about</span>
    </span>
  </a>
</nav>
```

**CSS:**
```css
.nav-item-nk26 {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--text-secondary);
}

.nav-arrow-nk26 {
  font-size: 0.75em;
  opacity: 0.6;
  transition: transform 0.3s ease;
}

.nav-text-wrapper-nk26 {
  position: relative;
  overflow: hidden;
  height: 1.2em; /* Adjust based on line-height */
}

.nav-text-nk26 {
  display: block;
  transition: transform 0.35s cubic-bezier(0.65, 0, 0.35, 1);
}

.nav-text-clone-nk26 {
  position: absolute;
  top: 100%;
  left: 0;
}

/* Hover States */
.nav-item-nk26:hover .nav-text-nk26 {
  transform: translateY(-100%);
}

.nav-item-nk26:hover .nav-arrow-nk26 {
  transform: rotate(-45deg); /* Arrow animates on hover too */
}
```

### Animation Timing
- **Duration:** 350ms
- **Easing:** `cubic-bezier(0.65, 0, 0.35, 1)` (smooth ease-in-out)
- **Stagger:** None (individual item animation)

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  .nav-text-nk26,
  .nav-arrow-nk26 {
    transition: none;
  }

  .nav-item-nk26:hover .nav-text-nk26 {
    transform: none;
  }
}
```

---

## Implementation Checklist

### Case Study Cards
- [ ] Add video element to case study card component
- [ ] Implement dark overlay layer
- [ ] Add `backdrop-filter: blur()` to info sections
- [ ] Wire up hover play/pause with slowed playback
- [ ] Ensure existing click transition still works
- [ ] Test performance with multiple videos on page
- [ ] Add `preload="metadata"` to optimize initial load

### Navbar
- [ ] Update navbar markup with text wrapper and clone
- [ ] Add vertical mask CSS with overflow hidden
- [ ] Implement hover transform animation
- [ ] Add arrow rotation on hover
- [ ] Test reduced-motion preference
- [ ] Verify keyboard focus states still visible

---

## Performance Considerations

### Videos
- Use `preload="metadata"` to avoid loading full video until hover
- Consider using `poster` attribute with first frame as fallback
- Compress videos to <5MB each
- Provide WebM fallback for better compression

### Backdrop Blur
- `backdrop-filter` can be expensive on large areas
- Test on lower-end devices
- Consider reducing blur radius on mobile (e.g., `blur(10px)`)

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `backdrop-filter` | 76+ | 103+ | 9+ | 79+ |
| CSS `overflow: hidden` mask | All | All | All | All |
| Video `playbackRate` | All | All | All | All |

**Fallback for older Firefox (pre-103):**
```css
@supports not (backdrop-filter: blur(1px)) {
  .case-study-info-top-nk26,
  .case-study-info-bottom-nk26 {
    background: rgba(0, 0, 0, 0.7); /* Solid fallback */
  }
}
```

---

*Document created: January 2026*
