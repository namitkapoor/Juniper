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
import { useClarity } from '../hooks/useClarity'
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics'
import { analyticsConfig } from '../config/analytics'

// Lazy load pages for code splitting
const Home = lazy(() => import('./Home.jsx'))
const About = lazy(() => import('./About.jsx'))
const Explore = lazy(() => import('./Explore.jsx'))
const ManageFarms = lazy(() => import('./CaseStudies/ManageFarms.jsx'))
const InfluencerMarketing = lazy(() => import('./CaseStudies/InfluencerMarketing.jsx'))
const TaskReminders = lazy(() => import('./CaseStudies/TaskReminders.jsx'))
const SustainablePackaging = lazy(() => import('./CaseStudies/SustainablePackaging.jsx'))
const ChristineValmy = lazy(() => import('./CaseStudies/ChristineValmy.jsx'))

// Wrapper component for GA4 (needs to be inside Router for useLocation)
const GA4Tracker = () => {
  useGoogleAnalytics(analyticsConfig.googleAnalytics.measurementId);
  return null;
};

const App = () => {
  // Initialize Lenis smooth scroll
  useLenis();

  // Initialize Microsoft Clarity (only if project ID exists)
  useClarity(analyticsConfig.clarity.projectId);

  // Track page views only in production
  useEffect(() => {
    if (import.meta.env.PROD && analyticsConfig.googleAnalytics.measurementId) {
      track('page_view', { page: 'home' });
    }
  }, []);

  return (
    <ThemeProvider>
      <TransitionProvider>
        <BrowserRouter>
          <GA4Tracker />
          <MaskTransition />
          <PageTransition>
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/case-study/manage-farms" element={<ManageFarms />} />
                <Route path="/case-study/influencer-marketing" element={<InfluencerMarketing />} />
                <Route path="/case-study/task-reminders" element={<TaskReminders />} />
                <Route path="/case-study/sustainable-packaging" element={<SustainablePackaging />} />
                <Route path="/case-study/christine-valmy" element={<ChristineValmy />} />
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