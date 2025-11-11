import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useState, useMemo, useEffect } from 'react';
import '../style/other-projects.css';

export default function OtherProjects({ currentProjectId }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter projects: exclude current project, coming soon, and disabled projects
  const allProjects = useMemo(() => {
    return [...caseStudies.ux, ...caseStudies.xr]
      .filter(project => 
        project.id !== currentProjectId &&
        !project.comingSoon &&
        project.enabled !== false
      );
  }, [currentProjectId]);

  // Reset index when projects change or if current index is out of bounds
  useEffect(() => {
    if (currentIndex >= allProjects.length && allProjects.length > 0) {
      setCurrentIndex(0);
    }
  }, [allProjects.length, currentIndex]);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % allProjects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  const ProjectCard = ({ project }) => (
    <div 
      className="case-study-card"
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
    </div>
  );

  // Don't render if no projects available
  if (allProjects.length === 0) {
    return null;
  }

  const currentProject = allProjects[currentIndex];

  return (
    <section className="other-projects">
      <h2>Other Projects</h2>
      <div className="project-carousel-container">
        <button 
          className="project-carousel-button prev"
          onClick={prevProject}
          aria-label="Previous project"
          disabled={allProjects.length <= 1}
        >
          <IoChevronBack />
        </button>

        <div className="project-carousel-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={currentProject} />
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          className="project-carousel-button next"
          onClick={nextProject}
          aria-label="Next project"
          disabled={allProjects.length <= 1}
        >
          <IoChevronForward />
        </button>
      </div>

      {allProjects.length > 1 && (
        <div className="carousel-indicators">
          {allProjects.map((project, index) => (
            <button
              key={project.id}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
} 