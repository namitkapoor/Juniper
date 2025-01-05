import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import OptimizedImage from './OptimizedImage';
import ProcessFlow from './ProcessFlow';
import { getProjectImages } from '../data/carouselImages';
import '../style/phase-content.css';
import { 
  IoNavigateOutline, 
  IoLayersOutline,
  // Add other icons as needed
} from 'react-icons/io5';

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
                  autoPlay={true}
                  interval={5000}
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
        const getIconForCategory = (category) => {
          switch(category.toLowerCase()) {
            case 'navigation':
              return <IoNavigateOutline size={20} />;
            case 'unnecessary features':
              return <IoLayersOutline size={20} />;
            // Add more cases as needed
            default:
              return null;
          }
        };

        return (
          <div className="analysis-section">
            {(section.content?.image || section.image) && (
              <div className="analysis-image">
                <OptimizedImage 
                  src={section.content?.image?.url || section.image?.url}
                  alt={section.content?.image?.alt || section.image?.caption}
                  caption={section.content?.image?.caption || section.image?.caption}
                />
              </div>
            )}
            {(section.content?.findings || section.findings) && (
              <div className="findings-grid">
                {(section.content?.findings || section.findings).map((finding, index) => (
                  <div key={index} className="finding-card">
                    <h5 className="section-title">
                      {getIconForCategory(finding.category)}
                      {finding.category}
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
            {section.items.map((concept, index) => (
              <div key={index} className={`concept-card ${concept.status?.toLowerCase()}`}>
                <h4>{concept.name}</h4>
                <p>{concept.description}</p>
                {concept.visuals && <ImageCarousel images={concept.visuals} />}
                {concept.features && (
                  <ul className="feature-list">
                    {concept.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        );

      case 'process':
        return <ProcessFlow steps={section.steps} />;

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