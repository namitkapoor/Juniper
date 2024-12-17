import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { useLoader, useFrame } from '@react-three/fiber'
import { PresentationControls, Float } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef, useState } from 'react'


export default function Model() {
    const model = useLoader(GLTFLoader, './3d models/self.glb')
    const modelPosition = useControls('model', {position: [0, -0.47, 0]})
    const modelScale = useControls('model', {scale: [0.15,0.15,0.15]})
    const modelRotation = useControls('model', {rotation: [-0.42, 1.49, 0.28]})
    
    

    const modelRef = useRef()

    const [isHovered, setIsHovered] = useState(false)
    const [rotationAmount, setRotationAmount] = useState(0) // Track how much rotation has happened

    // Use useFrame to update rotation on every frame
    // useFrame((state, delta) => {
    //     if (modelRef.current) {
    //         const rotationSpeed = 2 * delta // Adjust this to control rotation speed

    //         // Rotate and scale clockwise when hovered
    //         if (isHovered && rotationAmount < Math.PI) { // Rotate up to 45 degrees (clockwise)
    //             modelRef.current.rotation.y += rotationSpeed
    //             modelRef.current.scale.setScalar(modelRef.current.scale.x + 0.002)
    //             setRotationAmount(rotationAmount + rotationSpeed)
    //         }
    //         // Rotate counterclockwise when not hovered (return to original position)
    //         else if (!isHovered && rotationAmount > 0) {
    //             modelRef.current.rotation.y -= rotationSpeed
    //             modelRef.current.scale.setScalar(modelRef.current.scale.x - 0.002)
    //             setRotationAmount(rotationAmount - rotationSpeed)
    //         }
            
    //     }
    // })

    const modelBehavior = () => {
        setIsHovered(true)
    }

    const modelReset = () => {
        setIsHovered(false)
    }

    return (
        <>
            <PresentationControls
                
                rotation={[0.13, 0.1, 0]}
                polar={[-0.4, 0.2]}
                azimuth={[-1, 0.75]}
                config={{ mass: 5, tension: 1000 }}
                snap={{ mass: 2, tension: 500 }}
            >
                <Float rotationIntensity={0.4}>
                    <ambientLight intensity={2} />

                    <primitive
                        occlude
                        ref={modelRef}
                        object={model.scene}
                        scale={modelScale.scale}
                        position={modelPosition.position}
                        rotation={modelRotation.rotation}
                        onPointerEnter={modelBehavior}
                        onPointerLeave={modelReset}
                    >
                    </primitive>
                      
                </Float>
            </PresentationControls>
        </>
    )
}
