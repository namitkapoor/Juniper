import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { visualEvolutionData } from '../data/visualEvolutionData';
import '../style/visual-evolution-module.css';

const EvolutionSlider = ({ iterations }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const sliderRef = useRef(null);
  const initialDesign = iterations[0];
  const finalDesign = iterations[iterations.length - 1];

  const handleSliderChange = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setSliderValue(percentage);
  };

  const handleMouseDown = (e) => {
    handleSliderChange(e);
    const handleMouseMove = (e) => handleSliderChange(e);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="visual-evolution-container">
      <div className="visual-slider-container">
        <div className="visual-slider-labels">
          <span className="visual-slider-label">Initial Design</span>
          <span className="visual-slider-label">Final Design</span>
        </div>
        
        <div className="visual-image-slider">
          <img 
            src={initialDesign.image} 
            alt="Initial design"
            className="visual-slider-image"
            style={{ opacity: 1 - sliderValue }}
          />
          <img 
            src={finalDesign.image} 
            alt="Final design"
            className="visual-slider-image"
            style={{ opacity: sliderValue }}
          />
        </div>

        <div 
          className="visual-slider-track"
          ref={sliderRef}
          onClick={handleSliderChange}
        >
          <div 
            className="visual-slider-progress"
            style={{ width: `${sliderValue * 100}%` }}
          />
          <div 
            className="visual-slider-handle"
            style={{ left: `${sliderValue * 100}%` }}
            onMouseDown={handleMouseDown}
          />
        </div>
      </div>

      <div className="visual-details-grid">
        <div className="visual-detail-card">
          <h3>Key Issues</h3>
          <ul className="visual-detail-list">
            {initialDesign.keyIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
        <div className="visual-detail-card">
          <h3>Improvements</h3>
          <ul className="visual-detail-list">
            {finalDesign.improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

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
          <EvolutionSlider iterations={data.iterations} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisualEvolution; 