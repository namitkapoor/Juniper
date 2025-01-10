import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import '../style/image-carousel.css';

const ImageCarousel = ({ images: providedImages, variant = 'research', activeMethodology, projectId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Filter images based on methodology if needed
  const filteredImages = activeMethodology 
    ? providedImages.filter(img => img.methodologies?.includes(activeMethodology))
    : providedImages;

  // Reset currentIndex when images change
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeMethodology, providedImages]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = filteredImages.length - 1;
      if (newIndex >= filteredImages.length) newIndex = 0;
      return newIndex;
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!filteredImages?.length) {
    return (
      <div className="carousel-empty">
        {activeMethodology 
          ? `No images available for ${activeMethodology}`
          : 'No images available'
        }
      </div>
    );
  }

  return (
    <div 
      className={`carousel-container ${variant}`} 
      data-project={projectId}
    >
      <div className="carousel-wrapper">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={filteredImages[currentIndex].src}
            alt={filteredImages[currentIndex].alt}
            className={`carousel-image ${imageLoaded ? 'loaded' : ''}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            onLoad={handleImageLoad}
            onAnimationStart={() => setImageLoaded(false)}
          />
        </AnimatePresence>

        {filteredImages.length > 1 && (
          <>
            <div 
              className="carousel-arrow prev" 
              onClick={() => paginate(-1)}
            >
              <IoChevronBack color="white" size={24} />
            </div>
            <div 
              className="carousel-arrow next" 
              onClick={() => paginate(1)}
            >
              <IoChevronForward color="white" size={24} />
            </div>
          </>
        )}
      </div>

      {filteredImages.length > 1 && (
        <div className="carousel-controls">
          {filteredImages.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel; 