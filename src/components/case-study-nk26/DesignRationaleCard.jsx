import React from 'react';
import { motion } from 'framer-motion';

/**
 * DesignRationaleCard - Sidebar card explaining design reasoning
 */
const DesignRationaleCard = ({
  title,
  items,
  className = ''
}) => {
  return (
    <motion.div
      className={`design-rationale-card-nk26 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h4 className="rationale-title-nk26">{title}</h4>
      {items.map((item, index) => (
        <p key={index} className="rationale-text-nk26">
          {item}
        </p>
      ))}
    </motion.div>
  );
};

export default DesignRationaleCard;
