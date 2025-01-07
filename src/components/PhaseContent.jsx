import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import OptimizedImage from './OptimizedImage';
import ProcessFlow from './ProcessFlow';
import DecisionCriteria from './DecisionCriteria';
import { 
  getProjectImages, 
  getTaskAnalysisImages, 
  getConceptImages
} from '../data/carouselImages';
import '../style/phase-content.css';

const PhaseContent = ({ content, contentType, projectId }) => {
  if (!content) return null;

  const renderSection = (section) => {
    switch (section.type) {
      case 'requirements':
        const researchImages = getProjectImages(projectId).filter(img => 
          section.items.some(item => 
            item.methodologies.some(method => img.methodologies.includes(method))
          )
        );
        const [selectedTags, setSelectedTags] = useState([]);
        
        const filteredImages = selectedTags.length > 0 
          ? researchImages.filter(img => 
              img.methodologies.some(method => selectedTags.includes(method))
            )
          : researchImages;

        const handleTagClick = (tag) => {
          setSelectedTags(prev => 
            prev.includes(tag) 
              ? prev.filter(t => t !== tag)
              : [...prev, tag]
          );
        };

        return (
          <div className="section requirements">
            {researchImages.length > 0 && (
              <div className="research-visuals">
                <ImageCarousel 
                  images={filteredImages}
                  autoPlay={false}
                  variant="research"
                />
              </div>
            )}
            <h5 className="requirements-title">Design Requirements</h5>
            <div className="requirements-grid">
              {section.items.map((item, index) => (
                <div key={index} className="requirement-card">
                  <h4>{item.category}</h4>
                  <p className="insight">{item.insight}</p>
                  <h5 className="methodology-subtitle">Research Methodologies</h5>
                  <div className="methodology-tags">
                    {item.methodologies.map((method, i) => (
                      <button
                        key={i}
                        className={`methodology-tag ${selectedTags.includes(method) ? 'active' : ''}`}
                        onClick={() => handleTagClick(method)}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <p className="response">{item.response}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analysis':
        const [selectedTask, setSelectedTask] = useState(null);
        const taskImages = section.content?.useCarousel 
          ? getTaskAnalysisImages(selectedTask)
          : [];

        return (
          <div className="analysis-section">
            {/* Cover Image */}
            {section.content?.coverImage && (
              <div className="analysis-image">
                <OptimizedImage 
                  src={section.content.coverImage.url}
                  alt={section.content.coverImage.alt}
                  caption={section.content.coverImage.caption}
                />
              </div>
            )}

            {/* Optional Carousel */}
            {section.content?.useCarousel && taskImages.length > 0 && (
              <div className="analysis-carousel">
                <ImageCarousel 
                  images={taskImages}
                  autoPlay={false}
                  variant="concept"
                />
              </div>
            )}

            {(section.content?.findings || section.findings) && (
              <div className="findings-grid">
                {(section.content?.findings || section.findings).map((finding, index) => (
                  <div key={index} className="finding-card">
                    <h5 className="section-title">{finding.category}</h5>
                    
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
                        <p className="additional-validation">{finding.additionalValidation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'concepts':
        return (
          <div className="concepts-grid">
            {section.content.concepts.map((concept, index) => (
              <div key={index} className={`concept-card ${concept.status?.toLowerCase()}`}>
                <h4>{concept.name}</h4>
                <p>{concept.description}</p>
                
                {/* Cover Image */}
                {concept.coverImage && (
                  <div className="concept-cover-image">
                    <OptimizedImage 
                      src={concept.coverImage.url}
                      alt={concept.coverImage.alt}
                      caption={concept.coverImage.caption}
                    />
                  </div>
                )}
                
                {/* Concept-specific carousel */}
                {concept.useCarousel && (
                  <div className="concept-carousel">
                    <ImageCarousel 
                      images={getConceptImages(concept.carouselType)}
                      autoPlay={false}
                      variant="concept"
                    />
                  </div>
                )}

                {concept.keyFeatures && (
                  <ul className="feature-list">
                    {concept.keyFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'wireframes':
        const [expandedCard, setExpandedCard] = useState(null);

        return (
          <div className="wireframes-section">
            {section.content.screens.map((screen, index) => (
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
                  {/* Show brief purpose as preview */}
                  <p className="preview-text">{screen.purpose.split('.')[0]}.</p>
                </div>

                {/* Expanded content */}
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

      case 'process':
        return <ProcessFlow steps={section.steps} />;

      case 'decisions':
        return <DecisionCriteria content={section.content} />;

      default:
        return null;
    }
  };

  return (
    <div className={`phase-content ${contentType}`}>
      <h3>{content.title}</h3>
      {content.summary && <p className="summary">{content.summary}</p>}
      
      <div className="sections">
        {content.sections?.map((section, index) => (
          <div key={index} className={`section ${section.type}`}>
            {renderSection(section)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseContent; 