import { Html } from "@react-three/drei"
import {useRef } from "react"
import {useControls} from 'leva'    

export default function Links()
{
    const htmlRef1 = useRef() // Create a reference for the Html element
    const htmlRef2 = useRef() // Create a reference for the Html element
    
    const htmlPosition = useControls('htmlRef1', {position:[0.014000000000000208,0,-0.4220000000000003]})
    const htmlRotation = useControls('htmlRef1', {rotation:[-0.5410000000000004,-0.046999999999999986,0]})
    return <>

        <Html
            ref={htmlRef1} // Pass the reference for debug menu
            transform
            occlude
            wrapperClass='htmlScreen'
            distanceFactor={1}
            position={htmlPosition.position}
            rotation={htmlRotation.rotation}
        >
            <iframe width="560" height="315" src="https://www.youtube.com/embed/urXS7fbOWSo?si=IZFi5mbRbJLNjVHl" title="YouTube video player" frameBorder = "0"></iframe>
        </Html>
        {/* <Html
            ref={htmlRef2}
            transform
            center // This will make the HTML element face the camera
            occlude
            distanceFactor={1}
            position={[2,0,0]}
            rotation={[0,0,0]}
        >
            <iframe width="560" height="315" src="https://lottie.host/embed/63e26184-9a9f-47db-b8d2-783cdcf9a79c/PbAwUw0EDu.json"></iframe>
        </Html> */}
    </>
}