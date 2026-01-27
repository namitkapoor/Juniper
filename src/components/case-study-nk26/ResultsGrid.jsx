import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

/**
 * AnimatedNumber - Renders a number that counts up when in view
 */
const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Extract number and suffix (e.g., "143" and "%")
  const numericValue = parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  const suffix = value.replace(/[\d.-]/g, '');
  
  const springValue = useSpring(0, {
    duration: 2000,
    bounce: 0,
  });

  const displayValue = useTransform(springValue, (latest) => 
    Math.floor(latest).toLocaleString() + suffix
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(numericValue);
    }
  }, [isInView, numericValue, springValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

/**
 * ResultsGrid - Grid of metric/result cards
 */
const ResultsGrid = ({
  results,
  className = ''
}) => {
  return (
    <motion.div
      className={`results-grid-nk26 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
      }}
    >
      {results.map((result, index) => (
        <ResultCard
          key={index}
          number={result.number}
          label={result.label}
          description={result.description}
          icon={result.icon}
        />
      ))}
    </motion.div>
  );
};

export const ResultCard = ({
  number,
  label,
  description,
  icon,
  className = ''
}) => {
  return (
    <motion.div
      className={`result-card-nk26 ${className}`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4 }}
    >
      {icon && (
        <div className="result-icon-nk26">
          <img src={icon} alt="" aria-hidden="true" />
        </div>
      )}
      <div className="result-number-nk26">
        <AnimatedNumber value={number} />
      </div>
      <div className="result-label-nk26">{label}</div>
      {description && (
        <p className="result-description-nk26">{description}</p>
      )}
    </motion.div>
  );
};

export default ResultsGrid;
