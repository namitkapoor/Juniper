import { Environment, ContactShadows, SpotLight, Float } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { useRef } from 'react'
import Model from './Model.jsx'
import { useTheme } from './ThemeContext'

export default function Experience() {
    const { theme } = useTheme();
    const spotLightRef = useRef()
    
    return <>
        <Environment preset="night" />
        <color args={[getComputedStyle(document.documentElement).getPropertyValue('--background')]} attach="background"/>
        
        <SpotLight
            ref={spotLightRef}
            position={[-3.5, -0.7, 0.8]}
            angle={0.4}
            penumbra={0.9}
            intensity={1.5}
            color="#5b5483"
            distance={10}
            castShadow


            power={15}
        />

        {/* Float settings adjusted for subtler movement */}
        <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.4}
        >
            <Model/>    
        </Float>   


        <EffectComposer>
            <Bloom 
                intensity={1.0}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                height={300}
                mipmapBlur={true}
                radius={0.7}
            />
            <ChromaticAberration 
                offset={[0.003, 0.003]}
            />
            <Vignette 
                darkness={1.1}
                offset={0.15}
            />
        </EffectComposer>
    </>
}