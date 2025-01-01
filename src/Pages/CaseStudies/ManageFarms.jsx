// src/Pages/CaseStudies/ManageFarms.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';
import BentoGrid from '../../components/BentoGrid.jsx';
import { IoAdd } from 'react-icons/io5';

export default function ManageFarms() {
  const [expandedSections, setExpandedSections] = useState(new Set());

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

  const introBentoItems = [
    {
      size: 'large',
      content: {
        type: 'image',
        src: '../../images/bento-grid-images/Farms/john-deere-app.jpg',
        alt: 'John Deere Operations Center Mobile App Interface'
      }
    },
    {
      size: 'small',
      content: {
        type: 'stats',
        title: 'Impact',
        items: [
          '↑ 70% SUS Score',
          '↑ 50% Daily Users',
          '★ 4.8 App Rating'
        ]
      }
    },
    {
      size: 'small',
      content: {
        type: 'text',
        title: 'User Feedback',
        description: '"Finally, an app that understands small farm operations!"',
        footer: '- Sarah Chen, Organic Farmer'
      }
    },
    {
      size: 'tall',
      content: {
        type: 'timeline',
        title: 'Project Timeline',
        milestones: [
          'Research & Discovery',
          'UX/UI Design',
          'User Testing',
          'Launch & Iterate'
        ]
      }
    },
    {
      size: 'tall',
      content: {
        type: 'timeline',
        title: 'Project Timeline',
        milestones: [
          'Research & Discovery',
          'UX/UI Design',
          'User Testing',
          'Launch & Iterate'
        ]
      }
    },
    {
      size: 'medium',
      content: {
        type: 'text',
        title: 'Challenge',
        description: 'Simplify complex farm management tools for small-scale operations while maintaining essential functionality.',
        footer: '6-month project timeline'
      }
    },
    
    {
      size: 'wide',
      content: {
        type: 'stats',
        title: 'Key Features',
        items: [
          '🌱 Smart Crop Planning',
          '📊 Simplified Analytics',
          '🚜 Equipment Tracking'
        ]
      }
    },
    {
      size: 'small',
      content: {
        type: 'text',
        title: 'Results',
        description: 'Achieved 50% increase in user adoption among small farm owners, with 93% task completion rate.',
        footer: 'Based on 6-month post-launch data'
      }
    },
    {
      size: 'small',
      content: {
        type: 'text',
        title: 'Results',
        description: 'Achieved 50% increase in user adoption among small farm owners, with 93% task completion rate.',
        footer: 'Based on 6-month post-launch data'
      }
    },
    
  ];

  return (
    <div className="case-study-container">
      <Navbar />
      <motion.div 
        className="case-study-content content-width"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className='case-study-title'>Manage Small Farms</h1>
        <p className="case-study-subtitle">
          Redesigning John Deere's Operations Center Mobile for small-scale farmers
        </p>
        
        {/* Hero Bento Grid Section */}
        <section className="case-study-hero">
          <div className="bento-grid-container">
            <BentoGrid items={introBentoItems} />            
          </div>
        </section>

        {/* Overview Section - Non-expandable */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-header">
            <h2>Overview</h2>
          </div>
          
          <div className="section-content">
            <div className="case-study-overview">
              <p>An operations management app designed to better serve small farm owners, focusing on usability and scalability for non-technical users.</p>
              {/* Keep your existing overview content */}
            </div>
          </div>
        </motion.div>

        {/* 1. Business Challenge Section */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className="section-header"
            onClick={() => toggleSection('businessChallenge')}
          >
            <h2>1. Business Challenge</h2>
            <motion.span 
              className="icon"
              animate={{ rotate: expandedSections.has('businessChallenge') ? 45 : 0 }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            Simplifying an overly complex app to better meet the needs of small farm owners and drive adoption.
          </p>
          
          <AnimatePresence mode="wait">
            {expandedSections.has('businessChallenge') && (
              <motion.div 
                className="section-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="challenge-grid">
                  <div className="challenge-content">
                    <div className="challenge-item">
                      <h3>Market Context</h3>
                      <p>While John Deere's Operations Center Mobile (OCM) app catered to large-scale farms, small farm owners found it overly complex and not aligned with their specific needs.</p>
                    </div>
                    <div className="challenge-item">
                      <h3>Revenue Impact</h3>
                      <p>Low app adoption among small farm owners meant missed opportunities for increased brand loyalty and equipment sales.</p>
                    </div>
                    <div className="challenge-item">
                      <h3>User Pain Points</h3>
                      <ul>
                        <li>Overwhelming interface with features irrelevant to small-scale operations</li>
                        <li>Difficulty managing tasks like equipment tracking, crop planning, and operational logs</li>
                        <li>Lack of accessible tutorials and support for first-time users</li>
                      </ul>
                    </div>
                    <div className="challenge-item">
                      <h3>Cost of Problems</h3>
                      <p>Frustrated users either abandoned the app or sought alternative tools, creating a gap in customer retention for John Deere in this growing demographic.</p>
                    </div>
                  </div>
                  <div className="challenge-image">
                    <img src="/path-to-challenge-image.jpg" alt="Business Challenge Visualization" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 2. Strategic Approach Section */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className="section-header"
            onClick={() => toggleSection('strategicApproach')}
          >
            <h2>2. Strategic Approach</h2>
            <motion.span 
              className="icon"
              animate={{ rotate: expandedSections.has('strategicApproach') ? 45 : 0 }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            A user-centered redesign focused on streamlining workflows, improving accessibility, and prioritizing ease of use.
          </p>
          
          <AnimatePresence mode="wait">
            {expandedSections.has('strategicApproach') && (
              <motion.div 
                className="section-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="approach-grid">
                  <div className="approach-content">
                    <div className="approach-item">
                      <h3>Research Insights</h3>
                      {/* Add your research insights content */}
                    </div>
                    <div className="approach-item">
                      <h3>Solution Framework</h3>
                      {/* Add your solution framework content */}
                    </div>
                    <div className="approach-item">
                      <h3>Decision Criteria</h3>
                      {/* Add your decision criteria content */}
                    </div>
                    <div className="approach-item">
                      <h3>Implementation Plan</h3>
                      {/* Add your implementation plan content */}
                    </div>
                  </div>
                  <div className="approach-image">
                    <img src="/path-to-approach-image.jpg" alt="Strategic Approach Visualization" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. Measurable Results Section */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className="section-header"
            onClick={() => toggleSection('results')}
          >
            <h2>3. Measurable Results</h2>
            <motion.span 
              className="icon"
              animate={{ rotate: expandedSections.has('results') ? 45 : 0 }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            Boosted productivity and engagement, achieving higher user satisfaction and increased adoption rates.
          </p>
          
          <AnimatePresence mode="wait">
            {expandedSections.has('results') && (
              <motion.div 
                className="section-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="results-grid">
                  <div className="results-content">
                    <div className="results-item">
                      <h3>Revenue Increase</h3>
                      {/* Add your revenue increase content */}
                    </div>
                    <div className="results-item">
                      <h3>User Metrics</h3>
                      {/* Add your user metrics content */}
                    </div>
                    <div className="results-item">
                      <h3>Performance Data</h3>
                      {/* Add your performance data content */}
                    </div>
                    <div className="results-item">
                      <h3>Client Testimonials</h3>
                      {/* Add your client testimonials content */}
                    </div>
                  </div>
                  <div className="results-image">
                    <img src="/path-to-results-image.jpg" alt="Results Visualization" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 4. Visual Evolution Section */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className="section-header"
            onClick={() => toggleSection('evolution')}
          >
            <h2>4. Visual Evolution</h2>
            <motion.span 
              className="icon"
              animate={{ rotate: expandedSections.has('evolution') ? 45 : 0 }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            From cluttered complexity to intuitive simplicity—key iterations that transformed the user experience.
          </p>
          
          <AnimatePresence mode="wait">
            {expandedSections.has('evolution') && (
              <motion.div 
                className="section-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="evolution-grid">
                  <div className="before-after">
                    <h3>Before & After</h3>
                    <div className="comparison-images">
                      <img src="/path-to-before-image.jpg" alt="Before" />
                      <img src="/path-to-after-image.jpg" alt="After" />
                    </div>
                  </div>
                  <div className="iterations">
                    <h3>Key Iterations</h3>
                    {/* Add your key iterations content */}
                  </div>
                  <div className="decision-points">
                    <h3>Decision Points</h3>
                    {/* Add your decision points content */}
                  </div>
                  <div className="final-solution">
                    <h3>Final Solution</h3>
                    {/* Add your final solution content */}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}