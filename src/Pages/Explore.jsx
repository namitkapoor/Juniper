import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Contact from '../components/sections/Contact';
import ExploreHero from '../components/sections/ExploreHero';
import EditorialExploreGrid from '../components/sections/EditorialExploreGrid';
import { BlobProvider } from '../contexts/BlobContext';
import { projects } from '../data/projectsData';
import '../style/explore.css';

const ExploreChat = lazy(() => import('../components/sections/ExploreChat'));

const AURA = projects.find(p => p.isBlob);

export default function Explore() {
    const [pageLoading,     setPageLoading]     = useState(true);
    const [panelOpen,       setPanelOpen]       = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [hoveredProject,  setHoveredProject]  = useState(null);
    const gridAnchor = useRef(null);

    // Panel content: hover preview > locked selection > Aura default
    const displayProject = hoveredProject ?? selectedProject ?? AURA;

    useEffect(() => {
        const t = setTimeout(() => setPageLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    // Scroll drives panel open/close
    useEffect(() => {
        let rafId = null;
        const OPEN_THRESHOLD  = window.innerHeight * 0.6;
        const CLOSE_THRESHOLD = window.innerHeight * 0.9;

        const handleScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                const gridTop = gridAnchor.current?.getBoundingClientRect().top ?? Infinity;
                if (gridTop < OPEN_THRESHOLD) {
                    setPanelOpen(true);
                } else if (gridTop > CLOSE_THRESHOLD) {
                    setPanelOpen(false);
                }
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // Reset selection when panel closes
    useEffect(() => {
        if (!panelOpen) setSelectedProject(null);
    }, [panelOpen]);

    // "Let it hear you" — scroll to grid, panel opens via scroll handler
    const openAura = useCallback(() => {
        gridAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    // Click a card to lock it; clicking locked card returns to Aura default
    const handleSelect = useCallback((project) => {
        if (project.isBlob) {
            setSelectedProject(null);
            return;
        }
        setSelectedProject(prev => prev?.title === project.title ? null : project);
    }, []);

    return (
        <BlobProvider>
            <div className="explore-page">
                <Navbar />

                <motion.div
                    className="page-loader"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: pageLoading ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: pageLoading ? 'flex' : 'none' }}
                >
                    <div className="page-loader-content">
                        <div className="page-spinner" />
                        <h2>Loading</h2>
                    </div>
                </motion.div>

                <motion.div
                    className="explore-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: pageLoading ? 0 : 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Hero — sticky behind the scrolling grid */}
                    <div className="explore-sticky-nk26">
                        <ExploreHero onPlayNow={openAura} blobActive={!panelOpen} />
                    </div>

                    {/* Grid scrolls over the sticky hero */}
                    <div ref={gridAnchor} className="explore-grid-anchor-nk26">
                        <EditorialExploreGrid
                            selectedProject={selectedProject}
                            panelOpen={panelOpen}
                            onSelect={handleSelect}
                            onHover={p => panelOpen && setHoveredProject(p)}
                            onHoverEnd={() => setHoveredProject(null)}
                        />
                    </div>
                </motion.div>

                <Contact />

                {/* Chat panel — fixed, slides in when grid is in view */}
                <AnimatePresence>
                    {panelOpen && (
                        <motion.div
                            className="explore-chat-panel-nk26"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Suspense fallback={null}>
                                <ExploreChat
                                    project={displayProject}
                                    onClose={() => setSelectedProject(null)}
                                />
                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </BlobProvider>
    );
}
