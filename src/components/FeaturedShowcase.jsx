import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeMute, FaVolumeUp, FaPlay, FaPause, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import IframeLoader from './IframeLoader';
import '../style/featuredShowcase.css';

export default function FeaturedShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const videoRef = useRef(null);
    const iframeRef = useRef(null);
    
    const handleIframeLoad = () => {
        // Set a short delay to make sure the iframe content is fully rendered
        setTimeout(() => {
            setIframeLoaded(true);
        }, 1500);
    };
    
    // Reset iframe loaded state when switching showcases
    useEffect(() => {
        if (currentIndex === 0) {
            setIframeLoaded(false);
        }
    }, [currentIndex]);
    
    const showcases = [
        {
            type: 'audio-reactive',
            title: 'Sound Waves in Space',
            description: "An interactive audio-reactive visualization that transforms sound into stunning visual patterns.",
            component: (
                <div className="iframe-container">
                    <IframeLoader loaded={iframeLoaded} />
                    <iframe
                        ref={iframeRef}
                        src="https://waddle-tunes.vercel.app/"
                        title="Interactive Sound Visualization"
                        className="showcase-frame"
                        allow="autoplay; microphone; camera; fullscreen"
                        loading="lazy"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-pointer-lock"
                        onLoad={handleIframeLoad}
                        style={{
                            pointerEvents: 'auto',
                            touchAction: 'manipulation'
                        }}
                    />
                </div>
            )
        },
        {
            type: 'video',
            title: 'Recent Work',
            description: "A glimpse into my experiments with 3D, motion, and interaction design.",
            component: (
                <div className="video-container">
                    <video 
                        ref={videoRef}
                        className="showcase-video"
                        src="./videos/Experiments/Portfolio Reel/Portfolio Reel - 3D.mp4" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                    />
                    <button 
                        className="video-play-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (videoRef.current) {
                                if (videoRef.current.paused) {
                                    videoRef.current.play();
                                    setIsPlaying(true);
                                } else {
                                    videoRef.current.pause();
                                    setIsPlaying(false);
                                }
                            }
                        }}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <div className="video-controls">
                        <button 
                            className="video-mute-toggle" 
                            onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.muted = !videoRef.current.muted;
                                    setIsMuted(!isMuted);
                                }
                            }}
                            onMouseEnter={() => setShowVolumeSlider(true)}
                        >
                            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                        <div 
                            className={`volume-slider-container ${showVolumeSlider ? 'visible' : ''}`}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => {
                                    const newVolume = parseFloat(e.target.value);
                                    setVolume(newVolume);
                                    if (videoRef.current) {
                                        videoRef.current.volume = newVolume;
                                        if (newVolume === 0) {
                                            videoRef.current.muted = true;
                                            setIsMuted(true);
                                        } else if (isMuted) {
                                            videoRef.current.muted = false;
                                            setIsMuted(false);
                                        }
                                    }
                                }}
                                className="volume-slider"
                            />
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const nextShowcase = () => {
        setCurrentIndex((prev) => (prev + 1) % showcases.length);
    };

    const prevShowcase = () => {
        setCurrentIndex((prev) => (prev - 1 + showcases.length) % showcases.length);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('play', () => setIsPlaying(true));
            videoElement.addEventListener('pause', () => setIsPlaying(false));
            return () => {
                videoElement.removeEventListener('play', () => setIsPlaying(true));
                videoElement.removeEventListener('pause', () => setIsPlaying(false));
            };
        }
    }, []);

    return (
        <section className="featured-showcase">
            <div className="featured-header">
                <h2 className="featured-title">Featured Work</h2>
                <p className="featured-subtitle">
                    Dive into my latest explorations in interactive design and creative technology
                </p>
            </div>

            <div className="showcase-container">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="showcase-content"
                    >
                        <div className="showcase-info">
                            <h3 className="showcase-title">{showcases[currentIndex].title}</h3>
                            <p className="showcase-description">{showcases[currentIndex].description}</p>
                        </div>
                        {showcases[currentIndex].component}
                    </motion.div>
                </AnimatePresence>

                <button className="showcase-nav prev" onClick={prevShowcase}>
                    <FaChevronLeft />
                </button>
                <button className="showcase-nav next" onClick={nextShowcase}>
                    <FaChevronRight />
                </button>

                <div className="showcase-indicators">
                    {showcases.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 