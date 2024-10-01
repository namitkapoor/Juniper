import { Html, Text,Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import Model from './Model.jsx'
import { useControls } from 'leva'
import Links from './Links.jsx'

export default function Experience()
{
    const htmlRef = useRef() // Create a reference for the Html element
    const htmlPosition = useControls('htmlRef', {position:[0.014000000000000208,1.1349999999999865,-0.4220000000000003]})
    const htmlRotation = useControls('htmlRef', {rotation:[-0.5410000000000004,-0.046999999999999986,0]})
    const wandaTextRotation = useControls('wandaText', {rotation: [0, 0, 0]})
    const wandaTextPosition = useControls('wandaText', {position: [0, 0, 0]})


    return <>

        {/* <Perf position="top-left" /> */}
        
        {/* <Links/> */}
        <Text
            castShadow = {true}
            className='wandaText'
            scale={0.15}
            font='./CraftworkGrotesk-Heavy.ttf'
            position={wandaTextPosition.position}
            rotation={wandaTextRotation.rotation}
        >
            Project 1
        </Text>    
        <Environment preset="city" />
        <color args={['#1a1a1a']} attach = "background"/>
        {/* <OrbitControls makeDefault /> */}
        <Model/>       
        <ContactShadows position-y={-1.5} blur={1.5}/>
    </>
}