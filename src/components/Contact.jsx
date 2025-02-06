// src/components/Contact.jsx
import React from 'react';
import '../style/contact.css';
import { IoLogoLinkedin, IoLogoGithub, IoMailOutline, IoArrowForward, IoArrowUp, IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';
import { useTheme } from './ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="contact-section">
      <div className="contact-wrapper">
        <div className="contact-content">
          <div className="contact-left">
            <div className="contact-header">
              <h2>Next Steps</h2>
              <p className="contact-subtitle">Tell me about your team and vision.</p>
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
              <a href="https://github.com/namitkapoor" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <IoLogoGithub className="social-icon" />
              </a>
              <a href="mailto:namitkpr@gmail.com"
                className="social-link"
                aria-label="Email"
              >
                <IoMailOutline className="social-icon" />
              </a>
            </div>
          </div>

          <div className="contact-right">
            <div className="case-study-links">
              <h3>Featured Work</h3>
              <div className="case-study-list">
                <div 
                  className="case-study-link"
                  onClick={() => navigate('/case-study/manage-farms')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="case-title">Manage Small Farms</span>
                  <IoArrowForward className="arrow-icon" />
                </div>
                <div 
                  className="case-study-link"
                  onClick={() => navigate('/case-study/influencer-marketing')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="case-title">Hire Influencer Marketing</span>
                  <IoArrowForward className="arrow-icon" />
                </div>
                <div 
                  className="case-study-link"
                  onClick={() => navigate('/case-study/task-reminders')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="case-title">Contextualize Task Reminders</span>
                  <IoArrowForward className="arrow-icon" />
                </div>
                <div 
                  className="case-study-link"
                  onClick={() => navigate('/case-study/sustainable-packaging')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="case-title">Incentivize Sustainable Packaging</span>
                  <IoArrowForward className="arrow-icon" />
                </div>
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
          <p className="copyright">© 2025 Namit Kapoor. All Rights Reserved.</p>
          <p className="footer-note">Tuned to experiential wavelengths 💫</p>
        </div>
      </div>
    </section>
  );
}