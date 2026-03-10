import React, { useEffect, lazy, Suspense } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import 'lenis/dist/lenis.css'
import '../style/app.css'
import { ThemeProvider } from '../components/layout/ThemeContext'
import { TransitionProvider } from '../contexts/TransitionContext'
import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'
import PageTransition from '../components/layout/PageTransition'
import MaskTransition from '../components/layout/MaskTransition'
import { useLenis } from '../hooks/useLenis'

// Lazy load pages for code splitting
const Home = lazy(() => import('./Home.jsx'))
const About = lazy(() => import('./About.jsx'))
const Explore = lazy(() => import('./Explore.jsx'))
const ManageFarms = lazy(() => import('./CaseStudies/ManageFarms.jsx'))
const InfluencerMarketing = lazy(() => import('./CaseStudies/InfluencerMarketing.jsx'))
const TaskReminders = lazy(() => import('./CaseStudies/TaskReminders.jsx'))
const SustainablePackaging = lazy(() => import('./CaseStudies/SustainablePackaging.jsx'))
const ChristineValmy = lazy(() => import('./CaseStudies/ChristineValmy.jsx'))
const Clutch = lazy(() => import('./CaseStudies/Clutch.jsx'))

const App = () => {
  // Analytics (GA4 + Clarity) are loaded via Google Tag Manager — see docs/GTM-SETUP.md
  useLenis();

  // Vercel Analytics: track page views in production
  useEffect(() => {
    if (import.meta.env.PROD) {
      track('page_view', { page: 'home' });
    }
  }, []);

  return (
    <ThemeProvider>
      <TransitionProvider>
        <BrowserRouter>
          <MaskTransition />
          <PageTransition>
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background, #1d1d1d)', color: 'var(--text-secondary, #a8a8a8)' }} />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/case-study/manage-farms" element={<ManageFarms />} />
                <Route path="/case-study/influencer-marketing" element={<InfluencerMarketing />} />
                <Route path="/case-study/task-reminders" element={<TaskReminders />} />
                <Route path="/case-study/sustainable-packaging" element={<SustainablePackaging />} />
                <Route path="/case-study/christine-valmy" element={<ChristineValmy />} />
                <Route path="/case-study/clutch" element={<Clutch />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </BrowserRouter>
        <Analytics />
      </TransitionProvider>
    </ThemeProvider>
  );
};

export default App;