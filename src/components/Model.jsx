import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useLoader, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'

// Import shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

export default function Model() {
    // Load all models
    const glassesModel = useLoader(GLTFLoader, './3d models/just-glasses.glb')
    const buzzBaseModel = useLoader(GLTFLoader, './3d models/project-omnitrix2.glb')
    const iPhoneModel = useLoader(GLTFLoader, './3d models/iPhone with JD App.glb')
    
    // Scroll state
    const [scrollProgress, setScrollProgress] = useState(0)
    const [shouldShowiPhone, setShouldShowiPhone] = useState(false)
    const [iPhoneScale, setiPhoneScale] = useState(0.001)
    const iPhoneThreshold = 0.05 // Start scaling at 5% scroll
    const iPhoneCompleteThreshold = 0.15 // Complete scaling at 15% scroll (much faster!)
    
    // Leva controls for glasses
    const glassesControls = useControls('Glasses', {
        position: { value: { x: -0.3, y: 0.2, z: 0 }, step: 0.1 },
        scale: { value: { x: 0.15, y: 0.15, z: 0.1 }, step: 0.01 },
        rotation: { value: { x: 0.6, y: -0.4, z: -0.2 }, step: 0.1 },
        color: { value: '#4a9eff' }
    })
    
    // Leva controls for buzz base
    const buzzBaseControls = useControls('BuzzBase', {
        position: { value: { x: 0, y: -0.1, z: 0.5 }, step: 0.1 },
        scale: { value: { x: 0.06, y: 0.06, z: 0.06 }, step: 0.01 },
        rotation: { value: { x: 0.1, y: -4.4, z: 0.5 }, step: 0.1 },
        color: { value: '#4a9eff' }
    })
    
    // Leva controls for iPhone model
    const iPhoneControls = useControls('iPhone', {
        position: { value: { x: 0, y: 0, z: -0.1 }, step: 0.1 },
        scale: { value: { x: 0.08, y: 0.08, z: 0.08 }, step: 0.01 },
        rotation: { value: { x: 0.4, y: 2.7, z: -0.1 }, step: 0.1 }
    })
    
    // Initial glasses position (hero state) - your original parameters
    const initialGlassesPosition = [-0.3, 0.2, 0]
    const initialGlassesScale = [0.15, 0.15, 0.1]
    const initialGlassesRotation = [0.6, -0.4, -0.2]
    
    // Scrolled glasses position (out of the way)
    const scrolledGlassesPosition = [2.6, -3.8, 4.3]
    const scrolledGlassesScale = [1, 1, 1]
    const scrolledGlassesRotation = [0.6, -3.6, -0.2]
    
    
    // Refs
    const glassesRef = useRef()
    const buzzBaseRef = useRef()
    const iPhoneRef = useRef()
    const glassesMaterialRef = useRef()
    const emissiveMaterialRef = useRef()
    const [lensGeometries, setLensGeometries] = useState([])
    
    // Scroll listener for glasses animation
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            
            // More robust scroll calculation
            const maxScroll = Math.max(documentHeight - windowHeight, 1)
            const progress = Math.min(scrollY / maxScroll, 1)
            
            // Calculate iPhone scale based on scroll progress
            // Scale from 0.001 to 0.08 between threshold and complete threshold
            let currentScale = 0.001
            if (progress >= iPhoneThreshold) {
                if (progress >= iPhoneCompleteThreshold) {
                    // Fully scaled
                    currentScale = 0.08
                } else {
                    // Scale proportionally between thresholds
                    const scaleProgress = (progress - iPhoneThreshold) / (iPhoneCompleteThreshold - iPhoneThreshold)
                    currentScale = 0.001 + (0.08 - 0.001) * scaleProgress
                }
            }
            
            console.log('Scroll event triggered:', {
                scrollY,
                windowHeight,
                documentHeight,
                maxScroll,
                progress,
                iPhoneScale: currentScale
            })
            
            setScrollProgress(progress)
            setShouldShowiPhone(progress >= iPhoneThreshold)
            setiPhoneScale(currentScale)
        }
        
        // Add scroll listener with better options
        window.addEventListener('scroll', handleScroll, { passive: true })
        
        // Initial call to set correct initial state
        handleScroll()
        
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Create shader materials and extract lens geometries
    useEffect(() => {
        const lensGeos = []
        
        // Glasses shader material
        const glassesMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(glassesControls.color) }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        // Apply material to glasses and extract lens geometries for stencil
        glassesModel.scene.traverse((child) => {
            if (child.isMesh) {
                // Store lens geometry for stencil mask creation
                // Clone geometry and store with world matrix
                const clonedGeo = child.geometry.clone()
                lensGeos.push({
                    geometry: clonedGeo,
                    position: child.position.clone(),
                    rotation: child.rotation.clone(),
                    scale: child.scale.clone(),
                    worldMatrix: child.matrixWorld.clone()
                })
                
                child.material = glassesMaterial
                glassesMaterialRef.current = glassesMaterial
            }
        })
        
        setLensGeometries(lensGeos)
        
        // Print buzzBase model structure
        console.log('BuzzBase Model Children:')
        buzzBaseModel.scene.traverse((child) => {
            console.log({
                type: child.type,
                name: child.name,
                children: child.children?.length || 0,
                isMesh: child.isMesh,
                material: child.material ? child.material.type : 'none',
                geometry: child.geometry ? child.geometry.type : 'none'
            })
            
            // Check if this is the iPhone 13
            if (child.name === 'iPhone 13' || child.name.includes('iPhone')) {
                console.log('🎯 FOUND iPhone child:', {
                    name: child.name,
                    type: child.type,
                    isMesh: child.isMesh,
                    position: child.position,
                    scale: child.scale,
                    rotation: child.rotation
                })
            }
        })

        // Create shader material for Emissive_blu child
        const emissiveMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(buzzBaseControls.color) }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        // Apply shader material to Emissive_blu child only
        buzzBaseModel.scene.traverse((child) => {
            if (child.isMesh && child.name === 'Gear') {
                console.log('Applying holographic shader to:', child.name)
                child.material = emissiveMaterial
                emissiveMaterialRef.current = emissiveMaterial
            }
        })

        // BuzzBase keeps its default material from the GLB (no shader) except for Emissive_blu
        
        // Print iPhone model structure
        console.log('iPhone Model Children:')
        iPhoneModel.scene.traverse((child) => {
            console.log({
                type: child.type,
                name: child.name,
                children: child.children?.length || 0,
                isMesh: child.isMesh,
                material: child.material ? child.material.type : 'none',
                geometry: child.geometry ? child.geometry.type : 'none'
            })
        })
    }, [glassesModel, buzzBaseModel, iPhoneModel, glassesControls.color, buzzBaseControls.color])

    // Update shader uniforms and handle scroll animation
    useFrame((state, delta) => {
        // Update glasses shader material time uniform
        if (glassesMaterialRef.current) {
            glassesMaterialRef.current.uniforms.uTime.value += delta
            // Update color from Leva controls
            glassesMaterialRef.current.uniforms.uColor.value.set(glassesControls.color)
        }
        
        // Update emissive shader material time uniform and color
        if (emissiveMaterialRef.current) {
            emissiveMaterialRef.current.uniforms.uTime.value += delta
            // Update color from Leva controls
            emissiveMaterialRef.current.uniforms.uColor.value.set(buzzBaseControls.color)
        }
        
        // Handle scroll-based glasses animation (faster completion)
        if (glassesRef.current) {
            // Map scroll progress to faster completion (complete at 20% scroll instead of 100%)
            const glassesScrollThreshold = 0.2
            const progress = Math.min(scrollProgress / glassesScrollThreshold, 1)
            
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
        
        // Apply Leva controls to buzz base
        if (buzzBaseRef.current) {
            buzzBaseRef.current.position.set(
                buzzBaseControls.position.x,
                buzzBaseControls.position.y,
                buzzBaseControls.position.z
            )
            buzzBaseRef.current.scale.set(
                buzzBaseControls.scale.x,
                buzzBaseControls.scale.y,
                buzzBaseControls.scale.z
            )
            buzzBaseRef.current.rotation.set(
                buzzBaseControls.rotation.x,
                buzzBaseControls.rotation.y,
                buzzBaseControls.rotation.z
            )
        }
        
        // Apply Leva controls to iPhone with scroll-based scaling
        if (iPhoneRef.current) {
            iPhoneRef.current.position.set(
                iPhoneControls.position.x,
                iPhoneControls.position.y,
                iPhoneControls.position.z
            )
            // Use scroll-based scale instead of Leva scale
            iPhoneRef.current.scale.set(
                iPhoneScale,
                iPhoneScale,
                iPhoneScale
            )
            iPhoneRef.current.rotation.set(
                iPhoneControls.rotation.x,
                iPhoneControls.rotation.y,
                iPhoneControls.rotation.z
            )
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
            
            {/* Buzz Base Model positioned below glasses */}
            <primitive 
                ref={buzzBaseRef}
                object={buzzBaseModel.scene}
            />
            
            {/* iPhone Model - only shows after scroll threshold */}
            {shouldShowiPhone && (
                <primitive 
                    ref={iPhoneRef}
                    object={iPhoneModel.scene}
                />
            )}
        </>
    )
}