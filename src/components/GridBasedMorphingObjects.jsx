import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'

// Import existing holographic shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

export default function GridBasedMorphingObjects() {
    const groupRef = useRef()
    const materialRef = useRef()
    const gridRef = useRef()
    
    // Load your grid GLB
    const gridModel = useLoader(GLTFLoader, './3d models/grid.glb')
    
    // Extract grid positions from the loaded model
    const gridPositions = useMemo(() => {
        const positions = []
        
        // Traverse the grid model to find positions
        gridModel.scene.traverse((child) => {
            if (child.isMesh) {
                // Get the geometry vertices to determine grid points
                const geometry = child.geometry
                const positionAttribute = geometry.getAttribute('position')
                
                if (positionAttribute) {
                    // Sample points from the grid geometry
                    for (let i = 0; i < positionAttribute.count; i += 10) { // Sample every 10th vertex
                        const x = positionAttribute.getX(i)
                        const y = positionAttribute.getY(i)
                        const z = positionAttribute.getZ(i)
                        
                        // Only use points that are likely grid intersections (you may need to adjust this)
                        if (Math.abs(x) % 1 < 0.1 && Math.abs(z) % 1 < 0.1) {
                            positions.push([x, y + 0.5, z]) // Offset slightly above grid
                        }
                    }
                }
            }
        })
        
        // If no positions found, create a fallback grid
        if (positions.length === 0) {
            console.log('No grid positions found, using fallback')
            for (let x = -2; x <= 2; x++) {
                for (let z = -2; z <= 2; z++) {
                    positions.push([x, 0.5, z])
                }
            }
        }
        
        return positions
    }, [gridModel])
    
    // Create different geometries for morphing
    const geometries = useMemo(() => {
        const geos = []
        
        // Cube
        geos.push(new THREE.BoxGeometry(0.3, 0.3, 0.3))
        
        // Sphere
        geos.push(new THREE.SphereGeometry(0.2, 12, 12))
        
        // Octahedron
        geos.push(new THREE.OctahedronGeometry(0.25))
        
        // Torus
        geos.push(new THREE.TorusGeometry(0.2, 0.08, 6, 12))
        
        // Icosahedron
        geos.push(new THREE.IcosahedronGeometry(0.2))
        
        // Cone
        geos.push(new THREE.ConeGeometry(0.2, 0.4, 6))
        
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
        
        // Hide the original grid model (we just want its positions)
        gridModel.scene.traverse((child) => {
            if (child.isMesh) {
                child.visible = false
            }
        })
        
        return () => {
            material.dispose()
        }
    }, [gridModel])
    
    useFrame((state) => {
        if (groupRef.current && materialRef.current) {
            // Update shader time
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
            
            // Animate each object in the grid
            groupRef.current.children.forEach((mesh, index) => {
                const time = state.clock.elapsedTime
                const position = gridPositions[index]
                
                if (position) {
                    // Morph between geometries by changing scale
                    const morphIndex = Math.floor((time + index * 0.3) % geometries.length)
                    const morphProgress = ((time + index * 0.3) % 1)
                    
                    // Scale morphing effect
                    const baseScale = 0.5 + Math.sin(time * 2 + index * 0.5) * 0.3
                    const morphScale = baseScale + Math.sin(morphProgress * Math.PI) * 0.2
                    mesh.scale.setScalar(morphScale)
                    
                    // Rotation
                    mesh.rotation.x = time * 0.4 + index * 0.1
                    mesh.rotation.y = time * 0.6 + index * 0.2
                    mesh.rotation.z = time * 0.3 + index * 0.15
                    
                    // Floating motion
                    mesh.position.y = position[1] + Math.sin(time + index * 0.4) * 0.3
                    
                    // Color variation
                    const hue = (time * 0.1 + index * 0.1) % 1
                    materialRef.current.uniforms.uColor.value.setHSL(hue, 0.8, 0.6)
                }
            })
        }
    })
    
    return (
        <group ref={groupRef}>
            {/* Render the grid model (hidden) to get its structure */}
            <primitive ref={gridRef} object={gridModel.scene} />
            
            {/* Create morphing objects at grid positions */}
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



