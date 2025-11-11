import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

// Keep your shader imports
import vertexShader from '../shaders/particles/vertex.glsl'
import fragmentShader from '../shaders/particles/fragment.glsl'

export default function AboutModel() {
    const { scene, gl, size, camera } = useThree()
    const particlesRef = useRef()
    const materialRef = useRef()
    const displacementRef = useRef({})
    const mouseRef = useRef(new THREE.Vector2(9999, 9999))
    
    useEffect(() => {
        // Setup displacement
        const displacement = displacementRef.current
        
        // Create canvas for displacement
        displacement.canvas = document.createElement('canvas')
        displacement.canvas.width = 128
        displacement.canvas.height = 128
        displacement.context = displacement.canvas.getContext('2d')
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

        // Load glow image
        displacement.glowImage = new Image()
        displacement.glowImage.src = '../images/glow.png'

        // Setup coordinates
        displacement.screenCursor = new THREE.Vector2(9999, 9999)
        displacement.canvasCursor = new THREE.Vector2(9999, 9999)
        displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999)

        // Create displacement texture
        displacement.texture = new THREE.CanvasTexture(displacement.canvas)

        // Create particles geometry - reduced resolution for fewer particles
        const particlesGeometry = new THREE.PlaneGeometry(8, 10, 128, 128)
        particlesGeometry.setIndex(null)
        particlesGeometry.deleteAttribute('normal')

        // Create intensity and angle attributes
        const intensitiesArray = new Float32Array(particlesGeometry.attributes.position.count)
        const anglesArray = new Float32Array(particlesGeometry.attributes.position.count)

        for(let i = 0; i < particlesGeometry.attributes.position.count; i++) {
            intensitiesArray[i] = Math.random()
            anglesArray[i] = Math.random() * Math.PI * 2
        }

        particlesGeometry.setAttribute('aIntensity', 
            new THREE.BufferAttribute(intensitiesArray, 1))
        particlesGeometry.setAttribute('aAngle', 
            new THREE.BufferAttribute(anglesArray, 1))

        // Create shader material
        const textureLoader = new THREE.TextureLoader()
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uResolution: new THREE.Uniform(new THREE.Vector2(
                    size.width * window.devicePixelRatio,
                    size.height * window.devicePixelRatio
                )),
                uPictureTexture: new THREE.Uniform(textureLoader.load('/images/namit professional shot1.jpg')),
                uDisplacementTexture: new THREE.Uniform(displacement.texture),
                uImageAspect: { value: 1.0 }
            }
        })

        // Update aspect ratio when texture loads
        material.uniforms.uPictureTexture.value.addEventListener('load', () => {
            const image = material.uniforms.uPictureTexture.value.image
            material.uniforms.uImageAspect.value = image.width / image.height
        })

        materialRef.current = material
        
        // Create particles
        const particles = new THREE.Points(particlesGeometry, material)
        particlesRef.current = particles
        scene.add(particles)

        // Event listener for pointer movement
        const handlePointerMove = (event) => {
            // Get canvas bounds
            const canvas = gl.domElement
            const rect = canvas.getBoundingClientRect()
            
            // Calculate normalized coordinates (-1 to 1)
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
            
            // Update displacement cursor
            displacement.screenCursor.x = mouseRef.current.x
            displacement.screenCursor.y = mouseRef.current.y
            
            // Map to canvas coordinates
            displacement.canvasCursor.x = (mouseRef.current.x + 1) * 0.5 * displacement.canvas.width
            displacement.canvasCursor.y = (-mouseRef.current.y + 1) * 0.5 * displacement.canvas.height
        }

        gl.domElement.addEventListener('pointermove', handlePointerMove)

        return () => {
            gl.domElement.removeEventListener('pointermove', handlePointerMove)
            scene.remove(particles)
            particlesGeometry.dispose()
            material.dispose()
        }
    }, [scene, size, gl])

    useFrame((state, delta) => {
        const displacement = displacementRef.current

        // Fade out
        displacement.context.globalCompositeOperation = 'source-over'
        displacement.context.globalAlpha = 0.02
        displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height)

        // Speed alpha
        const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor)
        displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
        const alpha = Math.min(cursorDistance * 0.05, 1)

        // Draw glow
        const glowSize = displacement.canvas.width * 0.25
        displacement.context.globalCompositeOperation = 'lighten'
        displacement.context.globalAlpha = alpha
        displacement.context.drawImage(
            displacement.glowImage,
            displacement.canvasCursor.x - glowSize * 0.5,
            displacement.canvasCursor.y - glowSize * 0.5,
            glowSize,
            glowSize
        )

        // Update texture
        displacement.texture.needsUpdate = true
    })

    return null
}