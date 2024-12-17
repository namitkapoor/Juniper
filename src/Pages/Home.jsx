// HomePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Experience from '../components/Experience.jsx';
import HeroModel from '../components/HeroModel.jsx';
import { Button, Layout, Row, Col } from 'antd'
import Content from '../components/Content.jsx';
import Navbar from "../components/Navbar.jsx";
import "../style/home.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <div className="page-container">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hero-content"
        >
          <h1>Namit Kapoor</h1>
          <p>Experience Designer</p>
        </motion.div>
        <Canvas
          shadows
          className="hero-canvas"
          camera={{
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [0, 0, 2]
          }}
        >
          <Experience />
        </Canvas>
      </section>

      {/* Case Studies Section */}
      <section className="case-studies">
        <h2>Selected Work</h2>
        <div className="case-studies-grid">
          <motion.div 
            className="case-study-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3>Case Study 1</h3>
            <p>Brief description</p>
          </motion.div>
        </div>
      </section>

      {/* Extra Work Section */}
      <section className="extra-work">
        <h2>Experiments</h2>
        <div className="work-grid">
          <motion.div 
            className="project-card"
            whileHover={{ scale: 1.02 }}
          >
            <h3>Project 1</h3>
            <p>Brief description</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <Canvas
          className="contact-canvas"
          camera={{
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [0, 0, 2]
          }}
        >
          <HeroModel />
        </Canvas>
        <motion.div 
          className="contact-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2>Let's Connect</h2>
          <p>Get in touch for opportunities or collaborations</p>
          <Button>Connect</Button>
        </motion.div>
      </section>
    </div>
  );
}

