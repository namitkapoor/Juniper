import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, PerspectiveCamera, Environment } from '@react-three/drei';

function Model({ url, title }) {
    const modelRef = useRef();
    const timeRef = useRef(0);
    
    // Replace Leva controls with fixed values
    const modelSettings = {
        scale: title === "Holiday Box" ? 0.3 : title === "Treatment Lotion" ? 1.9 : 2,
        wiggleEnabled: true,
        wiggleAmount: 0.10,
        wiggleSpeed: 1.0,
        rotationX: title === "Holiday Box" ? 0.49 : title === "Treatment Lotion" ? -1.60 : 0,
        rotationY: title === "Holiday Box" ? -0.34 : title === "Treatment Lotion" ? -1.60 : 0,
        rotationZ: title === "Holiday Box" ? -0.34 : title === "Treatment Lotion" ? -0.80 : 0,
        positionX: title === "Holiday Box" ? -1.9 : title === "Treatment Lotion" ? 3.1 : 0,
        positionY: title === "Holiday Box" ? 17.8 : title === "Treatment Lotion" ? 5.0 : 0,
        positionZ: title === "Holiday Box" ? 1.5 : title === "Treatment Lotion" ? 5.0 : 0
    };
    
    // Remove any leading dot from the path
    const cleanUrl = url.startsWith('.') ? url.substring(1) : url;
    const encodedUrl = cleanUrl.replace(/ /g, '%20');
    
    try {
        const { scene } = useGLTF(encodedUrl);
        
        // Gentle wiggle animation
        useFrame((state, delta) => {
            if (modelRef.current && modelSettings.wiggleEnabled) {
                // Increment time
                timeRef.current += delta * modelSettings.wiggleSpeed;
                
                // Create a smooth sine wave motion
                const wiggle = Math.sin(timeRef.current) * modelSettings.wiggleAmount;
                
                // Apply the wiggle to the model's rotation
                modelRef.current.rotation.y = modelSettings.rotationY + wiggle;
                
                // Add a subtle tilt for more organic motion
                modelRef.current.rotation.x = modelSettings.rotationX + (Math.sin(timeRef.current * 0.5) * modelSettings.wiggleAmount * 0.3);
            }
        });

        return (
            <Center>
                <primitive 
                    ref={modelRef}
                    object={scene} 
                    scale={modelSettings.scale}
                    position={[modelSettings.positionX, modelSettings.positionY, modelSettings.positionZ]}
                    rotation={[modelSettings.rotationX, modelSettings.rotationY, modelSettings.rotationZ]}
                />
            </Center>
        );
    } catch (error) {
        throw error;
    }
}

export default function ModelViewer({ modelPath, imagePath, title }) {
    const [modelError, setModelError] = useState(false);
    
    // Replace camera controls with fixed values
    const cameraSettings = {
        position: { x: 0.0, y: 11.6, z: 7.2 },
        fov: 45
    };

    // Replace environment controls with fixed values
    const environmentSettings = {
        preset: 'apartment',
        intensity: 1.0
    };

    // Replace lighting controls with fixed values
    const lightingSettings = {
        // Ambient Light
        ambientIntensity: 0.0,
        
        // Key Light (Warm)
        keyLightIntensity: 1.8,
        keyLightColor: '#ffa32a',
        keyLightPosition: { x: 5.0, y: 5.0, z: 5.0 },
        
        // Fill Light (Cool)
        fillLightIntensity: 1.9,
        fillLightColor: '#e0f2fe',
        fillLightPosition: { x: -23.5, y: -19.5, z: -8.1 },
        
        // Top Light
        topLightIntensity: 4.0,
        topLightColor: '#ffffff',
        topLightAngle: 0.6,
        topLightPenumbra: 1.0,
        
        // Ground Bounce
        groundIntensity: 1.5,
        groundColor: '#d1d5db',
        
        // Rim Light
        rimLightIntensity: 2.0,
        rimLightColor: '#818cf8',
        rimLightPosition: { x: -10.0, y: 0.0, z: -10.0 }
    };

    // If no model path is provided or there was an error loading the model, show the image
    if (!modelPath || modelError) {
        return (
            <img 
                src={imagePath} 
                alt={title}
                className="explore-project-image"
            />
        );
    }

    return (
        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
            <Canvas
                style={{ background: 'transparent' }}
                onError={() => {
                    setModelError(true);
                }}
            >
                <PerspectiveCamera 
                    makeDefault 
                    position={[cameraSettings.position.x, cameraSettings.position.y, cameraSettings.position.z]} 
                    fov={cameraSettings.fov}
                />
                
                <Environment 
                    preset={environmentSettings.preset}
                    background={false}
                    intensity={environmentSettings.intensity}
                />

                {/* Enhanced lighting setup with fixed values */}
                <ambientLight intensity={lightingSettings.ambientIntensity} />
                
                {/* Key light - warm */}
                <directionalLight 
                    position={[lightingSettings.keyLightPosition.x, lightingSettings.keyLightPosition.y, lightingSettings.keyLightPosition.z]} 
                    intensity={lightingSettings.keyLightIntensity}
                    color={lightingSettings.keyLightColor}
                />
                
                {/* Fill light - cool */}
                <directionalLight 
                    position={[lightingSettings.fillLightPosition.x, lightingSettings.fillLightPosition.y, lightingSettings.fillLightPosition.z]} 
                    intensity={lightingSettings.fillLightIntensity}
                    color={lightingSettings.fillLightColor}
                />
                
                {/* Top light */}
                <spotLight
                    position={[0, 10, 0]}
                    angle={lightingSettings.topLightAngle}
                    penumbra={lightingSettings.topLightPenumbra}
                    intensity={lightingSettings.topLightIntensity}
                    color={lightingSettings.topLightColor}
                />
                
                {/* Ground bounce light */}
                <hemisphereLight
                    skyColor="#ffffff"
                    groundColor={lightingSettings.groundColor}
                    intensity={lightingSettings.groundIntensity}
                />
                
                {/* Rim light */}
                <pointLight
                    position={[lightingSettings.rimLightPosition.x, lightingSettings.rimLightPosition.y, lightingSettings.rimLightPosition.z]}
                    intensity={lightingSettings.rimLightIntensity}
                    color={lightingSettings.rimLightColor}
                />

                <Suspense fallback={null}>
                    <Model 
                        url={modelPath}
                        title={title}
                        onError={() => {
                            setModelError(true);
                        }}
                    />
                </Suspense>
                <OrbitControls 
                    enableZoom={true}
                    maxDistance={20}
                    minDistance={2}
                    autoRotate={false}
                    autoRotateSpeed={2}
                />
            </Canvas>
        </div>
    );
} 