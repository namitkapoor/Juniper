import { lazy, Suspense, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { IoAdd } from 'react-icons/io5';
import { aboutSections } from '../data/aboutContent';

// Lazy load components
const Navbar = lazy(() => import('../components/Navbar'));
const AboutModel = lazy(() => import('../components/AboutModel'));

// Import styles
import '../style/about.css';
import '../style/animations.css';

export default function About() {
  const [expandedSections, setExpandedSections] = useState(new Set(['about']));

  // Memoize toggle function
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const renderContent = (section) => {
    switch (section.id) {
      case 'about':
        return (
          <div className="about-grid">
            <div className="info-canvas-content">
              <div className="section-header">
                <h2>{section.heroContent.heading}</h2>
              </div>
              <p>{section.heroContent.description}</p>
            </div>
            <div className="grid-item canvas-section">
              <Canvas
                camera={{
                  fov: 45,
                  near: 0.1,
                  far: 2000,
                  position: [0, 0, 5]
                }}
                gl={{ 
                  antialias: true,
                  alpha: true,
                  preserveDrawingBuffer: true,
                  powerPreference: "high-performance"
                }}
                dpr={Math.min(window.devicePixelRatio, 2)}
              >
                <Suspense fallback={null}>
                  <AboutModel />
                </Suspense>
              </Canvas>
            </div>
          </div>
        );
      
      case 'who':
        return (
          <div className="who-content">
            <p>{section.content.description}</p>
            <div className="skills-grid">
              {Object.entries(section.content.skills).map(([key, skill]) => (
                <div key={key} className="skill-card">
                  <div className="skill-content">
                    <h3>{skill.title}</h3>
                    <ul>
                      {skill.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'why':
        return (
          <div className="bio-section">
            {section.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        );

      case 'drive':
        return (
          <div className="personal-section">
            <p>{section.content.intro}</p>
            <p>My drive comes from:</p>
            <ul>
              {section.content.drivingFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container about">
      <Suspense fallback={<div className="loading-skeleton">Loading...</div>}>
        <Navbar />
      </Suspense>
      
      <div className="about-content content-width">
        {aboutSections.map((section, index) => (
          <motion.div
            key={section.id}
            className="expandable-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: section.id === 'about' ? 0 : 0.2 * index,
              ease: "easeOut"
            }}
          >
            <div 
              className="section-header"
              onClick={() => section.id !== 'about' && toggleSection(section.id)}
            >
              <h2>{section.title}</h2>
              {section.id !== 'about' && (
                <motion.span 
                  className="icon"
                  animate={{ rotate: expandedSections.has(section.id) ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <IoAdd />
                </motion.span>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {(section.id === 'about' || expandedSections.has(section.id)) && (
                <motion.div 
                  className="section-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent(section)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}