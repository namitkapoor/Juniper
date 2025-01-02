import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { businessChallengeData } from '../data/businessChallengeData';

const BusinessChallenge = ({ isExpanded, projectId }) => {
  const [selectedPainPoint, setSelectedPainPoint] = useState(0);
  const data = businessChallengeData[projectId];

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
            <div className="market-context">
              <h3>{data.marketContext.title}</h3>
              <p>{data.marketContext.content}</p>
            </div>

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

            <div className="challenge-grid">
              <div className="pain-points">
                <h3>User Pain Points</h3>
                <ul className="pain-points-list">
                  {data.painPoints.map((point, index) => (
                    <li 
                      key={index}
                      className={`pain-point-item ${selectedPainPoint === index ? 'active' : ''}`}
                      onClick={() => setSelectedPainPoint(index)}
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

              <div className="challenge-visuals">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedPainPoint}
                    src={data.painPoints[selectedPainPoint].image}
                    alt={`${data.painPoints[selectedPainPoint].title} visualization`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
            </div>

            <div className="cost-problems">
              <h3>{data.costProblems.title}</h3>
              <p>{data.costProblems.content}</p>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessChallenge; 