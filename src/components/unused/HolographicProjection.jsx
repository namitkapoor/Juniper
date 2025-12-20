import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

// Import shaders
import vertexShader from '../shaders/holographic/vertex.glsl'
import fragmentShader from '../shaders/holographic/fragment.glsl'

/**
 * HolographicProjection - Creates a cone beam projection effect
 * Makes it look like the glasses are being projected from the base
 */
export default function HolographicProjection() {
  // Leva controls for projection
  const projectionControls = useControls('Holographic Projection', {
    // Position - moves the entire projection
    position: { value: { x: 0, y: -0.05, z: 0.55 }, step: 0.1 },
    // Rotation - rotates the entire cone
    rotation: { value: { x: -3, y: -0.1, z: 0 }, step: 0.1 },
    // Scale - scales the entire cone
    scale: { value: 0.6, min: 0.1, max: 3, step: 0.1 },
    // Cone shape
    height: { value: 0.5, min: 0.1, max: 2, step: 0.05 },
    radiusTop: { value: 0.02, min: 0.001, max: 0.5, step: 0.01, label: 'Top Radius' },
    radiusBottom: { value: 0.3, min: 0.1, max: 1, step: 0.05, label: 'Bottom Radius' },
    // Emitter controls
    emitterOffset: { value: 0.05, min: -0.5, max: 0.5, step: 0.01, label: 'Emitter Y Offset' },
    emitterScale: { value: 1.5, min: 0.5, max: 5, step: 0.1, label: 'Emitter Glow Size' },
    // Visual controls
    color: { value: '#4a9eff' },
    opacity: { value: 0.4, min: 0, max: 1, step: 0.01 },
    particleCount: { value: 100, min: 0, max: 500, step: 10 },
    showRings: { value: true },
    showEmitterGlow: { value: true, label: 'Show Emitter Glow' }
  })
  
  const { 
    position,
    rotation,
    scale,
    height,
    radiusTop, 
    radiusBottom,
    emitterOffset,
    emitterScale,
    color, 
    opacity,
    particleCount,
    showRings,
    showEmitterGlow
  } = projectionControls
  const coneRef = useRef()
  const ringsRef = useRef([])
  const materialRef = useRef()
  const particlesRef = useRef()

  // Create cone geometry - memoized to update when radius/height changes
  const coneGeometry = useMemo(() => {
    const radialSegments = 32
    return new THREE.ConeGeometry(radiusBottom, height, radialSegments, 1, true)
  }, [radiusBottom, height])

  // Create holographic shader material for cone with gradient fade
  const createConeMaterial = () => {
    // Custom shader for gradient fade from top to bottom
    const gradientVertexShader = `
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    
    const gradientFragmentShader = `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        // Calculate progressive gradient based on height (Y position)
        // Normalize Y position from -0.5 to 0.5 → 0 to 1
        float normalizedY = (vPosition.y + 0.5);
        
        // Calculate distance from center axis (for radial fade)
        float distFromCenter = length(vec2(vPosition.x, vPosition.z));
        
        // Calculate expected radius at this height
        float expectedRadius = mix(1.0, 0.02, normalizedY); // Bottom to top ratio
        
        // Soft radial gradient - smooth falloff from center to edges
        // Using multiple layers for ultra-soft edges
        float normalizedDist = distFromCenter / expectedRadius;
        
        // Multi-layer soft edge falloff
        float radialGradient = 1.0 - pow(normalizedDist, 1.5);
        radialGradient = smoothstep(0.0, 1.0, radialGradient);
        
        // Additional soft edge blur (creates feathered edges)
        float edgeSoftness = 1.0 - smoothstep(0.5, 1.2, normalizedDist);
        radialGradient *= edgeSoftness;
        
        // Height gradient - strong at top, completely fades at bottom
        // Using higher power to make bottom fade more aggressively
        float heightGradient = pow(normalizedY, 2.5);
        
        // Add extra fade for the very bottom (last 20% of height)
        float bottomFade = smoothstep(0.0, 0.2, normalizedY);
        
        // Add subtle noise to break up hard contours
        float noise = sin(vPosition.x * 20.0 + uTime * 0.5) * cos(vPosition.z * 20.0 + uTime * 0.3) * 0.05;
        
        // Combine gradients: strong at tip, fade completely at base
        float gradient = mix(radialGradient * 0.1 * bottomFade, 1.0, heightGradient);
        gradient = gradient * (1.0 + noise);
        
        // Boost overall brightness
        gradient = gradient * 1.5;
        
        // Clamp to ensure proper range
        gradient = clamp(gradient, 0.0, 1.0);
        
        // Add some holographic glitch (subtle)
        float glitch = sin(vPosition.y * 10.0 + uTime * 2.0) * 0.05;
        float finalOpacity = (gradient + glitch * gradient) * uOpacity * 2.0;
        
        // Add scanlines
        float scanline = sin(vPosition.y * 50.0 + uTime) * 0.05 + 0.95;
        
        gl_FragColor = vec4(uColor, finalOpacity * scanline);
      }
    `
    
    return new THREE.ShaderMaterial({
      vertexShader: gradientVertexShader,
      fragmentShader: gradientFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  }

  // Store particle angles for animation (not in positions array)
  const particleAngles = useMemo(() => {
    if (particleCount === 0) return []
    
    const angles = []
    for (let i = 0; i < particleCount; i++) {
      angles.push({
        angle: Math.random() * Math.PI * 2,
        radiusOffset: 0.85 + Math.random() * 0.1 // Keep particles 85-95% inside cone
      })
    }
    return angles
  }, [particleCount])

  // Create floating particles mapped around the cone surface - memoized
  const particlePositions = useMemo(() => {
    if (particleCount === 0) return new Float32Array(0)
    
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Position along cone height (0 to 1)
      const t = Math.random()
      
      // Calculate radius at this height (cone surface)
      const radiusAtHeight = radiusBottom - t * (radiusBottom - radiusTop)
      
      // Place particles INSIDE the cone (85-95% of radius)
      const radius = radiusAtHeight * particleAngles[i].radiusOffset
      
      positions[i * 3] = Math.cos(particleAngles[i].angle) * radius
      positions[i * 3 + 1] = (t - 0.5) * height // Height (centered)
      positions[i * 3 + 2] = Math.sin(particleAngles[i].angle) * radius
    }
    
    return positions
  }, [particleCount, radiusTop, radiusBottom, height, particleAngles])

  // Animate the projection
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Update shader time for glitch effect and opacity
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
      materialRef.current.uniforms.uOpacity.value = opacity
    }
    
    // Animate particles flowing down the cone (from glasses to base)
    if (particlesRef.current && particleCount > 0) {
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3
        
        // Move particles downward (glasses → base)
        positions[idx + 1] -= 0.002
        
        // Reset when they reach the bottom
        if (positions[idx + 1] < -height / 2) {
          positions[idx + 1] = height / 2
        }
        
        // Recalculate X and Z based on current height to stay within cone
        // Convert Y position back to normalized height (0 to 1)
        const normalizedHeight = (positions[idx + 1] + height / 2) / height
        
        // Calculate radius at current height
        const radiusAtCurrentHeight = radiusBottom - normalizedHeight * (radiusBottom - radiusTop)
        
        // Apply the saved angle and radius offset for this particle
        const radius = radiusAtCurrentHeight * particleAngles[i].radiusOffset
        const angle = particleAngles[i].angle
        
        positions[idx] = Math.cos(angle) * radius      // X
        positions[idx + 2] = Math.sin(angle) * radius  // Z
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    // Pulse effect is now handled in shader
  })

  return (
    <group 
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale, scale, scale]}
    >
      {/* Main projection cone */}
      <mesh
        ref={coneRef}
        geometry={coneGeometry}
      >
        <primitive object={createConeMaterial()} attach="material" ref={materialRef} />
      </mesh>

      {/* Floating particles inside cone */}
      {particleCount > 0 && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlePositions.length / 3}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color={color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* Pulsing rings at emitter */}
      {showRings && [0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, height / 2 + emitterOffset + i * 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[radiusTop + i * 0.02, radiusTop + 0.01 + i * 0.02, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={(0.5 - i * 0.15)}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Glow at emitter source */}
      <pointLight
        position={[0, height / 2 + emitterOffset, 0]}
        color={color}
        intensity={1.0}
        distance={1.5}
      />
      
      {/* Additional glow for emitter */}
      {showEmitterGlow && (
        <mesh position={[0, height / 2 + emitterOffset, 0]}>
          <sphereGeometry args={[radiusTop * emitterScale, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}

