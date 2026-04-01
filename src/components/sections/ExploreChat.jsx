import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '../../data/projectsData';
import { useBlob } from '../../contexts/BlobContext';
import { BlobHero } from '../media/StudioBlob';
import '../../style/exploreChat.css';

const ModelViewer = lazy(() => import('../media/ModelViewer'));

function ChatMessage({ msg, project }) {
    const isUser = msg.role === 'user';
    return (
        <motion.div
            className={`explore-chat__msg-nk26 ${isUser ? 'is-user' : 'is-agent'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {!isUser && (
                <div className="explore-chat__avatar-nk26">
                    <img src={project.image} alt={project.title} />
                </div>
            )}
            <div className="explore-chat__bubble-nk26">{msg.text}</div>
        </motion.div>
    );
}

// ── Blob panel — replaces standard media + suggestions ────────────────────────
function BlobPanel({ project }) {
    const { setBlobProject, startAudio, stopAudio, isPlaying } = useBlob();
    const [activePreset, setActivePreset] = useState(null);
    const uploadRef = useRef();

    const applyPreset = (preset) => {
        setActivePreset(preset.label);
        setBlobProject({
            colorA: preset.colorA, colorB: preset.colorB,
            amplitude: preset.amplitude, frequency: preset.frequency, speed: preset.speed,
        }, null);
    };

    const handleFile = async (file) => {
        if (!file) return;
        setActivePreset(null);
        await startAudio(file);
        if (uploadRef.current) uploadRef.current.value = '';
    };

    return (
        <>
            {/* Live blob canvas */}
            <div className="explore-chat__media-nk26 explore-chat__media--blob-nk26">
                <BlobHero />
            </div>

            {/* Presets */}
            <div className="explore-chat__feed-nk26">
                <p className="explore-chat__suggestions-label-nk26">Presets</p>
                <div className="explore-chat__presets-nk26">
                    {project.presets.map(preset => (
                        <button
                            key={preset.label}
                            className={`explore-chat__preset-nk26 ${activePreset === preset.label ? 'is-active' : ''}`}
                            style={{
                                '--preset-a': preset.colorA,
                                '--preset-b': preset.colorB,
                            }}
                            onClick={() => applyPreset(preset)}
                        >
                            <span className="explore-chat__preset-dot-nk26" />
                            {preset.label}
                        </button>
                    ))}
                </div>

                <p className="explore-chat__suggestions-label-nk26" style={{ marginTop: '1.25rem' }}>
                    Your audio
                </p>
                <p className="explore-chat__upload-hint-nk26">
                    Drop any MP3 to drive the sculpture with your own music.
                </p>

                <input
                    ref={uploadRef}
                    type="file"
                    accept=".mp3,audio/mpeg"
                    style={{ display: 'none' }}
                    onChange={e => handleFile(e.target.files[0])}
                />
            </div>

            {/* Play / pause + upload row */}
            <div className="explore-chat__input-row-nk26">
                <button
                    className="explore-chat__audio-upload-nk26"
                    onClick={() => uploadRef.current?.click()}
                >
                    Upload MP3
                </button>
                {isPlaying && (
                    <button
                        className="explore-chat__send-nk26"
                        onClick={stopAudio}
                        aria-label="Stop audio"
                        title="Stop"
                    >
                        ■
                    </button>
                )}
            </div>
        </>
    );
}

// ── Main chat panel ───────────────────────────────────────────────────────────
export default function ExploreChat({ project, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput]       = useState('');
    const messagesEndRef = useRef();

    useEffect(() => {
        setMessages([]);
        setInput('');
    }, [project?.title]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (text) => {
        if (!text.trim()) return;
        const userMsg  = { role: 'user',  text: text.trim() };
        const response = project.chatResponses?.[text.trim()];
        const agentMsg = {
            role: 'agent',
            text: response || "I don't have a pre-written answer for that — but feel free to reach out via the contact section below.",
        };
        setMessages(prev => [...prev, userMsg, agentMsg]);
        setInput('');
    };

    const showSuggestions = project.suggestedQuestions?.length > 0 && messages.length === 0;

    return (
        <div className="explore-chat-nk26">
            {/* Header */}
            <div className="explore-chat__header-nk26">
                <div className="explore-chat__header-meta-nk26">
                    {project.year && <span className="explore-chat__year-nk26">{project.year}</span>}
                    <div className="explore-chat__tags-nk26">
                        {project.categories.map(cat => (
                            <span
                                key={cat}
                                className="explore-chat__tag-nk26"
                                style={{ '--cat-color': categories[cat].color }}
                            >
                                {categories[cat].name}
                            </span>
                        ))}
                    </div>
                </div>
                <h2 className="explore-chat__title-nk26">
                    {project.brand && <span className="explore-chat__brand-nk26">{project.brand}</span>}
                    {project.title}
                </h2>
                <button className="explore-chat__close-nk26" onClick={onClose} aria-label="Close">✕</button>
            </div>

            {/* Blob project gets its own panel */}
            {project.isBlob ? (
                <BlobPanel project={project} />
            ) : (
                <>
                    {/* Standard media */}
                    <div className="explore-chat__media-nk26">
                        {project.model ? (
                            <Suspense fallback={<img src={project.image} alt={project.title} className="explore-chat__media-img-nk26" />}>
                                <ModelViewer
                                    modelPath={project.model}
                                    imagePath={project.image}
                                    title={project.title}
                                />
                            </Suspense>
                        ) : project.video ? (
                            <video
                                src={project.video}
                                className="explore-chat__media-video-nk26"
                                autoPlay muted loop playsInline
                            />
                        ) : (
                            <img src={project.image} alt={project.title} className="explore-chat__media-img-nk26" />
                        )}
                    </div>

                    {/* Messages + suggestions */}
                    <div className="explore-chat__feed-nk26">
                        <AnimatePresence>
                            {showSuggestions && (
                                <motion.div
                                    className="explore-chat__suggestions-nk26"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <p className="explore-chat__suggestions-label-nk26">Suggested Questions</p>
                                    {project.suggestedQuestions.map(q => (
                                        <button
                                            key={q}
                                            className="explore-chat__suggestion-nk26"
                                            onClick={() => sendMessage(q)}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {messages.map((msg, i) => (
                            <ChatMessage key={i} msg={msg} project={project} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="explore-chat__input-row-nk26">
                        <input
                            className="explore-chat__input-nk26"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                            placeholder="Have a question?"
                            aria-label="Chat input"
                        />
                        <button
                            className="explore-chat__send-nk26"
                            onClick={() => sendMessage(input)}
                            aria-label="Send"
                        >
                            ▶
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
