import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import "../style/navbar.css"

export default function Navbar() {
    const [isBlinking, setIsBlinking] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    // Eye movement animation
    const eyeMotion = {
        x: [0, 3, -3, 0],
        transition: {
            duration: 1.8,
            times: [0, 0.33, 0.66, 1],
            ease: "easeInOut"
        }
    };

    // Random blinking and movement effects
    useEffect(() => {
        const createBlinkInterval = () => {
            const randomDelay = Math.random() * 4000 + 2000;
            return setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => {
                    setIsBlinking(false);
                    createBlinkInterval();
                }, 200);
            }, randomDelay);
        };

        const createMoveInterval = () => {
            const randomDelay = Math.random() * 5000 + 3000;
            return setTimeout(() => {
                setIsMoving(true);
                setTimeout(() => {
                    setIsMoving(false);
                    createMoveInterval();
                }, 2000);
            }, randomDelay);
        };

        const blinkTimeout = createBlinkInterval();
        const moveTimeout = createMoveInterval();

        return () => {
            clearTimeout(blinkTimeout);
            clearTimeout(moveTimeout);
        };
    }, []);

    return <>
        <div className="navigation">
            <div className="nav-items">
                <div className="logo-container">
                    <a className="logo-placeholder" href="/">
                        <div className="logo-with-text">
                            <svg
                                width="60"
                                height="30"
                                viewBox="0 0 120 50"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Glasses frames */}
                                <motion.path
                                    d="M20 25C20 16.7157 26.7157 10 35 10C43.2843 10 50 16.7157 50 25C50 33.2843 43.2843 40 35 40C26.7157 40 20 33.2843 20 25Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    d="M70 25C70 16.7157 76.7157 10 85 10C93.2843 10 100 16.7157 100 25C100 33.2843 93.2843 40 85 40C76.7157 40 70 33.2843 70 25Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    d="M50 25C50 25 55 25 60 25C65 25 70 25 70 25"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    d="M20 25C15 25 10 23 5 20"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <motion.path
                                    d="M100 25C105 25 110 23 115 20"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                {/* Eyes */}
                                <motion.ellipse
                                    cx="35"
                                    cy="25"
                                    rx="4"
                                    ry="6"
                                    fill="white"
                                    animate={!isBlinking ? {
                                        ...(isMoving ? eyeMotion : {}),
                                        scaleY: 1
                                    } : {
                                        scaleY: 0.1
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                                <motion.ellipse
                                    cx="85"
                                    cy="25"
                                    rx="4"
                                    ry="6"
                                    fill="white"
                                    animate={!isBlinking ? {
                                        ...(isMoving ? eyeMotion : {}),
                                        scaleY: 1
                                    } : {
                                        scaleY: 0.1
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                            </svg>
                            <span className="logo-text">namit</span>
                        </div>
                    </a>
                </div>
                
                <div className="nav-links">
                    <a className="nav-item" href="/about">about</a>
                    <a className="nav-item" href="/files/KapoorNamit_Resume.pdf" target="_blank">resume</a>
                </div>
            </div>
        </div>
    </>
}