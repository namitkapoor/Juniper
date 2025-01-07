import React, { useState } from 'react';
import '../style/horizontal-tabs.css';

const ConceptButton = ({ title, status, onClick, isActive }) => (
  <button 
    className={`concept-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    <h3>{title}</h3>
    <span className="status">{status}</span>
  </button>
);

const Hotspot = ({ position, data, onClick }) => (
  <div 
    className="hotspot"
    style={{ left: position.x, top: position.y }}
    onClick={onClick}
  />
);

const ChecklistItem = ({ item, isActive, onClick }) => (
  <div 
    className={`checklist-item ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    <h4>{item.title}</h4>
    {isActive && (
      <div className="checklist-content">
        <p>{item.description}</p>
        {item.recommendations && (
          <ul>
            {item.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
);

const HorizontalTabs = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [direction, setDirection] = useState('right');
  const [activeConcept, setActiveConcept] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [activeChecklistItem, setActiveChecklistItem] = useState(null);

  const handleTabChange = (index) => {
    setDirection(index > activeTab ? 'right' : 'left');
    setActiveTab(index);
    // Reset states when changing tabs
    setActiveConcept(null);
    setActiveHotspot(null);
    setActiveChecklistItem(null);
  };

  const renderTabContent = (tab) => {
    switch (tab.type) {
      case 'concept':
        return (
          <div className="concept-feedback">
            <h2>{tab.header}</h2>
            <div className="concept-buttons">
              {tab.concepts.map((concept, index) => (
                <ConceptButton
                  key={index}
                  {...concept}
                  isActive={activeConcept === index}
                  onClick={() => setActiveConcept(activeConcept === index ? null : index)}
                />
              ))}
            </div>
            {activeConcept !== null && (
              <div className="concept-details">
                {tab.concepts[activeConcept].details}
              </div>
            )}
          </div>
        );

      case 'wireframe':
        return (
          <div className="wireframe-feedback">
            <h2>{tab.header}</h2>
            <div className="wireframe-container">
              <img src={tab.wireframe.url} alt={tab.wireframe.alt} />
              {tab.hotspots.map((hotspot, index) => (
                <Hotspot
                  key={index}
                  {...hotspot}
                  isActive={activeHotspot === index}
                  onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
                />
              ))}
              {activeHotspot !== null && (
                <div className="hotspot-content">
                  {tab.hotspots[activeHotspot].content}
                </div>
              )}
            </div>
          </div>
        );

      case 'accessibility':
        return (
          <div className="accessibility-section">
            <h2>{tab.header}</h2>
            <div className="accessibility-checklist">
              {tab.items.map((item, index) => (
                <ChecklistItem
                  key={index}
                  item={item}
                  isActive={activeChecklistItem === index}
                  onClick={() => setActiveChecklistItem(activeChecklistItem === index ? null : index)}
                />
              ))}
            </div>
          </div>
        );

      default:
        return tab.content;
    }
  };

  return (
    <div className="horizontal-tabs">
      <div className="tab-headers">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabChange(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.map((tab, index) => (
          <div 
            key={index}
            className={`tab-panel ${activeTab === index ? 'active' : ''}`}
            data-direction={direction}
          >
            {renderTabContent(tab)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalTabs; 