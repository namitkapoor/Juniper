import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectBentoGrid from './ProjectBentoGrid';
import { projects, categories } from '../data/projectsData';
import { projectBentoData } from '../data/projectBentoData';
import '../style/experiments.css';
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause } from 'react-icons/fa';

export default function VoidExperiments() {
    const [activeCategories, setActiveCategories] = useState(new Set());
    const [expandedProject, setExpandedProject] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const videoRef = useRef(null);

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

    // Toggle mute state for the showcase video
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };
    
    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            
            // If volume is set to 0, mute the video
            if (newVolume === 0) {
                videoRef.current.muted = true;
                setIsMuted(true);
            } else if (isMuted) {
                // If video was muted but volume is now > 0, unmute
                videoRef.current.muted = false;
                setIsMuted(false);
            }
        }
    };
    
    // Toggle volume slider visibility
    const toggleVolumeSlider = () => {
        setShowVolumeSlider(prev => !prev);
    };

    // Toggle play/pause
    const togglePlayPause = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log("Play/Pause clicked"); // Debugging
        
        if (videoRef.current) {
            if (videoRef.current.paused) {
                console.log("Playing video");
                const playPromise = videoRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            console.log("Video played successfully");
                        })
                        .catch(error => {
                            console.error("Play error:", error);
                        });
                }
            } else {
                console.log("Pausing video");
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };
    
    // Update isPlaying state when video plays or pauses
    useEffect(() => {
        const videoElement = videoRef.current;
        
        if (videoElement) {
            const handlePlay = () => {
                console.log("Play event detected");
                setIsPlaying(true);
            };
            
            const handlePause = () => {
                console.log("Pause event detected");
                setIsPlaying(false);
            };
            
            videoElement.addEventListener('play', handlePlay);
            videoElement.addEventListener('pause', handlePause);
            
            return () => {
                videoElement.removeEventListener('play', handlePlay);
                videoElement.removeEventListener('pause', handlePause);
            };
        }
    }, []);

    // Make sure all bento grid videos have audio enabled
    const setupBentoVideos = () => {
        // This will be called when bento grid expands
        const bentoVideos = document.querySelectorAll('.bento-item video');
        bentoVideos.forEach(video => {
            // Enable audio but start muted
            video.muted = true;
            
            // Create mute toggle for each video if it doesn't exist
            if (!video.parentNode.querySelector('.video-mute-toggle')) {
                const muteBtn = document.createElement('button');
                muteBtn.className = 'video-mute-toggle';
                muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
                muteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    video.muted = !video.muted;
                    muteBtn.innerHTML = video.muted ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>' : 
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" /></svg>';
                });
                video.parentNode.appendChild(muteBtn);
            }
        });
    };

    // Handle project expansion - setup videos when expanded
    const handleProjectExpand = (projectTitle) => {
        const newExpandedProject = expandedProject === projectTitle ? null : projectTitle;
        setExpandedProject(newExpandedProject);
        
        // Setup video controls after expansion
        if (newExpandedProject) {
            setTimeout(setupBentoVideos, 500); // Wait for animation to complete
        }
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
        <section className="experiments-section">
            <h2 className='experiments-title'>Innovation Portfolio</h2>
            
            {/* Featured Video Showcase */}
            <div className="featured-video-container">
                <video 
                    ref={videoRef}
                    className="featured-video"
                    src="./videos/Experiments/Portfolio Reel/Portfolio Reel - 3D.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    onError={(e) => console.error("Video error:", e)}
                    onLoadedData={() => console.log("Video loaded successfully")}
                >
                    Your browser does not support the video tag.
                </video>
                
                {/* Separate play/pause button with its own click handler */}
                <button 
                    className="video-play-button"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                
                <div className="video-controls" onClick={e => e.stopPropagation()}>
                    <button 
                        className="video-mute-toggle" 
                        onClick={toggleMute}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                    >
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    
                    <div 
                        className={`volume-slider-container ${showVolumeSlider ? 'visible' : ''}`}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                    </div>
                </div>
            </div>

            <div className="categories-container">
                <div className="categories-buttons">
                    {Object.entries(categories).map(([key, { name, color }]) => (
                        <motion.button
                            key={key}
                            className={`category-button ${activeCategories.has(key) ? 'active' : ''}`}
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

            <motion.div className="projects-grid" layout>
                <AnimatePresence>
                    {sortProjects(projects).map((project) => (
                        <motion.div
                            key={project.title}
                            className={`project-card ${expandedProject === project.title ? 'expanded' : ''}`}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                                opacity: project.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.3,
                                scale: project.categories.some(cat => activeCategories.has(cat)) || activeCategories.size === 0 ? 1 : 0.95
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="project-categories">
                                {project.categories.map(cat => (
                                    <span 
                                        key={cat} 
                                        className="category-tag"
                                        style={{ '--category-color': categories[cat].color }}
                                    >
                                        {categories[cat].name}
                                    </span>
                                ))}
                            </div>
                            <h3>{project.title}</h3>
                            <div className="project-image-container">
                                <img 
                                    src={project.image} 
                                    alt={project.title}
                                    className="project-image"
                                />
                            </div>
                            <p>{project.description}</p>
                            
                            {projectBentoData[project.title] && (
                                <motion.button
                                    className="expand-button"
                                    onClick={() => handleProjectExpand(project.title)}
                                    animate={{ rotate: expandedProject === project.title ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="expand-icon">▼</span>
                                </motion.button>
                            )}

                            <AnimatePresence>
                                {expandedProject === project.title && projectBentoData[project.title] && (
                                    <motion.div
                                        className="project-bento-container"
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