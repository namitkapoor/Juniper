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
  const [activeImageIndices, setActiveImageIndices] = useState({});

  const isDecisionsActive = expandedSections.has('approach2');
  const isSolutionActive = expandedSections.has('approach1');

  const shouldShowPhase = (phaseId) => {
    const phaseIndex = phases.findIndex(p => p.id === phaseId);
    return expandedSections.has(`approach${phaseIndex}`);
  };

  const renderPhaseContent = (phase, index) => {
    if (!shouldShowPhase(phase.id)) return null;

    return (
      <motion.div
        key={phase.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="phase-content-wrapper"
      >
        <PhaseContent 
          content={phase.content}
          projectId={projectId}
          isResearchPhase={index === 0}
          isDecisionsPhase={isDecisionsActive}
          isSolutionPhase={phase.id === 'solution'}
          showSolutionConcepts={isDecisionsActive || isSolutionActive}
          iterations={phase.iterations}
          onIterationSelect={onIterationSelect}
          iterationView={iterationView}
        />
      </motion.div>
    );
  };

  // Function to handle image navigation
  const navigateImage = (conceptIndex, direction) => {
    setActiveImageIndices(prev => {
      const currentIndex = prev[conceptIndex] || 0;
      const maxIndex = solutionPhase?.content?.concepts[conceptIndex].images.length - 1;
      let newIndex = currentIndex + direction;
      
      if (newIndex < 0) newIndex = maxIndex;
      if (newIndex > maxIndex) newIndex = 0;
      
      return { ...prev, [conceptIndex]: newIndex };
    });
  };

  // Render solution concepts at the top when in decisions phase
  const renderSolutionConcepts = () => {
    if (isDecisionsActive && !isSolutionActive) {
      const solutionPhase = phases.find(p => p.id === 'solution');
      if (solutionPhase?.content?.concepts) {
        return (
          <motion.div
            key="solution-concepts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="phase-content-wrapper"
          >
            <div className="concepts-section">
              <div className="concept-container">
                <h4>Solution Concepts</h4>
                <div className="concepts-grid">
                  {solutionPhase.content.concepts.map((concept, conceptIndex) => (
                    <div 
                      key={conceptIndex} 
                      className={`concept-card ${isDecisionsActive ? concept.status.toLowerCase() : ''}`}
                      style={{
                        background: concept.status === 'Selected' ? 
                          'linear-gradient(to right, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0))' : 
                          concept.status === 'Rejected' ? 
                          'linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0))' : 
                          'none',
                        borderLeft: isDecisionsActive ? 
                          concept.status === 'Selected' ? '3px solid #22C55E' : 
                          concept.status === 'Rejected' ? '3px solid #EF4444' : 
                          'none' : 'none',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className="concept-header">
                        <h5>{concept.name}</h5>
                        <p className="concept-description">{concept.description}</p>
                      </div>
                      
                      {concept.images?.[0] && (
                        <div className="concept-image-container" style={{
                          marginTop: '1rem',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          <figure className="concept-image" style={{
                            margin: 0,
                            position: 'relative'
                          }}>
                            <img 
                              src={concept.images[0].url} 
                              alt={concept.images[0].caption || ''}
                              style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '8px'
                              }}
                            />
                            {concept.images[0].caption && (
                              <figcaption style={{
                                padding: '0.5rem',
                                fontSize: '0.875rem',
                                color: 'rgba(255, 255, 255, 0.8)'
                              }}>
                                {concept.images[0].caption}
                              </figcaption>
                            )}
                          </figure>
                        </div>
                      )}
                      
                      {isDecisionsActive && (
                        <div className="concept-status" style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: concept.status === 'Selected' ? 
                            'rgba(34, 197, 94, 0.1)' : 
                            'rgba(239, 68, 68, 0.1)',
                          color: concept.status === 'Selected' ? 
                            '#22C55E' : 
                            '#EF4444',
                          border: `1px solid ${
                            concept.status === 'Selected' ? 
                              'rgba(34, 197, 94, 0.2)' : 
                              'rgba(239, 68, 68, 0.2)'
                          }`
                        }}>
                          {concept.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      }
    }
    return null;
  };

  return (
    <div className={`smart-phase-view ${isDecisionsActive ? 'decisions-active' : ''}`}>
      <AnimatePresence>
        {renderSolutionConcepts()}
        {phases.map((phase, index) => 
          shouldShowPhase(phase.id) && renderPhaseContent(phase, index)
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartPhaseView; 