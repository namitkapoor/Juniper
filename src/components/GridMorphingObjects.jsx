import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Import existing holographic shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

export default function GridMorphingObjects({ gridSize = 5, spacing = 2 }) {
    const groupRef = useRef()
    const materialRef = useRef()
    
    // Create grid positions
    const gridPositions = useMemo(() => {
        const positions = []
        const halfSize = Math.floor(gridSize / 2)
        
        for (let x = -halfSize; x <= halfSize; x++) {
            for (let z = -halfSize; z <= halfSize; z++) {
                positions.push([x * spacing, 0, z * spacing])
            }
        }
        return positions
    }, [gridSize, spacing])
    
    // Create different geometries for morphing
    const geometries = useMemo(() => {
        const geos = []
        
        // Cube
        geos.push(new THREE.BoxGeometry(0.5, 0.5, 0.5))
        
        // Sphere
        geos.push(new THREE.SphereGeometry(0.3, 16, 16))
        
        // Octahedron
        geos.push(new THREE.OctahedronGeometry(0.4))
        
        // Torus
        geos.push(new THREE.TorusGeometry(0.3, 0.1, 8, 16))
        
        // Icosahedron
        geos.push(new THREE.IcosahedronGeometry(0.3))
        
        return geos
    }, [])
    
    useEffect(() => {
        // Create holographic shader material
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
        
        materialRef.current = material
        
        return () => {
            material.dispose()
        }
    }, [])
    
    useFrame((state) => {
        if (groupRef.current && materialRef.current) {
            // Update shader time
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
            
            // Animate each object in the grid
            groupRef.current.children.forEach((mesh, index) => {
                const time = state.clock.elapsedTime
                const position = gridPositions[index]
                
                if (position) {
                    // Morph between geometries
                    const morphIndex = Math.floor((time + index * 0.5) % geometries.length)
                    const nextMorphIndex = (morphIndex + 1) % geometries.length
                    const morphProgress = (time + index * 0.5) % 1
                    
                    // Create interpolated geometry
                    const currentGeo = geometries[morphIndex]
                    const nextGeo = geometries[nextMorphIndex]
                    
                    // Simple morphing by scaling
                    const scale = 0.5 + Math.sin(time + index * 0.3) * 0.3
                    mesh.scale.setScalar(scale)
                    
                    // Rotation
                    mesh.rotation.x = time * 0.5 + index * 0.1
                    mesh.rotation.y = time * 0.3 + index * 0.2
                    mesh.rotation.z = time * 0.2 + index * 0.15
                    
                    // Floating motion
                    mesh.position.y = position[1] + Math.sin(time + index * 0.4) * 0.2
                    
                    // Color variation
                    const hue = (time * 0.1 + index * 0.1) % 1
                    materialRef.current.uniforms.uColor.value.setHSL(hue, 0.8, 0.6)
                }
            })
        }
    })
    
    return (
        <group ref={groupRef}>
            {gridPositions.map((position, index) => (
                <mesh
                    key={index}
                    position={position}
                    material={materialRef.current}
                    geometry={geometries[index % geometries.length]}
                />
            ))}
        </group>
    )
}

