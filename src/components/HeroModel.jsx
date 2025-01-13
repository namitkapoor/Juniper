import { Html, Text,Environment, ContactShadows } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import Bottle from './Bottle.jsx'
import { useControls } from 'leva'

export default function HeroModel()
{


    return <>

        {/* <Perf position="top-left" /> */}
        
        {/* <Links/> */}   
        <Environment preset="city" />
        <color args={['#1a1a1a']} attach = "background"/>
        {/* <OrbitControls makeDefault /> */}
        <Bottle/>       
        <ContactShadows position-y={-1.5} blur={1.5}/>
    </>
}