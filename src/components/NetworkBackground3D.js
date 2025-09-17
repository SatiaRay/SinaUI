import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * NetworkBackground3D
 * - تلاش می‌کند WebGL سه‌بعدی را بسازد.
 * - اگر شکست خورد، حالت fallback 2D را با <canvas> فعال می‌کند که ذرات و "سیم" ها را رسم می‌کند.
 *
 * Props:
 *   fallbackImage = optional image path to show behind 2D canvas (string)
 */
const NetworkBackground3D = ({ fallbackImage = null }) => {
  const containerRef = useRef(null);

  // rendererRef نگهدارندهٔ WebGL renderer در صورت موفقیت
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  // ---------- Effect: init three.js (try/catch) ----------
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) {
      setUseFallback(true);
      return;
    }

    // سریع چک سطحی برای وجود WebGLRenderingContext
    if (typeof window.WebGLRenderingContext === 'undefined') {
      setUseFallback(true);
      return;
    }

    let scene, camera, controls, particles, linesGroup, lineGeometry;
    let particlesMaterial;
    let lastLineUpdate = 0;
    const LINE_UPDATE_INTERVAL = 100;

    const initThree = () => {
      try {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.z = 20;
        camera.position.y = 10;

        const renderer = new THREE.WebGLRenderer({
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        });

        // If getContext fails, throw to fallback
        const gl = renderer.getContext && renderer.getContext();
        if (!gl) throw new Error('No WebGL context');

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        rendererRef.current = renderer;
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.enableZoom = false;
        controls.enablePan = false;

        // Particles
        const particleCount = 150;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          const radius = 15;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = radius * Math.cos(phi);

          colors[i * 3] = 0.2 + Math.random() * 0.2;
          colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
          colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;

          sizes[i] = Math.random() * 2 + 1;
        }

        particlesGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );
        particlesGeometry.setAttribute(
          'color',
          new THREE.BufferAttribute(colors, 3)
        );
        particlesGeometry.setAttribute(
          'size',
          new THREE.BufferAttribute(sizes, 1)
        );

        particlesMaterial = new THREE.ShaderMaterial({
          uniforms: { time: { value: 0 } },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            void main() {
              vColor = color;
              vec3 pos = position;
              pos.x += sin(time + position.y) * 0.2;
              pos.y += cos(time + position.x) * 0.2;
              pos.z += sin(time + position.x) * 0.2;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (200.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              vec2 xy = gl_PointCoord.xy - vec2(0.5);
              float ll = length(xy);
              if (ll > 0.5) discard;
              float alpha = 0.7 * smoothstep(0.5, 0.2, ll);
              gl_FragColor = vec4(vColor, alpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });

        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Lines
        const linesMaterial = new THREE.LineBasicMaterial({
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.3,
        });
        linesGroup = new THREE.Group();
        scene.add(linesGroup);

        const linePositions = new Float32Array(6);
        const lineColors = new Float32Array(6);
        lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute(
          'position',
          new THREE.BufferAttribute(linePositions, 3)
        );
        lineGeometry.setAttribute(
          'color',
          new THREE.BufferAttribute(lineColors, 3)
        );

        // Animate
        const animate = () => {
          frameRef.current = requestAnimationFrame(animate);
          const time = Date.now() * 0.001;
          particlesMaterial.uniforms.time.value = time;

          if (Date.now() - lastLineUpdate > LINE_UPDATE_INTERVAL) {
            while (linesGroup.children.length > 0) {
              linesGroup.remove(linesGroup.children[0]);
            }

            const positionsArray = particles.geometry.attributes.position.array;
            const colorsArray = particles.geometry.attributes.color.array;

            for (let i = 0; i < positionsArray.length; i += 9) {
              for (let j = i + 3; j < positionsArray.length; j += 9) {
                const dx = positionsArray[i] - positionsArray[j];
                const dy = positionsArray[i + 1] - positionsArray[j + 1];
                const dz = positionsArray[i + 2] - positionsArray[j + 2];
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < 30) {
                  linePositions[0] = positionsArray[i];
                  linePositions[1] = positionsArray[i + 1];
                  linePositions[2] = positionsArray[i + 2];
                  linePositions[3] = positionsArray[j];
                  linePositions[4] = positionsArray[j + 1];
                  linePositions[5] = positionsArray[j + 2];

                  lineColors[0] = colorsArray[i];
                  lineColors[1] = colorsArray[i + 1];
                  lineColors[2] = colorsArray[i + 2];
                  lineColors[3] = colorsArray[j];
                  lineColors[4] = colorsArray[j + 1];
                  lineColors[5] = colorsArray[j + 2];

                  lineGeometry.attributes.position.needsUpdate = true;
                  lineGeometry.attributes.color.needsUpdate = true;

                  const line = new THREE.Line(
                    lineGeometry.clone(),
                    linesMaterial
                  );
                  linesGroup.add(line);
                }
              }
            }
            lastLineUpdate = Date.now();
          }

          controls.update();
          rendererRef.current.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (err) {
        console.warn('WebGL init failed, switching to 2D fallback:', err);
        setUseFallback(true);
      }
    };

    const disposeThree = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (rendererRef.current) {
        try {
          rendererRef.current.dispose();
          if (containerRef.current?.contains(rendererRef.current.domElement)) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        } catch (e) {
          // ignore
        }
      }
      // scene cleanup (three.js objects) can be added if needed
    };

    const cleanup = initAndCatch();

    function initAndCatch() {
      const maybeCleanup = initThree();
      return maybeCleanup;
    }

    // return cleanup on unmount
    return () => {
      disposeThree();
    };
  }, []);

  // ---------- Effect: when useFallback === true -> draw 2D canvas ----------
  useEffect(() => {
    if (!useFallback) return;

    const container = containerRef.current;
    if (!container) return;

    // create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    // particles for 2D
    const PARTICLE_COUNT = 140;
    const particles2D = [];
    const LINE_DIST = 110 * dpr; // threshold (px^2 not used, use linear)
    const LINE_OPACITY = 0.18;

    function initParticles() {
      particles2D.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles2D.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 1 + Math.random() * 3,
          hue: 200 + Math.random() * 80, // bluish-purple range
        });
      }
    }

    function resize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      width = Math.max(300, container.clientWidth);
      height = Math.max(200, container.clientHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    // draw one frame
    let lastTime = performance.now();
    function draw(now) {
      frameRef.current = requestAnimationFrame(draw);
      const dt = Math.min(50, now - lastTime) / 1000;
      lastTime = now;

      // clear with radial gradient similar to original design
      const grd = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.05,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.9
      );
      grd.addColorStop(0, '#1a1a2e');
      grd.addColorStop(1, '#0a0a1a');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // optional fallback image behind particles
      if (fallbackImage) {
        // draw image with low opacity under gradient (if provided)
        // (image loading is not handled here; if you need guaranteed drawing,
        // preload the image and then draw)
        try {
          const img = new Image();
          img.src = fallbackImage;
          img.onload = () => {
            ctx.globalAlpha = 0.9;
            // cover mode
            const ratio = Math.max(width / img.width, height / img.height);
            const iw = img.width * ratio;
            const ih = img.height * ratio;
            ctx.drawImage(img, (width - iw) / 2, (height - ih) / 2, iw, ih);
            ctx.globalAlpha = 1;
          };
        } catch (e) {
          // ignore
        }
      }

      // update particle positions
      for (let p of particles2D) {
        p.x += p.vx * (50 * dt);
        p.y += p.vy * (50 * dt);

        // small perlin-like drift using sin/cos of time for natural motion
        const t = now * 0.001;
        p.x += Math.sin(t + p.x * 0.001) * 0.02;
        p.y += Math.cos(t + p.y * 0.001) * 0.02;

        // wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // draw lines first (so particles appear above)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles2D.length; i++) {
        const a = particles2D[i];
        for (let j = i + 1; j < particles2D.length; j++) {
          const b = particles2D[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST) {
            const alpha = (1 - dist / LINE_DIST) * LINE_OPACITY;
            // color interpolation between two particle hues for slight variation
            const hue = (a.hue + b.hue) / 2;
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw particles
      for (let p of particles2D) {
        // glow effect: draw radial shadow with multiple circles
        // outer (soft)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        g.addColorStop(0, `hsla(${p.hue}, 80%, 60%, 0.18)`);
        g.addColorStop(0.4, `hsla(${p.hue}, 80%, 60%, 0.08)`);
        g.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // initial resize and listeners
    resize();
    window.addEventListener('resize', resize);

    // start animation
    frameRef.current = requestAnimationFrame(draw);

    // cleanup
    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (canvas && container.contains(canvas)) container.removeChild(canvas);
    };
  }, [useFallback, fallbackImage]);

  // ---------- Render ----------
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(circle at center, #1a1a2e 0%, #0a0a1a 100%)',
        overflow: 'hidden',
      }}
    />
  );
};

export default NetworkBackground3D;
