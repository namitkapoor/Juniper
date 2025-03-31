// HomePage.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Experience from '../components/Experience.jsx';
import Contact from '../components/Contact.jsx';
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import "../style/home.css";
import { IoLockClosed, IoArrowForward, IoChevronDown } from 'react-icons/io5';
import AnimatedTagline from '../components/AnimatedTagline';
import LoaderScreen from '../components/LoaderScreen';
import { 
  IoColorPalette, // Design
  IoSparkles, // UX
  IoSearch, // Research
  IoCode, // Development
  IoExtensionPuzzle, // AI (using puzzle piece instead)
  IoGlasses, // XR/Mixed Reality
  IoBriefcase, // B2B
  IoPeople // B2C
} from 'react-icons/io5';
import CountdownTimer from '../components/CountdownTimer';

const caseStudyCategories = {
  ux: { 
    name: 'UX Design', 
    color: 'linear-gradient(135deg,rgb(230, 162, 236),rgb(34, 25, 219))',
    icon: IoExtensionPuzzle
  },
  research: { 
    name: 'UX Research', 
    color: 'linear-gradient(135deg,rgb(198, 194, 166), rgb(17, 60, 6))',
    icon: IoSearch 
  },
  development: { 
    name: 'Development', 
    color: 'linear-gradient(135deg,rgb(142, 145, 161),rgb(7, 41, 237))',
    icon: IoCode 
  },
  ai: { 
    name: 'AI', 
    color: 'linear-gradient(135deg,rgb(222, 101, 46), #673AB7)',
    icon: IoSparkles 
  },
  xr: { 
    name: 'XR', 
    color: 'linear-gradient(135deg,rgb(105, 200, 210),rgb(26, 66, 74))',
    icon: IoGlasses 
  },
  b2b: { 
    name: 'B2B', 
    color: 'linear-gradient(135deg,rgb(179, 134, 65), #FF9800)',
    icon: IoBriefcase
  },
  b2c: { 
    name: 'B2C', 
    color: 'linear-gradient(135deg, #FF8A65,rgb(148, 55, 27))',
    icon: IoPeople 
  }
};

const caseStudies = [
  {
    title: 'Manage Small Farms',
    metrics: '70 SUS Score',
    categories: ['ux', 'research', 'b2c'],
    image: '../images/Project Cover Photos/JD thumbnail photo 2.svg',
    description: 'Simplified an operations management app to better serve small farm owners, focusing on usability and scalability for non-technical users.',
    path: '/case-study/manage-farms'
  },
  {
    title: 'Hire Influencer Marketing',
    metrics: '28% Less Clicks',
    categories: ['ux', 'b2b'],
    image: '../images/Project Cover Photos/Campaign Page.svg',
    description: 'Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.',
    path: '/case-study/influencer-marketing'
  },
  
  {
    title: 'Contextualize Task Reminders',
    metrics: '30+ User Studies',
    categories: ['xr', 'research', 'ux', 'development'],
    image: '../images/Project Cover Photos/Anywhere Access Luminote gif.gif',
    description: 'Created an AR-based task management system combining spatial reminders with adaptive organizational structures to reduce cognitive load.',
    path: '/case-study/task-reminders'
  },
  {
    title: 'Incentivize Sustainable Packaging', 
    metrics: '30% More Eco-Friendly Choices',
    categories: ['xr', 'ux', 'development', 'b2c'],
    image: '../images/Project Cover Photos/SUSpointpopup-cropped.gif',
    description: 'Designed an AR app to promote sustainable shopping by evaluating product packaging and incentivizing eco-conscious purchases with rewards.',
    path: '/case-study/sustainable-packaging'
  },
  {
    title: 'Personalize Skin Care',
    metrics: '1200+ Site Visitors',
    categories: ['ux', 'development','ai', 'b2b'],
    image: '../images/Project Cover Photos/Home Page.svg',
    description: 'Developed a chatbot-driven skincare recommendation platform, integrating computer vision to provide personalized product suggestions.',
    path: 'https://sentry-skin-website.vercel.app/',
    comingSoon: false,
    isExternal: true
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeProjectType, setActiveProjectType] = useState('ux');
  const navigate = useNavigate();
  const [activeCategories, setActiveCategories] = useState(new Set());

  // Comment out the first-load check for development

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, []);


  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Comment out session storage for development
    sessionStorage.setItem('hasLoaded', 'true');
  };

  const toggleCategory = (category) => {
    setActiveCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const sortCaseStudies = (studies) => {
    if (activeCategories.size === 0) return studies;
    
    return [...studies].sort((a, b) => {
      const aMatches = a.categories.filter(cat => activeCategories.has(cat)).length;
      const bMatches = b.categories.filter(cat => activeCategories.has(cat)).length;
      return bMatches - aMatches;
    });
  };

  return (
    <>
      {isLoading && <LoaderScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="page-container">
        <Navbar />
        
        {/* Hero Section */}
        <section className="hero-section">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hero-content"
            style={{ 
              marginTop: '-15vh'
            }}
          >
            <p className='occupation'>Experience Designer</p>
            <h1 className='hero-display'>Namit Kapoor</h1>
            
            {/* Countdown Timer is now more prominent */}
            <CountdownTimer targetDate="July 2, 2025" />
          </motion.div>

          <Canvas
            shadows
            className="hero-canvas"
            camera={{
              fov: 45,
              near: 0.1,
              far: 2000,
              position: [0, 0, 2]
            }}
          >
            <ambientLight intensity={0.2} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={0.5} 
              castShadow 
            />
            <Experience />
          </Canvas>
        </section>

        {/* Separate section for scroll indicator */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            document.querySelector('.case-studies').scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }}
        >
          <span className="scroll-text">View Projects</span>
          <IoChevronDown 
            className="scroll-arrow"
            size={24}
            color="rgba(255, 255, 255, 0.6)"
          />
        </motion.div>

         {/* Case Studies Section */}
         <section className="case-studies">
          <div className="case-studies-header">
            <h2 className='case-studies-title'>Case Studies</h2>
            <p className="filter-subtitle">I solve problems across these areas. Where can I add value to yours?</p>
          </div>
          
          <div className="categories-container">
            <div className="categories-buttons">
              {Object.entries(caseStudyCategories).map(([key, { name, color, icon: Icon }]) => (
                <motion.button
                  key={key}
                  className={`category-button ${activeCategories.has(key) ? 'active' : ''}`}
                  onClick={() => toggleCategory(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    '--category-color': color,
                    '--blend-opacity': activeCategories.has(key) ? '1' : '0.3'
                  }}
                >
                  <Icon className="category-icon" />
                  <span>{name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div className="case-studies-grid" layout>
            <AnimatePresence>
              {sortCaseStudies(caseStudies).map((study) => (
                <motion.div
                  key={study.title}
                  className={`case-study-card ${study.comingSoon ? 'coming-soon' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: study.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.3,
                    scale: study.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.95
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    if (study.isExternal) {
                      window.open(study.path, '_blank');
                    } else if (!study.comingSoon) {
                      navigate(study.path);
                    }
                  }}
                >
                  <h3>{study.title}</h3>
                  
                  {study.comingSoon ? (
                    <div className="coming-soon-badge">
                      <IoLockClosed className="lock-icon" />
                      Coming Soon
                    </div>
                  ) : (
                    <div className="case-study-meta">
                      <span>{study.metrics}</span>
                    </div>
                  )}

                  <div className="case-study-tags">
                    {study.categories.map(cat => (
                      <span 
                        key={cat} 
                        className="tag"
                        style={{ '--category-color': caseStudyCategories[cat].color }}
                      >
                        {caseStudyCategories[cat].name}
                      </span>
                    ))}
                  </div>

                  <img 
                    className="case-study-image" 
                    src={study.image}
                    alt={study.title} 
                  />
                  
                  <p>{study.description}</p>
                  
                  <div className="button-container">
                    <Button 
                      className={`case-study-button ${study.comingSoon ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (study.isExternal) {
                          window.open(study.path, '_blank');
                        } else if (!study.comingSoon) {
                          navigate(study.path);
                        }
                      }}
                      disabled={study.comingSoon}
                    >
                      {study.comingSoon ? 'Coming Soon' : study.isExternal ? 'Visit Website' : 'Learn More'}
                      {!study.comingSoon && !study.isExternal && <IoArrowForward className="button-icon" />}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Extra Work Section - commented out since we have a separate page */}
        {/* <Experiments /> */}

        {/* Contact Section */}
        <Contact />
      </div>
    </>
  );
}

