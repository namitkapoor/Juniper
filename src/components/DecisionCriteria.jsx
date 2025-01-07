import React, { useState } from 'react';
import OptimizedImage from './OptimizedImage';
import '../style/decision-criteria.css';

const DecisionCriteria = ({ content }) => {
  const [activeTab, setActiveTab] = useState('concepts');
  const [activeHotspots, setActiveHotspots] = useState({});

  if (!content) return null;

  const tabs = [
    { id: 'concepts', label: 'Concept Feedback' },
    { id: 'wireframes', label: 'Wireframe Feedback' },
    { id: 'accessibility', label: 'Accessibility' }
  ];

  const toggleHotspot = (imageId, hotspotId) => {
    setActiveHotspots(prev => ({
      ...prev,
      [`${imageId}-${hotspotId}`]: !prev[`${imageId}-${hotspotId}`]
    }));
  };

  const renderConceptComparison = () => {
    console.log('Concept Feedback:', content.conceptFeedback);
    return (
      <div className="decision-concept-comparison">
        <div className="decision-concept-grid">
          {content.conceptFeedback?.map((concept, index) => {
            const status = concept.status?.toLowerCase() || '';
            
            return (
              <div 
                key={index}
                className={`decision-concept-card ${status === 'selected' ? 'selected' : 'not-selected'}`}
              >
                <h3>{concept.title}</h3>
                <span className={`status-badge ${status === 'selected' ? 'selected' : 'not-selected'}`}>
                  {concept.status}
                </span>
                <p className="description">{concept.description}</p>
                {concept.image && (
                  <div className="decision-concept-image">
                    <img
                      src={concept.image.url}
                      alt={concept.image.alt || concept.title}
                    />
                    <p className="decision-caption">{concept.image.caption}</p>
                  </div>
                )}
                <div className="supporting-points">
                  <h6>Supporting Points</h6>
                  <ul>
                    {concept.supportingPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWireframeFeedback = () => (
    <div className="decision-wireframe-feedback">
      <div className="decision-wireframe-intro">
        <h3>Map View Flow Iterations</h3>
        <p>The following wireframes showcase the evolution of the Map View interface, which was my primary focus area in this project.</p>
      </div>

      <div className={`decision-hotspots-section ${Object.values(activeHotspots).some(v => v) ? 'active' : ''}`}>
        <div className="decision-hotspots-grid">
          {content.wireframeFeedback?.[0].images.flatMap(image =>
            image.hotspots
              .filter(hotspot => activeHotspots[`${image.id}-${hotspot.id}`])
              .map(hotspot => (
                <div key={`${image.id}-${hotspot.id}`} className="decision-hotspot-card">
                  <div className="hotspot-header">
                    <span className="hotspot-number">{hotspot.id.split('-')[1]}</span>
                    <h6>{hotspot.challenge}</h6>
                  </div>
                  <p className="decision-feedback-text">{hotspot.feedback}</p>
                  <p className="decision-changes-text">{hotspot.changes}</p>
                </div>
              ))
          )}
        </div>
      </div>

      <div className="decision-wireframe-grid">
        {content.wireframeFeedback?.[0].images.map((image) => (
          <div key={image.id} className="decision-wireframe-item">
            <div className="decision-wireframe-image-container">
              <div className="decision-wireframe-image">
                <OptimizedImage
                  src={image.url}
                  alt={`Map View Version ${image.id}`}
                  caption={image.caption}
                />
                {image.hotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    className={`decision-hotspot-marker ${
                      activeHotspots[`${image.id}-${hotspot.id}`] ? 'active' : ''
                    }`}
                    style={{ 
                      left: `${hotspot.position.x}%`, 
                      top: `${hotspot.position.y}%` 
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHotspot(image.id, hotspot.id);
                    }}
                  >
                    {hotspot.id.split('-')[1]}
                  </button>
                ))}
              </div>
              <p className="decision-wireframe-caption">Version {image.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccessibility = () => (
    <div className="accessibility-section">
      <div className="accessibility-grid">
        {content.accessibility?.map((item, index) => (
          <div key={index} className="accessibility-card">
            <h3>{item.title}</h3>
            <p className="description">{item.description}</p>
            
            <div className="recommendations">
              <h6>Recommendations</h6>
              <ul>
                {item.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {item.visual && (
              <div className="visual-example">
                <OptimizedImage
                  src={item.visual.url}
                  alt={item.title}
                  caption={item.visual.caption}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'concepts':
        return renderConceptComparison();
      case 'wireframes':
        return renderWireframeFeedback();
      case 'accessibility':
        return renderAccessibility();
      default:
        return null;
    }
  };

  return (
    <div className="decision-criteria">
      
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DecisionCriteria; 