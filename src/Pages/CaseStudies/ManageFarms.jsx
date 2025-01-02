// src/Pages/CaseStudies/ManageFarms.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';
import BentoGrid from '../../components/BentoGrid.jsx';
import { IoAdd, IoAlertCircleOutline,IoStatsChart, IoTimeOutline, IoBarChartOutline, IoPeopleOutline, IoSearchOutline, IoAccessibilityOutline, IoCheckmarkDoneOutline, IoAppsOutline, IoListOutline, IoSchoolOutline, IoAnalyticsOutline, IoDocumentTextOutline, IoGitBranchOutline, IoLayersOutline, IoSpeedometerOutline, IoCodeWorkingOutline } from 'react-icons/io5';

export default function ManageFarms() {
  const [expandedSections, setExpandedSections] = useState(new Set());
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
                <section className="business-challenge">
                  <div className="market-context">
                    <h3>Market Context</h3>
                    <p>While John Deere's Operations Center Mobile (OCM) app catered effectively to large-scale farms, it fell short for small farm owners, who found it overly complex and misaligned with their unique needs.</p>
                  </div>

                  <div className="revenue-impact">
                    <h3>Revenue Impact</h3>
                    <p>With approximately 1.9 million small farms in the United States <a href="https://www.nifa.usda.gov/grants/programs/family-farms?" target="_blank" rel="noopener noreferrer">(USDA, 2022)</a>, low adoption of the app resulted in missed opportunities to strengthen brand loyalty and drive equipment sales in a significant market segment.</p>
                  </div>

                  <div className="challenge-grid">
                    <div className="pain-points">
                      <h3>User Pain Points</h3>
                      <ul className="pain-points-list">
                        <li 
                          className={`pain-point-item ${selectedPainPoint === 0 ? 'active' : ''}`}
                          onClick={() => handlePainPointClick(0)}
                        >
                          <div className="pain-point-icon">
                            <IoAppsOutline />
                          </div>
                          <div className="pain-point-content">
                            <h4>Complex Interface</h4>
                            <p>Overwhelming interface with features irrelevant to small-scale operations.</p>
                          </div>
                        </li>

                        <li 
                          className={`pain-point-item ${selectedPainPoint === 1 ? 'active' : ''}`}
                          onClick={() => handlePainPointClick(1)}
                        >
                          <div className="pain-point-icon">
                            <IoListOutline />
                          </div>
                          <div className="pain-point-content">
                            <h4>Task Management</h4>
                            <p>Difficulty managing essential tasks like equipment tracking, crop planning, and operational logs.</p>
                          </div>
                        </li>

                        <li 
                          className={`pain-point-item ${selectedPainPoint === 2 ? 'active' : ''}`}
                          onClick={() => handlePainPointClick(2)}
                        >
                          <div className="pain-point-icon">
                            <IoSchoolOutline />
                          </div>
                          <div className="pain-point-content">
                            <h4>Learning Curve</h4>
                            <p>Lack of accessible tutorials and support for first-time users, creating a steep learning curve.</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="challenge-visuals">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={selectedPainPoint}
                          src={painPointImages[selectedPainPoint]}
                          alt="Pain point visualization"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="cost-problems">
                    <h3>Cost of Problems</h3>
                    <p>Frustrated by the lack of user-friendly tools, small farm owners either abandoned the app or turned to alternative solutions, creating a retention gap for John Deere in a rapidly growing segment.</p>
                  </div>
                </section>
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
                <div className="approach-content">
                  <div className="approach-grid">
                    <div className="approach-tabs">
                      <div 
                        className={`approach-tab ${selectedApproachTab === 0 ? 'active' : ''}`}
                        onClick={() => setSelectedApproachTab(0)}
                      >
                        <div className="tab-icon">
                          <IoAnalyticsOutline size={24} />
                        </div>
                        <div className="tab-content">
                          <h3>Research Insights</h3>
                          <p>We conducted surveys, interviews, and task analyses to uncover pain points.</p>
                        </div>
                      </div>

                      <div 
                        className={`approach-tab ${selectedApproachTab === 1 ? 'active' : ''}`}
                        onClick={() => setSelectedApproachTab(1)}
                      >
                        <div className="tab-icon">
                          <IoLayersOutline size={24} />
                        </div>
                        <div className="tab-content">
                          <h3>Solution Framework</h3>
                          <p>Prioritized features addressing key pain points for scalable design.</p>
                        </div>
                      </div>

                      <div 
                        className={`approach-tab ${selectedApproachTab === 2 ? 'active' : ''}`}
                        onClick={() => setSelectedApproachTab(2)}
                      >
                        <div className="tab-icon">
                          <IoGitBranchOutline size={24} />
                        </div>
                        <div className="tab-content">
                          <h3>Decision Criteria</h3>
                          <p>Aligning with user needs and addressing usability gaps.</p>
                        </div>
                      </div>

                      <div 
                        className={`approach-tab ${selectedApproachTab === 3 ? 'active' : ''}`}
                        onClick={() => setSelectedApproachTab(3)}
                      >
                        <div className="tab-icon">
                          <IoCodeWorkingOutline size={24} />
                        </div>
                        <div className="tab-content">
                          <h3>Implementation Plan</h3>
                          <p>Iterative approach ensuring continuous refinement.</p>
                        </div>
                      </div>
                    </div>

                    <div className="approach-visuals">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={selectedApproachTab}
                          src={approachImages[selectedApproachTab]}
                          alt="Strategic approach visualization"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Detailed content based on selected tab */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedApproachTab}
                      className="approach-details"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {selectedApproachTab === 0 && (
                        <div className="approach-item">
                          <div className="approach-quote">
                            "We conducted surveys, interviews, and task analyses to uncover pain points and guide our design decisions."
                          </div>
                          <ul className="approach-list">
                            <li>Surveys revealed that 36% of farmers relied on paper tools, highlighting an opportunity for a streamlined digital solution.</li>
                            <li>User interviews emphasized the need for offline functionality, simplified task management, and intuitive workflows.</li>
                            <li>Affinity mapping identified three critical themes: farming experiences, technology interaction, and getting familiar with the farming industry, which shaped our user personas and priorities.</li>
                          </ul>
                        </div>
                      )}

                      {selectedApproachTab === 1 && (
                        <div className="approach-item">
                          <div className="approach-quote">
                            "We prioritized features addressing key pain points to create a scalable, user-centered design."
                          </div>
                          <div className="framework-grid">
                            <div className="framework-section">
                              <h4>Core Features</h4>
                              <ul>
                                <li>A daily feed to centralize tasks and updates</li>
                                <li>Smart crop planning for field organization</li>
                                <li>Simplified analytics to help farmers track performance easily</li>
                              </ul>
                            </div>
                            <div className="framework-section">
                              <h4>Design Principles</h4>
                              <ul>
                                <li>Modular and mobile-first interface for ease of use</li>
                                <li>Clear, labeled navigation tabs tailored to farmers' workflows</li>
                                <li>Consistency in UI elements to reduce learning curves</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedApproachTab === 2 && (
                        <div className="approach-item">
                          <div className="approach-quote">
                            "Our decisions focused on aligning with user needs and addressing usability gaps."
                          </div>
                          <ul className="decision-list">
                            <li>The need for offline access influenced the addition of core functionalities that did not require internet connectivity.</li>
                            <li>Task analyses revealed the importance of customizable templates to streamline repetitive actions.</li>
                            <li>Survey feedback prompted the removal of irrelevant features designed for large-scale farms, simplifying the app for small-scale operations.</li>
                            <li>Expert evaluations guided improvements in information architecture, ensuring that labels and interactive elements were intuitive and actionable.</li>
                          </ul>
                        </div>
                      )}

                      {selectedApproachTab === 3 && (
                        <div className="approach-item">
                          <div className="approach-quote">
                            "The iterative approach ensured continuous refinement and alignment with user feedback."
                          </div>
                          <div className="implementation-details">
                            <p>Conducted four design iterations over a three-month timeline, using data from usability evaluations to refine features.</p>
                            
                            <h4>Prototype-First Approach</h4>
                            <ul>
                              <li>Low-fidelity prototypes were tested to validate basic workflows</li>
                              <li>High-fidelity designs incorporated feedback from heuristic evaluations and usability testing</li>
                            </ul>
                            
                            <h4>Key Refinements</h4>
                            <ul>
                              <li>Adding a dedicated Tasks tab for seamless navigation</li>
                              <li>Improving the organization of field sections and schedules through enhanced layouts</li>
                              <li>Ensuring accessibility by achieving WCAG 2.0 AA compliance</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
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