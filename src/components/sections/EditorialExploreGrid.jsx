import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModelViewer from '../media/ModelViewer';
import { projects, categories } from '../../data/projectsData';
import { useBlob } from '../../contexts/BlobContext';
import '../../style/editorialExplore.css';

const BLOB_ROW        = ['Aura'];
const TALL_COLUMNS    = ['Central Ciborium', 'VR Head Gestures', 'Owlette'];
const LANDSCAPE_PAIR  = ["Mother's Day Gifts", 'Design Fiction'];
const MODEL_QUAD      = ['Treatment Lotion', 'Holiday Box', 'Disney Hats', 'Holiday Reindeer'];
const PAINTING_QUAD   = ['Energon', 'Guiding Light', 'Sanctuary', 'Dichotomy Within'];
const FULL_ROW        = ['Wanda'];
const PAIR_ROW        = ['Recyclar', 'Luminote'];

const byTitle = (title) => projects.find(p => p.title === title);

// ── EditorialCard ─────────────────────────────────────────────────────────────

let blobPresetIdx = 0;

function EditorialCard({ project, isFiltered, isSelected, layout, onClick, onHover, onHoverEnd }) {
    const [hovered, setHovered] = useState(false);
    const [tilt, setTilt]       = useState({ x: 0, y: 0 });
    const videoRef = useRef(null);
    const cardRef  = useRef(null);
    const { setBlobProject, clearBlobProject } = useBlob();

    const handleMouseEnter = useCallback(() => {
        setHovered(true);
        onHover?.();
        if (project.isBlob && project.presets) {
            const preset = project.presets[blobPresetIdx % project.presets.length];
            blobPresetIdx++;
            setBlobProject({ colorA: preset.colorA, colorB: preset.colorB, amplitude: preset.amplitude, frequency: preset.frequency, speed: preset.speed }, null);
        } else if (project.blob) {
            setBlobProject(project.blob, project.image);
        }
        if (videoRef.current) videoRef.current.play().catch(() => {});
    }, [project, setBlobProject, onHover]);

    const handleMouseLeave = useCallback(() => {
        setHovered(false);
        setTilt({ x: 0, y: 0 });
        onHoverEnd?.();
        clearBlobProject();
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [clearBlobProject, onHoverEnd]);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -8, y: x * 8 });
    }, []);

    const hasVideo = !!project.video;
    const hasModel = !!project.model;

    const blobMediaStyle = project.isBlob ? {
        background: `radial-gradient(ellipse at 40% 40%, ${project.blob.colorA}44, ${project.blob.colorB}88)`,
    } : {};

    return (
        <motion.div
            className={`editorial-card-wrap editorial-card-wrap--${layout} ${isFiltered ? 'is-filtered' : ''}`}
            animate={{ opacity: isFiltered ? 0.2 : 1, scale: isFiltered ? 0.97 : 1 }}
        >
            <article
                ref={cardRef}
                className={`editorial-card editorial-card--${layout} ${isSelected ? 'is-selected' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                onClick={onClick}
                style={{
                    transform: hovered
                        ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                        : 'perspective(800px) rotateX(0deg) rotateY(0deg)',
                    transition: hovered
                        ? 'transform 0.1s ease-out'
                        : 'transform 0.4s ease-out, opacity 0.3s ease',
                }}
            >
                <div className="editorial-card__media" style={blobMediaStyle}>
                    {project.isBlob ? (
                        <div className="editorial-card__blob-hint">
                            <span className="editorial-card__blob-icon">◎</span>
                            <span className="editorial-card__blob-label">Audio Reactive</span>
                        </div>
                    ) : (
                        <>
                            {hasVideo && (
                                <video
                                    ref={videoRef}
                                    src={project.video}
                                    className={`editorial-card__video ${hovered ? 'is-playing' : ''}`}
                                    muted loop playsInline preload="none"
                                />
                            )}
                            {hasModel && !hasVideo ? (
                                <div className="editorial-card__model">
                                    <ModelViewer modelPath={project.model} imagePath={project.image} title={project.title} />
                                </div>
                            ) : (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className={`editorial-card__image ${hovered && hasVideo ? 'is-hidden' : ''}`}
                                    loading="lazy"
                                />
                            )}
                            {project.brand && <span className="editorial-card__brand-watermark">{project.brand}</span>}
                            {project.logo  && <img src={project.logo} alt={project.brand} className="editorial-card__logo" />}
                        </>
                    )}
                </div>

                <div className="editorial-card__info">
                    <div className="editorial-card__tags">
                        {project.categories.map(cat => (
                            <span key={cat} className="editorial-card__tag" style={{ '--cat-color': categories[cat].color }}>
                                {categories[cat].name}
                            </span>
                        ))}
                    </div>
                    <h3 className="editorial-card__title">{project.title}</h3>
                    <p className="editorial-card__desc">{project.description}</p>
                </div>

                {(project.brand || project.year) && (
                    <div className="editorial-card__corner-label">
                        {project.brand && <span className="editorial-card__corner-brand">{project.brand}</span>}
                        {project.year  && <span className="editorial-card__corner-year">{project.year}</span>}
                    </div>
                )}

                {(hasModel || hasVideo) && (
                    <span className="editorial-card__badge">{hasVideo ? '▶' : '3D'}</span>
                )}
            </article>
        </motion.div>
    );
}

// ── Grid ──────────────────────────────────────────────────────────────────────

export default function EditorialExploreGrid({ selectedProject, panelOpen, onSelect, onHover, onHoverEnd }) {
    const [activeCategories, setActiveCategories] = useState(new Set());
    const gridRef = useRef(null);

    const toggleCategory = (cat) => {
        setActiveCategories(prev => {
            const next = new Set(prev);
            next.has(cat) ? next.delete(cat) : next.add(cat);
            return next;
        });
    };

    const isFiltered = (project) => {
        if (activeCategories.size === 0) return false;
        return !project.categories.some(c => activeCategories.has(c));
    };

    const card = (title, layout) => {
        const p = byTitle(title);
        if (!p) return null;
        return (
            <EditorialCard
                key={p.title}
                project={p}
                layout={layout}
                isFiltered={isFiltered(p)}
                isSelected={selectedProject?.title === p.title}
                onClick={() => onSelect?.(p)}
                onHover={() => selectedProject && onHover?.(p)}
                onHoverEnd={() => selectedProject && onHoverEnd?.()}
            />
        );
    };

    const isSplit = !!panelOpen;

    return (
        <section ref={gridRef} className={`editorial-explore ${isSplit ? 'is-split' : ''}`}>

            <div className="editorial-explore__header">
                <h2 className="editorial-explore__title">Experiments</h2>
                <p className="editorial-explore__subtitle">
                    Interactive 3D, motion design, AR, and creative explorations
                </p>
            </div>

            <div className="editorial-explore__filters">
                {Object.entries(categories).map(([key, { name, color }]) => (
                    <button
                        key={key}
                        className={`editorial-filter-btn ${activeCategories.has(key) ? 'is-active' : ''}`}
                        style={{ '--cat-color': color }}
                        onClick={() => toggleCategory(key)}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <div className="explore-row-nk26 explore-row--blob-nk26">
                {BLOB_ROW.map(t => card(t, 'landscape'))}
            </div>

            <div className="explore-row-nk26 explore-row--tall-cols-nk26">
                {TALL_COLUMNS.map(t => card(t, 'tall'))}
            </div>

            <div className="explore-row-nk26 explore-row--landscape-pair-nk26">
                {LANDSCAPE_PAIR.map(t => card(t, 'landscape'))}
            </div>

            <div className="explore-row-nk26 explore-row--double-quad-nk26">
                <div className="explore-quad-nk26">
                    {MODEL_QUAD.map(t => card(t, 'quad'))}
                </div>
                <div className="explore-quad-nk26">
                    {PAINTING_QUAD.map(t => card(t, 'quad'))}
                </div>
            </div>

            <div className="explore-row-nk26 explore-row--full-row-nk26">
                {FULL_ROW.map(t => card(t, 'landscape'))}
            </div>

            <div className="explore-row-nk26 explore-row--landscape-pair-nk26">
                {PAIR_ROW.map(t => card(t, 'landscape'))}
            </div>

        </section>
    );
}
