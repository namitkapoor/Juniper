import React from 'react';
import { motion } from 'framer-motion';
import BentoGrid from './BentoGrid';
import { overviewData } from '../data/overviewData';
import '../style/overview-module.css';

const Overview = ({ projectId }) => {
  const data = overviewData[projectId];
  if (!data) return null;

  const processedBentoItems = data.bentoItems.map(item => ({
    ...item,
    content: {
      ...item.content,
      icon: item.content.icon ? <item.content.icon size={24} /> : null
    }
  }));

  return (
    <section className="case-study-overview">
      <motion.div
        className="overview-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overview-header">
          <h1 className='overview-title'>{data.title}</h1>
          <p className="case-study-subtitle">{data.subtitle}</p>
          <p className="case-study-description">{data.description}</p>
        </div>

        
        <div className="bento-grid-wrapper">
          <BentoGrid items={processedBentoItems} />
        </div>
      </motion.div>
    </section>
  );
};

export default Overview; 