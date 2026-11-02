/**
 * Port of Juniper's About particle portrait (src/components/media/AboutCanvas.jsx
 * + AboutModel.jsx, read-only reference): a 129x129 grid of particles samples
 * the portrait; the pointer pushes them through a displacement canvas.
 * Differences: the texture is about.json `portrait.src`; the background is the
 * stage's; it pauses off-screen (frameloop "never"), and under reduced motion
 * renders one static frame (frameloop "demand"). Lives in its own chunk.
 */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

function Model({ src }) {
  const { scene, gl, size, camera } = useThree();
  const materialRef = useRef();
  const disp = useRef({});
  const ready = useRef(false);

  useEffect(() => {
    const d = disp.current;
    d.canvas = document.createElement("canvas");
    d.canvas.width = d.canvas.height = 128;
    d.context = d.canvas.getContext("2d");
    d.context.fillRect(0, 0, 128, 128);
    d.glowImage = new Image();
    d.glowImage.src = "/assets/about/glow.png";
    d.canvasCursor = new THREE.Vector2(9999, 9999);
    d.canvasCursorPrevious = new THREE.Vector2(9999, 9999);
    d.texture = new THREE.CanvasTexture(d.canvas);

    // Unit plane, scaled to the photo's aspect once it loads (portrait.webp is
    // 1085 x 1450, so start there): the face keeps its real proportions.
    const geo = new THREE.PlaneGeometry(1, 1, 128, 128);
    geo.setIndex(null);
    geo.deleteAttribute("normal");
    const n = geo.attributes.position.count;
    const intens = new Float32Array(n), angles = new Float32Array(n);
    for (let i = 0; i < n; i++) { intens[i] = Math.random(); angles[i] = Math.random() * Math.PI * 2; }
    geo.setAttribute("aIntensity", new THREE.BufferAttribute(intens, 1));
    geo.setAttribute("aAngle", new THREE.BufferAttribute(angles, 1));

    const PLANE_H = 10;
    const fit = (aspect) => {
      d.aspect = aspect;
      points.scale.set(PLANE_H * aspect, PLANE_H, 1);
      // Camera distance that shows the whole plane in the canvas, with a margin.
      const cam = camera, half = Math.tan((cam.fov * Math.PI) / 360);
      const el = gl.domElement;
      const canvasAspect = el.clientWidth / Math.max(1, el.clientHeight);
      const zH = PLANE_H / (2 * half), zW = (PLANE_H * aspect) / (2 * half * canvasAspect);
      cam.position.z = Math.max(zH, zW) * 1.06;
      cam.updateProjectionMatrix();
    };
    // TextureLoader fires its onLoad callback, not a DOM "load" event; the old
    // listener never ran, so the image aspect stayed at 1 (a square portrait).
    const tex = new THREE.TextureLoader().load(src, (t) => fit(t.image.width / t.image.height));
    const material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uResolution: new THREE.Uniform(new THREE.Vector2(size.width * devicePixelRatio, size.height * devicePixelRatio)),
        uPictureTexture: new THREE.Uniform(tex),
        uDisplacementTexture: new THREE.Uniform(d.texture),
        uImageAspect: { value: 1.0 },
      },
    });
    materialRef.current = material;
    const points = new THREE.Points(geo, material);
    scene.add(points);
    fit(1085 / 1450);
    d.refit = () => fit(d.aspect);

    const onMove = (e) => {
      const r = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = -((e.clientY - r.top) / r.height) * 2 + 1;
      d.canvasCursor.x = (x + 1) * 0.5 * 128;
      d.canvasCursor.y = (-y + 1) * 0.5 * 128;
    };
    gl.domElement.addEventListener("pointermove", onMove);
    ready.current = true;
    return () => {
      gl.domElement.removeEventListener("pointermove", onMove);
      scene.remove(points); geo.dispose(); material.dispose(); tex.dispose();
      ready.current = false;
    };
  }, [scene, gl, src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    materialRef.current?.uniforms.uResolution.value.set(size.width * devicePixelRatio, size.height * devicePixelRatio);
    disp.current.refit?.();
  }, [size]);

  useFrame(() => {
    const d = disp.current;
    if (!ready.current || !d.context) return;
    d.context.globalCompositeOperation = "source-over";
    d.context.globalAlpha = 0.02;
    d.context.fillRect(0, 0, 128, 128);
    const dist = d.canvasCursorPrevious.distanceTo(d.canvasCursor);
    d.canvasCursorPrevious.copy(d.canvasCursor);
    const g = 128 * 0.25;
    d.context.globalCompositeOperation = "lighten";
    d.context.globalAlpha = Math.min(dist * 0.05, 1);
    if (d.glowImage.complete) d.context.drawImage(d.glowImage, d.canvasCursor.x - g / 2, d.canvasCursor.y - g / 2, g, g);
    d.texture.needsUpdate = true;
  });
  return null;
}

export default function ParticlePortrait({ src, reduced, background = "#141414" }) {
  const box = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        // Framed so the whole 8 x 10 particle plane (the whole face) is in view:
        // z = 5 / tan(22.5deg) for a 45deg vertical field of view.
        camera={{ fov: 45, near: 0.1, far: 2000, position: [0, 0, 12.2] }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <color attach="background" args={[background]} />
        <Model src={src} />
      </Canvas>
    </div>
  );
}
