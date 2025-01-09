// HomePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import Experience from '../components/Experience.jsx';
import HeroModel from '../components/HeroModel.jsx';
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import "../style/home.css";
import { IoLockClosed, IoArrowForward } from 'react-icons/io5';
import Experiments from '../components/Experiments';

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
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Manage Small Farms</h3>
              
              <div className="case-study-meta">
                <span>60% Less Time Spent</span>
              </div>

              <div className="case-study-tags">
                <span className="tag">Mobile Design</span>
                <span className="tag">Research</span>
                <span className="tag">Application</span>
              </div>

              <img 
                className="case-study-image" 
                src="../images/Project Cover Photos/JD thumbnail photo 2.svg" 
                alt="Manage Small Farms" 
              />
              
              <p>Simplified an operations management app to better serve small farm owners, focusing on usability and scalability for non-technical users.</p>
              
              <div className="button-container">
                <Button 
                  className='case-study-button'
                  onClick={() => navigate('/case-study/manage-farms')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Hire Influencer Marketing</h3>
              
              <div className="case-study-meta">
                <span>40% Increase in Engagement</span>
              </div>

              <div className="case-study-tags">
                <span className="tag">Web Design</span>
                <span className="tag">B2B</span>
                <span className="tag">Dashboard</span>
              </div>

              <img 
                className="case-study-image" 
                src="../images/Project Cover Photos/Campaign Page.svg" 
                alt="Influencer Marketing" 
              />
              
              <p>Redesigned a web app to simplify influencer hiring and campaign tracking, boosting user engagement by reducing workflow friction for small business owners.</p>
              
              <div className="button-container">
                <Button 
                  className='case-study-button'
                  onClick={() => navigate('/case-study/influencer-marketing')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="case-study-card locked"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Personalize Skin Care</h3>
              
              <div className="case-study-meta">
                <span>2000+ Site Visitors</span>
              </div>

              <div className="case-study-tags">
                <span className="tag">Web Design</span>
                <span className="tag">E-commerce</span>
                <span className="tag">AI/ML</span>
              </div>

              <img 
                className="case-study-image" 
                src="../images/Project Cover Photos/Home Page.svg" 
                alt="Skincare Platform" 
              />
              
              <IoLockClosed className="lock-icon" />
              
              <p>Developed a chatbot-driven skincare recommendation platform, integrating computer vision to provide personalized product suggestions.</p>
              
              <div className="button-container">
                <Button className='case-study-button' disabled>
                  Coming Soon
                  <IoArrowForward className="button-icon" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {activeProjectType === 'xr' && (
          <div className="case-studies-grid">
            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Contextualize Task Reminders</h3>
              
              <div className="case-study-meta">
                <span>10% Increase in Task Completion</span>
              </div>

              <div className="case-study-tags">
                <span className="tag">AR/VR</span>
                <span className="tag">Mobile Design</span>
                <span className="tag">Productivity</span>
              </div>

              <img 
                className="case-study-image" 
                src="../images/Project Cover Photos/Anywhere Access Luminote gif.gif" 
                alt="AR Task Reminders" 
              />
              
              <p>Created an AR-based task management system combining spatial reminders with adaptive organizational structures to reduce cognitive load.</p>
              
              <div className="button-container">
                <Button 
                  className='case-study-button'
                  onClick={() => navigate('/case-study/task-reminders')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="case-study-card"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Incentivize Sustainable Packaging</h3>
              
              <div className="case-study-meta">
                <span>30% More Eco-Friendly Choices</span>
              </div>

              <div className="case-study-tags">
                <span className="tag">AR/VR</span>
                <span className="tag">Sustainability</span>
                <span className="tag">Retail</span>
              </div>

              <img 
                className="case-study-image" 
                src="../images/Project Cover Photos/SUSpointpopup-cropped.gif" 
                alt="AR Packaging" 
              />
              
              <p>Designed an AR app to promote sustainable shopping by evaluating product packaging and incentivizing eco-conscious purchases with rewards.</p>
              
              <div className="button-container">
                <Button 
                  className='case-study-button'
                  onClick={() => navigate('/case-study/sustainable-packaging')}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Extra Work Section */}
      <Experiments />

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

