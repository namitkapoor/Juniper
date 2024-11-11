import "../style/navbar.css"
import { Link } from 'react-router-dom';

export default function Navbar() {
    return <>
        <navigation>
            <div class="nav-items">
            <div class="logo-container">
                    <a class="logo-placeholder" href="/">
                        <img src="./Owl logo white transparent.png" 
                            height={60} 
                            width={60}
                            ></img>
                    </a>
            </div>
            
            <div class="nav-links">
                <a class="nav-item" href="/hello">about</a>
                <a class="nav-item" href="/">resume</a>
            </div>
            </div>
        </navigation>
    </>
}