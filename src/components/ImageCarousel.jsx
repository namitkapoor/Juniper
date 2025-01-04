import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { carouselImages } from '../data/carouselImages';
import '../style/image-carousel.css';

const ImageCarousel = ({ projectId, activeMethodology, images: providedImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Use provided images if available, otherwise fetch from carouselImages
  const images = providedImages || carouselImages[projectId] || [];
  
  // Filter images based on methodology if needed
  const filteredImages = activeMethodology 
    ? images.filter(img => img.methodologies?.includes(activeMethodology))
    : images;

  // Reset currentIndex when images change
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [activeMethodology, images]);

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
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      return newIndex;
    });
  };

  if (!images.length) {
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
    <div className="carousel-wrapper">
      <div className="carousel-container">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="carousel-slide"
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="carousel-image"
            />
            <div className="carousel-caption">
              {images[currentIndex].caption}
            </div>
          </motion.div>
        </AnimatePresence>

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
      </div>

      <div className="carousel-controls">
        {images.map((_, index) => (
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
    </div>
  );
};

export default ImageCarousel; 