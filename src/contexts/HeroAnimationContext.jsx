import { createContext } from 'react';

/**
 * Default hero animation timings. Used when Leva is not available (e.g. production)
 * or as fallback in useContext. Tweak these in the Leva "Hero Animations" panel in dev.
 *
 * Leva vs full Lottie for the hero:
 * - Leva + Framer Motion: tweak timings in real time, dynamic text, smaller bundle, responsive.
 *   Use when you want to iterate quickly and keep text/SEO flexible.
 * - Full hero in one Lottie: perfect designer-controlled timing, no state/props, but
 *   text changes need re-export, larger file, and responsiveness is harder. Use when the
 *   hero is mostly illustration and you want pixel-perfect timing from After Effects.
 */
export const DEFAULT_HERO_CONTROLS = {
  // Hero name: letter-by-letter
  heroNameLetterStagger: 0.20,
  heroNameLetterDuration: 0.50,
  // Hero-name strokes (left, right, bottom)
  heroNameLeftDuration: 0.7,
  heroNameLeftDelay: 0.35,
  heroNameRightDuration: 0.8,
  heroNameRightDelay: 0.70,
  heroNameStrokeDuration: 1.6,
  heroNameStrokeDelay: 0.0,
  // Tagline: starts after hero name, word-by-word
  taglineDelay: 0.8,
  taglineWordStagger: 0.20,
  taglineWordDuration: 0.20,
  // Tagline strokes (right, bottom)
  taglineRightDuration: 0.6,
  taglineRightDelay: 0.00,
  taglineStrokeDuration: 1.1,
  taglineStrokeDelay: 0.00,
  // Lottie: appears after tagline finishes
  lottieDelayAfterTagline: 0.3,
  lottieFadeDuration: 0.35,
  // Hero-info-bottom strokes (right, bottom). Block starts this long after hero in view.
  infoBottomStrokesDelay: 2.4,
  infoBottomRightDuration: 0.9,
  infoBottomRightDelay: 0.30,
  infoBottomBottomDuration: 1.0,
  infoBottomBottomDelay: 0.40,
};

export const HeroAnimationContext = createContext(DEFAULT_HERO_CONTROLS);
