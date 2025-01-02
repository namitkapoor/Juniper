import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { strategicApproachData } from '../data/strategicApproachData';
import '../style/strategic-approach-module.css';

const PhaseContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="phase-content">
      <h3>{content.title}</h3>
      <p className="phase-summary">{content.summary}</p>

      {content.keyFindings && (
        <div className="key-findings">
          <h4>Key Findings</h4>
          <ul>
            {content.keyFindings.map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>
        </div>
      )}

      {content.methodology && (
        <div className="methodology">
          <h4>{content.methodology.title}</h4>
          <ul>
            {content.methodology.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {content.keyFeatures && (
        <div className="key-features">
          <h4>Key Features</h4>
          <ul>
            {content.keyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {content.criteria && (
        <div className="criteria-grid">
          {content.criteria.map((criterion, index) => (
            <div key={index} className="criterion-card">
              <h4>{criterion.title}</h4>
              <div className="weight">{criterion.weight}</div>
              <p>{criterion.description}</p>
            </div>
          ))}
        </div>
      )}

      {content.phases && (
        <div className="implementation-phases">
          {content.phases.map((phase, index) => (
            <div key={index} className="phase-card">
              <h4>{phase.title}</h4>
              <div className="duration">{phase.duration}</div>
              <ul>
                {phase.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {content.images && (
        <div className="phase-images">
          {content.images.map((image, index) => (
            <figure key={index}>
              <img src={image.src} alt={image.caption} />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
};

const StrategicApproach = ({ 
  expandedSections, 
  timelineProgress, 
  onToggleSection,
  projectId 
}) => {
  const data = strategicApproachData[projectId];
  if (!data) return null;

  return (
    <div className="strategic-approach">
      <div className="approach-timeline">
        <div className="timeline-container">
          <div className="timeline-phases">
            {data.phases.map((phase, index) => (
              <div
                key={index}
                className={`timeline-phase ${expandedSections.has(`approach${index}`) ? 'active' : ''}`}
                onClick={() => onToggleSection(`approach${index}`)}
              >
                <div className="phase-icon">
                  <phase.icon size={20} />
                </div>
                <div className="phase-title">{phase.title}</div>
              </div>
            ))}
            <div className="timeline-line" />
            <motion.div 
              className="timeline-progress"
              animate={{ width: `${timelineProgress}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expandedSections.has('strategicApproach') && (
          <motion.div 
            className="section-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {data.phases.map((phase, index) => (
              expandedSections.has(`approach${index}`) && (
                <PhaseContent key={phase.id} content={phase.content} />
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrategicApproach; 