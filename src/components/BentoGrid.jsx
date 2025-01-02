// src/components/BentoGrid/BentoGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './../style/bento-grid.css';

const BentoItem = ({ className = '', delay = 0, content }) => {
  const renderContent = () => {
    if (!content) return null;

    const contentClasses = `bento-content ${className}`;

    switch (content.type) {
      case 'image':
        return (
          <div className={contentClasses}>
            <img 
              src={content.src} 
              alt={content.alt || ''} 
              className="bento-images"
            />
          </div>
        );

      case 'timeline':
        return (
          <div className={contentClasses}>
            {content.title && (
              <h3 className="text-xl font-semibold">
                {content.icon && content.icon}
                {content.title}
              </h3>
            )}
            <div className="flex-grow w-full">
              <ul className="timeline-list">
                {content.milestones.map((milestone, index) => (
                  <li 
                    key={index} 
                    className={`timeline-item ${index === content.activeIndex ? 'active' : ''}`}
                  >
                    {milestone}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={contentClasses}>
            {content.title && (
              <h3 className="text-xl font-semibold">
                {content.icon && content.icon}
                {content.title}
              </h3>
            )}
            <div className="flex-grow w-full">
              {content.description && (
                <p className="text-gray-200">{content.description}</p>
              )}
            </div>
            {content.footer && (
              <small className="text-gray-400 mt-auto">{content.footer}</small>
            )}
          </div>
        );

      case 'stats':
        return (
          <div className={contentClasses}>
            {content.title && (
              <h3 className="text-xl font-semibold mb-3">
                {content.icon && content.icon}
                {content.title}
              </h3>
            )}
            <ul className="stats-list flex-grow">
              {content.items.map((item, index) => (
                <li key={index} className="stats-item">
                  <span className="stats-text">{item}</span>
                  <div className="stats-bar">
                    <motion.div 
                      className="stats-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'custom':
        return <div className={contentClasses}>{content.component}</div>;

      case 'metrics':
        return (
          <div className={contentClasses}>
            {content.title && (
              <h3 className="text-xl font-semibold mb-3">
                {content.icon && content.icon}
                {content.title}
              </h3>
            )}
            <div className="metrics-grid">
              {content.items.map((item, index) => (
                <motion.div 
                  key={index}
                  className="metric-item"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <motion.span 
                    className="metric-value"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0 
                    }}
                    transition={{ 
                      duration: 1,
                      delay: index * 0.2 
                    }}
                  >
                    {item.value}
                  </motion.span>
                  <span className="metric-label">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`bento-item ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {renderContent()}
    </motion.div>
  );
};

const BentoGrid = ({ items }) => {
  return (
    <div className="case-study-bento-grid">
      {items.map((item, index) => (
        <BentoItem
          key={index}
          className={item.size || 'small'}
          delay={index * 0.1}
          content={item.content}
        />
      ))}
    </div>
  );
};

export default BentoGrid;