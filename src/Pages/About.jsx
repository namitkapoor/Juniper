// About.jsx
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import AboutContent from '../components/AboutContent';
import Navbar from '../components/Navbar';
import Experience from '../components/Experience';
import HeroModel from '../components/HeroModel';
import '../style/about.css';

export default function About() {
  return (
    <div className="page-container about">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="about-hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>About Me</h1>
          <p className="subtitle">Experience Designer & Creative Developer</p>
        </motion.div>
        <Canvas
          className="about-hero-canvas"
          camera={{
            fov: 45,
            near: 0.1,
            far: 2000,
            position: [0, 0, 2]
          }}
          gl={{ 
            antialias: true,
            alpha: true 
          }}
        >
          <Suspense fallback={null}>
            <HeroModel />
          </Suspense>
        </Canvas>
      </section>
      
            
      {/* Main Content */}
      <AboutContent />
      
      
    </div>
  );
}
