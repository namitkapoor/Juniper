import { useState } from 'react';

export default function AnimatedTagline() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const showDefinition = (tooltipId) => {
    setActiveTooltip(tooltipId);
  };

  const hideDefinition = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="tagline-container">
      <p className="tagline">
        Harmonizing {' '}
        <span 
          className="interactive-word"
          onMouseEnter={() => showDefinition('tech')}
          onMouseLeave={hideDefinition}


        >
          pixels
          <span className={`tooltip ${activeTooltip === 'tech' ? 'visible' : ''}`}>
            AI, XR, Mobile, Web
          </span>
        </span>
        {' '}with{' '}
        <span 
          className="interactive-word"
          onMouseEnter={() => showDefinition('human')}


          onMouseLeave={hideDefinition}
        >
          lived experiences
          <span className={`tooltip ${activeTooltip === 'human' ? 'visible' : ''}`}>
            Accessibility, Usability, Delight
          </span>

        </span>
      </p>
      <div className="availability-status">
        <span className="status-dot"></span>
        <p>Available for Product Design roles</p>
      </div>
    </div>
  );
} 