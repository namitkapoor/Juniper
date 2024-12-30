import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import About from './About.jsx'
import Home from './Home.jsx'
import ManageFarms from './CaseStudies/ManageFarms.jsx'
import '../style/app.css'

const root = ReactDOM.createRoot(document.querySelector('#root'))


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/case-study/manage-farms" element={<ManageFarms />} />  
      </Routes>
    </BrowserRouter>
  );
};

export default App;