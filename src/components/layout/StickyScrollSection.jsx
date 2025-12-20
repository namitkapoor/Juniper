import React, { useRef, useContext, createContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Create a context to share the parent container ref
const StickyScrollContext = createContext(null);

/**
 * Provider component that wraps the case studies carousel
 * Provides the parent container ref to all child StickyScrollSection components
 */
export const StickyScrollProvider = ({ children, containerRef }) => {
  return (
    <StickyScrollContext.Provider value={containerRef}>
      {children}
    </StickyScrollContext.Provider>
  );
};

/**
 * A reusable sticky scroll card that shrinks its container height
 * Part of a sequential shrinking animation for stacked cards
 * Content maintains its size and gets clipped by the shrinking container
 * All cards stick to the top and move up together as they shrink
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render inside the card
 * @param {number} props.index - Card index in the stack (0-based)
 * @param {number} props.totalCards - Total number of cards
 * @param {number} props.topOffset - Distance from top when sticky (default: 120px)
 * @param {number} props.cardHeight - Initial card height in pixels (default: 800)
 * @param {number} props.finalHeight - Final compressed height in pixels (default: 160)
 * @param {number} props.zIndex - Z-index for stacking
 */
const StickyScrollSection = ({
  children,
  index = 0,
  totalCards = 1,
  topOffset = 120,
  cardHeight = 800,
  finalHeight = 160,
  zIndex = 10
}) => {
  const containerRef = useRef(null);
  const parentContainerRef = useContext(StickyScrollContext);

  // Calculate the shrink amount for this card
  const shrinkAmount = cardHeight - finalHeight;

  // Track scroll progress relative to the parent container (or this container as fallback)
  // Use the parent container to get overall scroll progress for coordinated animation
  // "start start" to "end start" tracks from when container enters viewport to when it fully scrolls past
  const scrollTarget = parentContainerRef || containerRef;
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end start"]
  });

  // Calculate when this card should start shrinking
  // Each card starts shrinking sequentially based on its index
  const shrinkStart = index / totalCards;
  const shrinkEnd = (index + 1) / totalCards;
  
  // Map scroll progress to this card's shrink progress
  const cardShrinkProgress = useTransform(
    scrollYProgress,
    [shrinkStart, shrinkEnd],
    [0, 1],
    { clamp: true }
  );

  // Animate the container height from full to compressed
  const animatedHeight = useTransform(
    cardShrinkProgress,
    [0, 1],
    [cardHeight, finalHeight],
    { clamp: true }
  );

  // Calculate cumulative shrink from all previous cards
  // This creates a transform that moves the current card up as previous cards shrink
  const calculateCumulativeShrink = (progress) => {
    let totalShrink = 0;
    for (let i = 0; i < index; i++) {
      const prevShrinkStart = i / totalCards;
      const prevShrinkEnd = (i + 1) / totalCards;
      const range = prevShrinkEnd - prevShrinkStart;
      if (range > 0) {
        const prevProgress = Math.max(0, Math.min(1, 
          (progress - prevShrinkStart) / range
        ));
        totalShrink += shrinkAmount * prevProgress;
      }
    }
    return totalShrink;
  };

  // Transform to move card up by cumulative shrink of previous cards
  const translateY = useTransform(scrollYProgress, (progress) => {
    return -calculateCumulativeShrink(progress);
  });

  // Container height needs to account for the scroll distance needed
  // Each card needs enough space to complete its shrink animation
  // We need enough scroll distance for this specific card to shrink
  // The scroll distance should be proportional to the shrink amount
  const scrollDistancePerCard = shrinkAmount * 1.5; // Enough space for smooth animation
  const containerHeight = cardHeight + scrollDistancePerCard;

  return (
    <div
      ref={containerRef}
      className="sticky-scroll-container"
      style={{
        height: `${containerHeight}px`,
        position: 'relative',
        marginBottom: 0
      }}
    >
      <motion.div
        style={{
          height: animatedHeight,
          position: 'sticky',
          top: `${topOffset}px`,
          zIndex,
          overflow: 'hidden',
          willChange: 'height, transform',
          y: translateY
        }}
        className="sticky-scroll-content"
      >
        <div style={{ height: `${cardHeight}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default StickyScrollSection;