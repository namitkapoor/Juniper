import React, { useState } from 'react';
import OptimizedImage from './OptimizedImage';
import { 
  IoNavigateOutline,
  IoTrashOutline,
  IoConstructOutline,
  IoFlagOutline,
  IoLeafOutline,
  IoCalendarOutline
} from 'react-icons/io5';
import '../style/solution-framework.css';
import ImageCarousel from './ImageCarousel';
import { getConceptImages } from '../data/carouselImages';

const SolutionFramework = ({ content, type, projectId }) => {
  console.log('SolutionFramework Props:', { content, type, projectId });
  const [expandedCard, setExpandedCard] = useState(null);

  const getTaskIcon = (category) => {
    const iconMap = {
      'Navigation': IoNavigateOutline,
      'Unnecessary Features': IoTrashOutline,
      'Choose a Crop to Plant': IoLeafOutline,
      'Identify and Customize Flags': IoFlagOutline,
      'Find Troubleshoot': IoConstructOutline,
      'Create Harvest Plans': IoCalendarOutline,
      'Remove Flags': IoTrashOutline
    };
    return iconMap[category];
  };

  if (type === 'analysis') {
    return (
      <div className="analysis-section">
        {/* Cover Image */}
        {content?.coverImage && (
          <div className="analysis-image">
            <OptimizedImage 
              src={content.coverImage.url}
              alt={content.coverImage.alt}
              caption={content.coverImage.caption}
            />
          </div>
        )}

        {/* Findings Grid */}
        {content?.findings && (
          <div className="findings-grid">
            {content.findings.map((finding, index) => {
              const IconComponent = getTaskIcon(finding.category);
              return (
                <div key={index} className="finding-card">
                  <h5 className="title-with-icon">
                    {IconComponent && <IconComponent size={24} />}
                    <span>{finding.category}</span>
                  </h5>
                  
                  <div className="content-section issue-section">
                    <h5 className="section-title">Issue Identified</h5>
                    <p className="issue">{finding.issue}</p>
                  </div>

                  <div className="content-section impact-section">
                    <h5 className="section-title">Business Impact</h5>
                    <p className="impact">{finding.impact}</p>
                  </div>

                  {finding.additionalValidation && (
                    <div className="content-section validation-section">
                      <h5 className="section-title">Additional Validation</h5>
                      <p className="additional-validation">
                        {finding.additionalValidation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (type === 'concepts') {
    return (
      <div className="concepts-grid">
        {content?.concepts?.map((concept, index) => {
          const carouselType = concept.carouselType || 
            (concept.name?.toLowerCase().includes('operations center') ? 'operationsCenterConcept' : 'seed2productConcept');
          
          return (
            <div key={index} className={`concept-card ${concept.status?.toLowerCase()}`}>
              <h4>{concept.name}</h4>
              <p>{concept.description}</p>
              
              <ImageCarousel 
                images={getConceptImages(projectId, carouselType)}
                autoPlay={false}
                variant="concept"
              />

              {concept.keyFeatures && (
                <ul className="feature-list">
                  {concept.keyFeatures.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'wireframes') {
    return (
      <div className="wireframes-section">
        {content?.screens?.map((screen, index) => (
          <div 
            key={index} 
            className={`wireframe-card ${expandedCard === index ? 'expanded' : ''}`}
            onClick={() => setExpandedCard(expandedCard === index ? null : index)}
          >
            <div className="wireframe-header">
              <h4 className="wireframe-title">{screen.name}</h4>
              <span className="expand-icon">
                {expandedCard === index ? '−' : '+'}
              </span>
            </div>
            
            <div className="wireframe-preview">
              <OptimizedImage 
                src={screen.image.url}
                alt={screen.name}
                caption={screen.image.caption}
              />
              <p className="preview-text">{screen.purpose.split('.')[0]}.</p>
            </div>

            {expandedCard === index && (
              <div className="wireframe-details">
                <div className="content-section">
                  <h5>
                    <span className="section-icon">✨</span>
                    Key Features
                  </h5>
                  <ul>
                    {screen.keyFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="content-section">
                  <h5>
                    <span className="section-icon">📝</span>
                    Refinements
                  </h5>
                  <ul>
                    {screen.feedbackAndRefinements.map((feedback, i) => (
                      <li key={i}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SolutionFramework; 