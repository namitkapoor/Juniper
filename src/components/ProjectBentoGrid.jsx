import React from 'react';
import { motion } from 'framer-motion';
import '../style/bento-grid.css';

const ProjectBentoGrid = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="bento-grid">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`bento-item ${item.size || ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="bento-item-content">
            {item.content.type === 'image' && (
              <>
                <img 
                  src={item.content.src} 
                  alt={item.content.alt || ''}
                />
                {item.content.description && (
                  <div className="bento-item-description">
                    <p>{item.content.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectBentoGrid; 