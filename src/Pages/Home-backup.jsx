// HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// import { Canvas } from '@react-three/fiber';
// import Experience from '../components/Experience.jsx';
import Contact from '../components/Contact.jsx';
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import "../style/home.css";
import { IoChevronDown } from 'react-icons/io5';
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
// import MorphingProjectCards from '../components/MorphingProjectCards';

// Hero Section Component with Scroll Animation
const HeroSection = () => {
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });
  
  const height = useTransform(
    scrollYProgress,
    [0, 1],
    ['80vh', '200px'],
    { clamp: true }
  );

  return (
    <motion.section
      ref={heroRef}
      className="hero-section"
      style={{ height, zIndex: 1000 }}
      initial={false}
    >
      <div className="hero-name-container">
        <h1 className="hero-name">namit</h1>
      </div>
      
      <div className="hero-info-top">
        <p>Harmonizes pixels to lived experiences</p>
      </div>
      
      <div className="hero-info-bottom">
        {/* 3D visualization will go here */}
      </div>
    </motion.section>
  );
};

// Case Study Item Component - Simple, using Hero Section Structure
const CaseStudyItem = ({ study, index, totalItems, caseStudyCategories, navigate }) => {
  const itemRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });
  
  const height = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    ['80vh', '70vh', '50vh', '30vh', '200px'],
    { clamp: true }
  );

  const handleClick = () => {
    if (study.isExternal) {
      window.open(study.path, '_blank');
    } else if (!study.comingSoon) {
      navigate(study.path);
    }
  };

  return (
    <motion.section
      ref={itemRef}
      className="hero-section case-study-item"
      style={{
        height,
        zIndex: 1000 - (index + 1),
        cursor: 'pointer',
      }}
      onClick={handleClick}
      initial={false}
    >
      <div className="hero-name-container">
        <h1 className="hero-name">{study.title}</h1>
      </div>
      
      <div className="hero-info-top">
        <h2 className="case-study-title">{study.title}</h2>
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
        <div className="case-study-meta">
          <span className="metric-highlight">{study.metrics}</span>
        </div>
      </div>
      
      <div className="hero-info-bottom">
        <p className="case-study-description">{study.description}</p>
        <div className="button-container">
          <Button 
            className={`case-study-button ${study.comingSoon ? 'disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={study.comingSoon}
          >
            {study.comingSoon ? 'Coming Soon' : study.isExternal ? 'Visit Website' : 'Learn More'}
            {!study.comingSoon && !study.isExternal && (
              <img 
                src="/images/vector icons/pixelated arrow.svg" 
                alt="arrow" 
                className="button-icon"
              />
            )}
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

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
  const navigate = useNavigate();

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasLoaded', 'true');
  };

  return (
    <>
      {isLoading && <LoaderScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="page-container">
        <Navbar />
        
        {/* Scrollable container for hero and case studies */}
        <div className="scrollable-content">
          {/* Hero Section - Sticky with scroll animation */}
          <HeroSection />

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
            style={{ color: 'var(--text-secondary, rgba(255, 255, 255, 0.6))' }}
          />
        </motion.div>

         {/* Case Studies Section - Using Hero Section Structure */}
         {/* <section className="case-studies">
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

          <div 
            ref={caseStudiesRef} 
            className="case-studies-carousel"
            style={{
              '--case-studies-count': caseStudies.length,
              // Minimal padding - just enough for last item to complete collapse
              paddingBottom: `400px`
            }}
          >
            {sortedCaseStudies.map((study, index) => (
              <CaseStudyItem
                key={study.title}
                study={study}
                index={index}
                totalItems={caseStudies.length}
                activeCategories={activeCategories}
                caseStudyCategories={caseStudyCategories}
                navigate={navigate}
              />
            ))}
          </div>
        </section> */}

        {/* Case Studies - Hero Section Structure */}
        <div className="case-studies-container">
          {caseStudies.map((study, index) => (
            <CaseStudyItem
              key={study.title}
              study={study}
              index={index}
              totalItems={caseStudies.length}
              caseStudyCategories={caseStudyCategories}
              navigate={navigate}
            />
          ))}
        </div>
        </div>

        {/* Extra Work Section - commented out since we have a separate page */}
        {/* <Experiments /> */}

        {/* Contact Section */}
        <Contact />
      </div>
    </>
  );
}

