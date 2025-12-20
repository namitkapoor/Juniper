import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

/**
 * MatrixBackground Component
 * Creates a "problem space" visualization - code, wireframes, glitchy data
 * This is visible EVERYWHERE except through the glasses (inverted stencil)
 */
export default function MatrixBackground() {
  const pointsRef = useRef()
  const linesRef = useRef()
  const codeTextRefs = useRef([])

  // Create random particles for the matrix effect
  const particleCount = 1000
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere around the scene
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10
      
      // Green/cyan colors for matrix effect
      colors[i3] = 0.0 + Math.random() * 0.3 // R
      colors[i3 + 1] = 0.5 + Math.random() * 0.5 // G (dominant)
      colors[i3 + 2] = 0.2 + Math.random() * 0.3 // B
    }
    
    return { positions, colors }
  }, [])

  // Create wireframe grid lines
  const gridLines = useMemo(() => {
    const points = []
    const gridSize = 10
    const divisions = 20
    const step = gridSize / divisions
    
    // Horizontal lines
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      points.push(
        new THREE.Vector3(-gridSize / 2, i * step, -5),
        new THREE.Vector3(gridSize / 2, i * step, -5)
      )
    }
    
    // Vertical lines
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      points.push(
        new THREE.Vector3(i * step, -gridSize / 2, -5),
        new THREE.Vector3(i * step, gridSize / 2, -5)
      )
    }
    
    return points
  }, [])

  // Code snippets for matrix effect
  const codeSnippets = [
    '// TODO', 
    'TODO:', 
    '// FIXME',
    '// WIP',
    '// DEBUG',
    '// OPTIMIZE',
    '// REFACTOR',
    '// TESTING',
    '// PENDING'
  ]

  // Animate particles and code
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Animate particles
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
    
    // Glitch effect on grid
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(time * 2) * 0.1
    }
    
    // Flicker code text
    codeTextRefs.current.forEach((text, i) => {
      if (text) {
        text.material.opacity = 0.4 + Math.sin(time * 3 + i) * 0.2
      }
    })
  })

  // Material that only renders where stencil is NOT set (inverse mask)
  const matrixMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      stencilWrite: false,
      stencilFunc: THREE.NotEqualStencilFunc, // Only render where stencil != ref
      stencilRef: 1, // Match the glasses stencil ref
    })
  }, [])

  const gridMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.3,
      stencilWrite: false,
      stencilFunc: THREE.NotEqualStencilFunc,
      stencilRef: 1,
    })
  }, [])

  return (
    <group>
      {/* Matrix particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={matrixMaterial} attach="material" />
      </points>

      {/* Wireframe grid */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={gridLines.length}
            array={new Float32Array(gridLines.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <primitive object={gridMaterial} attach="material" />
      </lineSegments>

      {/* Floating code snippets */}
      {codeSnippets.map((code, i) => {
        const angle = (i / codeSnippets.length) * Math.PI * 2
        const radius = 3
        return (
          <Text
            key={i}
            ref={(el) => (codeTextRefs.current[i] = el)}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 0.5) * 2,
              Math.sin(angle) * radius - 2
            ]}
            fontSize={0.2}
            color="#00ff88"
            anchorX="center"
            anchorY="middle"
            material-transparent
            material-opacity={0.5}
            material-stencilWrite={false}
            material-stencilFunc={THREE.NotEqualStencilFunc}
            material-stencilRef={1}
          >
            {code}
          </Text>
        )
      })}
    </group>
  )
}



