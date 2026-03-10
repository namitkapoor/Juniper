import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NextProjectTeaser = ({ title, description, href, videoSrc, coverImage, className = '' }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  return (
    <section
      className={`next-project-nk26 ${className}`}
      aria-label="Next case study"
      onClick={() => navigate(href)}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
    >
      {/* Media sits directly in section so it fills the whole area */}
      {(videoSrc || coverImage) && (
        <div className="next-project-media-nk26" aria-hidden="true">
          {coverImage && <img src={coverImage} alt="" className="next-project-cover-nk26" />}
          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="none"
              className="next-project-video-nk26"
            />
          )}
          <div className="next-project-media-overlay-nk26" />
        </div>
      )}

      <Link
        to="/"
        className="next-project-home-nk26"
        onClick={e => e.stopPropagation()}
      >
        ← Back to Home
      </Link>

      {/* Text sits above media via z-index */}
      <motion.div
        className="next-project-container-nk26"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="next-project-label-nk26">Next Project</h3>
        <h2 className="next-project-title-nk26">{title}</h2>
        <p className="next-project-description-nk26">{description}</p>
          <Link
            to={href}
            className="next-project-link-nk26"
            onClick={e => e.stopPropagation()}
          >
            View Case Study
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
      </motion.div>
    </section>
  );
};

export default NextProjectTeaser;
