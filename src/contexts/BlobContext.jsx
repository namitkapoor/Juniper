import { createContext, useContext, useState, useRef, useCallback } from 'react';

export const BLOB_IDLE = {
    colorA: '#ffffff',
    colorB: '#d0d0d0',
    amplitude: 0.20,
    frequency: 1.8,
    speed: 1.6,
};

const BlobContext = createContext({
    blobState: BLOB_IDLE,
    blobImage: null,
    setBlobProject: () => {},
    clearBlobProject: () => {},
    audioData: null,
    startAudio: async () => {},
    stopAudio: () => {},
    isPlaying: false,
});

export function BlobProvider({ children }) {
    const [blobState, setBlobState]   = useState(BLOB_IDLE);
    const [blobImage, setBlobImage]   = useState(null);
    const [audioData, setAudioData]   = useState(null);
    const [isPlaying, setIsPlaying]   = useState(false);
    const audioCtxRef  = useRef(null);
    const analyserRef  = useRef(null);
    const sourceRef    = useRef(null);
    const rafRef       = useRef(null);
    const projectRef   = useRef(null);

    const tick = useCallback(() => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        setAudioData(data.slice());
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const startAudio = useCallback(async (file) => {
        if (sourceRef.current)  { sourceRef.current.disconnect(); sourceRef.current = null; }
        if (audioCtxRef.current) { await audioCtxRef.current.close(); }
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        const ctx      = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;

        const buffer = await file.arrayBuffer();
        const decoded = await ctx.decodeAudioData(buffer);
        const source = ctx.createBufferSource();
        source.buffer = decoded;
        source.loop   = true;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        await ctx.resume();
        source.start();

        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current   = source;
        setIsPlaying(true);

        if (!projectRef.current) {
            setBlobState({ colorA: '#ff9a3c', colorB: '#9b2cfa', amplitude: 0.12, frequency: 2.5, speed: 1.2 });
        }
        tick();
    }, [tick]);

    const stopAudio = useCallback(() => {
        if (sourceRef.current)  { sourceRef.current.disconnect(); sourceRef.current = null; }
        if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        setAudioData(null);
        setIsPlaying(false);
        if (!projectRef.current) setBlobState(BLOB_IDLE);
    }, []);

    const setBlobProject = useCallback((blob, image) => {
        projectRef.current = blob;
        setBlobState(blob);
        setBlobImage(image || null);
    }, []);

    const clearBlobProject = useCallback(() => {
        projectRef.current = null;
        setBlobImage(null);
        setBlobState(isPlaying
            ? { colorA: '#ff9a3c', colorB: '#9b2cfa', amplitude: 0.12, frequency: 2.5, speed: 1.2 }
            : BLOB_IDLE
        );
    }, [isPlaying]);

    return (
        <BlobContext.Provider value={{
            blobState, blobImage, setBlobProject, clearBlobProject,
            audioData, startAudio, stopAudio, isPlaying,
        }}>
            {children}
        </BlobContext.Provider>
    );
}

export const useBlob = () => useContext(BlobContext);
