import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransition } from '../../contexts/TransitionContext';
import { useNavigate } from 'react-router-dom';

export default function MaskTransition() {
  const { isTransitioning, transitionData, endTransition } = useTransition();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (isTransitioning && transitionData) {
      // Start video if provided
      if (transitionData.videoSrc && videoRef.current) {
        videoRef.current.play().catch(console.error);
      }

      // Navigate after mask starts expanding
      const navigateTimer = setTimeout(() => {
        navigate(transitionData.path);
      }, 100);

      // End transition after mask fully covers and page has time to load
      const endTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        endTransition();
      }, 700);

      return () => {
        clearTimeout(navigateTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isTransitioning, transitionData, navigate, endTransition]);

  // Calculate mask origin position (default to center if not provided)
  const originX = transitionData?.originX ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 50);
  const originY = transitionData?.originY ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 50);
  const originPercentX = typeof window !== 'undefined' ? (originX / window.innerWidth) * 100 : 50;
  const originPercentY = typeof window !== 'undefined' ? (originY / window.innerHeight) * 100 : 50;

  return (
    <AnimatePresence>
      {isTransitioning && transitionData && (
        <motion.div
          key="mask-overlay"
          initial={{ clipPath: `circle(0% at ${originPercentX}% ${originPercentY}%)` }}
          animate={{ clipPath: `circle(150% at ${originPercentX}% ${originPercentY}%)` }}
          exit={{ opacity: 0 }}
          transition={{
            clipPath: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] },
            opacity: { duration: 0.3 }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--background, #1d1d1d)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}
