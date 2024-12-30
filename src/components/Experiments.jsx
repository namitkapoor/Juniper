import React from 'react';
import { motion } from 'framer-motion';
import '../style/experiments.css';

export default function Experiments() {
  const workProjects = [
    {
      title: "Project 1",
      description: "Brief description",
      tags: ["UI/UX", "Web"],
      image: "/path-to-image.jpg",  // We'll add images later
    },
    // We can add more projects later
  ];

  return (
    <section className="work-section">
      <h2>Experiments</h2>
      <div className="work-grid">
        {workProjects.map((project, index) => (
          <motion.div 
            key={index}
            className="work-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="work-tags">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="work-tag">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
