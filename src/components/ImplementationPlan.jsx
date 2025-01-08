import React, { useState } from 'react';
import {
  IoGitCompareOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoBookOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoArrowForward,
  IoTrendingUp,
  IoTime
} from 'react-icons/io5';
import '../style/implementation-plan.css';

const ImplementationPlan = ({ content }) => {
  const [expandedPanels, setExpandedPanels] = useState({});
  const [activeMetric, setActiveMetric] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [animatingCard, setAnimatingCard] = useState(null);

  if (!content || !content.sections) return null;

  const icons = {
    prototypes: <IoGitCompareOutline className="panel-icon" />,
    usabilityTesting: <IoPeopleOutline className="panel-icon" />,
    presentation: <IoDocumentTextOutline className="panel-icon" />,
    reflection: <IoBookOutline className="panel-icon" />
  };

  const renderPrototypesPanel = (section) => (
    <div className="panel-content prototypes">
      <p className="description">{section.description}</p>
      <div className="prototypes-grid">
        {section.items.map((item, index) => (
          <div key={index} className="prototype-card">
            <h4>{item.change}</h4>
            <div className="media-container">
              {item.media.type === 'video' && (
                <video
                  src={item.media.url}
                  controls
                  preload="metadata"
                  loop={item.media.loop}
                  muted={item.media.muted}
                  playsInline
                  className="prototype-video"
                />
              )}
            </div>
            <div className="prototype-info">
              <div className="info-row">
                <IoInformationCircleOutline className="info-icon" />
                <p className="reason">{item.reason}</p>
              </div>
              <div className="info-row">
                <IoCheckmarkCircleOutline className="info-icon" />
                <p className="result">{item.result}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsabilityPanel = (section) => (
    <div className="panel-content usability">
      <p className="description">{section.description}</p>
      <div className="metrics-dashboard">
        <div className="metrics-grid">
          {Object.entries(section.metrics).map(([key, value], index) => {
            if (key !== 'keyFindings') {
              return (
                <div 
                  key={key}
                  className={`metric-card ${activeMetric === index ? 'active' : ''}`}
                  onMouseEnter={() => setActiveMetric(index)}
                  onMouseLeave={() => setActiveMetric(null)}
                >
                  <div className="metric-icon">
                    {key === 'tasksTested' && <IoTime />}
                    {key === 'participants' && <IoPeopleOutline />}
                    {key === 'averageSuccessRate' && <IoTrendingUp />}
                  </div>
                  <div className="metric-details">
                    <h6>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</h6>
                    <span className="metric-value">{value}</span>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
        {section.image && (
          <div className="usability-image">
            <img src={section.image} alt="Usability Testing Results" />
          </div>
        )}
        <div className="key-findings">
          <h5>Key Findings</h5>
          <div className="findings-grid">
            {section.metrics.keyFindings.map((finding, index) => (
              <div 
                key={index}
                className={`finding-card ${selectedCard === `finding-${index}` ? 'selected' : ''}`}
                onClick={() => setSelectedCard(selectedCard === `finding-${index}` ? null : `finding-${index}`)}
              >
                <IoInformationCircleOutline className="finding-icon" />
                <p>{finding}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderListPanel = (section) => (
    <div className="panel-content list">
      {section.image && (
        <div className="section-image">
          <img src={section.image} alt={section.title} />
        </div>
      )}
      <p className="description">{section.description}</p>
      <ul className="items-list">
        {section.items.map((item, index) => (
          <li 
            key={index}
            className={`list-item ${selectedCard === `list-${index}` ? 'selected' : ''}`}
            onClick={() => setSelectedCard(`list-${index}`)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderPanelContent = (type, section) => {
    switch (type) {
      case 'prototypes':
        return renderPrototypesPanel(section);
      case 'usabilityTesting':
        return renderUsabilityPanel(section);
      case 'presentation':
      case 'reflection':
        return renderListPanel(section);
      default:
        return null;
    }
  };

  const renderPanel = (section) => {
    return (
      <div className={`implementation-panel ${expandedPanels[section.type] ? 'expanded' : ''}`}>
        <div 
          className="panel-header"
          onClick={() => setExpandedPanels(prev => ({
            ...prev,
            [section.type]: !prev[section.type]
          }))}
        >
          <div className="header-content">
            {icons[section.type]}
            <h4>{section.title}</h4>
          </div>
          <span className="expand-icon">
            {expandedPanels[section.type] ? '−' : '+'}
          </span>
        </div>
        
        {expandedPanels[section.type] && renderPanelContent(section.type, section)}
      </div>
    );
  };

  return (
    <div className="implementation-plan">
      {content.summary && (
        <p className="summary fade-in">{content.summary}</p>
      )}
      {content.sections.map((section, index) => renderPanel(section))}
    </div>
  );
};

export default ImplementationPlan; 