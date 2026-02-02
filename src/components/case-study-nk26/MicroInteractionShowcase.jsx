import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LottieAnimation from './LottieAnimation';

/**
 * MicroInteractionShowcase - Grid of micro-interaction animations with descriptions
 * Performance optimized: videos only load/play when visible in viewport
 */
const MicroInteractionShowcase = ({
  interactions,
  className = ''
}) => {
  return (
    <motion.div
      className={`micro-interaction-showcase-nk26 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      {interactions.map((interaction, index) => (
        <MicroInteractionItem
          key={index}
          animationPath={interaction.animationPath}
          videoSrc={interaction.videoSrc}
          title={interaction.title}
          description={interaction.description}
          ariaLabel={interaction.ariaLabel}
          loop={interaction.loop}
        />
      ))}
    </motion.div>
  );
};

/**
 * LazyVideo - Only loads and plays video when visible in viewport
 */
const LazyVideo = ({ src, loop, ariaLabel }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use IntersectionObserver with rootMargin for early loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading 100px before visible
      }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, []);

  // Play/pause and load based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      // Load video if not already loaded
      if (!hasLoaded) {
        video.src = src;
        video.load();
        setHasLoaded(true);
      }
      // Play when visible
      video.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    } else if (hasLoaded) {
      // Pause when not visible to save CPU
      video.pause();
    }
  }, [isVisible, hasLoaded, src]);

  return (
    <div ref={containerRef} className="micro-interaction-video-nk26">
      <video
        ref={videoRef}
        muted
        loop={loop}
        playsInline
        preload="none"
        aria-label={ariaLabel}
      />
    </div>
  );
};

export const MicroInteractionItem = ({
  animationPath,
  videoSrc,
  title,
  description,
  ariaLabel,
  loop = true,
  className = ''
}) => {
  return (
    <motion.div
      className={`micro-interaction-item-nk26 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    >
      {animationPath ? (
        <LottieAnimation
          animationPath={animationPath}
          loop={loop}
          ariaLabel={ariaLabel}
        />
      ) : videoSrc ? (
        <LazyVideo src={videoSrc} loop={loop} ariaLabel={ariaLabel} />
      ) : null}
      <div className="micro-interaction-description-nk26">
        <h3 className="subsection-title-nk26">{title}</h3>
        <p className="section-text-nk26">{description}</p>
      </div>
    </motion.div>
  );
};

export default MicroInteractionShowcase;
