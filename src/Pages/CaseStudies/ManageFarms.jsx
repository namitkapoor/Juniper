// src/Pages/CaseStudies/ManageFarms.jsx
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

export default function ManageFarms() {
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          newSet.add('approach0'); // Add Research Insights when plus icon is clicked
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
          // Clear other approach sections before adding the new one
          [...newSet].forEach(s => {
            if (s.startsWith('approach')) {
              newSet.delete(s);
            }
          });
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

  return (
    <div className="case-study-container">
      <Navbar />
      <motion.div 
        className="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="page-title">Manage Small Farms</h1>
        
        {/* Overview Section */}
        <Overview projectId="manageFarms" />

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
            Key metrics and outcomes that demonstrate the impact of our design solutions.
          </p>
          
          <MeasurableResults 
            isExpanded={expandedSections.has('measurableResults')} 
            projectId="manageFarms" 
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
            onClick={() => toggleSection('evolution')}
          >
            <h2>4. Visual Evolution</h2>
            <motion.span 
              className="icon"
              animate={{ 
                rotate: expandedSections.has('evolution') ? 45 : 0
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