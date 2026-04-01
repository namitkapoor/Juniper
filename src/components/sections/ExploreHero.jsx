import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlob } from '../../contexts/BlobContext';
import { BlobHero } from '../media/StudioBlob';
import '../../style/exploreHero.css';

export default function ExploreHero({ onPlayNow, blobActive = true }) {
    const { isPlaying, stopAudio } = useBlob();
    const [audioHovered, setAudioHovered] = useState(false);
    const [blobReady,    setBlobReady]    = useState(false);

    // Blob fades in after tagline settles
    useEffect(() => {
        const t = setTimeout(() => setBlobReady(true), 400);
        return () => clearTimeout(t);
    }, []);

    const showAudioCta = isPlaying || audioHovered;

    return (
        <section className="explore-hero">

            {/* Blob — scales up from center after tagline */}
            <div className="blob-hero-center-nk26" style={{ display: blobActive ? 'block' : 'none' }}>
                <motion.div
                    className="blob-hero-anim-nk26"
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={blobReady
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.88 }
                    }
                    transition={{
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <BlobHero />
                </motion.div>
            </div>

            {/* Tagline */}
            <div className="explore-hero__tagline">
                <motion.span
                    className="explore-hero__tagline-line"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.28, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    Work that moves.
                </motion.span>

                <motion.span
                    className="explore-hero__tagline-interactive"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    onMouseEnter={() => setAudioHovered(true)}
                    onMouseLeave={() => setAudioHovered(false)}
                    onClick={() => !isPlaying && onPlayNow?.()}
                >
                    <AnimatePresence mode="wait">
                        {showAudioCta ? (
                            <motion.button
                                key="audio-cta"
                                className={`explore-hero__audio-inline ${isPlaying ? 'is-playing' : ''}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    isPlaying ? stopAudio() : onPlayNow?.();
                                }}
                            >
                                {isPlaying ? (
                                    <><span className="audio-pulse" /> Stop</>
                                ) : (
                                    <>↓ Let it hear you</>
                                )}
                            </motion.button>
                        ) : (
                            <motion.span
                                key="literally"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25 }}
                            >
                                Sometimes literally.
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.span>
            </div>

            {/* Scroll cue */}
            <div className="explore-hero__scroll">
                <span>Scroll</span>
                <div className="explore-hero__scroll-line" />
            </div>
        </section>
    );
}
