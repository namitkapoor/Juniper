import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectBentoGrid from './ProjectBentoGrid';
import { projects, categories } from '../data/projectsData';
import { projectBentoData } from '../data/projectBentoData';
import '../style/voidExperiments.css';
import ModelViewer from './ModelViewer';

export default function VoidExperiments() {
    const [activeCategories, setActiveCategories] = useState(new Set());
    const [expandedProject, setExpandedProject] = useState(null);

    // Toggle category filter
    const toggleCategory = (category) => {
        setActiveCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // Handle project expansion
    const handleProjectExpand = (projectTitle) => {
        setExpandedProject(expandedProject === projectTitle ? null : projectTitle);
    };

    const sortProjects = (projectsToSort) => {
        if (activeCategories.size === 0) return projectsToSort;
        
        return [...projectsToSort].sort((a, b) => {
            const aMatches = a.categories.filter(cat => activeCategories.has(cat)).length;
            const bMatches = b.categories.filter(cat => activeCategories.has(cat)).length;
            
            if (aMatches !== bMatches) {
                return bMatches - aMatches;
            }
            return 0;
        });
    };

    return (
        <section className="void-experiments-section">
            <div className="void-experiments-header">
                <h2 className="void-experiments-title">Experiments & Projects</h2>
                <p className="void-experiments-subtitle">
                    A collection of creative explorations in interactive design, 3D, and motion
                </p>
            </div>
            
            <div className="void-categories-container">
                <div className="void-categories-buttons">
                    {Object.entries(categories).map(([key, { name, color }]) => (
                        <motion.button
                            key={key}
                            className={`void-category-button ${activeCategories.has(key) ? 'active' : ''}`}
                            onClick={() => toggleCategory(key)}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                '--category-color': color,
                                '--blend-opacity': activeCategories.has(key) ? '1' : '0.3'
                            }}
                        >
                            {name}
                        </motion.button>
                    ))}
                </div>
            </div>

            <motion.div className="void-projects-grid" layout>
                <AnimatePresence>
                    {sortProjects(projects).map((project) => (
                        <motion.div
                            key={project.title}
                            className={`void-project-card ${expandedProject === project.title ? 'expanded' : ''}`}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: project.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.3,
                                scale: project.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.95
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="void-project-content">
                                <div className="void-project-categories">
                                    {project.categories.map(cat => (
                                        <span 
                                            key={cat} 
                                            className="void-category-tag"
                                            style={{ '--category-color': categories[cat].color }}
                                        >
                                            {categories[cat].name}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="void-project-title">{project.title}</h3>
                                <div className="void-project-image-container">
                                    <ModelViewer 
                                        modelPath={project.model}
                                        imagePath={project.image}
                                        title={project.title}
                                    />
                                </div>
                                <p className="void-project-description">{project.description}</p>
                            </div>
                            
                            {projectBentoData[project.title] && (
                                <motion.button
                                    className="void-expand-button"
                                    onClick={() => handleProjectExpand(project.title)}
                                    animate={{ rotate: expandedProject === project.title ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="void-expand-icon">▼</span>
                                </motion.button>
                            )}

                            <AnimatePresence>
                                {expandedProject === project.title && projectBentoData[project.title] && (
                                    <motion.div
                                        className="void-project-bento-container"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <ProjectBentoGrid items={projectBentoData[project.title].bentoItems} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}