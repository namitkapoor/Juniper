import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import '../style/fonts.css'
import '../style/app.css'
import About from './About.jsx'
import Home from './Home.jsx'
import ManageFarms from './CaseStudies/ManageFarms.jsx'
import InfluencerMarketing from './CaseStudies/InfluencerMarketing.jsx'
import TaskReminders from './CaseStudies/TaskReminders.jsx'
import SustainablePackaging from './CaseStudies/SustainablePackaging.jsx'
import { ThemeProvider } from '../components/ThemeContext'
import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'
import PageTransition from '../components/PageTransition'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const App = () => {
  useEffect(() => {
    track('page_view', { page: 'home' });
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/case-study/manage-farms" element={<ManageFarms />} />
            <Route path="/case-study/influencer-marketing" element={<InfluencerMarketing />} />
            <Route path="/case-study/task-reminders" element={<TaskReminders />} />
            <Route path="/case-study/sustainable-packaging" element={<SustainablePackaging />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
  );
};

export default App;