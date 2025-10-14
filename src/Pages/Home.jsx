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
    image: '../images/Project Cover Photos/JD Redesign thumbnail vector.svg',
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
    image: '../images/Project Cover Photos/Sentry Skin thumbnail.svg',
    description: 'Developed a chatbot-driven skincare recommendation platform, integrating computer vision to provide personalized product suggestions.',
    path: 'https://sentry-skin-website.vercel.app/',
    comingSoon: false,
    isExternal: true
  },
  {
    title: 'Recommend Beauty Products',
    metrics: '23% More Purchases',
    categories: ['ux', 'ai', 'b2c'],
    image: '../images/Project Cover Photos/Nuele thumbnail.svg',
    description: 'Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.',
    path: '/case-study/product-recommendations',
    comingSoon: true
  },
  {
    title: 'Improve Beauty School Enrollment',
    metrics: '23% More Enrollments',
    categories: ['ux', 'ai', 'b2b'],
    image: '../images/Project Cover Photos/CV thumbnail.svg',
    description: 'Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.',
    path: '/case-study/beauty-school',
    comingSoon: true
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
          <div 
            className="hero-content"
            style={{ 
              marginTop: '45vh'
            }}
          >
            {/* Occupation - loads first */}
            <motion.p 
              className='occupation'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 2.0, duration: 1.2, ease: "easeOut" }}
            >
              Experience Designer
            </motion.p>
            
            {/* Name - loads second */}
            <motion.h1 
              className='hero-display'
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 1.5, ease: "easeOut" }}
            >
              Namit Kapoor
            </motion.h1>
            
            {/* Tagline - loads third */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.5, duration: 1.2, ease: "easeOut" }}
            >
              <AnimatedTagline />
            </motion.div>
          </div>

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

          <div className="case-studies-carousel">
            <AnimatePresence>
              {sortCaseStudies(caseStudies).map((study, index) => (
                <motion.div
                  key={study.title}
                  className={`case-study-showcase ${study.comingSoon ? 'coming-soon' : ''}`}
                  initial={{ 
                    opacity: 0,
                    rotateX: 45,
                    rotateY: -15,
                    scale: 0.85,
                    z: -200
                  }}
                  whileInView={{ 
                    opacity: study.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.3,
                    rotateX: 0,
                    rotateY: 0,
                    scale: study.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.95,
                    z: 0
                  }}
                  exit={{ 
                    opacity: 0,
                    rotateX: -45,
                    rotateY: 15,
                    scale: 0.85,
                    z: -200
                  }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.1 * index,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  onClick={() => {
                    if (study.isExternal) {
                      window.open(study.path, '_blank');
                    } else if (!study.comingSoon) {
                      navigate(study.path);
                    }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: 1000
                  }}
                >
                  <div className={`showcase-content ${index % 2 === 1 ? 'reverse' : ''}`}>
                    <motion.div 
                      className="showcase-info"
                      initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + (0.1 * index), duration: 0.6 }}
                    >
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

                      <div className="info-header">
                          <div className="case-study-meta">
                            <span className="metric-highlight">{study.metrics}</span>
                          </div>
                      </div>
                      
                      <h3>{study.title}</h3>
                      <p className="showcase-description">{study.description}</p>
                      
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

                    <motion.div 
                      className="showcase-visual"
                      initial={{ x: 50, opacity: 0, rotateY: -25 }}
                      whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
                      transition={{ 
                        delay: 0.3 + (0.1 * index), 
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      style={{
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className="visual-container">
                        <img 
                          className="showcase-image" 
                          src={study.image}
                          alt={study.title} 
                        />
                        <div className="visual-glow"></div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Extra Work Section - commented out since we have a separate page */}
        {/* <Experiments /> */}

        {/* Contact Section */}
        <Contact />
      </div>
    </>
  );
}

