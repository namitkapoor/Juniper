// src/Pages/CaseStudies/ManageFarms.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';
import BentoGrid from '../../components/BentoGrid.jsx';

export default function ManageFarms() {
  const introBentoItems = [
    {
      size: 'large',
      content: {
        type: 'image',
        src: '../../images/bento-grid-images/Farms/App store review 1.jpg',
        alt: 'Featured App Store Review'
      }
    },
    {
      size: 'wide',
      content: {
        type: 'stats',
        title: 'Key Metrics',
        items: [
          '70 Average SUS Score',
          '50% Increase in Daily Active Users',
          '4.8 App Store Rating'
        ]
      }
    },
    {
      content: {
        type: 'text',
        title: 'User Feedback',
        description: 'This app has transformed how I manage my small farm. Everything I need is right at my fingertips.',
        footer: '- John Smith, Farm Owner'
      }
    }
  ];

  const bentoItems = [
    {
      size: 'large',
      content: {
        type: 'image',
        src: '../../images/bento-grid-images/Farms/App store review 1.jpg',
        alt: 'Featured App Store Review'
      }
    },
    {
      size: 'wide',
      content: {
        type: 'stats',
        title: 'Simplicity, Clarity, and Task Relevance',
        items: [
          'Removed irrelevant features like large-scale fleet management.',
          'Enhanced visual clarity with intuitive icons and color-coded tasks.',
          'Automated repetitive processes like maintenance reminders.'
        ]
      }
    },
    {
      content: {
        type: 'text',
        title: 'User Feedback',
        description: 'This app has transformed how I manage my small farm. Everything I need is right at my fingertips.',
        footer: '- John Smith, Farm Owner'
      }
    }
  ];

  return (
    <div className="case-study-container">
      <Navbar />
      <motion.div 
        className="case-study-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className='case-study-title'>Manage Small Farms</h1>
        <section className="case-study-hero">
          {/* <img className="cover-image" src="../../images/Project Cover Photos/JD thumbnail photo 2.svg" alt="Manage Small Farms" /> */}
          <div className="bento-grid-container">
            <BentoGrid items={introBentoItems} />            
          </div>
        </section>

        <section className="case-study-overview">
          <h2>Overview</h2>
          <p>An operations management app designed to better serve small farm owners, focusing on usability and scalability for non-technical users.</p>
        </section>

        <section className="business-challenge">
          <h2>1. Business Challenge</h2>
          <div className="challenge-grid">
            <div className="challenge-item">
              <h3>Market Context</h3>
              <p>While John Deere’s Operations Center Mobile (OCM) app catered to large-scale farms, small farm owners found it overly complex and not aligned with their specific needs.</p>
            </div>
            <div className="challenge-item">
              <h3>Revenue Impact</h3>
              <p>Low app adoption among small farm owners meant missed opportunities for increased brand loyalty and equipment sales.</p>
            </div>
            <div className="challenge-item">
              <h3>User Pain Points</h3>
              <p>
                <li>Overwhelming interface with features irrelevant to small-scale operations.</li>
                <li>Difficulty managing tasks like equipment tracking, crop planning, and operational logs.</li>
                <li>Lack of accessible tutorials and support for first-time users.</li></p>
            </div>
            <div className="challenge-item">
              <h3>Cost of Problems</h3>
              <p>Frustrated users either abandoned the app or sought alternative tools, creating a gap in customer retention for John Deere in this growing demographic.</p>
            </div>
          </div>
        </section>

        <section className="strategic-approach">
          <h2>2. Strategic Approach</h2>
          <div className="approach-grid">
            <div className="approach-item">
              <h3>Research Insights</h3>
              <p>
                <li>Conducted user interviews with 15 small farm owners; 80% cited a need for simplified navigation and task-specific workflows.</li>
                <li>Identified high-priority features like weather tracking, equipment maintenance logs, and crop scheduling as critical to users.</li>
                <li>Usability testing revealed confusion caused by unnecessary features, leading to app abandonment.</li>
              </p>
            </div>
            <div className="approach-item">
              <h3>Solution Framework</h3>
              <p>
                <li>Streamlined the interface to highlight only essential features for small farms.</li>
                <li>Introduced customizable dashboards for task prioritization and visibility.</li>
                <li>Added interactive tutorials to onboard first-time users effectively.</li></p>
            </div>
            <div className="approach-item">
              <h3>Decision Criteria</h3>
              <BentoGrid items={bentoItems} />
            </div>
            <div className="approach-item">
              <h3>Implementation Plan</h3>
              <p>[Implementation plan content]</p>
            </div>
          </div>
        </section>

        <section className="measurable-results">
          <h2>3. Measurable Results</h2>
          <div className="results-grid">
            <div className="results-item">
              <h3>Revenue Increase</h3>
              <p>[Revenue increase content]</p>
            </div>
            <div className="results-item">
              <h3>User Metrics</h3>
              <p>[User metrics content]</p>
            </div>
            <div className="results-item">
              <h3>Performance Data</h3>
              <p>[Performance data content]</p>
            </div>
            <div className="results-item">
              <h3>Client Testimonials</h3>
              <p>[Client testimonials content]</p>
            </div>
          </div>
        </section>

        <section className="visual-evolution">
          <h2>4. Visual Evolution</h2>
          <div className="evolution-grid">
            <div className="evolution-item">
              <h3>Before & After</h3>
              <div className="before-after-container">
                <div className="before">
                  <h4>Before</h4>
                  <img src="[before-image-path]" alt="Before" />
                </div>
                <div className="after">
                  <h4>After</h4>
                  <img src="[after-image-path]" alt="After" />
                </div>
              </div>
            </div>
            <div className="evolution-item">
              <h3>Key Iterations</h3>
              <p>[Key iterations content]</p>
            </div>
            <div className="evolution-item">
              <h3>Decision Points</h3>
              <p>[Decision points content]</p>
            </div>
            <div className="evolution-item">
              <h3>Final Solution</h3>
              <p>[Final solution content]</p>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}