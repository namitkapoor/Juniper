import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import '../style/bento-grid-base.css';
import '../style/project-bento.css';

const ProjectBentoGrid = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Helper function to determine column spans based on size
  const getColSpans = (size) => {
    const spans = {
      small: { xs: 24, sm: 12, md: 8, lg: 6 },    // 1/4 width on large screens
      medium: { xs: 24, sm: 24, md: 12, lg: 12 },  // 1/2 width
      large: { xs: 24, sm: 24, md: 16, lg: 12 },   // 1/2 width but taller
      wide: { xs: 24, sm: 24, md: 16, lg: 12 }     // 1/2 width
    };
    return spans[size] || spans.small;
  };

  return (
    <Row gutter={[16, 16]} className="bento-container">
      {items.map((item, index) => {
        const colSpans = getColSpans(item.size);
        
        return (
          <Col 
            key={index} 
            {...colSpans}
            className={`bento-col ${item.size || ''}`}
          >
            <motion.div
              className={`bento-item project-bento-item ${item.size || ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.content.type === 'image' && (
                <div className="bento-item-content project-bento-content">
                  <img
                    src={item.content.src}
                    alt={item.content.alt || ''}
                    style={{
                      objectFit: item.content.objectFit || 'contain',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  {item.content.description && (
                    <motion.div 
                      className="bento-item-description"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <p>{item.content.description}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default ProjectBentoGrid; 