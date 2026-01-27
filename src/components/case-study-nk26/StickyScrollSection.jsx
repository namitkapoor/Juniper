import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * StickyScrollSection - Sticky visual that changes based on scroll position
 */
const StickyScrollSection = ({
  visualCards,
  contentBlocks,
  sectionLabel = "Design evolution narrative",
  className = ''
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const contentRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const trigger = parseInt(entry.target.dataset.trigger, 10);
            if (trigger) {
              setActiveStep(trigger);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-100px 0px'
      }
    );

    contentRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      contentRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [contentBlocks]);

  return (
    <section
      className={`sticky-scroll-section-nk26 ${className}`}
      aria-label={sectionLabel}
    >
      <div className="sticky-container-nk26">
        {/* Sticky Visual (Left) */}
        <div className="sticky-visual-nk26" aria-live="polite">
          {visualCards.map((card, index) => (
            <div
              key={card.step || index}
              className={`visual-card-nk26 ${activeStep === (card.step || index + 1) ? 'active' : ''}`}
              data-step={card.step || index + 1}
            >
              <img
                src={card.src}
                alt={card.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Scrollable Content (Right) */}
        <div className="sticky-content-nk26">
          {contentBlocks.map((block, index) => (
            <div
              key={block.trigger || index}
              ref={(el) => (contentRefs.current[index] = el)}
              className="content-block-nk26"
              data-trigger={block.trigger || index + 1}
            >
              {block.title && (
                <h3 className="content-title-nk26">{block.title}</h3>
              )}
              {block.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Content components for use within StickyScrollSection
export const ContentText = ({ children, className = '' }) => (
  <p className={`content-text-nk26 ${className}`}>{children}</p>
);

export const UserQuote = ({ children, cite, image, className = '' }) => (
  <blockquote className={`user-quote-nk26 ${image ? 'has-image-nk26' : ''} ${className}`}>
    <div className="quote-container-nk26">
      {image && (
        <div className="quote-image-nk26">
          <img src={image.src} alt={image.alt || ''} />
        </div>
      )}
      <div className="quote-content-nk26">
        <div className="quote-text-nk26">{children}</div>
        {cite && <cite className="quote-cite-nk26">{cite}</cite>}
      </div>
    </div>
  </blockquote>
);

export const FeatureList = ({ items, className = '' }) => (
  <ul className={`feature-list-nk26 ${className}`}>
    {items.map((item, index) => (
      <li key={index} className="feature-item-nk26">
        {item}
      </li>
    ))}
  </ul>
);

export const BentoGrid = ({ items, className = '' }) => (
  <div className={`bento-grid-nk26 ${className}`}>
    {items.map((item, index) => (
      <div key={index} className="bento-item-nk26">
        {item.icon && (
          <div className="bento-icon-nk26">
            <img src={item.icon} alt="" aria-hidden="true" />
          </div>
        )}
        <h4 className="bento-title-nk26">{item.title}</h4>
        <p className="bento-description-nk26">{item.description}</p>
      </div>
    ))}
  </div>
);

export default StickyScrollSection;
