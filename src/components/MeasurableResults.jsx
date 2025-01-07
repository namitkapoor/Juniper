import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { measurableResultsData } from '../data/measurableResultsData';
import '../style/measurable-results-module.css';

const Lightbox = ({ image, alt, onClose }) => (
  <motion.div 
    className="lightbox-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
      <img src={image} alt={alt} className="lightbox-image" />
      <button className="lightbox-close" onClick={onClose}>×</button>
    </div>
  </motion.div>
);

const MetricCard = ({ metric }) => {
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <div className="measurable-metric-card">
      <div className="measurable-metric-header">
        <div className="measurable-metric-icon">
          {React.createElement(metric.icon, { size: 24 })}
        </div>
        <h3>{metric.title}</h3>
      </div>
      
      <div className="measurable-metric-stats">
        <div className="measurable-metric-value-container">
          <div className="measurable-metric-value">
            {metric.stats.value}
          </div>
          {metric.stats.unit && (
            <div className="measurable-unit">
              {metric.stats.unit}
            </div>
          )}
        </div>
        
        {metric.stats.change && metric.stats.change !== 'N/A' && (
          <div className="measurable-metric-change">
            <span className="measurable-change-value">{metric.stats.change}</span>
            {metric.stats.previousValue && (
              <span className="measurable-previous-value">
                from {metric.stats.previousValue}
              </span>
            )}
          </div>
        )}
      </div>

      <ul className="measurable-metric-details">
        {metric.details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
      
      {metric.image && (
        <>
          <img 
            src={metric.image} 
            alt={`${metric.title} visualization`}
            className="measurable-metric-image"
            onClick={() => setShowLightbox(true)}
          />
          <AnimatePresence>
            {showLightbox && (
              <Lightbox 
                image={metric.image}
                alt={`${metric.title} visualization`}
                onClose={() => setShowLightbox(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="measurable-testimonial-card">
    <div className="measurable-testimonial-content">
      <blockquote>{testimonial.quote}</blockquote>
      <div className="measurable-testimonial-author">
        <div className="measurable-author-info">
          <div className="measurable-author-name">{testimonial.author}</div>
          <div className="measurable-author-role">{testimonial.role}</div>
        </div>
      </div>
    </div>
  </div>
);

const MeasurableResults = ({ isExpanded, projectId }) => {
  const data = measurableResultsData[projectId];
  if (!data) return null;

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div 
          className="section-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="measurable-metrics-grid">
            {data.metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MetricCard metric={metric} />
              </motion.div>
            ))}
          </div>

          {data.testimonials && data.testimonials.length > 0 && (
            <motion.div 
              className="measurable-testimonials-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>User Testimonials</h3>
              <div className="measurable-testimonials-grid">
                {data.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MeasurableResults; 