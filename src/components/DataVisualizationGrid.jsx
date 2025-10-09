import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Import existing holographic shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

export default function DataVisualizationGrid({ data = null }) {
    const groupRef = useRef()
    const materialRef = useRef()
    
    // Default data if none provided
    const defaultData = useMemo(() => [
        { name: 'UX Design', value: 0.9, color: '#ff6b6b' },
        { name: '3D Design', value: 0.8, color: '#4ecdc4' },
        { name: 'AI/ML', value: 0.7, color: '#45b7d1' },
        { name: 'Development', value: 0.8, color: '#96ceb4' },
        { name: 'Research', value: 0.9, color: '#feca57' },
        { name: 'XR/AR', value: 0.6, color: '#ff9ff3' },
        { name: 'Motion', value: 0.7, color: '#54a0ff' },
        { name: 'Strategy', value: 0.8, color: '#5f27cd' },
        { name: 'Leadership', value: 0.7, color: '#00d2d3' },
    ], [])
    
    const visualizationData = data || defaultData
    
    // Create grid positions
    const gridPositions = useMemo(() => {
        const positions = []
        const gridSize = Math.ceil(Math.sqrt(visualizationData.length))
        const spacing = 2
        
        for (let i = 0; i < visualizationData.length; i++) {
            const x = (i % gridSize) - Math.floor(gridSize / 2)
            const z = Math.floor(i / gridSize) - Math.floor(gridSize / 2)
            positions.push([x * spacing, 0, z * spacing])
        }
        return positions
    }, [visualizationData])
    
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
            
            // Animate each data point
            groupRef.current.children.forEach((mesh, index) => {
                const time = state.clock.elapsedTime
                const dataPoint = visualizationData[index]
                const position = gridPositions[index]
                
                if (dataPoint && position) {
                    // Height based on data value
                    const baseHeight = dataPoint.value * 2
                    const waveHeight = Math.sin(time + index * 0.5) * 0.3
                    mesh.position.y = baseHeight + waveHeight
                    
                    // Scale based on data value
                    const baseScale = 0.3 + dataPoint.value * 0.4
                    const pulseScale = 1 + Math.sin(time * 2 + index * 0.3) * 0.2
                    mesh.scale.setScalar(baseScale * pulseScale)
                    
                    // Rotation
                    mesh.rotation.x = time * 0.3 + index * 0.1
                    mesh.rotation.y = time * 0.5 + index * 0.2
                    mesh.rotation.z = time * 0.2 + index * 0.15
                    
                    // Color from data
                    const color = new THREE.Color(dataPoint.color)
                    materialRef.current.uniforms.uColor.value.lerp(color, 0.1)
                }
            })
        }
    })
    
    return (
        <group ref={groupRef}>
            {gridPositions.map((position, index) => {
                const dataPoint = visualizationData[index]
                if (!dataPoint) return null
                
                // Choose geometry based on data type or index
                let geometry
                switch (index % 4) {
                    case 0:
                        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
                        break
                    case 1:
                        geometry = new THREE.SphereGeometry(0.3, 16, 16)
                        break
                    case 2:
                        geometry = new THREE.ConeGeometry(0.3, 0.6, 8)
                        break
                    case 3:
                        geometry = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8)
                        break
                    default:
                        geometry = new THREE.OctahedronGeometry(0.3)
                }
                
                return (
                    <mesh
                        key={index}
                        position={position}
                        material={materialRef.current}
                        geometry={geometry}
                    />
                )
            })}
        </group>
    )
}

