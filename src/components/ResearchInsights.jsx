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

  // Move image filtering logic here
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

  const getInsightIcon = (category) => {
    const iconMap = {
      'User Research': IoPersonOutline,
      'Market Analysis': IoBarChartOutline,
      'Competitive Analysis': IoSearchOutline,
      'User Testing': IoPeopleOutline,
      'Documentation': IoDocumentTextOutline,
      'Heuristic Evaluation': IoEyeOutline,
      'Data Analysis': IoAnalyticsOutline,
      'Performance Metrics': IoStatsChartOutline
    };
    
    const IconComponent = iconMap[category];
    return IconComponent ? <IconComponent size={28} /> : null;
  };

  return (
    <>
      {researchImages.length > 0 && (
        <div className="research-visuals">
          <ImageCarousel 
            images={filteredImages}
            autoPlay={false}
            variant="research"
          />
        </div>
      )}
      <div className="requirements-grid">
        {items.map((item, index) => (
          <div key={index} className="requirement-card">
            <div className="title-with-icon">
              {getInsightIcon(item.category)}
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
    </>
  );
};

export default ResearchInsights; 