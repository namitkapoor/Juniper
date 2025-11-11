// HomePage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import Contact from '../components/Contact.jsx';
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import "../style/home.css";
import "../style/button.css";
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

// Case Study Item Component with Scroll Animation - Optimized
const CaseStudyItem = React.memo(({ study, index, totalItems, activeCategories, caseStudyCategories, navigate }) => {
  const itemRef = useRef(null);
  
  // Per-item scroll tracking - starts when item top reaches sticky position
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start start", "end start"], // Starts when item top hits viewport top (sticky position)
    layoutEffect: false
  });
  
  // Smooth height transition - collapses as item scrolls past sticky position
  const height = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    ['800px', '600px', '300px', '160px'],
    { clamp: true }
  );

  const isVisible = activeCategories.size === 0 || study.categories.some(cat => activeCategories.has(cat));

  return (
    <motion.div
      ref={itemRef}
      className={`case-study-showcase ${study.comingSoon ? 'coming-soon' : ''}`}
      style={{
        height,
        opacity: isVisible ? 1 : 0.3,
        position: 'sticky',
        top: '120px',
        zIndex: totalItems - index,
      }}
      onClick={() => {
        if (study.isExternal) {
          window.open(study.path, '_blank');
        } else if (!study.comingSoon) {
          navigate(study.path);
        }
      }}
    >
      {/* Title - Bottom Left (2/3 area, spanning 2 rows) */}
      <div 
        className="case-study-title-container"
        style={{
          backgroundImage: study.backgroundImage ? `url("${study.backgroundImage}")` : undefined
        }}
      >
        <h3 className="case-study-title">{study.title}</h3>
      </div>
      
      {/* Info Top - Top Right (1/3 area, first row) */}
      <div className="case-study-info-top">
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
        <p className="case-study-description">{study.description}</p>
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
            {!study.comingSoon && (
              <img 
                src="/images/vector icons/pixelated arrow.svg" 
                alt="arrow" 
                className="button-icon"
              />
            )}
          </Button>
        </div>
      </div>

      {/* Visual - Bottom Right (2/3 area, second row) */}
      <div className="case-study-visual">
        <div className="visual-container">
          <img 
            className="case-study-image" 
            src={study.image}
            alt={study.title} 
          />
          <div className="visual-glow"></div>
        </div>
      </div>
    </motion.div>
  );
});

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
    image: '../images/Project Cover Photos/JD Redesign thumbnail.png',
    description: 'Simplified an operations management app to better serve small farm owners, focusing on usability and scalability for non-technical users.',
    path: '/case-study/manage-farms',
    backgroundImage: '../images/Project Cover Photos/farmer on phone screenshot 1.png'
  },
  {
    title: 'Hire Influencer Marketing',
    metrics: '28% Less Clicks',
    categories: ['ux', 'b2b'],
    image: '../images/Project Cover Photos/Campaign Page.svg',
    description: 'Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.',
    path: '/case-study/influencer-marketing',
    backgroundImage: '/images/Project Cover Photos/influencer screenshot 1.png'
  },
  
  // Temporarily removed case studies
  // {
  //   title: 'Contextualize Task Reminders',
  //   metrics: '30+ User Studies',
  //   categories: ['xr', 'research', 'ux', 'development'],
  //   image: '../images/Project Cover Photos/Anywhere Access Luminote gif.gif',
  //   description: 'Created an AR-based task management system combining spatial reminders with adaptive organizational structures to reduce cognitive load.',
  //   path: '/case-study/task-reminders',
  //   backgroundImage: '/images/Project Cover Photos/Anywhere Access Luminote gif.gif'
  // },
  // {
  //   title: 'Incentivize Sustainable Packaging', 
  //   metrics: '30% More Eco-Friendly Choices',
  //   categories: ['xr', 'ux', 'development', 'b2c'],
  //   image: '../images/Project Cover Photos/SUSpointpopup-cropped.gif',
  //   description: 'Designed an AR app to promote sustainable shopping by evaluating product packaging and incentivizing eco-conscious purchases with rewards.',
  //   path: '/case-study/sustainable-packaging',
  //   backgroundImage: '/images/Project Cover Photos/SUSpointpopup-cropped.gif'
  // },
  {
    title: 'Personalize Product Recommendations',
    metrics: '23% More Purchases',
    categories: ['ux', 'development','ai', 'b2b'],
    image: '../images/Project Cover Photos/Sentry Skin thumbnail.svg',
    description: 'Developed a conversational product recommendation agent customizable to a brand\'s catalog',
    path: '/case-study/product-recommendations',
    comingSoon: false,
    backgroundImage: '/images/Project Cover Photos/personalize skincare screenshot.png'
  },
  // {
  //   title: 'Recommend Beauty Products',
  //   metrics: '23% More Purchases',
  //   categories: ['ux', 'ai', 'b2c'],
  //   image: '../images/Project Cover Photos/Nuele thumbnail.svg',
  //   description: 'Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.',
  //   path: '/case-study/product-recommendations',
  //   comingSoon: true,
  //   backgroundImage: '/images/Project Cover Photos/Nuele thumbnail.svg'
  // },
  {
    title: 'Enroll More Students',
    metrics: '143% More Submissions',
    categories: ['ux', 'ai', 'b2b'],
    image: '../images/Project Cover Photos/CV thumbnail.svg',
    description: 'Designed a chat-driven enrollment system to simplify beauty school enrollment and tracking, boosting user engagement by reducing workflow friction for enrollment officers.',
    path: '/case-study/beauty-school',
    comingSoon: true,
    backgroundImage: '/images/Project Cover Photos/Beauty school technician screenshot.png'
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [activeCategories, setActiveCategories] = useState(new Set());
  const caseStudiesRef = useRef(null);
  const [heroLottieAnimation, setHeroLottieAnimation] = useState(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  // Comment out the first-load check for development

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasLoaded');
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load Lottie animation data for hero section
    fetch('/lottie/Pixel smile blinking transparent glasses.json')
      .then(response => response.json())
      .then(data => setHeroLottieAnimation(data))
      .catch(error => console.error('Error loading Lottie animation:', error));
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


  // Memoize sorted case studies to avoid recalculating on every render
  const sortedCaseStudies = useMemo(() => {
    if (activeCategories.size === 0) return caseStudies;
    
    return [...caseStudies].sort((a, b) => {
      const aMatches = a.categories.filter(cat => activeCategories.has(cat)).length;
      const bMatches = b.categories.filter(cat => activeCategories.has(cat)).length;
      return bMatches - aMatches;
    });
  }, [activeCategories]);

  return (
    <>
      {isLoading && <LoaderScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="page-container">
        <Navbar />
        
        {/* Hero Section - Rule of Thirds Grid */}
        <section className="hero-section">
          {/* Name - Bottom Left (2/3 area) */}
          <div className="hero-name-container">
            <h1 className="hero-name">namit</h1>
          </div>
          
          {/* Info Top - Top Right (1/3 area, first row) */}
          <div className="hero-info-top">
            <p>Harmonizes pixels to lived experiences</p>
          </div>
          
          {/* Info Bottom - Bottom Right (2/3 area, second row) - Lottie animation */}
          <div className="hero-info-bottom">
            <div className="hero-lottie-container">
              {heroLottieAnimation && (
                <Lottie 
                  animationData={heroLottieAnimation}
                  loop={true}
                  autoplay={true}
                  className="hero-lottie"
                />
              )}
            </div>
          </div>
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
            style={{ color: 'var(--text-secondary, rgba(255, 255, 255, 0.6))' }}
          />
        </motion.div>

         {/* Case Studies Section - Original Grid */}
         <section className="case-studies">
          <div className="categories-carousel-container">
            <div 
              className="categories-carousel-wrapper"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
              style={{ '--category-count': Object.keys(caseStudyCategories).length }}
            >
              <motion.div 
                className={`categories-carousel-track ${isCarouselPaused ? 'paused' : ''}`}
              >
                {/* Duplicate items for seamless infinite loop */}
                {[...Array(3)].map((_, loopIndex) => (
                  Object.entries(caseStudyCategories).map(([key, { name, color, icon: Icon }]) => (
                    <motion.button
                      key={`${key}-${loopIndex}`}
                      className={`category-carousel-button ${activeCategories.has(key) ? 'active' : ''}`}
                      onClick={() => toggleCategory(key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        '--category-color': color,
                        '--blend-opacity': activeCategories.has(key) ? '1' : '0.3'
                      }}
                    >
                      <div className="category-carousel-content">
                        <Icon className="category-icon" />
                        <span className="category-name">{name}</span>
                      </div>
                      <div 
                        className="category-gradient-overlay"
                        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
                      />
                    </motion.button>
                  ))
                ))}
              </motion.div>
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
        </section>

        {/* Extra Work Section - commented out since we have a separate page */}
        {/* <Experiments /> */}

        {/* Contact Section */}
        <Contact />
      </div>
    </>
  );
}

