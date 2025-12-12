import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../style/iframeLoader.css';

export default function IframeLoader({ loaded }) {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="iframe-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: loaded ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        display: loaded ? 'none' : 'flex',
        pointerEvents: loaded ? 'none' : 'auto'
      }}
    >
      <div className="loader-content">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
        <div className="loader-text">
          <motion.span 
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading audio experience{dots}
          </motion.span>
          <p className="loader-tip">Please allow microphone access when prompted</p>
        </div>
      </div>
    </motion.div>
  );
} 