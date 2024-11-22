import "../style/navbar.css"


export default function Navbar() {
    return <>
        <div className = "navigation">
            <div className="nav-items">
            <div className="logo-container">
                    <a class="logo-placeholder" href="/">
                        <img src="./images/Owl_transparent_bg.png" 
                            height={60} 
                            width={60}
                            ></img>
                    </a>
            </div>
            
            <div class="nav-links">
                <a class="nav-item" href="/about">about</a>
                <a class="nav-item" href="/">resume</a>
            </div>
            </div>
        </div>
    </>
}