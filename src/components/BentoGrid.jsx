// src/components/BentoGrid/BentoGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import './../style/bento-grid.css';

const BentoItem = ({ className = '', delay = 0, content }) => {
  const renderContent = () => {
    if (!content) return null;

    // Handle image content
    if (content.type === 'image') {
      return (
        <img 
          src={content.src} 
          alt={content.alt || ''} 
          className="bento-images"
        />
      );
    }

    // Handle text content
    if (content.type === 'text') {
      return (
        <div className="bento-content">
          {content.title && <h3 className="text-xl font-semibold mb-3">{content.title}</h3>}
          {content.description && <p className="text-gray-200">{content.description}</p>}
          {content.footer && <small className="mt-2 text-gray-400">{content.footer}</small>}
        </div>
      );
    }

    // Handle stats content
    if (content.type === 'stats') {
      return (
        <div className="bento-content">
          {content.title && <h3 className="text-xl font-semibold mb-3">{content.title}</h3>}
          <ul className="space-y-2">
            {content.items.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // Handle custom content
    if (content.type === 'custom') {
      return content.component;
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
          className={item.size || ''}
          delay={index * 0.1}
          content={item.content}
        />
      ))}
    </div>
  );
};

export default BentoGrid;