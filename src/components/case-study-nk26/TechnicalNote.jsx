import React from 'react';
import { motion } from 'framer-motion';

/**
 * TechnicalNote - Terminal-style annotation for implementation details
 */
const TechnicalNote = ({
  children,
  label = "Technical Note",
  className = ''
}) => {
  return (
    <motion.div
      className={`tech-note-nk26 ${className}`}
      role="complementary"
      aria-label="Technical implementation details"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="tech-note-header-nk26">
        <svg
          className="tech-note-icon-nk26"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 4L10 8L6 12M10 8H14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="tech-note-label-nk26">{label}</span>
      </div>
      <div className="tech-note-content-nk26">
        {typeof children === 'string' ? (
          <p className="tech-note-text-nk26">{children}</p>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
};

// For multiple paragraphs
export const TechNoteText = ({ children, className = '' }) => {
  return (
    <p className={`tech-note-text-nk26 ${className}`}>
      {children}
    </p>
  );
};

export default TechnicalNote;
