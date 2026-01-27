import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import { motion } from 'framer-motion';

/**
 * LottieAnimation - Lazy-loaded Lottie animation with viewport detection
 */
const LottieAnimation = ({
  animationPath,
  loop = false,
  autoplay = true,
  caption,
  ariaLabel,
  className = ''
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !animationPath) return;

    // Load animation
    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop,
      autoplay: autoplay && isInView,
      path: animationPath
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationPath, loop]);

  // Play/pause based on viewport visibility
  useEffect(() => {
    if (!animationRef.current) return;

    if (isInView) {
      animationRef.current.play();
    } else {
      animationRef.current.pause();
    }
  }, [isInView]);

  return (
    <motion.div
      className={`lottie-animation-nk26 ${className}`}
      aria-label={ariaLabel || 'Animated illustration'}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        ref={containerRef}
        className="lottie-player-nk26"
        role="img"
        aria-label={ariaLabel}
      />
      {caption && (
        <figcaption className="lottie-caption-nk26">{caption}</figcaption>
      )}
    </motion.div>
  );
};

export default LottieAnimation;
