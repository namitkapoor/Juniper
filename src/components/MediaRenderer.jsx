import React, { useState } from 'react';
import '../style/media-renderer.css';

const MediaRenderer = ({ media }) => {
  const [hasError, setHasError] = useState(false);

  if (!media || !media.url) return null;

  // If previous attempt failed, try to load image instead
  if (hasError && media.type === 'gif') {
    const imagePath = media.url.replace('.gif', '.png');
    return (
      <img
        src={imagePath}
        alt={media.alt || 'Fallback image'}
        className={`media-content image-media ${media.containMode ? 'contain-mode' : ''}`}
      />
    );
  }

  switch (media.type) {
    case 'video':
      return (
        <div className={`media-container ${media.phoneFrame ? 'phone-frame' : ''}`}>
          <video
            className="prototype-video"
            src={media.url}
            poster={media.poster}
            autoPlay={media.autoplay}
            loop={media.loop}
            muted={media.muted}
            playsInline
            onError={(e) => {
              console.error('Video loading error:', e);
              setHasError(true);
            }}
          />
        </div>
      );
    
    case 'gif':
      return (
        <img
          src={media.url}
          alt={media.alt || 'GIF content'}
          className={`media-content gif-media ${media.containMode ? 'contain-mode' : ''}`}
          onError={(e) => {
            console.error('GIF loading error:', e);
            setHasError(true);
          }}
        />
      );
    
    case 'image':
      return (
        <img
          src={media.url}
          alt={media.alt || 'Image content'}
          className={`media-content image-media ${media.containMode ? 'contain-mode' : ''}`}
          onError={(e) => {
            console.error('Image loading error:', e);
            setHasError(true);
          }}
        />
      );
    
    default:
      return null;
  }
};

export default MediaRenderer; 