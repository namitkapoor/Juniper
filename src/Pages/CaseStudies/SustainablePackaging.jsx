import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';
import { IoAdd } from 'react-icons/io5';
import BusinessChallenge from '../../components/BusinessChallenge';
import StrategicApproach from '../../components/StrategicApproach';
import VisualEvolution from '../../components/VisualEvolution';
import MeasurableResults from '../../components/MeasurableResults';
import Overview from '../../components/Overview';
import OtherProjects from '../../components/OtherProjects';

export default function SustainablePackaging() {
  const [expandedSections, setExpandedSections] = useState(
    new Set(['strategicApproach', 'approach0', 'measurableResults'])
  );
  const [timelineProgress, setTimelineProgress] = useState(25);

  // Add scroll to top effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      
      if (section.startsWith('approach')) {
        if (!newSet.has('strategicApproach')) {
          newSet.add('strategicApproach');
        }
        
        if (newSet.has(section)) {
          newSet.delete(section);
          const activeSections = [...newSet]
            .filter(s => s.startsWith('approach'))
            .map(s => parseInt(s.replace('approach', '')));
          
          if (activeSections.length === 0) {
            newSet.delete('strategicApproach');
            setTimelineProgress(0);
          } else {
            const lastActive = Math.max(...activeSections);
            setTimelineProgress((lastActive + 1) * 25);
          }
        } else {
          [...newSet].forEach(s => {
            if (s.startsWith('approach')) {
              newSet.delete(s);
            }
          });
          newSet.add(section);
          const sectionNumber = parseInt(section.replace('approach', ''));
          setTimelineProgress((sectionNumber + 1) * 25);
        }
      }
      else if (section === 'strategicApproach') {
        if (newSet.has(section)) {
          [...newSet].forEach(s => {
            if (s.startsWith('approach')) {
              newSet.delete(s);
            }
          });
          newSet.delete(section);
          setTimelineProgress(0);
        } else {
          newSet.add(section);
          newSet.add('approach0');
          setTimelineProgress(25);
        }
      }
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

  return (
    <div className="case-study-container">
      <Navbar />
      <motion.div 
        className="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="page-title">Incentivize Sustainable Packaging</h1>
        
        {/* Overview Section */}
        <Overview projectId="sustainablePackaging" />

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
            Encouraging retailers to adopt sustainable packaging practices through incentive programs.
          </p>
          
          <BusinessChallenge 
            isExpanded={expandedSections.has('businessChallenge')} 
            projectId="sustainablePackaging" 
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
          <p className="section-description">
            A data-driven approach to developing an effective sustainability incentive program.
          </p>
          
          <StrategicApproach 
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            projectId="sustainablePackaging"
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
            onClick={() => toggleSection('measurableResults')}
          >
            <h2>3. Measurable Results</h2>
            <motion.span 
              className="icon"
              animate={{ 
                rotate: expandedSections.has('measurableResults') ? 45 : 0 
              }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            Impact metrics and retailer feedback from the incentive program.
          </p>
          
          <MeasurableResults 
            isExpanded={expandedSections.has('measurableResults')}
            projectId="sustainablePackaging"
          />
        </motion.div>

        {/* 4. Visual Evolution Section */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className="section-header"
            onClick={() => toggleSection('visualEvolution')}
          >
            <h2>4. Visual Evolution</h2>
            <motion.span 
              className="icon"
              animate={{ 
                rotate: expandedSections.has('visualEvolution') ? 45 : 0 
              }}
            >
              <IoAdd />
            </motion.span>
          </div>
          <p className="section-description">
            The evolution of our sustainable packaging incentive platform.
          </p>
          
          <VisualEvolution 
            isExpanded={expandedSections.has('visualEvolution')}
            projectId="sustainablePackaging"
          />
        </motion.div>

        {/* Add Other Projects section at the bottom */}
        <motion.div
          className="expandable-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <OtherProjects currentProjectId="sustainable-packaging" />
        </motion.div>
      </motion.div>
    </div>
  );
} 