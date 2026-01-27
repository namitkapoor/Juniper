# Sticky Scroll Case Studies - Implementation Guide

## Goal
Recreate the scroll effect from [atolldigital.com](https://atolldigital.com/) for case study cards.

## Desired Behavior
1. Case study cards become "sticky" at a fixed position when scrolled into view
2. Each card shrinks from 800px → 135px as you continue scrolling
3. Cards stack vertically (each new card appears below the previous compressed card)
4. Smooth, 60fps animation

## Current Stack
- React 18
- Framer Motion v11.15.0
- Vite
- CSS (no Tailwind)

---

## What We've Tried

### Attempt 1: CSS `position: sticky`
**Result:** ❌ Doesn't work
- Cards shrink correctly but don't stick
- Likely cause: Some parent element CSS is interfering
- Tried: Removing `overflow: hidden`, `contain` properties
- Still didn't work

### Attempt 2: JavaScript `position: fixed` toggle
**Result:** ⚠️ Partially works
- Cards DO stick and shrink
- Problems:
  - First card overlaps hero section (sticks too early)
  - Animation is jerky (React state re-renders)

### Attempt 3: Back to CSS sticky with stacked tops
**Result:** ❌ Sticky still doesn't work

---

## Questions to Resolve

### Q1: Reference Behavior
Looking at atolldigital.com:
- Do the cards stack ON TOP of each other (like a deck of cards)?
- Or do they stack BELOW each other (push-up style)?

### Q2: When Should Sticking Start?
- Should cards start sticking only when you scroll INTO the case studies section?
- Or should they be sticky from page load?

### Q3: Scroll Distance
- How much scrolling should it take to fully shrink one card?
- Current: ~90vh (almost one full screen height)

### Q4: Final Compressed Height
- You mentioned 135px - is this exact or approximate?

### Q5: What Happens at the End?
- When all cards are compressed, should they all stay visible stacked?
- Or should they scroll away normally?

---

## Technical Options

### Option A: Debug CSS Sticky
- Need to find what's blocking sticky
- Check all ancestors for: overflow, contain, transform, filter, perspective
- Most performant if we can make it work

### Option B: Intersection Observer + Fixed Positioning
- Use IntersectionObserver to detect when card enters "sticky zone"
- Switch to `position: fixed` only within that zone
- More control but requires careful scroll math

### Option C: GSAP ScrollTrigger
- Industry standard for this exact effect
- ~60kb additional dependency
- Very reliable and smooth

### Option D: CSS Scroll-Driven Animations
- Native CSS, no JS
- `animation-timeline: scroll()`
- Limited browser support (Chrome 115+, no Safari stable)

---

## Current Implementation: GSAP ScrollTrigger

Switched to GSAP ScrollTrigger for reliability. Key changes:

```jsx
// StickyScrollSection.jsx now uses:
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Each card:
// 1. Has position: sticky applied via GSAP
// 2. Top position = 120 + (index * 135)px for stacking
// 3. Shrinks from 800px → 135px as you scroll through its container
// 4. scrub: 0.5 for smooth animation
```

## Testing
1. Refresh the page
2. Scroll through case studies section
3. Cards should stick and shrink smoothly
4. Each card stacks below the previous compressed card

## If sticky STILL doesn't work with GSAP
The issue is definitely a parent CSS property. Need to check ancestors for:
- `overflow: hidden` or `overflow: auto`
- `transform` (any value)
- `filter` (any value)
- `contain: paint` or `contain: layout`
- `perspective` (any value)

## Debug Command
Open browser console and run:
```js
document.querySelector('.sticky-scroll-content').computedStyleMap().get('position')
```
