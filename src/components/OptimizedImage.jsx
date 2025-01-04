import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Convert image path to optimized WebP version
  const optimizedSrc = src.replace('/images/', '/images/optimized/').replace(/\.[^.]+$/, '.webp');

  return (
    <div className={`image-wrapper ${isLoading ? 'loading' : ''} ${className || ''}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          // Fallback to original image if optimized version fails to load
          e.target.src = src;
          setIsLoading(false);
        }}
      />
      {isLoading && <div className="image-placeholder" />}
    </div>
  );
};

export default OptimizedImage; 