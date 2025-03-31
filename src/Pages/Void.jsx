import React from 'react';
// import VoidExperiments from '../components/VoidExperiments';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
// import FeaturedShowcase from '../components/FeaturedShowcase';
import VoidScene from '../components/VoidScene';
import '../style/void.css';

export default function Void() {
    return (
        <div className="void-page">
            <Navbar />
            <VoidScene />
            {/* <FeaturedShowcase /> */}
            {/* <VoidExperiments /> */}
            <Contact />
        </div>
    );
} 