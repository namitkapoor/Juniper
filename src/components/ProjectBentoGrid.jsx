import React, { useState, useRef, useEffect } from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import '../style/bento-grid-base.css';
import '../style/project-bento.css';
import ModelViewer from './ModelViewer';

const ProjectBentoGrid = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Helper function to determine column spans based on size
  const getColSpans = (size) => {
    const spans = {
      small: { xs: 24, sm: 12, md: 8, lg: 6 },    // 1/4 width on large screens
      medium: { xs: 24, sm: 24, md: 12, lg: 12 },  // 1/2 width
      large: { xs: 24, sm: 24, md: 16, lg: 12 },   // 1/2 width but taller
      wide: { xs: 24, sm: 24, md: 16, lg: 12 }     // 1/2 width
    };
    return spans[size] || spans.small;
  };

  const BentoItem = ({ item }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [fileSize, setFileSize] = useState(null);
    const [currentVideoSrc, setCurrentVideoSrc] = useState(null);
    const [fallbackAttempted, setFallbackAttempted] = useState(false);
    const [videoCanPlay, setVideoCanPlay] = useState(false);
    const videoRef = useRef(null);
    const { content, size } = item;
    
    // Normalize path: convert ./path to /path for public folder assets
    const normalizePath = (path) => {
      if (!path) return path;
      // If path starts with ./, remove it to make it root-relative
      const normalized = path.startsWith('./') ? path.substring(1) : path;
      console.log(`[BentoItem] Normalizing path: "${path}" -> "${normalized}"`);
      return normalized;
    };

    const normalizedSrc = normalizePath(content.src);
    
    // Initialize video source
    useEffect(() => {
      if (content.type === 'video' && !currentVideoSrc) {
        setCurrentVideoSrc(normalizedSrc);
      }
    }, [content.type, normalizedSrc, currentVideoSrc]);
    
    // Check file size for videos (especially large ones)
    useEffect(() => {
      if (content.type === 'video' && currentVideoSrc) {
        console.log(`[BentoItem] Checking file size for video:`, currentVideoSrc);
        setIsLoading(true);
        
        // Use HEAD request to get file size without downloading
        fetch(currentVideoSrc, { method: 'HEAD' })
          .then(response => {
            const contentLength = response.headers.get('content-length');
            const contentType = response.headers.get('content-type');
            if (contentLength) {
              const sizeInMB = (parseInt(contentLength) / (1024 * 1024)).toFixed(2);
              setFileSize(sizeInMB);
              console.log(`[BentoItem] Video file size: ${sizeInMB} MB for`, currentVideoSrc);
              console.log(`[BentoItem] Content-Type: ${contentType || 'unknown'}`);
              
              if (parseFloat(sizeInMB) > 50) {
                console.warn(`[BentoItem] ⚠️ Large video file detected (${sizeInMB} MB):`, currentVideoSrc);
                console.warn(`[BentoItem] This may cause loading issues. Consider compressing the video.`);
              }
            } else {
              console.warn(`[BentoItem] Could not determine file size for:`, currentVideoSrc);
            }
          })
          .catch(error => {
            console.error(`[BentoItem] Error checking file size:`, error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [content.type, currentVideoSrc]);
    
    // Log when component mounts
    useEffect(() => {
      console.log(`[BentoItem] Rendering ${content.type}:`, {
        originalPath: content.src,
        normalizedPath: normalizedSrc,
        alt: content.alt,
        description: content.description
      });
    }, [content.src, content.type, content.alt, content.description, normalizedSrc]);
    
    const handleVideoClick = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleImageError = (e) => {
      console.error(`[BentoItem] Image failed to load:`, {
        src: normalizedSrc,
        originalSrc: content.src,
        alt: content.alt,
        error: e,
        target: e.target
      });
      setHasError(true);
    };

    const handleImageLoad = () => {
      console.log(`[BentoItem] Image loaded successfully:`, {
        src: normalizedSrc,
        alt: content.alt
      });
    };

    // Generate fallback video path for VR Head Gestures
    const getFallbackVideoPath = (originalPath) => {
      // If the original is "Head Gesture - VR Interaction.mp4", try "Accessible VR Head gesture.mp4"
      if (originalPath.includes('Head Gesture - VR Interaction.mp4')) {
        return originalPath.replace('Head Gesture - VR Interaction.mp4', 'Accessible VR Head gesture.mp4');
      }
      return null;
    };

    const handleVideoError = (e) => {
      // If video already can play or has loaded metadata, ignore the error
      // This is likely a playback/seek error, not a load error
      const hasLoaded = videoCanPlay || 
                       (videoRef.current && videoRef.current.readyState >= 2); // HAVE_CURRENT_DATA or higher
      
      if (hasLoaded) {
        // Video has loaded successfully, so this is a playback error, not a load error
        // Silently ignore it - the video can still play
        console.log(`[BentoItem] ℹ️ Video playback error (ignored - video already loaded):`, {
          src: currentVideoSrc || normalizedSrc,
          readyState: videoRef.current?.readyState,
          networkState: videoRef.current?.networkState,
          errorCode: videoRef.current?.error?.code,
          note: 'This error is ignored because the video loaded successfully'
        });
        // Clear the error state if it was set
        setHasError(false);
        return;
      }

      const errorDetails = {
        src: currentVideoSrc || normalizedSrc,
        originalSrc: content.src,
        alt: content.alt,
        error: e,
        videoElement: videoRef.current,
        networkState: videoRef.current?.networkState,
        errorCode: videoRef.current?.error?.code,
        errorMessage: videoRef.current?.error?.message,
        fileSize: fileSize ? `${fileSize} MB` : 'unknown',
        readyState: videoRef.current?.readyState,
        canPlayType: videoRef.current?.canPlayType?.('video/mp4')
      };
      
      console.error(`[BentoItem] ❌ Video failed to load:`, errorDetails);
      
      // Provide specific error messages based on error code
      if (videoRef.current?.error) {
        const errorCode = videoRef.current.error.code;
        const errorMessages = {
          1: 'MEDIA_ERR_ABORTED - Video loading aborted',
          2: 'MEDIA_ERR_NETWORK - Network error while loading video',
          3: 'MEDIA_ERR_DECODE - Video decoding error (possibly corrupted file or unsupported codec)',
          4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Video format not supported'
        };
        console.error(`[BentoItem] Error code ${errorCode}: ${errorMessages[errorCode] || 'Unknown error'}`);
        
        // Only try fallback on initial load errors
        // Check readyState - if it's 0 (HAVE_NOTHING) or 1 (HAVE_METADATA but can't play), it's a load error
        const isLoadError = videoRef.current.readyState <= 1 || 
                           videoRef.current.networkState === 3; // NETWORK_NO_SOURCE
        
        // Try fallback video if decode error and we haven't tried it yet and it's a load error
        // Don't try if video has any data loaded (readyState >= 2)
        if (errorCode === 3 && !fallbackAttempted && isLoadError && videoRef.current.readyState < 2) {
          const fallbackPath = getFallbackVideoPath(normalizedSrc);
          if (fallbackPath) {
            console.log(`[BentoItem] 🔄 Attempting fallback video:`, fallbackPath);
            setFallbackAttempted(true);
            setHasError(false);
            setCurrentVideoSrc(fallbackPath);
            setIsLoading(true);
            setVideoCanPlay(false); // Reset since we're trying a new source
            return; // Don't set error yet, try fallback first
          }
        }
        
        if (errorCode === 3 && isLoadError) {
          console.error(`[BentoItem] 💡 DECODE ERROR SOLUTIONS:`, {
            possibleCauses: [
              'Video file is corrupted',
              'Video codec is not supported by browser',
              'Video file is too large for browser to decode',
              'Video container format issue'
            ],
            solutions: [
              'Re-encode the video with H.264 codec',
              'Compress the video file',
              'Check if the file plays in other video players',
              'Try the fallback video file if available'
            ]
          });
        }
        
        if (fileSize && parseFloat(fileSize) > 50) {
          console.error(`[BentoItem] 💡 SUGGESTION: File is ${fileSize} MB. Large files may timeout. Consider:`, {
            suggestions: [
              'Compress the video file',
              'Use a video hosting service (YouTube, Vimeo)',
              'Convert to a more efficient codec (H.264)',
              'Reduce video resolution or bitrate'
            ]
          });
        }
      }
      
      setHasError(true);
      setIsLoading(false);
    };

    const handleVideoLoadStart = () => {
      console.log(`[BentoItem] Video load started:`, {
        src: currentVideoSrc || normalizedSrc,
        alt: content.alt,
        fileSize: fileSize ? `${fileSize} MB` : 'checking...'
      });
      setIsLoading(true);
      setLoadProgress(0);
      setVideoCanPlay(false); // Reset when starting new load
    };
    
    const handleVideoProgress = (e) => {
      if (videoRef.current && videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        const duration = videoRef.current.duration;
        if (duration > 0) {
          const progress = (bufferedEnd / duration) * 100;
          setLoadProgress(progress);
          if (progress < 100) {
            console.log(`[BentoItem] Video loading progress: ${progress.toFixed(1)}%`, {
              src: normalizedSrc,
              buffered: `${bufferedEnd.toFixed(2)}s / ${duration.toFixed(2)}s`
            });
          }
        }
      }
    };
    
    const handleVideoStalled = () => {
      console.warn(`[BentoItem] ⚠️ Video loading stalled:`, {
        src: normalizedSrc,
        fileSize: fileSize ? `${fileSize} MB` : 'unknown',
        networkState: videoRef.current?.networkState
      });
    };
    
    const handleVideoWaiting = () => {
      console.warn(`[BentoItem] ⚠️ Video waiting for data:`, {
        src: normalizedSrc,
        readyState: videoRef.current?.readyState
      });
    };

    const handleVideoCanPlay = () => {
      console.log(`[BentoItem] ✅ Video can play:`, {
        src: currentVideoSrc || normalizedSrc,
        alt: content.alt,
        duration: videoRef.current?.duration,
        videoWidth: videoRef.current?.videoWidth,
        videoHeight: videoRef.current?.videoHeight,
        fileSize: fileSize ? `${fileSize} MB` : 'unknown'
      });
      setVideoCanPlay(true); // Mark that video successfully loaded
      setIsLoading(false);
      setLoadProgress(100);
      setHasError(false); // Clear any previous errors since video can play
    };

    const handleVideoLoadedMetadata = () => {
      console.log(`[BentoItem] Video metadata loaded:`, {
        src: normalizedSrc,
        alt: content.alt,
        duration: videoRef.current?.duration,
        videoWidth: videoRef.current?.videoWidth,
        videoHeight: videoRef.current?.videoHeight,
        readyState: videoRef.current?.readyState
      });
    };

    const renderContent = () => {
      switch (content.type) {
        case 'image':
          return (
            <img 
              src={normalizedSrc} 
              alt={content.alt}
              className="bento-grid-media"
              style={{ objectFit: content.objectFit || 'contain' }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          );
        case 'video':
          return (
            <div 
              className="bento-grid-content"
              data-playing={isPlaying}
            >
              <video 
                ref={videoRef}
                loop 
                muted 
                playsInline
                preload="metadata"
                className="bento-grid-media"
                style={{ objectFit: content.objectFit || 'contain' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={handleVideoError}
                onLoadStart={handleVideoLoadStart}
                onCanPlay={handleVideoCanPlay}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onProgress={handleVideoProgress}
                onStalled={handleVideoStalled}
                onWaiting={handleVideoWaiting}
                key={currentVideoSrc || normalizedSrc}
              >
                <source src={currentVideoSrc || normalizedSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {isLoading && !hasError && (
                <div style={{ 
                  padding: '1rem', 
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '4px'
                }}>
                  <div>Loading video{fileSize ? ` (${fileSize} MB)` : ''}...</div>
                  {loadProgress > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ 
                        width: '200px', 
                        height: '4px', 
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${loadProgress}%`, 
                          height: '100%', 
                          background: 'white',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {loadProgress.toFixed(0)}%
                      </div>
                    </div>
                  )}
                </div>
              )}
              {hasError && (
                <div style={{ 
                  padding: '1rem', 
                  color: 'red', 
                  textAlign: 'center',
                  background: 'rgba(0, 0, 0, 0.8)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '4px',
                  maxWidth: '90%'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    Video failed to load
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {currentVideoSrc || normalizedSrc}
                  </div>
                  {fallbackAttempted && (
                    <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                      ⚠️ Fallback video also failed
                    </div>
                  )}
                  {fileSize && parseFloat(fileSize) > 50 && (
                    <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '0.5rem' }}>
                      ⚠️ Large file ({fileSize} MB) - may need compression
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem' }}>
                    Check console for details
                  </div>
                </div>
              )}
              <button 
                className="video-control-button"
                onClick={handleVideoClick}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                disabled={isLoading || hasError}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          );
        case 'model':
          return (
            <div className="bento-grid-content">
              <ModelViewer 
                modelPath={normalizedSrc}
                imagePath={normalizedSrc} // Fallback image path
                title={content.alt}
                modelSettings={content.modelSettings}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className={`bento-grid-item ${size}`}>
        <div className="bento-grid-content">
          {renderContent()}
          <div className="bento-grid-description">
            <p>{content.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Row gutter={[16, 16]} className="bento-container">
      {items.map((item, index) => {
        const colSpans = getColSpans(item.size);
        
        return (
          <Col 
            key={index} 
            {...colSpans}
            className={`bento-col ${item.size || ''}`}
          >
            <motion.div
              className={`bento-grid-item ${item.size || ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BentoItem item={item} />
            </motion.div>
          </Col>
        );
      })}
    </Row>
  );
};

export default ProjectBentoGrid; 