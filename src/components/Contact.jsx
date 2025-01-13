// src/components/Contact.jsx
import React from 'react';
import '../style/contact.css';
import { IoLogoLinkedin, IoLogoGithub, IoMailOutline, IoArrowForward, IoArrowUp, IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { useTheme } from './ThemeContext.jsx';

export default function Contact() {
  const { theme, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        <div className="contact-content">
          <div className="contact-left">
            <div className="contact-header">
              <h2>Contact</h2>
              <p className="contact-subtitle">Let's create something amazing together</p>
            </div>
            
            <div className="social-links">
              <a href="https://www.linkedin.com/in/namitkapoor/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <IoLogoLinkedin className="social-icon" />
              </a>
              <a href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <IoLogoGithub className="social-icon" />
              </a>
              <a href="mailto:namitkapoor26@gmail.com"
                className="social-link"
                aria-label="Email"
              >
                <IoMailOutline className="social-icon" />
              </a>
            </div>

            <div className="availability-status">
              <span className="status-dot"></span>
              <p>Available for hybrid roles</p>
              
            </div>
          </div>

          <div className="contact-right">
            <div className="case-study-links">
              <h3>Featured Work</h3>
              <div className="case-study-list">
                <a href="/case-study/manage-farms" className="case-study-link">
                  <span className="case-title">Manage Small Farms</span>
                  <IoArrowForward className="arrow-icon" />
                </a>
                <a href="/case-study/influencer-marketing" className="case-study-link">
                  <span className="case-title">Hire Influencer Marketing</span>
                  <IoArrowForward className="arrow-icon" />
                </a>
                <a href="/case-study/task-reminders" className="case-study-link">
                  <span className="case-title">Contextualize Task Reminders</span>
                  <IoArrowForward className="arrow-icon" />
                </a>
                <a href="/case-study/sustainable-packaging" className="case-study-link">
                  <span className="case-title">Incentivize Sustainable Packaging</span>
                  <IoArrowForward className="arrow-icon" />
                </a>                
              </div>
            </div>
          </div>
        </div>

        <div className="controls-container">
          <button 
            className="theme-toggle coming-soon"
            disabled
            aria-label="Theme toggle coming soon"
          >
            <span className="coming-soon-text">Coming Soon</span>
            <IoMoonOutline className="moon-icon" />
            <IoSunnyOutline className="sun-icon" />
          </button>
          <button 
            className="scroll-top" 
            onClick={scrollToTop} 
            aria-label="Scroll to top"
          >
            <IoArrowUp />
          </button>
        </div>

        <div className="footer">
          
          <p className="copyright">© 2024 Namit Kapoor. All Rights Reserved.</p>
          <p className="footer-note">Made with ❤️ and creativity.</p>
        </div>
      </div>
    </section>
  );
}