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

      case 'text':
      case 'timeline':
        return (
          <div className={contentClasses}>
            {content.title && (
              <h3 className="text-xl font-semibold">{content.title}</h3>
            )}
            <div className="flex-grow">
              {content.description && (
                <p className="text-gray-200">{content.description}</p>
              )}
              {content.milestones && (
                <ul className="mt-4 space-y-2">
                  {content.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {milestone}
                    </li>
                  ))}
                </ul>
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
              <h3 className="text-xl font-semibold mb-3">{content.title}</h3>
            )}
            <ul className="space-y-2 flex-grow">
              {content.items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'custom':
        return <div className={contentClasses}>{content.component}</div>;

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