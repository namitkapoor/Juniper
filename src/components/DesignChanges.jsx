import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { designChangesData } from '../data/designChangesData';
import '../style/design-changes.css';

const ChangeCard = ({ change, index }) => {
  return (
    <motion.div 
      className="change-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="change-header">
        <span className="change-number">Change {index + 1}</span>
        <h3 className="change-title">{change.title}</h3>
      </div>

      <div className="change-content">
        {/* What we changed */}
        <div className="change-section">
          <h4 className="section-label what-label">What we changed</h4>
          <p className="section-text">{change.what}</p>
        </div>

        {/* Visual */}
        {change.visual && (
          <div className="change-visual">
            {change.visual.type === 'image' && (
              <img 
                src={change.visual.src} 
                alt={change.visual.alt}
                className="change-image"
              />
            )}
            {change.visual.type === 'comparison' && (
              <div className="comparison-container">
                <div className="comparison-item">
                  <span className="comparison-label">Before</span>
                  <img 
                    src={change.visual.before} 
                    alt="Before change"
                    className="comparison-image"
                  />
                </div>
                <div className="comparison-divider">→</div>
                <div className="comparison-item">
                  <span className="comparison-label">After</span>
                  <img 
                    src={change.visual.after} 
                    alt="After change"
                    className="comparison-image"
                  />
                </div>
              </div>
            )}
            {change.visual.caption && (
              <p className="visual-caption">{change.visual.caption}</p>
            )}
          </div>
        )}

        {/* Why it mattered */}
        <div className="change-section">
          <h4 className="section-label why-label">Why it mattered</h4>
          <p className="section-text">{change.why}</p>
          {change.researchInsights && (
            <ul className="insight-list">
              {change.researchInsights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          )}
        </div>

        {/* What we explored but rejected */}
        {change.rejected && change.rejected.length > 0 && (
          <div className="change-section rejected-section">
            <h4 className="section-label rejected-label">What we explored but rejected</h4>
            <div className="rejected-options">
              {change.rejected.map((option, idx) => (
                <div key={idx} className="rejected-option">
                  <span className="rejected-option-name">{option.name}</span>
                  <span className="rejected-reason">{option.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How we validated it */}
        <div className="change-section">
          <h4 className="section-label validated-label">How we validated it</h4>
          {change.validation.description && (
            <p className="section-text">{change.validation.description}</p>
          )}
          {change.validation.metrics && (
            <div className="validation-metrics">
              {change.validation.metrics.map((metric, idx) => (
                <div key={idx} className="metric-item">
                  <span className="metric-value">{metric.value}</span>
                  <span className="metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          )}
          {change.validation.quote && (
            <blockquote className="validation-quote">
              "{change.validation.quote.text}"
              {change.validation.quote.source && (
                <cite>— {change.validation.quote.source}</cite>
              )}
            </blockquote>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CollapsedPreview = ({ changes }) => {
  return (
    <motion.div 
      className="design-changes-preview"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="preview-grid">
        {changes.map((change, index) => (
          <motion.div
            key={index}
            className="preview-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="preview-header">
              <div className="preview-number">{index + 1}</div>
              <div className="preview-text">
                <h4 className="preview-title">{change.title}</h4>
                <p className="preview-description">{change.what}</p>
              </div>
            </div>

            {/* Visual Preview */}
            {change.visual && (
              <div className="preview-visual">
                {change.visual.type === 'comparison' && (
                  <div className="preview-comparison">
                    <div className="preview-comparison-item">
                      <span className="preview-label">Before</span>
                      <img 
                        src={change.visual.before} 
                        alt="Before"
                        className="preview-comparison-image"
                      />
                    </div>
                    <div className="preview-arrow">→</div>
                    <div className="preview-comparison-item">
                      <span className="preview-label">After</span>
                      <img 
                        src={change.visual.after} 
                        alt="After"
                        className="preview-comparison-image"
                      />
                    </div>
                  </div>
                )}
                {change.visual.type === 'image' && (
                  <img 
                    src={change.visual.src} 
                    alt={change.visual.alt}
                    className="preview-single-image"
                  />
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DesignChanges = ({ isExpanded, projectId }) => {
  const data = designChangesData[projectId];
  if (!data) return null;

  return (
    <>
      {/* Collapsed Preview - shows when section is closed */}
      <AnimatePresence>
        {!isExpanded && (
          <CollapsedPreview changes={data.changes} />
        )}
      </AnimatePresence>

      {/* Full Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="section-content design-changes-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {data.introduction && (
              <p className="design-changes-intro">{data.introduction}</p>
            )}
            
            <div className="changes-grid">
              {data.changes.map((change, index) => (
                <ChangeCard 
                  key={index} 
                  change={change} 
                  index={index}
                />
              ))}
            </div>

            {data.didntChange && data.didntChange.length > 0 && (
              <motion.div 
                className="didnt-change-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="didnt-change-title">What We Intentionally Didn't Change</h3>
                <div className="didnt-change-grid">
                  {data.didntChange.map((item, index) => (
                    <div key={index} className="didnt-change-item">
                      <h4>{item.name}</h4>
                      <p className="didnt-change-reason">{item.reason}</p>
                      <p className="didnt-change-action">
                        <strong>What we did instead:</strong> {item.whatWeDid}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesignChanges;

