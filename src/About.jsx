// HelloPage.jsx
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <h1>Hello!</h1>
      <p>Click the link below to go back to the home page.</p>

      {/* Link to go back to the HomePage */}
      <Link to="/">
        <div style={{ backgroundColor: 'lightgreen', padding: '10px', cursor: 'pointer' }}>
          Go back to Home Page
        </div>
      </Link>
    </div>
  );
}
