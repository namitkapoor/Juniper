import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { visualEvolutionData } from '../data/visualEvolutionData';
import '../style/visual-evolution-module.css';

const EvolutionSlider = ({ iterations }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const sliderRef = useRef(null);
  
  // Calculate which images should be visible based on slider value
  const getVisibleImages = (value) => {
    const numIterations = iterations.length;
    // Calculate which segment we're in (0 to numIterations-1)
    const segmentSize = 1 / (numIterations - 1);
    const currentIndex = Math.min(
      Math.floor(value / segmentSize),
      numIterations - 1
    );
    const nextIndex = Math.min(currentIndex + 1, numIterations - 1);
    
    // Calculate progress within current segment
    const segmentProgress = (value - (currentIndex * segmentSize)) / segmentSize;
    
    return {
      currentIndex,
      nextIndex,
      progress: segmentProgress
    };
  };

  const handleSliderChange = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const x = clientX - rect.left;
    let rawPercentage = Math.max(0, Math.min(1, x / rect.width));
    
    // Calculate number of segments
    const numSegments = iterations.length - 1;
    const segmentSize = 1 / numSegments;
    
    // Find nearest segment
    const nearestSegment = Math.round(rawPercentage / segmentSize) * segmentSize;
    
    setSliderValue(Math.min(1, nearestSegment));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleSliderChange(e);
    const handleMouseMove = (e) => handleSliderChange(e);
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e) => {
    handleSliderChange(e);
    const handleTouchMove = (e) => handleSliderChange(e);
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const { currentIndex, nextIndex, progress } = getVisibleImages(sliderValue);

  return (
    <div className="visual-evolution-container">
      <div className="visual-slider-container">
        <div className="visual-slider-labels">
          <span className="visual-slider-label" key="initial">Initial Design</span>
          <span className="visual-slider-label" key="final">Final Design</span>
        </div>
        
        <div className="visual-image-slider">
          {iterations.map((iteration, index) => (
            <img 
              key={`image-${index}`}
              src={iteration.image} 
              alt={`Design iteration ${index + 1}`}
              className="visual-slider-image"
              style={{
                opacity: index === currentIndex ? 1 - progress : 
                         index === nextIndex ? progress : 0,
                display: (index === currentIndex || index === nextIndex) ? 'block' : 'none'
              }}
            />
          ))}
        </div>

        <div 
          className="visual-slider-track"
          ref={sliderRef}
          onClick={handleSliderChange}
          onTouchStart={handleTouchStart}
        >
          <div 
            className="visual-slider-progress"
            style={{ width: `${sliderValue * 100}%` }}
          />
          <div 
            className="visual-slider-handle"
            style={{ left: `${sliderValue * 100}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        </div>
      </div>

      <div className="visual-details-grid">
        <div className="visual-detail-card">
          <h3>{iterations[currentIndex].stage}</h3>
          <ul className="visual-detail-list">
            {(iterations[currentIndex].improvements || iterations[currentIndex].keyIssues)?.map((item, index) => (
              <li key={`improvement-${index}`}>{item}</li>
            )) || []}
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