import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PhaseContent from './PhaseContent';

const SmartPhaseView = ({ 
  phases, 
  expandedSections, 
  projectId, 
  activeIteration,
  onIterationSelect 
}) => {
  const [iterationView, setIterationView] = useState(null);

  // Helper to determine if a phase should be visible
  const shouldShowPhase = (phaseId) => {
    // Always show the current phase
    if (expandedSections.has(`approach${phases.findIndex(p => p.id === phaseId)}`)) {
      return true;
    }
    
    // If we're in decisions phase, also show solution phase
    if (phaseId === 'solution' && expandedSections.has('approach2')) {
      return true;
    }

    return false;
  };

  // Check if decisions phase is active
  const isDecisionsActive = expandedSections.has('approach2');

  const renderPhaseContent = (phase, index) => {
    if (!shouldShowPhase(phase.id)) return null;

    return (
      <motion.div
        key={phase.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`phase-content-wrapper ${isDecisionsActive ? 'decisions-active' : ''}`}
      >
        <PhaseContent 
          content={phase.content}
          projectId={projectId}
          isResearchPhase={index === 0}
          // Pass isDecisionsPhase as true for both solution and decisions phases when decisions is active
          isDecisionsPhase={isDecisionsActive}
          iterations={phase.iterations}
          onIterationSelect={onIterationSelect}
          iterationView={iterationView}
        />
      </motion.div>
    );
  };

  return (
    <div className={`smart-phase-view ${isDecisionsActive ? 'decisions-active' : ''}`}>
      <AnimatePresence>
        {phases.map((phase, index) => renderPhaseContent(phase, index))}
      </AnimatePresence>
    </div>
  );
};

export default SmartPhaseView; 