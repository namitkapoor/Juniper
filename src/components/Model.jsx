import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useLoader, useFrame } from '@react-three/fiber'
import { PresentationControls, Float, Text, Center } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import '../style/fonts.css'

// Import shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

export default function Model() {
    const model = useLoader(GLTFLoader, './3d models/self.glb')
    
    // Commented out useControls for debugging
    // const modelPosition = useControls('model', {position: [0.02, -0.51, 0]})
    // const modelScale = useControls('model', {scale: [0.15,0.15,0.15]})
    // const modelRotation = useControls('model', {rotation: [-0.42, 1.47, 0.69]})

    // Directly set values
    const modelPosition = { position: [0.02, -0.51, 0] };
    const modelScale = { scale: [0.15, 0.15, 0.15] };
    const modelRotation = { rotation: [-0.42, 1.47, 0.69] };
    
    const materialRef = useRef()
    const modelRef = useRef()
    const [isHovered, setIsHovered] = useState(false)

    // Create shader material
    useEffect(() => {
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0.1, 0.6, 0.9) }
            },
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        // Apply material to all meshes in the model
        model.scene.traverse((child) => {
            if (child.isMesh && child.material.name === 'Glasses_lenses_blue.001') {
                child.material = material
                materialRef.current = material               
            }
        })
    }, [model])

    // Update shader uniforms
    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta
        }
    })

    const modelBehavior = () => {
        setIsHovered(true)
    }

    const modelReset = () => {
        setIsHovered(false)
    }

    return (
        <>
            {/* <Text
                position={[0, 0.35, -2]}
                fontSize={0.75}
                anchorX="center"
                anchorY="middle"
            >
                Namit Kapoor
                <meshStandardMaterial
                    attach="material"
                    color="#4a9eff"
                    emissive="#ffffff"
                    emissiveIntensity={200}
                    transparent
                    opacity={1.0}
                    metalness={0.8}
                    roughness={0.2}
                />
            </Text> */}
            <PresentationControls
                global
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 2, tension: 400 }}
                snap={{ mass: 4, tension: 400 }}
            >
                <Float rotationIntensity={0.4}>
                    
                    <primitive 
                        object={model.scene}
                        position={[0.02, -0.2, 0]}
                        scale={[0.25,0.5,0.5]}
                        rotation={[-0.42, 1.47, 0.99]}
                        ref={modelRef}
                        onPointerOver={modelBehavior}
                        onPointerOut={modelReset}
                    />
                </Float>
            </PresentationControls>
        </>
    )
}
