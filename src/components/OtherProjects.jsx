import { motion } from 'framer-motion';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useState } from 'react';
import '../style/other-projects.css';

export default function OtherProjects({ currentProjectId }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine all case studies into a single array
  const allProjects = [...caseStudies.ux, ...caseStudies.xr]
    .filter(project => project.id !== currentProjectId);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % allProjects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  const ProjectCard = ({ project }) => (
    <motion.div 
      className="case-study-card"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/case-study/${project.id}`)}
    >
      <div className="card-header">
        <h3>{project.title}</h3>
      </div>

      <div className="case-study-tags">
        {project.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <img 
        className="case-study-image" 
        src={project.image} 
        alt={project.title} 
      />
      
      <Button 
        className='case-study-button'
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/case-study/${project.id}`);
        }}
      >
        Learn More
      </Button>
    </motion.div>
  );

  return (
    <section className="other-projects">
        <h2>Other Projects</h2>
      <div className="carousel-container">
        <button 
          className="carousel-button prev"
          onClick={prevProject}
          aria-label="Previous project"
        >
          <IoChevronBack />
        </button>

        <motion.div 
          className="carousel-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={currentIndex}
        >
          <ProjectCard project={allProjects[currentIndex]} />
        </motion.div>

        <button 
          className="carousel-button next"
          onClick={nextProject}
          aria-label="Next project"
        >
          <IoChevronForward />
        </button>
      </div>

      <div className="carousel-indicators">
        {allProjects.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
} 