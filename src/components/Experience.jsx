import {Environment, ContactShadows } from '@react-three/drei'
import Model from './Model.jsx'
import { useTheme } from './ThemeContext';

export default function Experience()
{
    const { theme } = useTheme();
    
    return <>

        {/* <Perf position="top-left" /> */}
        
        {/* <Links/> */}   
        <Environment preset="city" />
        <color args={[getComputedStyle(document.documentElement).getPropertyValue('--background')]} attach="background"/>
        {/* <OrbitControls makeDefault /> */}
        <Model/>       
        <ContactShadows position-y={-1.5} blur={1.5}/>
    </>
}