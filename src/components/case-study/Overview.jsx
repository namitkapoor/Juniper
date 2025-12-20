import React from 'react';
import { motion } from 'framer-motion';
import RuleOfThirdsGrid from '../grids/RuleOfThirdsGrid';
import { overviewData } from '../../data/overviewData';
import '../../style/overview-module.css';

// Project title mapping
const projectTitles = {
  "manageFarms": "Manage Small Farms",
  "influencerMarketing": "Hire Influencer Marketing",
  "taskReminders": "Contextualize Task Reminders",
  "sustainablePackaging": "Incentivize Sustainable Packaging"
};

const Overview = ({ projectId, projectTitle }) => {
  const data = overviewData[projectId];
  if (!data) return null;

  // Use provided projectTitle or fallback to mapping
  const actualTitle = projectTitle || projectTitles[projectId] || data.title;

  // Find image/video item (large item for 2/3 section)
  const imageItem = data.bentoItems?.find(item => item.content.type === 'image');
  
  // Find metrics item
  const metricsItem = data.bentoItems?.find(item => item.content.type === 'metrics');
  
  // Find project info item
  const projectInfoItem = data.bentoItems?.find(item => 
    item.content.type === 'stats' && item.content.title === 'Project Info'
  );

  // Create title + overview text item (top right)
  const titleItem = {
    content: {
      type: 'title-overview',
      title: actualTitle, // Use the actual project title, not "Overview"
      subtitle: data.subtitle,
      description: data.description
    }
  };

  // Create combined metrics + project info item (bottom right)
  const combinedInfoItem = {
    content: {
      type: 'combined-info',
      metrics: metricsItem?.content,
      projectInfo: projectInfoItem?.content
    }
  };

  // Structure: [image, title, combined-info]
  const allItems = [
    imageItem || { content: { type: 'image', src: '', alt: '' } },
    titleItem,
    combinedInfoItem
  ].map(item => ({
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
        <div className="rule-of-thirds-wrapper">
          <RuleOfThirdsGrid items={allItems} />
        </div>
      </motion.div>
    </section>
  );
};

export default Overview; 