import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { caseStudies } from '../../data/caseStudies';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useTransition } from '../../contexts/TransitionContext';
import '../../style/other-projects.css';
import '../../style/button.css';

// Case study page imports for preloading
const caseStudyImports = {
  'christine-valmy': () => import('../../Pages/CaseStudies/ChristineValmy.jsx'),
  'manage-farms': () => import('../../Pages/CaseStudies/ManageFarms.jsx'),
  'influencer-marketing': () => import('../../Pages/CaseStudies/InfluencerMarketing.jsx'),
  'task-reminders': () => import('../../Pages/CaseStudies/TaskReminders.jsx'),
  'sustainable-packaging': () => import('../../Pages/CaseStudies/SustainablePackaging.jsx'),
};

export default function OtherProjects({ currentProjectId }) {
  const navigate = useNavigate();
  const { startTransition } = useTransition();
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

  // Preload the currently visible project
  useEffect(() => {
    if (allProjects.length > 0) {
      const currentProject = allProjects[currentIndex];
      if (currentProject && caseStudyImports[currentProject.id]) {
        caseStudyImports[currentProject.id]();
      }
    }
  }, [currentIndex, allProjects]);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % allProjects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  // Track which projects have been preloaded
  const preloadedProjects = useRef(new Set());

  const handleCardClick = useCallback((e, project) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    startTransition({
      path: `/case-study/${project.id}`,
      videoSrc: null,
      originX: x,
      originY: y,
    });
  }, [startTransition]);

  const handleCardHover = useCallback((project) => {
    // Preload the case study page on hover
    if (!preloadedProjects.current.has(project.id) && caseStudyImports[project.id]) {
      preloadedProjects.current.add(project.id);
      caseStudyImports[project.id]();
    }
  }, []);

  const ProjectCard = ({ project }) => (
    <div
      className="case-study-card"
      onClick={(e) => handleCardClick(e, project)}
      onMouseEnter={() => handleCardHover(project)}
      style={{ cursor: 'pointer' }}
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
          const rect = e.currentTarget.closest('.case-study-card')?.getBoundingClientRect();
          const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
          const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

          startTransition({
            path: `/case-study/${project.id}`,
            videoSrc: null,
            originX: x,
            originY: y,
          });
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