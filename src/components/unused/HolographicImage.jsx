import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, useState } from 'react'
import { useControls } from 'leva'
import * as THREE from 'three'

export default function HolographicImage({ imagePath, initialPosition = [0, 0, 0], initialScale = [1, 1, 1] }) {
    const meshRef = useRef()
    const [texture, setTexture] = useState(null)
    const materialRef = useRef()
    
    // Leva controls for the image
    const imageControls = useControls('Image', {
        position: { value: { x: initialPosition[0], y: initialPosition[1], z: initialPosition[2] }, step: 0.1 },
        scale: { value: { x: initialScale[0], y: initialScale[1], z: initialScale[2] }, step: 0.1 },
        rotation: { value: { x: 0, y: 0, z: 0 }, step: 0.1 }
    })

    // Load the image
    useEffect(() => {
        const loader = new THREE.TextureLoader()
        console.log('Loading image from:', imagePath)
        loader.load(
            imagePath,
            (texture) => {
                console.log('Image loaded successfully')
                texture.flipY = false
                setTexture(texture)
            },
            (progress) => {
                console.log('Loading progress:', progress)
            },
            (error) => {
                console.error('Error loading image:', error)
            }
        )
    }, [imagePath])

    // Update material when texture loads
    useEffect(() => {
        if (texture && meshRef.current) {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide
            })
            materialRef.current = material
            meshRef.current.material = material
        }
    }, [texture])

    // Apply Leva controls for position, scale, and rotation
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.set(
                imageControls.position.x,
                imageControls.position.y,
                imageControls.position.z
            )
            meshRef.current.scale.set(
                imageControls.scale.x,
                imageControls.scale.y,
                imageControls.scale.z
            )
            meshRef.current.rotation.set(
                imageControls.rotation.x,
                imageControls.rotation.y,
                imageControls.rotation.z
            )
        }
    })

    if (!texture) return null

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[1, 1]} />
        </mesh>
    )
}
