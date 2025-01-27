import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [location]);

    return (
        <div style={{ position: 'relative' }}>
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        key={location.pathname}
                        initial={{ filter: 'blur(20px)', opacity: 0 }}
                        animate={{ filter: 'blur(0px)', opacity: 1 }}
                        exit={{ filter: 'blur(20px)', opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#1a1a1a',
                            zIndex: 1000,
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </AnimatePresence>
            {!isTransitioning && (
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {children}
                </div>
            )}
        </div>
    );
} 