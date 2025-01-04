import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import '../style/iterative-timeline.css';

const IterativeTimeline = ({ phases, activePhase, onPhaseSelect }) => {
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const timelineRef = useRef(null);

  const getIterationPath = (startIndex, endIndex) => {
    const startNode = document.getElementById(`phase-${startIndex}`);
    const endNode = document.getElementById(`phase-${endIndex}`);
    
    if (!startNode || !endNode) return '';

    const start = startNode.getBoundingClientRect();
    const end = endNode.getBoundingClientRect();
    const timelineBounds = timelineRef.current.getBoundingClientRect();

    const x1 = start.left - timelineBounds.left + start.width / 2;
    const x2 = end.left - timelineBounds.left + end.width / 2;
    const y = start.height / 2;
    const curve = 50; // Height of the curve

    return `M ${x1} ${y} C ${x1} ${y-curve} ${x2} ${y-curve} ${x2} ${y}`;
  };

  return (
    <div className="timeline-wrapper" ref={timelineRef}>
      <div className="timeline-base" />
      <motion.div 
        className="timeline-progress"
        initial={{ width: '0%' }}
        animate={{ width: `${((activePhase + 1) / phases.length) * 100}%` }}
      />
      
      <div className="timeline-nodes">
        {phases.map((phase, index) => (
          <div 
            key={index}
            id={`phase-${index}`}
            className={`timeline-node ${index === activePhase ? 'active' : ''}`}
            onMouseEnter={() => setHoveredPhase(index)}
            onMouseLeave={() => setHoveredPhase(null)}
          >
            <button
              className={`node-button ${index === activePhase ? 'active' : ''}`}
              onClick={() => onPhaseSelect(index)}
            >
              <phase.icon size={24} />
            </button>
            <div className="node-title">{phase.title}</div>
            
            {phase.loopBackTo !== undefined && hoveredPhase === index && (
              <div className="iteration-hint">
                <ChevronLeft size={14} />
                <span>Iterate if needed</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <svg className="iteration-paths">
        {phases.map((phase, index) => (
          phase.loopBackTo !== undefined && (
            <motion.path
              key={`iteration-${index}`}
              className={`iteration-path ${hoveredPhase === index ? 'visible' : ''}`}
              d={getIterationPath(index, phase.loopBackTo)}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: hoveredPhase === index ? 1 : 0,
                opacity: hoveredPhase === index ? 1 : 0
              }}
              transition={{ duration: 0.5 }}
            />
          )
        ))}
      </svg>
    </div>
  );
};

export default IterativeTimeline;