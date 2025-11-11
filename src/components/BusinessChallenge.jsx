import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessChallengeData } from '../data/businessChallengeData';
import { getBusinessChallengeImages } from '../data/carouselImages';
import ImageCarousel from './ImageCarousel';

const BusinessChallenge = ({ isExpanded, projectId }) => {
  const [selectedPainPoint, setSelectedPainPoint] = useState(0);
  const data = businessChallengeData[projectId];

  const handlePainPointChange = (index) => {
    setSelectedPainPoint(index);
  };

  const currentPainPoint = data.painPoints[selectedPainPoint];
  
  // Get business challenge images for the current pain point
  const currentImages = getBusinessChallengeImages(projectId, currentPainPoint?.id);

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div 
          className="section-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <section className="business-challenge">
            {/* Left Column (2/3) - Main Content */}
            <div className="business-challenge-main">
              <div className="challenge-carousel">
                <ImageCarousel 
                  images={currentImages}
                  autoPlay={false}
                  variant="business"
                />
              </div>

            <div className="market-context">
              <h3>{data.marketContext.title}</h3>
              <p>{data.marketContext.content}</p>
            </div>

              <div className="cost-problems">
                <h3>{data.costProblems.title}</h3>
                <p>{data.costProblems.content}</p>
              </div>
            </div>

            {/* Right Column (1/3) - Split into 1/3 and 2/3 rows */}
            <div className="business-challenge-sidebar">
              {/* Top Row (1/3) */}
              <div className="business-challenge-top">
            <div className="revenue-impact">
              <h3>{data.revenueImpact.title}</h3>
              <p>
                {data.revenueImpact.content}
                {data.revenueImpact.source && (
                  <a 
                    href={data.revenueImpact.source.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    ({data.revenueImpact.source.text})
                  </a>
                )}
              </p>
            </div>
              </div>

              {/* Bottom Row (2/3) */}
              <div className="business-challenge-bottom">
              <div className="pain-points">
                <h3>User Pain Points</h3>
                <ul className="pain-points-list">
                  {data.painPoints.map((point, index) => (
                    <li 
                      key={index}
                      className={`pain-point-item ${selectedPainPoint === index ? 'active' : ''}`}
                      onClick={() => handlePainPointChange(index)}
                    >
                      <div className="pain-point-icon">
                        <point.icon />
                      </div>
                      <div className="pain-point-content">
                        <h4>{point.title}</h4>
                        <p>{point.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessChallenge; 