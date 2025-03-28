import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }) {
    console.log('Attempting to load model from URL:', url);
    
    // Remove any leading dot from the path
    const cleanUrl = url.startsWith('.') ? url.substring(1) : url;
    const encodedUrl = cleanUrl.replace(/ /g, '%20');
    console.log('Processed URL:', encodedUrl);
    
    try {
        const { scene } = useGLTF(encodedUrl);
        console.log('Model loaded successfully');
        return <primitive object={scene} />;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

export default function ModelViewer({ modelPath, imagePath, title }) {
    const [modelError, setModelError] = useState(false);
    
    useEffect(() => {
        console.log('ModelViewer mounted with:', {
            modelPath,
            imagePath,
            title
        });
    }, [modelPath, imagePath, title]);

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
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ background: 'transparent' }}
                onError={(error) => {
                    console.error('Canvas error occurred:', error);
                    setModelError(true);
                }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <Model 
                        url={modelPath}
                        onError={(error) => {
                            console.error('Model loading error:', error);
                            setModelError(true);
                        }}
                    />
                </Suspense>
                <OrbitControls 
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={2}
                />
            </Canvas>
        </div>
    );
} 