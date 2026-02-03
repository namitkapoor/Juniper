// Analytics Configuration (reference only — GA4 & Clarity are loaded via GTM; see docs/GTM-SETUP.md)
// Clarity: https://clarity.microsoft.com
// Google Analytics: https://analytics.google.com

export const analyticsConfig = {
  clarity: {
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID,
  },
  googleAnalytics: {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  },
};