import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { measurableResultsData } from '../data/measurableResultsData';
import '../style/measurable-results-module.css';

const MetricCard = ({ metric }) => (
  <div className="metric-card">
    <div className="metric-header">
      <div className="metric-icon">
        <metric.icon size={24} />
      </div>
      <h3>{metric.title}</h3>
    </div>
    <div className="metric-stats">
      <div className="metric-value">
        {metric.stats.value}
        {metric.stats.unit && <span className="unit">{metric.stats.unit}</span>}
      </div>
      <div className="metric-change">
        <span className="change-value">{metric.stats.change}</span>
        <span className="previous-value">from {metric.stats.previousValue}</span>
      </div>
    </div>
    <ul className="metric-details">
      {metric.details.map((detail, index) => (
        <li key={index}>{detail}</li>
      ))}
    </ul>
    {metric.image && (
      <div className="metric-image">
        <img src={metric.image} alt={metric.title} />
      </div>
    )}
  </div>
);

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card">
    <div className="testimonial-content">
      <blockquote>{testimonial.quote}</blockquote>
      <div className="testimonial-author">
        <div className="author-info">
          <div className="author-name">{testimonial.author}</div>
          <div className="author-role">{testimonial.role}</div>
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
          <div className="metrics-grid">
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
              className="testimonials-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>User Testimonials</h3>
              <div className="testimonials-grid">
                {data.testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} testimonial={testimonial} />
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