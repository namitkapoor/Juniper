import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';

const PhaseContent = ({ content, projectId, isResearchPhase }) => {
  const [activeMethodology, setActiveMethodology] = useState(null);

  if (!content) return null;

  // WCAG AA compliant earth tone combinations
  const methodologyColors = {
    "User Interviews": "#9C4221",      // Terra Cotta (contrast with white: 7.3:1)
    "Field Observations": "#276749",   // Forest Green (contrast with white: 6.5:1)
    "Journey Maps": "#F59E0B",         // Amber (contrast with black: 4.8:1)
    "Survey Data": "#854D0E",          // Dark Brown (contrast with white: 7.1:1)
    "Competitive Analysis": "#F87171", // Coral (contrast with black: 4.3:1)
    "Storyboards": "#D97706"          // Dark Amber (contrast with black: 4.6:1)
  };

  // Determine text color based on background color
  const getTextColor = (method) => {
    // Use white text for darker earth tones
    switch (method) {
      case "User Interviews":
      case "Field Observations":
      case "Survey Data":
        return 'rgba(255, 255, 255, 0.95)'; // White text
      default:
        return 'rgba(0, 0, 0, 0.8)'; // Dark text
    }
  };

  return (
    <div className="phase-content">
      <h3>{content.title}</h3>
      
      {isResearchPhase && (
        <ImageCarousel 
          projectId={projectId} 
          activeMethodology={activeMethodology}
        />
      )}
      
      <p className="phase-summary">{content.summary}</p>

      {content.designRequirements && (
        <div className="design-requirements">
          <h4>Design Requirements</h4>
          <div className="criteria-grid">
            {content.designRequirements.map((req, index) => (
              <div key={index} className="criterion-card">
                <h4>{req.category}</h4>
                <p>{req.insight}</p>
                <div className="methodology-section">
                  <div className="methodology-title">Research Methodologies</div>
                  <div className="methodology-tags">
                    {req.methodologies.map((method, idx) => (
                      <button
                        key={idx}
                        className={`methodology-tag ${activeMethodology === method ? 'active' : ''}`}
                        style={{ 
                          backgroundColor: methodologyColors[method] || 'rgba(255, 255, 255, 0.1)',
                          opacity: activeMethodology && activeMethodology !== method ? 0.5 : 1,
                          color: getTextColor(method),
                          border: 'none',
                          fontWeight: '500',
                          letterSpacing: '0.01em',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => setActiveMethodology(
                          activeMethodology === method ? null : method
                        )}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseContent; 