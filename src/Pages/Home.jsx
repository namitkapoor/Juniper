// HomePage.jsx
import React, { useState, useEffect, useRef, useMemo, lazy, Suspense, useContext } from 'react';
import { motion, useInView } from 'framer-motion';
// Leva controls commented out
// import { useControls, button } from 'leva';
import { useTransition } from '../contexts/TransitionContext';

// Lazy load heavy components
const Lottie = lazy(() => import('lottie-react'));
import { HeroAnimationContext, DEFAULT_HERO_CONTROLS } from '../contexts/HeroAnimationContext';
import Contact from '../components/sections/Contact.jsx';
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/layout/Navbar.jsx";
import "../style/home.css";
import "../style/button.css";
import { IoChevronDown } from 'react-icons/io5';
// Preloader commented out
// import LoaderScreen from '../components/ui/LoaderScreen';
import {
  IoSparkles, // UX
  IoSearch, // Research
  IoCode, // Development
  IoExtensionPuzzle, // AI (using puzzle piece instead)
  IoGlasses, // XR/Mixed Reality
  IoBriefcase, // B2B
  IoPeople // B2C
} from 'react-icons/io5';

// Case study page imports for preloading
const caseStudyImports = {
  '/case-study/christine-valmy': () => import('./CaseStudies/ChristineValmy.jsx'),
  '/case-study/manage-farms': () => import('./CaseStudies/ManageFarms.jsx'),
  '/case-study/influencer-marketing': () => import('./CaseStudies/InfluencerMarketing.jsx'),
  '/case-study/task-reminders': () => import('./CaseStudies/TaskReminders.jsx'),
  '/case-study/sustainable-packaging': () => import('./CaseStudies/SustainablePackaging.jsx'),
};

// Pixel Animation Lottie - plays on scroll, with custom colors
const PixelAnimationLottie = React.memo(({ animationData, isInView }) => {
  const lottieRef = useRef(null);
  const hasPlayed = useRef(false);

  // Modify Lottie colors - change dark fills to a visible color
  const colorizedAnimation = useMemo(() => {
    if (!animationData) return null;

    // Deep clone the animation data
    const modified = JSON.parse(JSON.stringify(animationData));

    // Function to recursively find and replace colors
    const replaceColors = (obj) => {
      if (!obj || typeof obj !== 'object') return;

      // Look for fill color properties (c.k is the color array in Lottie)
      if (obj.ty === 'fl' && obj.c && obj.c.k) {
        // Change to a cyan/teal color [R, G, B] in 0-1 range
        // You can customize this color: [0.4, 0.8, 0.9] = cyan
        obj.c.k = [0.1, 0.1, 0.1]; // Teal/cyan color
      }

      // Look for stroke color
      if (obj.ty === 'st' && obj.c && obj.c.k) {
        obj.c.k = [0.86, 0.86, 0.86];
      }

      // Recurse through arrays and objects
      if (Array.isArray(obj)) {
        obj.forEach(replaceColors);
      } else {
        Object.values(obj).forEach(replaceColors);
      }
    };

    replaceColors(modified);
    return modified;
  }, [animationData]);

  // Play animation when scrolled into view
  useEffect(() => {
    if (isInView && !hasPlayed.current && lottieRef.current) {
      hasPlayed.current = true;
      lottieRef.current.goToAndPlay(0);
    }
  }, [isInView]);

  if (!colorizedAnimation) return null;

  return (
    <div className="pixel-animation-wrapper-nk26">
      <Lottie
        lottieRef={lottieRef}
        animationData={colorizedAnimation}
        loop={false}
        autoplay={false}
        className="pixel-animation-nk26"
      />
    </div>
  );
});

// Case Study Card Content Component
const CaseStudyCard = React.memo(({ study, activeCategories, caseStudyCategories, navigate }) => {
  const isVisible = activeCategories.size === 0 || study.categories.some(cat => activeCategories.has(cat));
  const { startTransition } = useTransition();
  const videoRef = useRef(null);
  const hasPreloaded = useRef(false);

  const handleMouseEnter = () => {
    if (videoRef.current && study.videoSrc) {
      videoRef.current.play().catch(() => {});
    }

    // Preload the case study page on hover
    if (!hasPreloaded.current && !study.comingSoon && !study.isExternal && caseStudyImports[study.path]) {
      hasPreloaded.current = true;
      caseStudyImports[study.path]();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClick = (e) => {
    if (study.isExternal) {
      window.open(study.path, '_blank');
    } else if (!study.comingSoon) {
      // Get click position for mask animation origin
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // No video in transition - video plays on page instead
      startTransition({
        path: study.path,
        videoSrc: null,
        originX: x,
        originY: y,
      });
    }
  };

  return (
    <div
      className={`case-study-card-nk26 ${study.comingSoon ? 'coming-soon' : ''}`}
      style={{
        opacity: isVisible ? 1 : 0.3,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Background - Full Width */}
      {study.videoSrc && (
        <video
          ref={videoRef}
          className="case-study-video-nk26"
          src={study.videoSrc}
          muted
          playsInline
          loop
          preload="metadata"
          poster={study.backgroundImage}
        />
      )}
      {/* Fallback image if no video */}
      {!study.videoSrc && study.backgroundImage && (
        <div
          className="case-study-image-bg-nk26"
          style={{ backgroundImage: `url("${study.backgroundImage}")` }}
        />
      )}

      {/* Dark Overlay */}
      <div className="case-study-overlay-nk26" />

      {/* Title - Left Side (2/3 area, spanning 2 rows) */}
      <div className="case-study-title-container-nk26">
        <h3 className="case-study-title-nk26">{study.title}</h3>
      </div>

      {/* Info Top - Right Side (1/3 area, first row) */}
      <div className="case-study-info-top-nk26">
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
        <p className="case-study-description-nk26">{study.description}</p>
        <div className="button-container">
          <Button
            className={`case-study-button ${study.comingSoon ? 'disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (study.isExternal) {
                window.open(study.path, '_blank');
              } else if (!study.comingSoon) {
                const rect = e.currentTarget.closest('.case-study-card-nk26')?.getBoundingClientRect();
                const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
                const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

                startTransition({
                  path: study.path,
                  videoSrc: null,
                  originX: x,
                  originY: y,
                });
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

      {/* Visual - Right Side (1/3 area, second row) */}
      <div className="case-study-visual-nk26">
        <div className="visual-container">
          <img
            className="case-study-image"
            src={study.image}
            alt={study.title}
          />
        </div>
      </div>
    </div>
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
    title: 'Enroll More Students',
    metrics: '143% More Submissions',
    categories: ['ux', 'ai', 'development', 'b2b'],
    image: '../images/Project Cover Photos/CV thumbnail.svg',
    description: 'Designed a chat-driven enrollment system to simplify beauty school enrollment and tracking, boosting user engagement by reducing workflow friction for enrollment officers.',
    path: '/case-study/christine-valmy',
    backgroundImage: '/images/Project Cover Photos/CV on Laptop.png',
    videoSrc: '/videos/Case Studies/CV/christine-valmy-laptop.mp4'
  },
  {
    title: 'Manage Small Farms',
    metrics: '70 SUS Score',
    categories: ['ux', 'research', 'b2c'],
    image: '../images/Project Cover Photos/JD Redesign thumbnail.png',
    description: 'Simplified an operations management app to better serve small farm owners, focusing on usability and scalability for non-technical users.',
    path: '/case-study/manage-farms',
    backgroundImage: '../images/Project Cover Photos/farmer on phone screenshot 1.png',
    videoSrc: '/videos/Case Studies/JD/Animations/Farmer w: phone anim-left.mp4'
  },
  {
    title: 'Hire Influencer Marketing',
    metrics: '28% Less Clicks',
    categories: ['ux', 'b2b'],
    image: '../images/Project Cover Photos/Campaign Page.svg',
    description: 'Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.',
    path: '/case-study/influencer-marketing',
    backgroundImage: '/images/Project Cover Photos/MI on Laptop.png',
    videoSrc: '/videos/Case Studies/MI/MI on laptop.mp4'
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
];

// Animated Hero Name Component - Letter by letter with stagger (timing from Leva / HeroAnimationContext)
const AnimatedHeroName = ({ text = "namit", animate }) => {
  const c = useContext(HeroAnimationContext) || DEFAULT_HERO_CONTROLS;
  return (
    <motion.h1
      className="hero-name"
      initial="hidden"
      animate={animate}
      variants={{
        visible: { transition: { staggerChildren: c.heroNameLetterStagger } },
        hidden: {},
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 65, x: 0, scale: 1, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: { duration: c.heroNameLetterDuration },
            },
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// Animated Tagline Component - Word by word, starts after hero-name (timing from Leva / HeroAnimationContext)
const AnimatedTagline = ({ text = "Harmonizes pixels to lived experiences", onAnimationComplete, animate }) => {
  const c = useContext(HeroAnimationContext) || DEFAULT_HERO_CONTROLS;
  const words = text.split(' ');

  return (
    <motion.p
      initial="hidden"
      animate={animate}
      onAnimationComplete={onAnimationComplete}
      variants={{
        visible: {
          transition: {
            staggerChildren: c.taglineWordStagger,
            delayChildren: c.taglineDelay,
          },
        },
        hidden: {},
      }}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 0, x: -10, scale: 1, filter: 'blur(10px)' },
            visible: {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: { duration: c.taglineWordDuration },
            },
          }}
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default function Home() {
  // Preloader commented out
  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [heroLottieAnimation, setHeroLottieAnimation] = useState(null);
  const [showHeroLottie, setShowHeroLottie] = useState(false);
  const [pixelAnimation, setPixelAnimation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const heroSectionRef = useRef(null);
  const caseStudiesRef = useRef(null);
  const heroInView = useInView(heroSectionRef, { once: true });
  const caseStudiesInView = useInView(caseStudiesRef, { once: false, margin: '-100px' });
  const lottieTimeoutRef = useRef(null);
  const [heroReplayKey, setHeroReplayKey] = useState(0);

  const LEVA_STORAGE_KEY = 'leva-hero-animations';
  const stored = useMemo(() => {
    try {
      const s = JSON.parse(localStorage.getItem(LEVA_STORAGE_KEY) || '{}');
      return { ...DEFAULT_HERO_CONTROLS, ...s };
    } catch {
      return { ...DEFAULT_HERO_CONTROLS };
    }
  }, []);

  // Leva "Hero Animations": persisted to localStorage. Use Replay to see changes after editing.
  // COMMENTED OUT FOR NOW
  /* const heroControls = useControls('Hero Animations', {
    Replay: button(() => {
      setShowHeroLottie(false);
      if (lottieTimeoutRef.current) { clearTimeout(lottieTimeoutRef.current); lottieTimeoutRef.current = null; }
      setHeroReplayKey((k) => k + 1);
    }, { label: 'Replay hero animations' }),
    heroNameLetterStagger: { value: stored.heroNameLetterStagger, min: 0, max: 1, step: 0.05, label: 'Name: letter stagger' },
    heroNameLetterDuration: { value: stored.heroNameLetterDuration, min: 0.1, max: 2, step: 0.05, label: 'Name: letter duration' },
    heroNameLeftDuration: { value: stored.heroNameLeftDuration, min: 0.2, max: 3, step: 0.1, label: 'Name stroke L: duration' },
    heroNameLeftDelay: { value: stored.heroNameLeftDelay, min: 0, max: 2, step: 0.05, label: 'Name stroke L: delay' },
    heroNameRightDuration: { value: stored.heroNameRightDuration, min: 0.2, max: 3, step: 0.1, label: 'Name stroke R: duration' },
    heroNameRightDelay: { value: stored.heroNameRightDelay, min: 0, max: 2, step: 0.05, label: 'Name stroke R: delay' },
    heroNameStrokeDuration: { value: stored.heroNameStrokeDuration, min: 0.5, max: 4, step: 0.1, label: 'Name stroke bottom: duration' },
    heroNameStrokeDelay: { value: stored.heroNameStrokeDelay, min: 0, max: 2, step: 0.1, label: 'Name stroke bottom: delay' },
    taglineDelay: { value: stored.taglineDelay, min: 0, max: 4, step: 0.1, label: 'Tagline: delay (after name)' },
    taglineWordStagger: { value: stored.taglineWordStagger, min: 0, max: 1, step: 0.05, label: 'Tagline: word stagger' },
    taglineWordDuration: { value: stored.taglineWordDuration, min: 0.1, max: 1, step: 0.05, label: 'Tagline: word duration' },
    taglineRightDuration: { value: stored.taglineRightDuration, min: 0.2, max: 3, step: 0.1, label: 'Tagline stroke R: duration' },
    taglineRightDelay: { value: stored.taglineRightDelay, min: 0, max: 2, step: 0.05, label: 'Tagline stroke R: delay' },
    taglineStrokeDuration: { value: stored.taglineStrokeDuration, min: 0.5, max: 4, step: 0.1, label: 'Tagline stroke bottom: duration' },
    taglineStrokeDelay: { value: stored.taglineStrokeDelay, min: 0, max: 2, step: 0.05, label: 'Tagline stroke bottom: delay' },
    lottieDelayAfterTagline: { value: stored.lottieDelayAfterTagline, min: 0, max: 2, step: 0.1, label: 'Lottie: delay after tagline' },
    lottieFadeDuration: { value: stored.lottieFadeDuration, min: 0.1, max: 1.5, step: 0.05, label: 'Lottie: fade duration' },
    infoBottomStrokesDelay: { value: stored.infoBottomStrokesDelay, min: 0, max: 8, step: 0.2, label: 'Info-bottom: block delay' },
    infoBottomRightDuration: { value: stored.infoBottomRightDuration, min: 0.2, max: 3, step: 0.1, label: 'Info-bottom stroke R: duration' },
    infoBottomRightDelay: { value: stored.infoBottomRightDelay, min: 0, max: 2, step: 0.05, label: 'Info-bottom stroke R: delay' },
    infoBottomBottomDuration: { value: stored.infoBottomBottomDuration, min: 0.2, max: 3, step: 0.1, label: 'Info-bottom stroke bottom: duration' },
    infoBottomBottomDelay: { value: stored.infoBottomBottomDelay, min: 0, max: 2, step: 0.05, label: 'Info-bottom stroke bottom: delay' },
  }); */
  // Use default controls instead
  const heroControls = DEFAULT_HERO_CONTROLS;

  // Commented out Leva persistence
  /* useEffect(() => {
    try {
      const toSave = {};
      Object.keys(DEFAULT_HERO_CONTROLS).forEach((k) => {
        if (k in heroControls && typeof heroControls[k] !== 'function') toSave[k] = heroControls[k];
      });
      localStorage.setItem(LEVA_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {}
  }, [heroControls]); */

  useEffect(() => {
    return () => {
      if (lottieTimeoutRef.current) clearTimeout(lottieTimeoutRef.current);
    };
  }, []);

  // Comment out the first-load check for development

  // Preloader commented out
  // useEffect(() => {
  //   const hasLoaded = sessionStorage.getItem('hasLoaded');
  //   if (hasLoaded) {
  //     setIsLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    // Load Lottie animation data for hero section
    fetch('/lottie/Pixel smile blinking transparent glasses.json')
      .then(response => response.json())
      .then(data => setHeroLottieAnimation(data))
      .catch(error => console.error('Error loading Lottie animation:', error));

    // Load pixel animation for Selected Work section
    fetch('/lottie/pixel-animation-blacc.json')
      .then(response => response.json())
      .then(data => setPixelAnimation(data))
      .catch(error => console.error('Error loading pixel animation:', error));
  }, []);


  // Detect mobile breakpoint (768px matches CSS breakpoint)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // Preloader commented out
  // const handleLoadingComplete = () => {
  //   setIsLoading(false);
  //   // Comment out session storage for development
  //   sessionStorage.setItem('hasLoaded', 'true');
  // };

  const emptyCategories = useMemo(() => new Set(), []);

  return (
    <>
      {/* Preloader commented out */}
      {/* {isLoading && <LoaderScreen onLoadingComplete={handleLoadingComplete} />} */}
      <div className="page-container">
        <Navbar />
        
        {/* Hero Section - Rule of Thirds Grid. Leva "Hero Animations" panel drives all timings. */}
        <HeroAnimationContext.Provider value={heroControls}>
        <section ref={heroSectionRef} key={heroReplayKey} className="hero-section">
          {/* Name - Bottom Left. Strokes: left, right (scaleY top→bottom), bottom (scaleX left→right). */}
          <div className="hero-name-container">
            <AnimatedHeroName text="namit" animate={heroInView ? "visible" : "hidden"} />
          <motion.div
              className="hero-name-left-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleY: 0 },
                visible: { scaleY: 1, transition: { duration: heroControls.heroNameLeftDuration, delay: heroControls.heroNameLeftDelay, ease: 'easeInOut' } },
              }}
              style={{ position: 'absolute', left: 0, top: 0, width: '2px', height: '100%', background: 'var(--bento-border)', transformOrigin: 'top' }}
            />
            <motion.div
              className="hero-name-right-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleY: 0 },
                visible: { scaleY: 1, transition: { duration: heroControls.heroNameRightDuration, delay: heroControls.heroNameRightDelay, ease: 'easeInOut' } },
              }}
              style={{ position: 'absolute', right: 0, top: 0, width: '2px', height: '100%', background: 'var(--bento-border)', transformOrigin: 'top' }}
            />
            <motion.div
              className="hero-name-bottom-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: {
                    duration: heroControls.heroNameStrokeDuration,
                    delay: heroControls.heroNameStrokeDelay,
                    ease: 'easeInOut',
                  },
                },
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'var(--bento-border)',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Info Top - Top Right (1/3 area). Tagline + bottom stroke; timings from Leva. */}
          <div className="hero-info-top">
            <AnimatedTagline
              text="Harmonizes pixels to lived experiences"
              animate={heroInView ? "visible" : "hidden"}
              onAnimationComplete={() => {
                if (lottieTimeoutRef.current) clearTimeout(lottieTimeoutRef.current);
                const delay = (heroControls.lottieDelayAfterTagline ?? 0.5) * 1000;
                lottieTimeoutRef.current = setTimeout(() => {
                  setShowHeroLottie(true);
                  lottieTimeoutRef.current = null;
                }, delay);
              }}
            />
          <motion.div
              className="hero-tagline-right-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleY: 0 },
                visible: {
                  scaleY: 1,
                  transition: {
                    duration: heroControls.taglineRightDuration,
                    delay: heroControls.taglineDelay + heroControls.taglineRightDelay,
                    ease: 'easeInOut',
                  },
                },
              }}
              style={{ position: 'absolute', right: 0, top: 0, width: '2px', height: '100%', background: 'var(--bento-border)', transformOrigin: 'top' }}
            />
            <motion.div
              className="hero-tagline-bottom-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: {
                    duration: heroControls.taglineStrokeDuration,
                    delay: heroControls.taglineDelay + heroControls.taglineStrokeDelay,
                    ease: 'easeInOut',
                  },
                },
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'var(--bento-border)',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Info Bottom - Bottom Right. Strokes: right (scaleY), bottom (scaleX). */}
          <div className="hero-info-bottom">
            <div className="hero-lottie-container">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showHeroLottie ? 1 : 0 }}
                transition={{ duration: heroControls.lottieFadeDuration }}
                style={{ width: '100%', height: '100%' }}
              >
                {heroLottieAnimation && (
                <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
                  <Lottie
                    animationData={heroLottieAnimation}
                      loop={true}
                    autoplay={true}
                    className="hero-lottie"
                  />
                </Suspense>
              )}
              </motion.div>
            </div>
            <motion.div
              className="hero-info-bottom-right-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleY: 0 },
                visible: {
                  scaleY: 1,
                  transition: {
                    duration: heroControls.infoBottomRightDuration,
                    delay: heroControls.infoBottomStrokesDelay + heroControls.infoBottomRightDelay,
                    ease: 'easeInOut',
                  },
                },
              }}
              style={{ position: 'absolute', right: 0, top: 0, width: '2px', height: '100%', background: 'var(--bento-border)', transformOrigin: 'top' }}
            />
            <motion.div
              className="hero-info-bottom-bottom-stroke"
              initial="hidden"
              animate={heroInView ? "visible" : "hidden"}
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: {
                    duration: heroControls.infoBottomBottomDuration,
                    delay: heroControls.infoBottomStrokesDelay + heroControls.infoBottomBottomDelay,
                    ease: 'easeInOut',
                  },
                },
              }}
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', background: 'var(--bento-border)', transformOrigin: 'left' }}
            />
          </div>
        </section>
        </HeroAnimationContext.Provider>

        {/* View Projects: appears after Lottie, hides when case studies section is in view */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: showHeroLottie && !caseStudiesInView ? 1 : 0,
            y: showHeroLottie && !caseStudiesInView ? 0 : 20
          }}
          transition={{ delay: showHeroLottie ? 0.5 : 0, duration: 0.5 }}
          style={{ 
            cursor: 'pointer', 
            pointerEvents: showHeroLottie && !caseStudiesInView ? 'auto' : 'none' 
          }}
          onClick={() => {
            document.querySelector('.case-studies')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <span className="scroll-text">View Projects</span>
          <IoChevronDown 
            className="scroll-arrow"
            size={24}
            style={{ color: 'var(--text-secondary, rgba(255, 255, 255, 0.6))' }}
          />
        </motion.div>

         {/* Case Studies Section - Selected work with pixel animation reveal */}
         <section ref={caseStudiesRef} className="case-studies">
          <div className="case-studies-header">
            <div className="selected-work-reveal-nk26">
              <motion.div
                className="selected-work-text-container-nk26"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="case-studies-title">Featured work</h2>
              </motion.div>
              {pixelAnimation && (
                <Suspense fallback={<div className="pixel-animation-placeholder-nk26" />}>
                  <PixelAnimationLottie
                    animationData={pixelAnimation}
                    isInView={caseStudiesInView}
                  />
                </Suspense>
              )}
            </div>
          </div>

          <div className="case-studies-grid">
            {caseStudies.map((study) => (
              <div key={study.title} className="case-study-item">
                <CaseStudyCard
                  study={study}
                  activeCategories={emptyCategories}
                  caseStudyCategories={caseStudyCategories}
                  navigate={navigate}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Extra Work Section - commented out since we have a separate page */}
        {/* <Experiments /> */}

        {/* Contact Section */}
        <Contact scrollTopShowRef={caseStudiesRef} />
      </div>
    </>
  );
}

