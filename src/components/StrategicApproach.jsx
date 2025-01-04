import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { strategicApproachData } from '../data/strategicApproachData';
import PhaseContent from './PhaseContent';
import IterativeTimeline from './IterativeTimeline';
import '../style/strategic-approach-module.css';
import ImageCarousel from './ImageCarousel';

const StrategicApproach = ({ 
  expandedSections, 
  onToggleSection,
  projectId 
}) => {
  const data = strategicApproachData[projectId];
  const [activeConnections, setActiveConnections] = useState(new Set());
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
    setActiveIteration(null); // Reset active iteration when changing phases
    
    const phase = data.phases[index];
    if (phase && phase.connections) {
      const newConnections = new Set();
      phase.connections.forEach(connectedPhaseId => {
        newConnections.add(`${phase.id}-${connectedPhaseId}`);
      });
      setActiveConnections(newConnections);
    }
  };

  const handleIterationSelect = (iteration, phaseIndex) => {
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
            style={{ minHeight: '600px' }}
          >
            {activeIteration && (
              <motion.div 
                className="iteration-details"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h4>Iteration Example</h4>
                <p><strong>Trigger:</strong> {activeIteration.trigger}</p>
                <p><strong>Action:</strong> {activeIteration.action}</p>
                <p><strong>Outcome:</strong> {activeIteration.outcome}</p>
              </motion.div>
            )}
            
            {data.phases.map((phase, index) => (
              expandedSections.has(`approach${index}`) && (
                <PhaseContent 
                  key={phase.id} 
                  content={phase.content}
                  projectId={projectId}
                  isResearchPhase={index === 0}
                  iterations={phase.iterations}
                  onIterationSelect={(iteration) => handleIterationSelect(iteration, index)}
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