import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useLoader, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Import shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

export default function Model() {
    // Load glasses model only
    const glassesModel = useLoader(GLTFLoader, './3d models/just-glasses.glb')
    
    // Scroll state
    const [scrollProgress, setScrollProgress] = useState(0)
    
    // Initial glasses position (hero state) - your original parameters
    const initialGlassesPosition = [-0.2, 0.1, 0]
    const initialGlassesScale = [0.15, 0.15, 0.1]
    const initialGlassesRotation = [0.6, -0.4, -0.2]
    
    // Scrolled glasses position (out of the way)
    const scrolledGlassesPosition = [2.6, -3.8, 4.3]
    const scrolledGlassesScale = [1, 1, 1]
    const scrolledGlassesRotation = [0.6, -3.6, -0.2]
    
    
    // Refs
    const glassesRef = useRef()
    const materialRef = useRef()
    
    // Scroll listener for glasses animation
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            
            // More robust scroll calculation
            const maxScroll = Math.max(documentHeight - windowHeight, 1)
            const progress = Math.min(scrollY / maxScroll, 1)
            
            console.log('Scroll event triggered:', {
                scrollY,
                windowHeight,
                documentHeight,
                maxScroll,
                progress
            })
            
            setScrollProgress(progress)
        }
        
        // Add scroll listener with better options
        window.addEventListener('scroll', handleScroll, { passive: true })
        
        // Initial call to set correct initial state
        handleScroll()
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Create shader material
    useEffect(() => {
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#4a9eff') }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        // Apply material to glasses
        glassesModel.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = material
                materialRef.current = material
            }
        })
    }, [glassesModel])

    // Update shader uniforms and handle scroll animation
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta
        }
        
        // Handle scroll-based glasses animation
        if (glassesRef.current) {
            const progress = scrollProgress
            
            // Debug logging every 60 frames (about once per second)
            if (state.clock.elapsedTime % 1 < delta) {
                console.log('useFrame - scrollProgress state:', scrollProgress, 'Using:', progress)
            }
            
            // Interpolate between initial and scrolled positions
            const currentPosition = [
                initialGlassesPosition[0] + (scrolledGlassesPosition[0] - initialGlassesPosition[0]) * progress,
                initialGlassesPosition[1] + (scrolledGlassesPosition[1] - initialGlassesPosition[1]) * progress,
                initialGlassesPosition[2] + (scrolledGlassesPosition[2] - initialGlassesPosition[2]) * progress
            ]
            
            const currentScale = [
                initialGlassesScale[0] + (scrolledGlassesScale[0] - initialGlassesScale[0]) * progress,
                initialGlassesScale[1] + (scrolledGlassesScale[1] - initialGlassesScale[1]) * progress,
                initialGlassesScale[2] + (scrolledGlassesScale[2] - initialGlassesScale[2]) * progress
            ]
            
            const currentRotation = [
                initialGlassesRotation[0] + (scrolledGlassesRotation[0] - initialGlassesRotation[0]) * progress,
                initialGlassesRotation[1] + (scrolledGlassesRotation[1] - initialGlassesRotation[1]) * progress,
                initialGlassesRotation[2] + (scrolledGlassesRotation[2] - initialGlassesRotation[2]) * progress
            ]
            
            // Apply interpolated values directly to glasses primitive
            glassesRef.current.position.set(...currentPosition)
            glassesRef.current.scale.set(...currentScale)
            glassesRef.current.rotation.set(...currentRotation)
        }
    })

    const handleModelClick = (event) => {
        console.log('Glasses clicked!', event) // Fixed groupRef error
    }

    return (
        <>
            <Float rotationIntensity={0.1}>
                {/* Glasses Model with scroll animation */}
                <primitive 
                    ref={glassesRef}
                    object={glassesModel.scene}
                    onClick={handleModelClick}
                />
            </Float>
        </>
    )
}