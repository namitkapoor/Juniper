import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoaderScreen({ onLoadingComplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showHappyEyes, setShowHappyEyes] = useState(false);

  // More deliberate eye movement sequence
  const eyeMotion = {
    x: [0, 0, 5, 5, -5, -5, 0],  // Movement with pauses
    transition: {
      duration: 3,
      times: [0, 0.1, 0.3, 0.45, 0.6, 0.75, 0.9],
      ease: "easeInOut"
    }
  };

  useEffect(() => {
    // Removed initial blink sequence
    
    // Final sequence - just one blink before happy eyes
    const finalBlinkStart = setTimeout(() => setIsBlinking(true), 3500);
    const finalBlinkEnd = setTimeout(() => {
      setIsBlinking(false);
      setShowHappyEyes(true);
    }, 3700);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(onLoadingComplete, 2000);
    }, 4500);

    return () => {
      clearTimeout(finalBlinkStart);
      clearTimeout(finalBlinkEnd);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <>
      <motion.div
        className="content-blur"
        initial={{ backdropFilter: 'blur(10px)' }}
        animate={{ 
          backdropFilter: isLoading ? 'blur(10px)' : 'blur(0px)',
          opacity: isLoading ? 1 : 0
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 998,
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      />

      <motion.div
        className="loader-screen"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: isLoading ? 1 : 0,
          pointerEvents: isLoading ? 'auto' : 'none',
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'var(--background)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }}
      >
        <div className="loader-content" style={{ marginTop: '25vh' }}>
          <div className="glasses-container">
            <svg
              width="160"
              height="70"
              viewBox="0 0 160 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: !isBlinking ? 'blur(0.5px)' : 'none' }}
            >
              {/* Outline paths - adjusted for new viewBox */}
              <path
                d="M30 35C30 23.9543 38.9543 15 50 15C61.0457 15 70 23.9543 70 35C70 46.0457 61.0457 55 50 55C38.9543 55 30 46.0457 30 35Z"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M90 35C90 23.9543 98.9543 15 110 15C121.046 15 130 23.9543 130 35C130 46.0457 121.046 55 110 55C98.9543 55 90 46.0457 90 35Z"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M70 35C70 35 75 35 80 35C85 35 90 35 90 35"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M30 35C25 35 15 32 5 28"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M130 35C135 35 145 32 155 28"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Animated filling paths - same paths but animated */}
              <motion.path
                d="M30 35C30 23.9543 38.9543 15 50 15C61.0457 15 70 23.9543 70 35C70 46.0457 61.0457 55 50 55C38.9543 55 30 46.0457 30 35Z"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M90 35C90 23.9543 98.9543 15 110 15C121.046 15 130 23.9543 130 35C130 46.0457 121.046 55 110 55C98.9543 55 90 46.0457 90 35Z"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M70 35C70 35 75 35 80 35C85 35 90 35 90 35"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M30 35C25 35 15 32 5 28"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M130 35C135 35 145 32 155 28"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />

              {/* Simple oval eyes */}
              {!showHappyEyes && (
                <>
                  <motion.ellipse
                    cx="50"
                    cy="35"
                    rx="4"
                    ry="6"
                    fill="white"
                    animate={!isBlinking ? eyeMotion : { scale: 0.1 }}
                    transition={{ duration: 0.1 }}
                  />
                  <motion.ellipse
                    cx="110"
                    cy="35"
                    rx="4"
                    ry="6"
                    fill="white"
                    animate={!isBlinking ? eyeMotion : { scale: 0.1 }}
                    transition={{ duration: 0.1 }}
                  />
                </>
              )}

              {/* Simple happy curved eyes */}
              {showHappyEyes && (
                <>
                  <motion.path
                    d="M45 35C47 31 53 31 55 35"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.path
                    d="M105 35C107 31 113 31 115 35"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </svg>
          </div>
          <motion.p
            className="loader-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2 }}  // Slower text fade-in
            style={{
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              fontSize: '0.8rem',  // Slightly smaller
              letterSpacing: '4.5px',  // Better readability
              fontWeight: 100,  // Medium weight


              color: 'rgba(191, 191, 191, 0.9)',  // Brighter text
              textShadow: '0 0 10px rgba(0, 0, 0, 0.3)',  // Subtle glow
              marginTop: '0.5rem'  // More space between glasses and text
            }}
          >
            Putting on my problem solving glasses
          </motion.p>
        </div>
      </motion.div>
    </>
  );
} 