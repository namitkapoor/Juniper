import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function useClarity(projectId) {
  useEffect(() => {
    // Only initialize in production and if project ID exists
    if (!projectId || !import.meta.env.PROD) {
      return;
    }

    // Initialize Microsoft Clarity
    try {
      Clarity.init(projectId);
      Clarity.consent(); // Grant consent for tracking
    } catch (error) {
      console.error('Failed to initialize Clarity:', error);
    }

    // Cleanup function
    return () => {
      // Clarity doesn't require explicit cleanup
      // The script will persist across route changes
    };
  }, [projectId]);
}