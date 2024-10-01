import './global.css'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route, createBrowserRouter,RouterProvider} from "react-router-dom"
import HelloPage from './Pages/About.jsx'
import HomePage from './Pages/HomePage.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))


root.render(
    <BrowserRouter>
    <Routes>
      {/* Route for the HomePage */}
      <Route path="/" element={<HomePage />} />
      {/* Route for the HelloPage */}
      <Route path="/hello" element={<HelloPage />} />
    </Routes>
  </BrowserRouter>
)