import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollShrinkSection - Wraps content with scroll-based height shrinking animation
 * Similar to the case study cards on the home page
 * 
 * HOW IT WORKS:
 * 1. useScroll tracks scroll progress relative to the section's position
 *    - offset: ["start start", "end start"] means:
 *      * Start tracking when section's top reaches viewport top (sticky position)
 *      * End tracking when section's bottom reaches viewport top
 *    - This creates a scroll progress value from 0 to 1
 * 
 * 2. useTransform maps scroll progress to height values
 *    - As you scroll, progress goes from 0 → 1
 *    - Height smoothly transitions between breakpoints
 *    - More breakpoints = smoother animation
 * 
 * @param {React.ReactNode} children - Content to wrap
 * @param {number} index - Index of the section (for z-index stacking)
 * @param {number} totalSections - Total number of sections (for z-index calculation)
 * @param {string} className - Additional CSS classes
 * @param {boolean} isExpanded - Whether the section content is expanded (for reference only)
 * @param {string} fixedHeight - Optional fixed height (e.g., "1200px") - disables shrinking
 */
export default function ScrollShrinkSection({ 
  children, 
  index = 0, 
  totalSections = 1,
  className = '',
  isExpanded = false,
  fixedHeight = null
}) {
  const sectionRef = useRef(null);
  
  // Track scroll progress - starts when section top reaches sticky position
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"], // Starts when section top hits viewport top
    layoutEffect: false
  });
  
  // Use fixed, large maxHeight to prevent recalculation jumps when state changes
  // The height values are memoized to prevent recalculation on state changes
  const heightValues = useMemo(() => {
    // If fixedHeight is provided, use it for all breakpoints (no shrinking)
    if (fixedHeight) {
      return [fixedHeight, fixedHeight];
    }
    
    // Large max height for readability - content should be fully readable before shrinking
    const maxHeight = '1600px'; // Full height when section first becomes sticky (progress: 0)
    const readableHeight = '1400px'; // Slight shrink (progress: 0.15)
    const comfortableHeight = '1200px'; // Comfortable reading height (progress: 0.4)
    const intermediateHeight = '800px'; // Mid-point transition (progress: 0.7)
    const compactHeight = '500px'; // Getting smaller (progress: 0.85)
    const nearMinHeight = '350px'; // Almost minimum (progress: 0.95)
    const minHeight = '250px'; // Minimum - just header and description (progress: 1)
    
    // More breakpoints = smoother, less abrupt transitions
    // The final shrink is now spread over 15% of scroll (0.85 → 1) with smaller steps
    // 500px → 350px → 250px instead of 500px → 200px, making it feel much smoother
    return [maxHeight, readableHeight, comfortableHeight, intermediateHeight, compactHeight, nearMinHeight, minHeight];
  }, [fixedHeight]); // Only recalculate if fixedHeight changes
  
  // More breakpoints for smoother animation, especially at the end
  // Added extra breakpoint at 0.95 to make final transition even smoother
  const progressBreakpoints = fixedHeight 
    ? [0, 1] // If fixed, no animation needed
    : [0, 0.15, 0.4, 0.7, 0.85, 0.95, 1]; // More gradual, especially at end
  
  const height = useTransform(
    scrollYProgress,
    progressBreakpoints,
    heightValues,
    { clamp: true }
  );

  return (
    <motion.div
      ref={sectionRef}
      className={`scroll-shrink-section ${className}`}
      style={{
        height,
        zIndex: totalSections - index,
      }}
    >
      {children}
    </motion.div>
  );
}

