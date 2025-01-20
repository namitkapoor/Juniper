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
  IoTime,
  IoVolumeHighOutline,
  IoColorPaletteOutline,
  IoSpeedometerOutline
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

  const getMetricIcon = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('sound') || lowerLabel.includes('volume')) {
      return <IoVolumeHighOutline />;
    }
    if (lowerLabel.includes('color')) {
      return <IoColorPaletteOutline />;
    }
    if (lowerLabel.includes('animation') || lowerLabel.includes('speed')) {
      return <IoSpeedometerOutline />;
    }
    return <IoTrendingUp />;
  };

  const renderPrototypesPanel = (section) => (
    <div className="panel-content prototypes">
      <p className="description">{section.description}</p>
      <div className="prototypes-grid">
        {section.items.map((item, index) => (
          <div key={index} className="prototype-card">
            <h4>{item.change}</h4>
            <div className={`media-container ${item.media.isLaptop ? 'laptop' : ''}`}>
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
          <div 
            className={`metric-card ${activeMetric === 'tasks' ? 'active' : ''}`}
            onMouseEnter={() => setActiveMetric('tasks')}
            onMouseLeave={() => setActiveMetric(null)}
          >
            <div className="metric-icon">
              <IoTime />
            </div>
            <div className="metric-details">
              <h6>tasks tested</h6>
              <span className="metric-value">{section.metrics.tasksTested}</span>
            </div>
          </div>
          <div 
            className={`metric-card ${activeMetric === 'participants' ? 'active' : ''}`}
            onMouseEnter={() => setActiveMetric('participants')}
            onMouseLeave={() => setActiveMetric(null)}
          >
            <div className="metric-icon">
              <IoPeopleOutline />
            </div>
            <div className="metric-details">
              <h6>participants</h6>
              <span className="metric-value">{section.metrics.participants}</span>
            </div>
          </div>
          {section.metrics.averageSuccessRate && (
            <div 
              className={`metric-card ${activeMetric === 'success' ? 'active' : ''}`}
              onMouseEnter={() => setActiveMetric('success')}
              onMouseLeave={() => setActiveMetric(null)}
            >
              <div className="metric-icon">
                <IoTrendingUp />
              </div>
              <div className="metric-details">
                <h6>average success rate</h6>
                <span className="metric-value">{section.metrics.averageSuccessRate}</span>
              </div>
            </div>
          )}
        </div>
        {section.metrics.customMetrics && (
          <div className="metrics-grid custom-metrics-row">
            {section.metrics.customMetrics.map((metric, index) => (
              <div 
                key={`custom-metric-${index}`}
                className={`metric-card ${activeMetric === `custom-${index}` ? 'active' : ''}`}
                onMouseEnter={() => setActiveMetric(`custom-${index}`)}
                onMouseLeave={() => setActiveMetric(null)}
              >
                <div className="metric-icon">
                  {getMetricIcon(metric.label)}
                </div>
                <div className="metric-details">
                  <h6>{metric.label.toLowerCase()}</h6>
                  <span className="metric-value">{metric.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {section.metrics.image && (
          <div className="usability-image">
            <img src={section.metrics.image} alt="Usability Testing Results" />
          </div>
        )}
        <div className="key-findings">
          <h5>Key Findings</h5>
          <div className="findings-grid">
            {section.metrics.keyFindings.map((finding, index) => (
              <div 
                key={`finding-${index}`}
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