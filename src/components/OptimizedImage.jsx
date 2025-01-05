import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, caption }) => {
  if (!src) return null;

  return (
    <div className="optimized-image">
      <img src={src} alt={alt || ''} />
      {caption && <p className="image-caption">{caption}</p>}
    </div>
  );
};

export default OptimizedImage; 