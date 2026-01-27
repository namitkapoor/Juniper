import React from 'react';
import { motion } from 'framer-motion';

const HeroVideo = ({
  videoSrc,
  webmSrc,
  posterSrc,
  title,
  subtitle,
  showScrollIndicator = true
}) => {
  return (
    <section className="hero-video-nk26" aria-label="Project introduction video">
      <div className="video-container-nk26">
        <video
          className="hero-video-element-nk26"
          autoPlay
          muted
          playsInline
          loop={false}
          poster={posterSrc}
          aria-label={`${title} demonstration video`}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={videoSrc} type="video/mp4" />
        </video>

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
