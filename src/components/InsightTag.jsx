import React from 'react';
import '../style/insight-tag.css';

const InsightTag = ({ category, methodologies }) => {
  return (
    <div className="insight-container">
      <div className="insight-tag">
        <span className="category">{category}</span>
        <div className="methodology-tags">
          {methodologies.map((method, index) => (
            <span key={index} className="methodology-tag">
              {method}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightTag; 