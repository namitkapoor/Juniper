import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import About from '../Pages/About.jsx'
import Home from '../Pages/Home.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />    
      </Routes>
    </BrowserRouter>
  );
};

export default App;