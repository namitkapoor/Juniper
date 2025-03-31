import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, PerspectiveCamera, Environment } from '@react-three/drei';
// import { useControls } from 'leva';

function Model({ url, title }) {
    console.log('Attempting to load model from URL:', url);
    const modelRef = useRef();
    const timeRef = useRef(0);
    
    // Default values instead of Leva controls
    const defaultControls = {
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
            if (modelRef.current && defaultControls.wiggleEnabled) {
                timeRef.current += delta * defaultControls.wiggleSpeed;
                const wiggle = Math.sin(timeRef.current) * defaultControls.wiggleAmount;
                modelRef.current.rotation.y = defaultControls.rotationY + wiggle;
                modelRef.current.rotation.x = defaultControls.rotationX + (Math.sin(timeRef.current * 0.5) * defaultControls.wiggleAmount * 0.3);
            }
        });

        return (
            <Center>
                <primitive 
                    ref={modelRef}
                    object={scene} 
                    scale={defaultControls.scale}
                    position={[defaultControls.positionX, defaultControls.positionY, defaultControls.positionZ]}
                    rotation={[defaultControls.rotationX, defaultControls.rotationY, defaultControls.rotationZ]}
                />
            </Center>
        );
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

export default function ModelViewer({ modelPath, imagePath, title }) {
    const [modelError, setModelError] = useState(false);
    
    // Default camera values instead of Leva controls
    const defaultCamera = {
        position: { x: 0.0, y: 11.6, z: 7.2 },
        fov: 45
    };

    // Default environment values
    const defaultEnv = {
        preset: 'apartment',
        intensity: 1.0
    };

    // Default lighting values
    const defaultLighting = {
        ambientIntensity: 0.0,
        keyLightIntensity: 1.8,
        keyLightColor: '#ffa32a',
        keyLightPosition: { x: 5.0, y: 5.0, z: 5.0 },
        fillLightIntensity: 1.9,
        fillLightColor: '#e0f2fe',
        fillLightPosition: { x: -23.5, y: -19.5, z: -8.1 },
        topLightIntensity: 4.0,
        topLightColor: '#ffffff',
        topLightAngle: 0.6,
        topLightPenumbra: 1.0,
        groundIntensity: 1.5,
        groundColor: '#d1d5db',
        rimLightIntensity: 2.0,
        rimLightColor: '#818cf8',
        rimLightPosition: { x: -10.0, y: 0.0, z: -10.0 }
    };

    if (!modelPath || modelError) {
        console.log('Falling back to image:', imagePath);
        return (
            <img 
                src={imagePath} 
                alt={title}
                className="void-project-image"
            />
        );
    }

    return (
        <div style={{ width: '100%', height: '300px', position: 'relative' }}>
            <Canvas
                style={{ background: 'transparent' }}
                onError={(error) => {
                    console.error('Canvas error occurred:', error);
                    setModelError(true);
                }}
            >
                <PerspectiveCamera 
                    makeDefault 
                    position={[defaultCamera.position.x, defaultCamera.position.y, defaultCamera.position.z]} 
                    fov={defaultCamera.fov}
                />
                
                <Environment 
                    preset={defaultEnv.preset}
                    background={false}
                    intensity={defaultEnv.intensity}
                />

                <ambientLight intensity={defaultLighting.ambientIntensity} />
                
                <directionalLight 
                    position={[defaultLighting.keyLightPosition.x, defaultLighting.keyLightPosition.y, defaultLighting.keyLightPosition.z]} 
                    intensity={defaultLighting.keyLightIntensity}
                    color={defaultLighting.keyLightColor}
                />
                
                <directionalLight 
                    position={[defaultLighting.fillLightPosition.x, defaultLighting.fillLightPosition.y, defaultLighting.fillLightPosition.z]} 
                    intensity={defaultLighting.fillLightIntensity}
                    color={defaultLighting.fillLightColor}
                />
                
                <spotLight
                    position={[0, 10, 0]}
                    angle={defaultLighting.topLightAngle}
                    penumbra={defaultLighting.topLightPenumbra}
                    intensity={defaultLighting.topLightIntensity}
                    color={defaultLighting.topLightColor}
                />
                
                <hemisphereLight
                    skyColor="#ffffff"
                    groundColor={defaultLighting.groundColor}
                    intensity={defaultLighting.groundIntensity}
                />
                
                <pointLight
                    position={[defaultLighting.rimLightPosition.x, defaultLighting.rimLightPosition.y, defaultLighting.rimLightPosition.z]}
                    intensity={defaultLighting.rimLightIntensity}
                    color={defaultLighting.rimLightColor}
                />

                <Suspense fallback={null}>
                    <Model 
                        url={modelPath}
                        title={title}
                        onError={(error) => {
                            console.error('Model loading error:', error);
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