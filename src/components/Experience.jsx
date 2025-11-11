import { Environment, ContactShadows, Float } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { useRef, useEffect } from 'react'
import { useControls } from 'leva'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Model from './Model.jsx'
import HolographicImage from './HolographicImage.jsx'
import HolographicProjection from './HolographicProjection.jsx'
import { useTheme } from './ThemeContext'

export default function Experience() {
    const { theme } = useTheme();
    const { gl } = useThree();
    
    // Enable stencil buffer on WebGL renderer
    useEffect(() => {
        if (gl) {
            gl.capabilities.stencil = true;
            const context = gl.getContext();
            if (context) {
                gl.stencil = true;
            }
        }
    }, [gl]);
    
    // Leva controls for studio lighting
    const {
        ambientIntensity,
        keyLightEnabled,
        keyLightPos,
        keyLightIntensity,
        keyLightColor,
        fillLightEnabled,
        fillLightPos,
        fillLightIntensity,
        fillLightColor,
        rimLightEnabled,
        rimLightPos,
        rimLightIntensity,
        rimLightColor
    } = useControls('Studio Lighting', {
        ambientIntensity: { value: 0.4, min: 0, max: 2, step: 0.1 },
        keyLightEnabled: true,
        keyLightPos: { value: { x: -3, y: 3, z: 3 }, step: 0.5 },
        keyLightIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
        keyLightColor: '#ffffff',
        fillLightEnabled: true,
        fillLightPos: { value: { x: 3, y: 1, z: 2 }, step: 0.5 },
        fillLightIntensity: { value: 1, min: 0, max: 3, step: 0.1 },
        fillLightColor: '#ffffff',
        rimLightEnabled: true,
        rimLightPos: { value: { x: 0, y: 2, z: -4 }, step: 0.5 },
        rimLightIntensity: { value: 1.5, min: 0, max: 3, step: 0.1 },
        rimLightColor: '#5b5483'
    })
    
    return <>
        <Environment preset="city" intensity={0.9} />
        <color args={[getComputedStyle(document.documentElement).getPropertyValue('--background')]} attach="background"/>
        
        {/* Ambient Light */}
        <ambientLight intensity={ambientIntensity} />
        
        {/* Key Light (main) */}
        {keyLightEnabled && (
            <directionalLight
                position={[keyLightPos.x, keyLightPos.y, keyLightPos.z]}
                intensity={keyLightIntensity}
                color={keyLightColor}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
        )}
        
        {/* Fill Light (reduces shadows) */}
        {fillLightEnabled && (
            <directionalLight
                position={[fillLightPos.x, fillLightPos.y, fillLightPos.z]}
                intensity={fillLightIntensity}
                color={fillLightColor}
            />
        )}
        
        {/* Rim Light (back/edge lighting) */}
        {rimLightEnabled && (
            <directionalLight
                position={[rimLightPos.x, rimLightPos.y, rimLightPos.z]}
                intensity={rimLightIntensity}
                color={rimLightColor}
            />
        )}

        {/* Holographic projection beam from base to glasses */}
        <HolographicProjection />
        
        {/* Model with glasses */}
        <Float
            speed={1.0}
            rotationIntensity={0.2}
            floatIntensity={0.12}
        >
            <Model />
        </Float>
        
        {/* Holographic Image positioned next to glasses */}
        {/* <HolographicImage 
            imagePath="/images/Project Cover Photos/JD Redesign thumbnail vector.svg"
            initialPosition={[1, 0.5, 0]}
            initialScale={[2, 2, 2]}
        /> */}


        {/* Post-processing disabled for debugging */}
        {/* <EffectComposer>
            <Bloom 
                intensity={0.5}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
                height={300}
                mipmapBlur={true}
                radius={0.5}
            />
            <ChromaticAberration 
                offset={[0.001, 0.001]}
            />
            <Vignette 
                darkness={0.8}
                offset={0.1}
            />
        </EffectComposer> */}
    </>
}