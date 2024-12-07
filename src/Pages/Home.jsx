// HomePage.jsx
import "../style/home.css";
import Experience from '../components/Experience.jsx'; // Your Three.js component
import { Canvas } from '@react-three/fiber'
import Content from '../components/Content.jsx'
import Navbar from "../components/Navbar.jsx"

export default function Home() {
  return (
    <>
      <div className = "page-container">
        <Navbar />  
        <Content />     
        <Canvas
                shadows
                className= "r3f"
                style = {{
                    width: "auto",
                    height: "auto",
                }}
                camera={ {
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [ 0,0,2]
                } }
            >
                <Experience />
        </Canvas>
        
      </div>
    </>
  )
}

