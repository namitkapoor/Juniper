// src/Pages/CaseStudies/ManageFarms.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';
import BentoGrid from '../../components/BentoGrid.jsx';
import { IoAdd, IoAlertCircleOutline,IoStatsChart, IoTimeOutline, IoBarChartOutline, IoPeopleOutline, IoSearchOutline, IoAccessibilityOutline, IoCheckmarkDoneOutline, IoAppsOutline, IoListOutline, IoSchoolOutline, IoAnalyticsOutline, IoDocumentTextOutline, IoGitBranchOutline, IoLayersOutline, IoSpeedometerOutline, IoCodeWorkingOutline } from 'react-icons/io5';
import BusinessChallenge from '../../components/BusinessChallenge';
import StrategicApproach from '../../components/StrategicApproach';
import VisualEvolution from '../../components/VisualEvolution';

export default function ManageFarms() {
  const [expandedSections, setExpandedSections] = useState(new Set(['approach0']));
  const [selectedPainPoint, setSelectedPainPoint] = useState(0);
  const [painPointImages, setPainPointImages] = useState([
    '../images/Case Studies/JD/original design.svg',
    '../images/Case Studies/JD/App store review 1.jpg',
    '../images/Case Studies/JD/long tutorial.jpg'
  ]);
  const [selectedApproachTab, setSelectedApproachTab] = useState(0);
  const approachImages = [
    '../images/Case Studies/JD/Team at JD Dealership.jpg',
    '../images/Case Studies/JD/Me at dealership.jpg',
    '../images/Case Studies/JD/first interview w sam.jpg',
    '../images/Case Studies/JD/me at farmers market.jpg'
  ];
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      
      // Only handle strategic approach toggle if it's explicitly clicked
      if (section === 'strategicApproach') {
        if (newSet.has(section)) {
          newSet.clear();
          setTimelineProgress(0);
        } else {
          newSet.add(section);
          newSet.add('approach0');
          setTimelineProgress(25);
        }
      } 
      // Handle subsection toggles only within Strategic Approach
      else if (section.startsWith('approach')) {
        if (newSet.has(section)) {
          newSet.delete(section);
          const activeSections = [...newSet]
            .filter(s => s.startsWith('approach'))
            .map(s => parseInt(s.replace('approach', '')));
          
          if (activeSections.length > 0) {
            const lastActive = Math.max(...activeSections);
            setTimelineProgress((lastActive + 1) * 25);
          } else {
            newSet.delete('strategicApproach');
            setTimelineProgress(0);
          }
        } else {
          newSet.add('strategicApproach');
          newSet.add(section);
          const sectionNumber = parseInt(section.replace('approach', ''));
          setTimelineProgress((sectionNumber + 1) * 25);
        }
      }
      // For other sections (like Business Challenge), handle normally
      else {
        if (newSet.has(section)) {
          newSet.delete(section);
        } else {
          newSet.add(section);
        }
      }
      return newSet;
    });
  };

  const handlePainPointClick = (index) => {
    setSelectedPainPoint(index);
  };

  const introBentoItems = [
    {
      size: 'large',
      content: {
        type: 'image',
        src: '../../images/Project Cover Photos/JD thumbnail photo 2.svg',
        alt: 'John Deere Operations Center Mobile App Interface'
      },
      objectFit: 'contain'
    },
    {
      size: 'small',
      content: {
        type: 'stats',
        icon: <IoStatsChart size={24} />,
        title: 'Impact',
        items: [
          'SUS Score: 70'
        ]
      }
    },
    {
      size: 'small',
      content: {
        type: 'text',
        icon: <IoPeopleOutline size={24} />,
        title: 'User Feedback',
        description: '"Finally, an app that understands small farm operations!"',
        footer: '- Sarah Chen, Homestead Farmer'
      }
    },
    {
      size: 'wide',
      content: {
        type: 'timeline',
        icon: <IoTimeOutline size={24} />,
        title: 'Project Timeline',
        milestones: [
          'Research & Discovery',
          'UX/UI Design',
          'User Testing',
          'Iterate'
        ],
        activeIndex: 3
      }
    },
    {
      size: 'medium',
      content: {
        type: 'text',
        icon: <IoSearchOutline size={24} />,
        title: 'Key Insight',
        description: '36% of farmers rely on paper tools, highlighting the need for an intuitive digital solution.',
        footer: 'Opportunity for adoption'
      }
    },
    
    {
      size: 'wide',
      content: {
        type: 'text',
        icon: <IoAccessibilityOutline size={24} />,
        title: 'Accessibility Focus',
        description: 'Achieved WCAG 2.0 AA compliance with contrast checks and color-blind-friendly visual tags.',
        footer: 'Inclusive by Design'
      }
    },
    {
      size: 'small',
      content: {
        type: 'text',
        icon: <IoCheckmarkDoneOutline size={24} />,
        title: 'Task Success Rate',
        description: '9/14 tasks completed successfully in usability testing.',
        footer: 'User Evaluations'
      }
    },
    {
      size: 'wide',
      content: {
        type: 'text',
        icon: <IoAlertCircleOutline size={24} />,
        title: 'Core Pain Point',
        description: 'Farmers lack a single tool to manage tasks, finances, and inventory efficiently.',
        footer: 'Disconnected Systems'
      }
    },
    {
      size: 'small',
      content: {
        type: 'metrics',
        icon: <IoBarChartOutline size={24} />,
        title: 'Research Breakdown',
        items: [
          { value: '9', label: 'Surveys' },
          { value: '4', label: 'User Interviews' },
          { value: '127', label: 'Affinity Notes' },
          { value: '7', label: 'Task Analyses' }
        ]
      }
    }
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
              animate={{ 
                rotate: expandedSections.has('businessChallenge') ? 45 : 0 
              }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            Simplifying an overly complex app to better meet the needs of small farm owners and drive adoption.
          </p>
          
          <BusinessChallenge 
            isExpanded={expandedSections.has('businessChallenge')} 
            projectId="manageFarms" 
          />
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
              animate={{ 
                rotate: expandedSections.has('strategicApproach') ? 45 : 0 
              }}
            >
              <IoAdd />
            </motion.span>
          </div>
          
          <StrategicApproach 
            expandedSections={expandedSections}
            timelineProgress={timelineProgress}
            onToggleSection={toggleSection}
            projectId="manageFarms"
          />
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
              animate={{ 
                rotate: [...expandedSections].some(s => s.startsWith('approach')) ? 45 : 0 
              }}
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
              animate={{ 
                rotate: [...expandedSections].some(s => s.startsWith('approach')) ? 45 : 0 
              }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            From cluttered complexity to intuitive simplicity—key iterations that transformed the user experience.
          </p>
          
          <VisualEvolution 
            isExpanded={expandedSections.has('evolution')} 
            projectId="manageFarms" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
}