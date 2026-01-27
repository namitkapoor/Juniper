import React from 'react';
import { motion } from 'framer-motion';
import LottieAnimation from './LottieAnimation';

/**
 * MicroInteractionShowcase - Grid of micro-interaction animations with descriptions
 */
const MicroInteractionShowcase = ({
  interactions,
  className = ''
}) => {
  return (
    <motion.div
      className={`micro-interaction-showcase-nk26 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      {interactions.map((interaction, index) => (
        <MicroInteractionItem
          key={index}
          animationPath={interaction.animationPath}
          title={interaction.title}
          description={interaction.description}
          ariaLabel={interaction.ariaLabel}
          loop={interaction.loop}
        />
      ))}
    </motion.div>
  );
};

export const MicroInteractionItem = ({
  animationPath,
  title,
  description,
  ariaLabel,
  loop = true,
  className = ''
}) => {
  return (
    <motion.div
      className={`micro-interaction-item-nk26 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    >
      <LottieAnimation
        animationPath={animationPath}
        loop={loop}
        ariaLabel={ariaLabel}
      />
      <div className="micro-interaction-description-nk26">
        <h3 className="subsection-title-nk26">{title}</h3>
        <p className="section-text-nk26">{description}</p>
      </div>
    </motion.div>
  );
};

export default MicroInteractionShowcase;
