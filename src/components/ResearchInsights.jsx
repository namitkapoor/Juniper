import React, { useState } from 'react';
import { 
  IoSearchOutline,
  IoPersonOutline,
  IoBarChartOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoAnalyticsOutline,
  IoStatsChartOutline
} from 'react-icons/io5';
import ImageCarousel from './ImageCarousel';
import { getProjectImages } from '../data/carouselImages';
import '../style/research-insights.css';

const ResearchInsights = ({ items, projectId }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const researchImages = getProjectImages(projectId, 'research').filter(img => 
    items.some(item => 
      item.methodologies.some(method => img.methodologies.includes(method))
    )
  );
  
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
    <>
      <div className="requirements-section-compact">
        <h5 className="requirements-title">Design Requirements</h5>
        <div className="requirements-grid">
          {items.map((item, index) => (
            <div key={index} className="requirement-card">
              <div className="title-with-icon">
                {item.icon && <item.icon size={20} />}
                <span>{item.category}</span>
              </div>
              <p className="insight">{item.insight}</p>
              {item.methodologies?.length > 0 && (
                <>
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
                </>
              )}
              {item.response && (
                <p className="response">{item.response}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {researchImages.length > 0 && (
        <div className="research-visuals">
          <ImageCarousel 
            images={filteredImages}
            autoPlay={false}
            variant="research"
            projectId={projectId}
          />
        </div>
      )}
    </>
  );
};

export default ResearchInsights; 