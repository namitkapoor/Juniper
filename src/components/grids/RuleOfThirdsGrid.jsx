import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../style/rule-of-thirds-grid.css';

/**
 * TitleOverviewAnimation - Shows title first, then animates out to reveal overview text with "Overview" label
 */
const TitleOverviewAnimation = ({ content }) => {
  const [showTitle, setShowTitle] = useState(true);
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    // Show title for 2 seconds, then animate out
    const titleTimer = setTimeout(() => {
      setShowTitle(false);
      // Show overview text after title animates out
      setTimeout(() => {
        setShowOverview(true);
      }, 500); // Wait for exit animation
    }, 2000);

    return () => clearTimeout(titleTimer);
  }, []);

  return (
    <div className="grid-content grid-title-overview">
      <AnimatePresence mode="wait">
        {showTitle && content.title ? (
          <motion.h1
            key="title"
            className="grid-title-overview-text"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {content.title}
          </motion.h1>
        ) : showOverview ? (
          <motion.div
            key="overview"
            className="title-overview-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <span className="overview-label">Overview</span>
            {content.subtitle && (
              <p className="grid-title-overview-subtitle">{content.subtitle}</p>
            )}
            {content.description && (
              <p className="grid-title-overview-description">{content.description}</p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

/**
 * RuleOfThirdsGrid - A recursive grid component that divides space using rule of thirds
 * 
 * Structure:
 * - Main container: 2/3 (left) + 1/3 (right)
 * - The 1/3 (right) splits into: 2/3 (top) + 1/3 (bottom)
 * - This creates a nested rule of thirds pattern
 * 
 * Items are placed in order:
 * 1. Large item (2/3 left, spans both rows)
 * 2. Top right item (1/3 right, top row)
 * 3. Bottom right item (1/3 right, bottom row)
 * 
 * If more items exist, they continue to subdivide the right column
 */
const RuleOfThirdsGrid = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  // Separate items: first item is the large 2/3 item, rest go in the 1/3 column
  const largeItem = items[0];
  const rightColumnItems = items.slice(1);

  const renderContent = (content) => {
    if (!content) return null;

    switch (content.type) {
      case 'title-overview':
        return <TitleOverviewAnimation content={content} />;

      case 'combined-info':
        return (
          <div className="grid-content grid-combined-info">
            {/* Metrics Section */}
            {content.metrics && (
              <div className="combined-metrics">
                {content.metrics.icon && <div className="grid-icon">{content.metrics.icon}</div>}
                {content.metrics.title && <h3 className="grid-title">{content.metrics.title}</h3>}
                {content.metrics.items && (
                  <div className="grid-metrics">
                    {content.metrics.items.map((item, idx) => (
                      <div key={idx} className="metrics-item">
                        <span className="value">{item.value}</span>
                        <span className="label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Project Info Section */}
            {content.projectInfo && (
              <div className="combined-project-info">
                {content.projectInfo.icon && <div className="grid-icon">{content.projectInfo.icon}</div>}
                {content.projectInfo.title && <h3 className="grid-title">{content.projectInfo.title}</h3>}
                {content.projectInfo.items && (
                  <div className="grid-stats">
                    {content.projectInfo.items.map((item, idx) => (
                      <div key={idx} className="stats-item">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="grid-image-wrapper">
            <img 
              src={content.src} 
              alt={content.alt || ''} 
              style={{ objectFit: content.objectFit || 'cover' }}
            />
          </div>
        );

      case 'text':
        return (
          <div className="grid-content">
            {content.icon && <div className="grid-icon">{content.icon}</div>}
            {content.title && <h3 className="grid-title">{content.title}</h3>}
            {content.description && <p className="grid-description">{content.description}</p>}
            {content.footer && <span className="grid-footer">{content.footer}</span>}
          </div>
        );

      case 'stats':
      case 'metrics':
        return (
          <div className="grid-content">
            {content.icon && <div className="grid-icon">{content.icon}</div>}
            {content.title && <h3 className="grid-title">{content.title}</h3>}
            <div className={`grid-${content.type}`}>
              {content.items?.map((item, idx) => (
                <div key={idx} className={`${content.type}-item`}>
                  {content.type === 'metrics' ? (
                    <>
                      <span className="value">{item.value}</span>
                      <span className="label">{item.label}</span>
                    </>
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="grid-content timeline">
            {content.icon && <div className="grid-icon">{content.icon}</div>}
            {content.title && <h3 className="grid-title">{content.title}</h3>}
            {content.milestones && (
              <ul className="timeline-list">
                {content.milestones.map((milestone, idx) => (
                  <li 
                    key={idx} 
                    className={`timeline-item ${idx === content.activeIndex ? 'active' : ''}`}
                  >
                    {milestone}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return (
          <div className="grid-content">
            {content.icon && <div className="grid-icon">{content.icon}</div>}
            {content.title && <h3 className="grid-title">{content.title}</h3>}
            {content.description && <p className="grid-description">{content.description}</p>}
          </div>
        );
    }
  };

  return (
    <div className="rule-of-thirds-grid">
      {/* Large 2/3 item on the left */}
      {largeItem && (
        <motion.div
          className="grid-item grid-item-large"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
        >
          {renderContent(largeItem.content)}
        </motion.div>
      )}

      {/* Right column (1/3) - splits into top and bottom */}
      {rightColumnItems.length > 0 && (
        <div className="grid-item-right-column">
          {/* Top right item (2/3 of the right column) */}
          {rightColumnItems[0] && (
            <motion.div
              className="grid-item grid-item-right-top"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {renderContent(rightColumnItems[0].content)}
            </motion.div>
          )}

          {/* Bottom right item (1/3 of the right column) */}
          {rightColumnItems[1] && (
            <motion.div
              className="grid-item grid-item-right-bottom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {renderContent(rightColumnItems[1].content)}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default RuleOfThirdsGrid;

