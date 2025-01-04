import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';

const PhaseContent = ({ 
  content, 
  projectId, 
  isResearchPhase, 
  iterations, 
  onIterationSelect 
}) => {
  const [activeMethodology, setActiveMethodology] = useState(null);

  if (!content) return null;

  // WCAG AA compliant earth tone combinations
  const methodologyColors = {
    "User Interviews": "#9C4221",
    "Field Observations": "#276749",
    "Journey Maps": "#F59E0B",
    "Survey Data": "#854D0E",
    "Competitive Analysis": "#F87171",
    "Storyboards": "#D97706"
  };

  const getTextColor = (method) => {
    switch (method) {
      case "User Interviews":
      case "Field Observations":
      case "Survey Data":
        return 'rgba(255, 255, 255, 0.95)';
      default:
        return 'rgba(0, 0, 0, 0.8)';
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
      
      {content.images && content.images.length > 0 && (
        <div className="phase-images">
          {content.images.map((image, index) => (
            <figure key={index}>
              <img src={image.url} alt={image.caption || ''} />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}

      <p className="phase-summary">{content.summary}</p>

      {iterations && iterations.length > 0 && (
        <div className="iterations-section">
          <h4>Iteration Examples</h4>
          <div className="iterations-grid">
            {iterations.map((iteration, index) => (
              <button
                key={index}
                className="iteration-card"
                onClick={() => onIterationSelect(iteration)}
              >
                <h5>{iteration.trigger}</h5>
                <p>{iteration.action}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {content.criteria && (
        <div className="criteria-section">
          <h4>Evaluation Criteria</h4>
          <div className="criteria-grid">
            {content.criteria.map((criterion, index) => (
              <div key={index} className="criterion-card">
                <h4>{criterion.title}</h4>
                <div className="weight">Weight: {criterion.weight}</div>
                <p>{criterion.description}</p>
                {criterion.feedback && (
                  <div className="feedback-section">
                    <h5>Feedback</h5>
                    <div className="feedback-images">
                      {criterion.feedback.images?.map((image, idx) => (
                        <figure key={idx} className="feedback-image">
                          <img src={image.url} alt={image.caption || ''} />
                          {image.caption && <figcaption>{image.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                    <p>{criterion.feedback.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {content.concepts && (
        <div className="concepts-section">
          <h4>Solution Concepts</h4>
          <div className="concepts-grid">
            {content.concepts.map((concept, index) => (
              <div 
                key={index} 
                className={`concept-card ${concept.status.toLowerCase()}`}
              >
                <h5>{concept.name}</h5>
                <ul>
                  {concept.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
                <div className="concept-status">{concept.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

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