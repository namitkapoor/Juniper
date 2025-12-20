import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

export function useGoogleAnalytics(measurementId) {
  const location = useLocation();

  // Initialize GA4 on mount (only in production)
  useEffect(() => {
    if (!measurementId || !import.meta.env.PROD) {
      return;
    }

    try {
      ReactGA.initialize(measurementId, {
        gaOptions: {
          siteSpeedSampleRate: 100, // Track all page load times
        },
      });
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }, [measurementId]);

  // Track page views on route change (only in production)
  useEffect(() => {
    if (!measurementId || !import.meta.env.PROD) return;

    try {
      // Send pageview with current path
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
        title: document.title,
      });
    } catch (error) {
      console.error('Failed to track pageview:', error);
    }
  }, [location, measurementId]);
}