// HelloPage.jsx
import { Link } from 'react-router-dom';
import AboutContent from '../components/AboutContent';
import Navbar from '../Navbar';
import '../about.css';

export default function About() {
  return (
    <>
      <Navbar />
      <div  className = "about">

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
