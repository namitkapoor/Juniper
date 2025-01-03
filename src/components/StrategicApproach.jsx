import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { strategicApproachData } from '../data/strategicApproachData';
import PhaseContent from './PhaseContent';
import '../style/strategic-approach-module.css';
import ImageCarousel from './ImageCarousel';

const StrategicApproach = ({ 
  expandedSections, 
  timelineProgress, 
  onToggleSection,
  projectId 
}) => {
  const data = strategicApproachData[projectId];
  if (!data) return null;

  // Calculate timeline progress based on active phases
  const calculateProgress = () => {
    const totalPhases = data.phases.length;
    let maxActivePhase = -1;
    
    for (let i = 0; i < totalPhases; i++) {
      if (expandedSections.has(`approach${i}`)) {
        maxActivePhase = i;
      }
    }
    
    return maxActivePhase === -1 ? 0 : ((maxActivePhase + 1) / totalPhases) * 100;
  };

  // Handle phase click
  const handlePhaseClick = (index, event) => {
    event.stopPropagation();
    onToggleSection(`approach${index}`);
  };

  return (
    <div className="strategic-approach">
      <div className="approach-timeline">
        <div className="timeline-container">
          <div className="timeline-phases">
            {data.phases.map((phase, index) => (
              <div
                key={index}
                className={`timeline-phase ${expandedSections.has(`approach${index}`) ? 'active' : ''}`}
                onClick={(e) => handlePhaseClick(index, e)}
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
              animate={{ 
                width: `${calculateProgress()}%`
              }}
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
            style={{ 
              minHeight: '600px'
            }}
          >
            {data.phases.map((phase, index) => (
              expandedSections.has(`approach${index}`) && (
                <PhaseContent 
                  key={phase.id} 
                  content={phase.content}
                  projectId={projectId}
                  isResearchPhase={index === 0}
                />
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrategicApproach; 