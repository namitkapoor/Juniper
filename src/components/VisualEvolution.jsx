import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { visualEvolutionData } from '../data/visualEvolutionData';
import '../style/visual-evolution-module.css';

const IterationCard = ({ iteration }) => (
  <div className="iteration-card">
    <h3>{iteration.stage}</h3>
    <p className="iteration-description">{iteration.description}</p>
    <div className="iteration-image">
      <img src={iteration.image} alt={iteration.stage} />
    </div>
    <div className="iteration-details">
      {iteration.keyIssues && (
        <div className="issues-list">
          <h4>Key Issues</h4>
          <ul>
            {iteration.keyIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
      {iteration.improvements && (
        <div className="improvements-list">
          <h4>Improvements</h4>
          <ul>
            {iteration.improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const DesignDecisionCard = ({ decision }) => (
  <div className="design-decision-card">
    <h3>{decision.title}</h3>
    <p className="decision-rationale">{decision.rationale}</p>
    <div className="comparison-container">
      <div className="before-after">
        <div className="before">
          <h4>Before</h4>
          <img src={decision.before} alt="Before design" />
        </div>
        <div className="after">
          <h4>After</h4>
          <img src={decision.after} alt="After design" />
        </div>
      </div>
    </div>
  </div>
);

const VisualEvolution = ({ isExpanded, projectId }) => {
  const data = visualEvolutionData[projectId];
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
          <div className="iterations-section">
            <div className="iterations-grid">
              {data.iterations.map((iteration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IterationCard iteration={iteration} />
                </motion.div>
              ))}
            </div>
          </div>

          {data.designDecisions && data.designDecisions.length > 0 && (
            <motion.div 
              className="design-decisions-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3>Key Design Decisions</h3>
              <div className="decisions-grid">
                {data.designDecisions.map((decision, index) => (
                  <DesignDecisionCard key={index} decision={decision} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisualEvolution; 