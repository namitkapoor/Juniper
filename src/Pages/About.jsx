// About.jsx
import AboutContent from '../components/AboutContent';
import Navbar from '../components/Navbar';
import '../style/about.css';

export default function About() {
  return (
    <>
      
      <div  className = "page-container about">
        <Navbar />
        <AboutContent />
        {/* Link to go back to the HomePage */}
        {/* <Link to="/">
          <div style={{ backgroundColor: 'lightgreen', padding: '10px', cursor: 'pointer' }}>
            Go back to Home Page
          </div>
        </Link> */}
      </div>
    </>
  )
}
