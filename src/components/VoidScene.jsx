import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import VoidExperiments from './VoidExperiments';
import FeaturedShowcase from './FeaturedShowcase';

export default function VoidScene() {
    return (
        <div className="void-page">
            {/* Background Canvas */}
            <div className="void-background">
                <Canvas style={{ background: 'black' }}>
                    <Stars
                        radius={300}
                        depth={50}
                        count={3000}
                        factor={4}
                        saturation={0.5}
                        fade={true}
                        speed={0.3}
                    />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={0.1}
                    />
                </Canvas>
            </div>

            {/* Main Content */}
            <div className="void-content">
                <FeaturedShowcase />
                <VoidExperiments />
            </div>
        </div>
    );
} 