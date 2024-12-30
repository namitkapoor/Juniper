import { lazy, Suspense, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { IoAdd } from 'react-icons/io5';

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

  const heroContent = (
    <div className="info-canvas-content">
      <div className="section-header">
        <h2>Breaking and Rebuilding</h2>
      </div>
      <p>Resilience isn't about staying intact—it's about how you reassemble. Give me a nudge → </p>
    </div>
  );

  const sections = [
    {
      id: 'about',
      title: '',
      content: (
        <div className="about-grid">
          {heroContent}
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
      )
    },
    {
      id: 'who',
      title: 'Who Am I',
      content: (
        <div className="who-content">
          <p>I'm an Experience Designer based in Atlanta, passionate about bridging the gap between art and technology.</p>
          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-content">
                <h3>Technical Skills</h3>
                <ul>
                  <li>Three.js & WebGL</li>
                  <li>React & Next.js</li>
                  <li>Node.js & Express</li>
                  <li>GLSL Shaders</li>
                </ul>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-content">
                <h3>Design Skills</h3>
                <ul>
                  <li>UI/UX Design</li>
                  <li>3D Modeling</li>
                  <li>Motion Design</li>
                  <li>Prototyping</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'why',
      title: 'Why I Do This',
      content: (
        <div className="bio-section">
          <p>My fascination with creative technology stems from its unique ability to create memorable, emotionally resonant experiences. I believe that technology, when combined with thoughtful design, can transform how we interact with information and each other.</p>
          <p>Every project is an opportunity to explore new possibilities and push the boundaries of what's possible in the digital space. Whether it's creating interactive installations or developing immersive web experiences, I'm driven by the challenge of making technology more human and accessible.</p>
        </div>
      )
    },
    {
      id: 'drive',
      title: 'What Keeps Me Going',
      content: (
        <div className="personal-section">
          <p>I'm fueled by the constant evolution of technology and its potential to create meaningful connections. The intersection of art, technology, and human experience is where I find my greatest inspiration.</p>
          <p>My drive comes from:</p>
          <ul>
            <li>The joy of solving complex problems creatively</li>
            <li>The opportunity to contribute to innovative projects</li>
            <li>The endless possibilities for learning and growth</li>
            <li>The chance to inspire and mentor others</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="page-container about">
      <Suspense fallback={<div className="loading-skeleton">Loading...</div>}>
        <Navbar />
      </Suspense>
      
      <div className="about-content content-width">
        {sections.map((section, index) => (
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
                  animate={{ 
                    rotate: expandedSections.has(section.id) ? 45 : 0 
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
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
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}