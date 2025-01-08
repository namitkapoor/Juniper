// src/components/BentoGrid/BentoGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import '../style/bento-grid.css';

const BentoItem = ({ content, className = '' }) => {
  const renderContent = () => {
    switch (content.type) {
      case 'image':
        return (
          <div className="bento-image-wrapper">
            <img 
              src={content.src} 
              alt={content.alt} 
              style={{ objectFit: content.objectFit || 'cover' }}
            />
          </div>
        );
      
      case 'timeline':
        return (
          <div className="bento-content timeline">
            {content.icon}
            <h3>{content.title}</h3>
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
          </div>
        );

      case 'stats':
      case 'metrics':
        return (
          <div className="bento-content">
            {content.icon}
            <h3>{content.title}</h3>
            <div className={`bento-${content.type}`}>
              {content.items.map((item, idx) => (
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

      default:
        return (
          <div className="bento-content">
            {content.icon}
            <h3>{content.title}</h3>
            <p>{content.description}</p>
            {content.footer && <span className="footer">{content.footer}</span>}
          </div>
        );
    }
  };

  return (
    <motion.div 
      className={`bento-item ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {renderContent()}
    </motion.div>
  );
};

const BentoGrid = ({ items }) => {
  return (
    <div className="bento-grid">
      {items.map((item, index) => (
        <BentoItem
          key={index}
          content={item.content}
          className={item.size}
        />
      ))}
    </div>
  );
};

export default BentoGrid;