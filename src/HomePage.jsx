// HomePage.jsx
import "./canvas.css";
import { Link } from 'react-router-dom';
import Experience from './Experience'; // Your Three.js component
import { Canvas } from '@react-three/fiber'
import Content from './Content.jsx'
import Navbar from "./Navbar.jsx";

export default function HomePage() {
  return (
    <>
        <Navbar />

        {/* <div className = "transparentBackground">
           
        </div> */}
        {/* <Content /> */}
        <Canvas
                shadows
                className= "r3f"
                camera={ {
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [ -3, 1.5, 10 ]
                } }
            >
                <Experience />
        </Canvas>
        
    </>
  )
}

