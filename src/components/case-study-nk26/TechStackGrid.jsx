import React from 'react';
import { motion } from 'framer-motion';

/**
 * TechStackGrid - Grid showing technology stack categories
 */
const TechStackGrid = ({
  categories,
  className = ''
}) => {
  return (
    <motion.div
      className={`tech-stack-grid-nk26 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {categories.map((category, index) => (
        <TechStackItem
          key={index}
          title={category.title}
          items={category.items}
        />
      ))}
    </motion.div>
  );
};

export const TechStackItem = ({
  title,
  items,
  className = ''
}) => {
  return (
    <motion.div
      className={`tech-stack-item-nk26 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="tech-stack-title-nk26">{title}</h4>
      <ul className="tech-list-nk26">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
};

export default TechStackGrid;
