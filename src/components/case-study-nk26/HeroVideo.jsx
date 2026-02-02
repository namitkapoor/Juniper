import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * HeroVideo - Lazy-loaded video with viewport detection
 * Only loads and plays when visible in viewport
 * Optimized to not load video until hero is in view
 */
const HeroVideo = ({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  showScrollIndicator = true
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Viewport detection using IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, []);

  // Load and play/pause based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      // Load video if not already loaded
      if (!hasLoaded) {
        video.src = videoSrc;
        video.load();
        setHasLoaded(true);
      }
      video.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    } else if (hasLoaded) {
      video.pause();
    }
  }, [isInView, hasLoaded, videoSrc]);

  return (
    <section
      ref={containerRef}
      className="hero-video-nk26"
      aria-label="Project introduction video"
    >
      <div className="video-container-nk26">
        <video
          ref={videoRef}
          className="hero-video-element-nk26"
          muted
          playsInline
          loop={false}
          poster={posterSrc}
          preload="none"
          aria-label={`${title} demonstration video`}
        />

        <div className="video-overlay-nk26" aria-hidden="true" />

        <motion.div
          className="hero-content-nk26"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="hero-title-nk26">{title}</h1>
          {subtitle && <p className="hero-subtitle-nk26">{subtitle}</p>}
        </motion.div>

        {showScrollIndicator && (
          <motion.div
            className="scroll-indicator-nk26"
            aria-label="Scroll to continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <span className="scroll-text-nk26">Scroll</span>
            <svg
              className="scroll-arrow-nk26"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 4L10 16M10 16L4 10M10 16L16 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroVideo;
