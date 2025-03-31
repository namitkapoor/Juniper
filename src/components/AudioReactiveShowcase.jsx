import React from 'react';
import '../style/audioReactiveShowcase.css';

export default function AudioReactiveShowcase() {
    return (
        <section className="audio-reactive-section">
            <h2 className="audio-reactive-title">Audio Reactive Experiments</h2>
            <div className="audio-reactive-container">
                <iframe
                    src="https://waddle-tunes.vercel.app/"
                    title="Audio Reactive Experiments"
                    className="audio-reactive-frame"
                    allow="autoplay; microphone"
                    loading="lazy"
                />
            </div>
        </section>
    );
} 