import { lazy, Suspense, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { IoAdd } from 'react-icons/io5';
import * as IoIcons from 'react-icons/io5';
import { aboutSections } from '../data/aboutContent';
import Contact from '../components/Contact';
import { useTheme } from '../components/ThemeContext';

// Lazy load components
const Navbar = lazy(() => import('../components/Navbar'));
const AboutModel = lazy(() => import('../components/AboutModel'));

// Import styles
import '../style/about.css';
import '../style/animations.css';

// Memoized Canvas component to prevent remounting
const AboutCanvas = () => {
  const { theme } = useTheme();
  
  // Get background color based on theme
  // Use black background for both themes so white particles are visible
  const backgroundColor = theme === 'light' 
    ? '#2e2d2d' // Black background for light mode
    : '#1d1d1d'; // Dark mode background from CSS
  
  return (
    <Canvas
      key="about-canvas"
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [0, 0, 5]
      }}
      gl={{ 
        antialias: true,
        alpha: false, // Set to false so background shows
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      }}
      dpr={Math.min(window.devicePixelRatio, 2)}
    >
      <color attach="background" args={[backgroundColor]} />
      <Suspense fallback={null}>
        <AboutModel />
      </Suspense>
    </Canvas>
  );
};

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

  // Memoize the about section content to prevent Canvas remounting
  const aboutContent = useMemo(() => {
    const section = aboutSections.find(s => s.id === 'about');
    if (!section) return null;
    
    return (
      <div className="about-grid">
        <div className="info-canvas-content">
          <div className="section-header">
            <h2>{section.heroContent.heading}</h2>
          </div>
          <p>{section.heroContent.description}</p>
        </div>
        <div className="grid-item canvas-section">
          <AboutCanvas />
        </div>
      </div>
    );
  }, []);

  const renderContent = (section) => {
    switch (section.id) {
      case 'about':
        return aboutContent;
      
      case 'who':
        return (
          <div className="who-content">
            <p>{section.content.description}</p>
            <div className="skills-section">
              <h3>Skills</h3>
              <div className="skills-grid">
                {Object.entries(section.content.skills).map(([key, skillCategory], index) => (
                  <div key={index} className="skill-card">
                    <h4>{skillCategory.title}</h4>
                    <div className="skill-icons">
                      {skillCategory.software.map((skill, idx) => (
                        <div key={idx}>
                          <img src={skill.icon} alt={skill.name} title={skill.name} className="skill-icon" />
                          <span>{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'journey':
        return (
          <div className={`timeline-section ${expandedSections.has('journey') ? 'timeline-visible' : ''}`}>
            <div className="custom-timeline">
              <div className="central-line"></div>
              {section.content.timeline.map((event, index) => {
                const IconComponent = IoIcons[event.icon];
                return (
                  <div 
                    key={index} 
                    className={`custom-timeline-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                  >
                    <div className="custom-timeline-content">
                      <div className="timeline-icon">
                        {IconComponent ? <IconComponent /> : null}
                      </div>
                      <div className="timeline-text">
                        <span className="timeline-year">{event.year}</span>
                        <p>{event.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          <div className="interests-section">
            {section.content.interests.map((interest, index) => (
              <div key={index} className="interest-card">
                <img src={interest.image} alt={interest.title} className="interest-image" />
                <h4>{interest.title}</h4>
                <p>{interest.description}</p>
              </div>
            ))}
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

        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2 * (aboutSections.length + 1),
            ease: "easeOut"
          }}
        >
          <Contact/>
        </motion.div>
      </div>
    </div>
  );
}