import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, PerspectiveCamera, Environment } from '@react-three/drei';
import { useControls } from 'leva';

function Model({ url, title }) {
    console.log('Attempting to load model from URL:', url);
    const modelRef = useRef();
    const timeRef = useRef(0);
    
    // Create Leva controls for this specific model
    const controls = useControls(title, {
        scale: { value: title === "Holiday Box" ? 0.3 : title === "Treatment Lotion" ? 1.9 : 2, min: 0.1, max: 20, step: 0.1 },
        wiggleEnabled: { value: true, label: "Gentle Wiggle" },
        wiggleAmount: { value: 0.10, min: 0, max: 0.5, step: 0.01, label: "Wiggle Amount" },
        wiggleSpeed: { value: 1.0, min: 0.1, max: 2, step: 0.1, label: "Wiggle Speed" },
        rotationX: { 
            value: title === "Holiday Box" ? 0.49 : title === "Treatment Lotion" ? -1.60 : 0, 
            min: -Math.PI, 
            max: Math.PI, 
            step: 0.01 
        },
        rotationY: { 
            value: title === "Holiday Box" ? -0.34 : title === "Treatment Lotion" ? -1.60 : 0, 
            min: -Math.PI, 
            max: Math.PI, 
            step: 0.01 
        },
        rotationZ: { 
            value: title === "Holiday Box" ? -0.34 : title === "Treatment Lotion" ? -0.80 : 0, 
            min: -Math.PI, 
            max: Math.PI, 
            step: 0.01 
        },
        positionX: { 
            value: title === "Holiday Box" ? -1.9 : title === "Treatment Lotion" ? 3.1 : 0, 
            min: -20, 
            max: 20, 
            step: 0.1 
        },
        positionY: { 
            value: title === "Holiday Box" ? 17.8 : title === "Treatment Lotion" ? 5.0 : 0, 
            min: -20, 
            max: 20, 
            step: 0.1 
        },
        positionZ: { 
            value: title === "Holiday Box" ? 1.5 : title === "Treatment Lotion" ? 5.0 : 0, 
            min: -20, 
            max: 20, 
            step: 0.1 
        }
    });
    
    // Remove any leading dot from the path
    const cleanUrl = url.startsWith('.') ? url.substring(1) : url;
    const encodedUrl = cleanUrl.replace(/ /g, '%20');
    
    try {
        const { scene } = useGLTF(encodedUrl);
        
        // Gentle wiggle animation
        useFrame((state, delta) => {
            if (modelRef.current && controls.wiggleEnabled) {
                // Increment time
                timeRef.current += delta * controls.wiggleSpeed;
                
                // Create a smooth sine wave motion
                const wiggle = Math.sin(timeRef.current) * controls.wiggleAmount;
                
                // Apply the wiggle to the model's rotation
                modelRef.current.rotation.y = controls.rotationY + wiggle;
                
                // Add a subtle tilt for more organic motion
                modelRef.current.rotation.x = controls.rotationX + (Math.sin(timeRef.current * 0.5) * controls.wiggleAmount * 0.3);
            }
        });

        return (
            <Center>
                <primitive 
                    ref={modelRef}
                    object={scene} 
                    scale={controls.scale}
                    position={[controls.positionX, controls.positionY, controls.positionZ]}
                    rotation={[controls.rotationX, controls.rotationY, controls.rotationZ]}
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
    
    // Camera controls
    const { cameraPosition, fov } = useControls('Camera', {
        cameraPosition: {
            value: { x: 0.0, y: 11.6, z: 7.2 },
            step: 0.1
        },
        fov: { value: 45, min: 20, max: 120, step: 1 }
    });

    // Environment and lighting controls
    const { envPreset, envIntensity } = useControls('Environment', {
        envPreset: {
            value: 'apartment',
            options: ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby']
        },
        envIntensity: { value: 1.0, min: 0, max: 5, step: 0.1 }
    });

    // Main lighting controls
    const lighting = useControls('Lighting', {
        // Ambient Light
        ambientIntensity: { value: 0.0, min: 0, max: 10, step: 0.1 },
        
        // Key Light (Warm)
        keyLightIntensity: { value: 1.8, min: 0, max: 10, step: 0.1 },
        keyLightColor: '#ffa32a',
        keyLightPosition: { 
            value: { x: 5.0, y: 5.0, z: 5.0 },
            step: 0.1
        },
        
        // Fill Light (Cool)
        fillLightIntensity: { value: 1.9, min: 0, max: 10, step: 0.1 },
        fillLightColor: '#e0f2fe',
        fillLightPosition: {
            value: { x: -23.5, y: -19.5, z: -8.1 },
            step: 0.1
        },
        
        // Top Light
        topLightIntensity: { value: 4.0, min: 0, max: 10, step: 0.1 },
        topLightColor: '#ffffff',
        topLightAngle: { value: 0.6, min: 0, max: Math.PI/2, step: 0.1 },
        topLightPenumbra: { value: 1.0, min: 0, max: 1, step: 0.1 },
        
        // Ground Bounce
        groundIntensity: { value: 1.5, min: 0, max: 10, step: 0.1 },
        groundColor: '#d1d5db',
        
        // Rim Light
        rimLightIntensity: { value: 2.0, min: 0, max: 10, step: 0.1 },
        rimLightColor: '#818cf8',
        rimLightPosition: {
            value: { x: -10.0, y: 0.0, z: -10.0 },
            step: 0.1
        }
    });

    // If no model path is provided or there was an error loading the model, show the image
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
                    position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]} 
                    fov={fov}
                />
                
                <Environment 
                    preset={envPreset}
                    background={false}
                    intensity={envIntensity}
                />

                {/* Enhanced lighting setup with Leva controls */}
                <ambientLight intensity={lighting.ambientIntensity} />
                
                {/* Key light - warm */}
                <directionalLight 
                    position={[lighting.keyLightPosition.x, lighting.keyLightPosition.y, lighting.keyLightPosition.z]} 
                    intensity={lighting.keyLightIntensity}
                    color={lighting.keyLightColor}
                />
                
                {/* Fill light - cool */}
                <directionalLight 
                    position={[lighting.fillLightPosition.x, lighting.fillLightPosition.y, lighting.fillLightPosition.z]} 
                    intensity={lighting.fillLightIntensity}
                    color={lighting.fillLightColor}
                />
                
                {/* Top light */}
                <spotLight
                    position={[0, 10, 0]}
                    angle={lighting.topLightAngle}
                    penumbra={lighting.topLightPenumbra}
                    intensity={lighting.topLightIntensity}
                    color={lighting.topLightColor}
                />
                
                {/* Ground bounce light */}
                <hemisphereLight
                    skyColor="#ffffff"
                    groundColor={lighting.groundColor}
                    intensity={lighting.groundIntensity}
                />
                
                {/* Rim light */}
                <pointLight
                    position={[lighting.rimLightPosition.x, lighting.rimLightPosition.y, lighting.rimLightPosition.z]}
                    intensity={lighting.rimLightIntensity}
                    color={lighting.rimLightColor}
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