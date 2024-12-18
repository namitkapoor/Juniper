// HomePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Experience from '../components/Experience.jsx';
import HeroModel from '../components/HeroModel.jsx';
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import Content from '../components/Content.jsx';
import Navbar from "../components/Navbar.jsx";
import "../style/home.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [activeProjectType, setActiveProjectType] = useState('ux');
  const navigate = useNavigate();



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
          <p className = 'occupation'>Experience Designer</p>
          <h1 className='display'>Namit Kapoor</h1>
          
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
        <h2>Case Studies</h2>
        <div className="toggle-container">
          <button 
            className={`toggle-button ${activeProjectType === 'ux' ? 'active' : ''}`}
            onClick={() => setActiveProjectType('ux')}
          >
            UX Design
          </button>
          <button 
            className={`toggle-button ${activeProjectType === 'xr' ? 'active' : ''}`}
            onClick={() => setActiveProjectType('xr')}
          >
            XR Design
          </button>
        </div>

        {activeProjectType === 'ux' && (
          <div className="case-studies-grid">
            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Manage Small Farms</h3>
              <img className="case-study-image" src="../images/Project Cover Photos/JD thumbnail photo 2.svg" alt="Manage Small Farms" />
              <p>Simplified an operations management app to better serve small farm owners, focusing on usability and scalability for non-technical users.</p>
              <Button className='case-study-button'onClick={() => navigate('/case-study/manage-farms')} >Learn More</Button>
            </motion.div>
            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Hire Influencer Marketing</h3>
              <img className="case-study-image" src="../images/Project Cover Photos/Campaign Page.svg" alt="Influencer Marketing" />
              <p>Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.</p>
              <Button className='case-study-button'>Learn More</Button>
            </motion.div>
            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Personalize Skin care</h3>
              <img className="case-study-image" src="../images/Project Cover Photos/Home Page.svg" alt="Skincare Platform" />
              <p>Developed a chatbot-driven skincare recommendation platform, integrating computer vision to provide personalized product suggestions.</p>
              <Button className='case-study-button'>Learn More</Button>
            </motion.div>
          </div>
        )}

        {activeProjectType === 'xr' && (
          <div className="case-studies-grid">
            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Contextualize task reminders</h3>
              <img className="case-study-image" src="../images/Project Cover Photos/Anywhere Access Luminote gif.gif" alt="AR Task Reminders" />
              <p>Created an AR-based task management system combining spatial reminders with adaptive organizational structures to reduce cognitive load.</p>
              <Button className='case-study-button'>Learn More</Button>
            </motion.div>
            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3>Incentivize sustainable packaging</h3>
              <img className="case-study-image" src="../images/Project Cover Photos/SUSpointpopup-cropped.gif" alt="AR Packaging" />
              <p>Designed an AR app to promote sustainable shopping by evaluating product packaging and incentivizing eco-conscious purchases with rewards.</p>
              <Button className='case-study-button'>Learn More</Button>
            </motion.div>
          </div>
        )}
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

