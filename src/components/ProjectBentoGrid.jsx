import React, { useState, useRef } from 'react';
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

  const BentoItem = ({ item }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const { content, size } = item;
    
    const handleVideoClick = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const renderContent = () => {
      switch (content.type) {
        case 'image':
          return (
            <img 
              src={content.src} 
              alt={content.alt}
              className="bento-grid-media"
              style={{ objectFit: content.objectFit || 'contain' }}
            />
          );
        case 'video':
          return (
            <div 
              className="bento-grid-content"
              data-playing={isPlaying}
            >
              <video 
                ref={videoRef}
                loop 
                muted 
                playsInline
                className="bento-grid-media"
                style={{ objectFit: content.objectFit || 'contain' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={content.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button 
                className="video-control-button"
                onClick={handleVideoClick}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className={`bento-grid-item ${size}`}>
        <div className="bento-grid-content">
          {renderContent()}
          <div className="bento-grid-description">
            <p>{content.description}</p>
          </div>
        </div>
      </div>
    );
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
              className={`bento-grid-item ${item.size || ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BentoItem item={item} />
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default ProjectBentoGrid; 