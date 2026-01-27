import React from 'react';
import { motion } from 'framer-motion';

/**
 * GridSection - Reusable grid layout component with three patterns
 *
 * Pattern A: 2/3 main content + 1/3 sidebar (left heavy)
 * Pattern B: 1/3 sidebar + 2/3 main content (right heavy)
 * Pattern C: Full width with optional nested split
 */

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Pattern A: 2/3 + 1/3
export const GridPatternA = ({
  children,
  sectionLabel,
  className = '',
  id
}) => {
  return (
    <section
      id={id}
      className={`grid-pattern-a-nk26 ${className}`}
      aria-label={sectionLabel}
    >
      <motion.div
        className="grid-container-nk26"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Pattern B: 1/3 + 2/3
export const GridPatternB = ({
  children,
  sectionLabel,
  className = '',
  id
}) => {
  return (
    <section
      id={id}
      className={`grid-pattern-b-nk26 ${className}`}
      aria-label={sectionLabel}
    >
      <motion.div
        className="grid-container-nk26"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Pattern C: Full Width
export const GridPatternC = ({
  children,
  sectionLabel,
  className = '',
  id
}) => {
  return (
    <section
      id={id}
      className={`grid-pattern-c-nk26 ${className}`}
      aria-label={sectionLabel}
    >
      <motion.div
        className="grid-container-nk26"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};

// Main content area (2/3 in Pattern A)
export const GridMain = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`grid-main-nk26 ${className}`}
      role="article"
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Meta sidebar (1/3 in Pattern A)
export const GridMeta = ({ children, sectionLabel = "Project metadata", className = '' }) => {
  return (
    <motion.aside
      className={`grid-meta-nk26 ${className}`}
      aria-label={sectionLabel}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.aside>
  );
};

// Text area (1/3 in Pattern B)
export const GridText = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`grid-text-nk26 ${className}`}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Visual area (2/3 in Pattern B)
export const GridVisual = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`grid-visual-nk26 ${className}`}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Nested grid for Pattern C
export const GridNested = ({ children, className = '' }) => {
  return (
    <div className={`grid-nested-nk26 ${className}`}>
      {children}
    </div>
  );
};

// Nested main (2/3 of nested)
export const NestedMain = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`nested-main-nk26 ${className}`}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Nested aside (1/3 of nested)
export const NestedAside = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`nested-aside-nk26 ${className}`}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Section title
export const SectionTitle = ({ children, full = false, className = '' }) => {
  const titleClass = full ? 'section-title-full-nk26' : 'section-title-nk26';
  return (
    <motion.h2
      className={`${titleClass} ${className}`}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  );
};

// Subsection title
export const SubsectionTitle = ({ children, as = 'h3', className = '' }) => {
  const Tag = as;
  return (
    <Tag className={`subsection-title-nk26 ${className}`}>
      {children}
    </Tag>
  );
};

// Section text paragraph
export const SectionText = ({ children, className = '' }) => {
  return (
    <p className={`section-text-nk26 ${className}`}>
      {children}
    </p>
  );
};

// Image wrapper with caption (supports both images and videos)
export const ImageWrapper = ({
  src,
  alt,
  caption,
  loading = 'lazy',
  className = '',
  imageClassName = '',
  type = null, // Optional: 'image' or 'video'. If null, auto-detects from file extension
  autoPlay = false,
  loop = false,
  muted = true // Default to true for autoplay compatibility
}) => {
  // Auto-detect media type from file extension if type not provided
  const mediaType = type || (src?.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? 'video' : 'image');
  
  return (
    <motion.div
      className={`image-wrapper-nk26 ${className}`}
      variants={fadeInVariants}
      transition={{ duration: 0.5 }}
    >
      {mediaType === 'video' ? (
        <video
          src={src}
          className={`section-image-nk26 section-video-nk26 ${imageClassName}`}
          controls
          playsInline
          preload="metadata"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          aria-label={alt}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`section-image-nk26 ${imageClassName}`}
          loading={loading}
        />
      )}
      {caption && (
        <figcaption className="image-caption-nk26">{caption}</figcaption>
      )}
    </motion.div>
  );
};

// Meta item for sidebar
export const MetaItem = ({ label, value, className = '' }) => {
  return (
    <div className={`meta-item-nk26 ${className}`}>
      <span className="meta-label-nk26">{label}</span>
      <span className="meta-value-nk26">{value}</span>
    </div>
  );
};

export default {
  GridPatternA,
  GridPatternB,
  GridPatternC,
  GridMain,
  GridMeta,
  GridText,
  GridVisual,
  GridNested,
  NestedMain,
  NestedAside,
  SectionTitle,
  SubsectionTitle,
  SectionText,
  ImageWrapper,
  MetaItem
};
