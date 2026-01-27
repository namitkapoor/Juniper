import React from 'react';
import { motion } from 'framer-motion';

/**
 * PainPointsGrid - Grid of user pain point cards
 */
const PainPointsGrid = ({
  painPoints,
  className = ''
}) => {
  return (
    <motion.div
      className={`pain-points-grid-nk26 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {painPoints.map((point, index) => (
        <PainPointCard
          key={index}
          title={point.title}
          items={point.items}
          icon={point.icon}
        />
      ))}
    </motion.div>
  );
};

export const PainPointCard = ({
  title,
  items,
  icon,
  className = ''
}) => {
  return (
    <motion.div
      className={`pain-point-card-nk26 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    >
      <div className="pain-point-header-nk26">
        {icon && (
          <div className="pain-point-icon-nk26">
            <img src={icon} alt="" aria-hidden="true" />
          </div>
        )}
        <h3 className="pain-point-title-nk26">{title}</h3>
      </div>
      <ul className="pain-point-list-nk26">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PainPointsGrid;
