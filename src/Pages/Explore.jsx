import React, { useState, useEffect } from 'react';
import ExploreExperiments from '../components/ExploreExperiments';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import FeaturedShowcase from '../components/FeaturedShowcase';
import { motion } from 'framer-motion';
import '../style/explore.css';

export default function Explore() {
    const [pageLoading, setPageLoading] = useState(true);
    
    useEffect(() => {
        // Simulate page load - you can adjust this time as needed
        const loadTimer = setTimeout(() => {
            setPageLoading(false);
        }, 800);
        
        return () => clearTimeout(loadTimer);
    }, []);
    
    return (
        <div className="explore-page">
            <Navbar />
            
            {/* Page loading animation */}
            <motion.div 
                className="page-loader"
                initial={{ opacity: 1 }}
                animate={{ opacity: pageLoading ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: pageLoading ? 'flex' : 'none' }}
            >
                <div className="page-loader-content">
                    <div className="page-spinner"></div>
                    <h2>Loading the Explore Experience</h2>
                </div>
            </motion.div>
            
            <motion.div 
                className="explore-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: pageLoading ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <FeaturedShowcase />
                <ExploreExperiments />
            </motion.div>
            
            <Contact />
        </div>
    );
} 