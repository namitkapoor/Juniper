// src/Pages/CaseStudies/ManageFarms.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar.jsx';
import '../../style/case-study.css';

export default function ManageFarms() {
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
          <img className="cover-image" src="../../images/Project Cover Photos/JD thumbnail photo 2.svg" alt="Manage Small Farms" />
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
              <p>[Market context content]</p>
            </div>
            <div className="challenge-item">
              <h3>Revenue Impact</h3>
              <p>[Revenue impact content]</p>
            </div>
            <div className="challenge-item">
              <h3>User Pain Points</h3>
              <p>[User pain points content]</p>
            </div>
            <div className="challenge-item">
              <h3>Cost of Problems</h3>
              <p>[Cost of problems content]</p>
            </div>
          </div>
        </section>

        <section className="strategic-approach">
          <h2>2. Strategic Approach</h2>
          <div className="approach-grid">
            <div className="approach-item">
              <h3>Research Insights</h3>
              <p>[Research insights content]</p>
            </div>
            <div className="approach-item">
              <h3>Solution Framework</h3>
              <p>[Solution framework content]</p>
            </div>
            <div className="approach-item">
              <h3>Decision Criteria</h3>
              <p>[Decision criteria content]</p>
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