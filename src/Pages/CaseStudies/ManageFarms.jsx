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
        <h1>Manage Small Farms</h1>
        <section className="case-study-hero">
          <img src="../../images/Project Cover Photos/JD thumbnail photo 2.svg" alt="Manage Small Farms" />
        </section>
        <section className="case-study-overview">
          <h2>Overview</h2>
          <p>An operations management app designed to better serve small farm owners, focusing on usability and scalability for non-technical users.</p>
        </section>
        {/* Add more sections as needed */}
      </motion.div>
    </div>
  );
}