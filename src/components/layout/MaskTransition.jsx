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

      // Navigate after a brief delay to allow mask to start
      const navigateTimer = setTimeout(() => {
        navigate(transitionData.path);
      }, 50);

      // End transition after mask animation completes
      const endTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        endTransition();
      }, 700); // Match the mask animation duration (600ms) + buffer

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
        <>
          {/* Mask overlay - circular reveal from click position */}
          <motion.div
            initial={{ clipPath: `circle(0% at ${originPercentX}% ${originPercentY}%)` }}
            animate={{ clipPath: `circle(150% at ${originPercentX}% ${originPercentY}%)` }}
            exit={{ clipPath: `circle(150% at ${originPercentX}% ${originPercentY}%)` }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--background, #d6cccc)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          />
          
          {/* Video overlay for Manage Farms */}
          {transitionData.videoSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90vw',
                maxWidth: '1200px',
                height: 'auto',
                zIndex: 10000,
                pointerEvents: 'none',
              }}
            >
              <video
                ref={videoRef}
                src={transitionData.videoSrc}
                muted
                playsInline
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
