import "../style/navbar.css"


export default function Navbar() {
    return <>
        <div className = "navigation">
            <div className="nav-items">
            <div className="logo-container">
                    <a className="logo-placeholder" href="/">
                        <img src="/images/Owl_transparent_bg.png" 
                            height={60} 
                            width={60}
                            ></img>
                    </a>
            </div>
            
            <div className="nav-links">
                <a className="nav-item" href="/about">about</a>
                <a className="nav-item" href="/">resume</a>
            </div>
            </div>
        </div>
    </>
}