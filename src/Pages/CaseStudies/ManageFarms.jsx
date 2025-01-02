// src/Pages/CaseStudies/ManageFarms.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';
import BentoGrid from '../../components/BentoGrid.jsx';
import { IoAdd, IoAlertCircleOutline,IoStatsChart, IoTimeOutline, IoBarChartOutline, IoPeopleOutline, IoSearchOutline, IoAccessibilityOutline, IoCheckmarkDoneOutline, IoAppsOutline, IoListOutline, IoSchoolOutline, IoAnalyticsOutline, IoDocumentTextOutline, IoGitBranchOutline, IoLayersOutline, IoSpeedometerOutline, IoCodeWorkingOutline } from 'react-icons/io5';

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
      
      if (section === 'strategicApproach') {
        if (newSet.has(section)) {
          newSet.clear();
          setTimelineProgress(0);
        } else {
          newSet.add(section);
          newSet.add('approach0');
          setTimelineProgress(25);
        }
      } else {
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
                rotate: [...expandedSections].some(s => s.startsWith('approach')) ? 45 : 0 
              }}
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
              animate={{ 
                rotate: [...expandedSections].some(s => s.startsWith('approach')) ? 45 : 0 
              }}
            >
              <IoAdd />
            </motion.span>
          </div>
          
          <div className="approach-timeline">
            <div className="timeline-container">
              <div className="timeline-phases">
                {[
                  { title: 'Research Insights', icon: <IoAnalyticsOutline size={20} /> },
                  { title: 'Solution Framework', icon: <IoLayersOutline size={20} /> },
                  { title: 'Decision Criteria', icon: <IoGitBranchOutline size={20} /> },
                  { title: 'Implementation Plan', icon: <IoCodeWorkingOutline size={20} /> }
                ].map((phase, index) => (
                  <div
                    key={index}
                    className={`timeline-phase ${expandedSections.has(`approach${index}`) ? 'active' : ''}`}
                    onClick={() => toggleSection(`approach${index}`)}
                  >
                    <div className="phase-icon">{phase.icon}</div>
                    <div className="phase-title">{phase.title}</div>
                  </div>
                ))}
                <div className="timeline-line" />
                <motion.div 
                  className="timeline-progress"
                  animate={{ width: `${timelineProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {expandedSections.has('strategicApproach') && (
              <motion.div 
                className="section-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Research Insights */}
                <AnimatePresence>
                  {expandedSections.has('approach0') && (
                    <motion.div 
                      className="approach-item"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="approach-content-grid">
                        <div className="approach-text">
                          <div className="approach-quote">
                            "I’d like a program that includes accounting,” highlighted the necessity of integrating basic financial tools.
                          </div>
                          
                          <div className="metrics-grid">
                            <div className="metric-item">
                              <h4>36%</h4>
                              <p>of farmers used paper-based systems</p>
                            </div>
                            <div className="metric-item">
                              <h4>250+</h4>
                              <p>hours of user interviews</p>
                            </div>
                            <div className="metric-item">
                              <h4>3</h4>
                              <p>key themes identified</p>
                            </div>
                          </div>

                          <div className="research-findings">
                            <h4>Key Findings</h4>
                            <ul>
                              <li>Farmers’ long work hours indicated the need for a time-efficient planner.</li>
                              <li>Quotes like, “I’d like a program that includes accounting,” highlighted the necessity of integrating basic financial tools.</li>
                              <li>Journey maps identified inefficiencies in current workflows, inspiring features like inventory tracking and smart crop planning.</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="approach-visual">
                          <img src="../images/Case Studies/JD/me at farmers market.jpg" alt="Research process visualization" />
                          <p className="image-caption">Caption: Research synthesis and affinity mapping process</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Solution Framework */}
                <AnimatePresence>
                  {expandedSections.has('approach1') && (
                    <motion.div 
                      className="approach-item"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="approach-content-grid">
                        <div className="approach-text">
                          <div className="approach-quote">
                            "Solution framework quote about the design direction and strategy"
                          </div>
                          
                          <div className="metrics-grid">
                            <div className="metric-item">
                              <h4>4</h4>
                              <p>core features identified</p>
                            </div>
                            <div className="metric-item">
                              <h4>80%</h4>
                              <p>task completion improvement</p>
                            </div>
                            <div className="metric-item">
                              <h4>3x</h4>
                              <p>faster workflow</p>
                            </div>
                          </div>

                          <div className="solution-components">
                            <h4>Core Components</h4>
                            <ul>
                              <li>Component description 1</li>
                              <li>Component description 2</li>
                              <li>Component description 3</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="approach-visual">
                          <img src="../images/Case Studies/JD/solution-framework.jpg" alt="Solution framework diagram" />
                          <p className="image-caption">Caption: Solution architecture and key components</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Decision Criteria */}
                <AnimatePresence>
                  {expandedSections.has('approach2') && (
                    <motion.div 
                      className="approach-item"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="approach-content-grid">
                        <div className="approach-text">
                          <div className="approach-quote">
                            "Decision criteria quote about the evaluation process"
                          </div>
                          
                          <div className="metrics-grid">
                            <div className="metric-item">
                              <h4>12</h4>
                              <p>key decisions made</p>
                            </div>
                            <div className="metric-item">
                              <h4>95%</h4>
                              <p>user approval rate</p>
                            </div>
                            <div className="metric-item">
                              <h4>5</h4>
                              <p>iterations refined</p>
                            </div>
                          </div>

                          <div className="decision-outcomes">
                            <h4>Key Decisions</h4>
                            <ul>
                              <li>Decision outcome 1</li>
                              <li>Decision outcome 2</li>
                              <li>Decision outcome 3</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="approach-visual">
                          <img src="../images/Case Studies/JD/decision-process.jpg" alt="Decision making process" />
                          <p className="image-caption">Caption: Decision framework and evaluation criteria</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Implementation Plan */}
                <AnimatePresence>
                  {expandedSections.has('approach3') && (
                    <motion.div 
                      className="approach-item"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="approach-content-grid">
                        <div className="approach-text">
                          <div className="approach-quote">
                            "Implementation quote about the execution process"
                          </div>
                          
                          <div className="metrics-grid">
                            <div className="metric-item">
                              <h4>90</h4>
                              <p>days to launch</p>
                            </div>
                            <div className="metric-item">
                              <h4>4</h4>
                              <p>major iterations</p>
                            </div>
                            <div className="metric-item">
                              <h4>100%</h4>
                              <p>WCAG compliance</p>
                            </div>
                          </div>

                          <div className="implementation-steps">
                            <h4>Key Milestones</h4>
                            <ul>
                              <li>Implementation milestone 1</li>
                              <li>Implementation milestone 2</li>
                              <li>Implementation milestone 3</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="approach-visual">
                          <img src="../images/Case Studies/JD/implementation-timeline.jpg" alt="Implementation timeline" />
                          <p className="image-caption">Caption: Implementation process and key milestones</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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