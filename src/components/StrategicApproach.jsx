import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { strategicApproachData } from '../data/strategicApproachData';
import PhaseContent from './PhaseContent';
import IterativeTimeline from './IterativeTimeline';
import '../style/strategic-approach-module.css';

const StrategicApproach = ({ 
  expandedSections, 
  onToggleSection,
  projectId 
}) => {
  const data = strategicApproachData[projectId];
  const [activeIteration, setActiveIteration] = useState(null);
  
  if (!data) return null;

  const getCurrentPhaseIndex = () => {
    const activePhases = [...expandedSections]
      .filter(s => s.startsWith('approach'))
      .map(s => parseInt(s.replace('approach', '')));
    return activePhases.length ? Math.max(...activePhases) : -1;
  };

  const handlePhaseSelect = (index) => {
    onToggleSection(`approach${index}`);
    setActiveIteration(null);
  };

  const handleIterationSelect = (iteration) => {
    setActiveIteration(iteration);
    // Find the index of the phase we're iterating back to
    const targetPhaseIndex = data.phases.findIndex(p => p.id === iteration.phase);
    if (targetPhaseIndex !== -1) {
      onToggleSection(`approach${targetPhaseIndex}`);
    }
  };

  return (
    <div className="strategic-approach">
      <IterativeTimeline
        phases={data.phases}
        activePhase={getCurrentPhaseIndex()}
        onPhaseSelect={handlePhaseSelect}
        activeIteration={activeIteration}
        onIterationSelect={handleIterationSelect}
      />

      <AnimatePresence>
        {expandedSections.has('strategicApproach') && (
          <motion.div 
            className="section-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {data.phases.map((phase, index) => {
              const shouldShow = expandedSections.has(`approach${index}`);
              if (!shouldShow) return null;

              return (
                <PhaseContent 
                  key={phase.id}
                  content={phase.content}
                  projectId={projectId}
                  isResearchPhase={index === 0}
                  isDecisionsPhase={expandedSections.has('approach2')}
                  iterations={phase.iterations}
                  onIterationSelect={handleIterationSelect}
                  activeIteration={activeIteration}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrategicApproach; 