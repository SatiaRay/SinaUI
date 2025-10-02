import React, { useEffect, useRef } from 'react';

const NetworkBackground2D = ({ fallbackImage = null }) => {
  const containerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Create and configure the canvas ---
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

    // --- Particle settings ---
    const PARTICLE_COUNT = 140;
    const particles2D = [];
    const LINE_DIST = 110 * dpr; // Maximum distance for drawing lines
    const LINE_OPACITY = 0.18; // Transparency of the connecting lines

    // Initialize particles with random positions, velocities, and colors
    function initParticles() {
      particles2D.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles2D.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 1 + Math.random() * 3,
          hue: 200 + Math.random() * 80, // Blue-purple color range
        });
      }
    }

    // Handle window resizing and scale canvas for high-DPI screens
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

    // Animation loop
    let lastTime = performance.now();
    function draw(now) {
      frameRef.current = requestAnimationFrame(draw);
      const dt = Math.min(50, now - lastTime) / 1000; // Delta time for smooth motion
      lastTime = now;

      // --- Background gradient ---
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

      // --- Optional fallback image behind particles ---
      if (fallbackImage) {
        try {
          const img = new Image();
          img.src = fallbackImage;
          img.onload = () => {
            ctx.globalAlpha = 0.9;
            const ratio = Math.max(width / img.width, height / img.height);
            const iw = img.width * ratio;
            const ih = img.height * ratio;
            ctx.drawImage(img, (width - iw) / 2, (height - ih) / 2, iw, ih);
            ctx.globalAlpha = 1;
          };
        } catch (e) {}
      }

      // --- Update particle positions with velocity and slight oscillation ---
      for (let p of particles2D) {
        p.x += p.vx * (50 * dt);
        p.y += p.vy * (50 * dt);

        const t = now * 0.001; // Time-based oscillation for organic movement
        p.x += Math.sin(t + p.x * 0.001) * 0.02;
        p.y += Math.cos(t + p.y * 0.001) * 0.02;

        // Wrap around edges for infinite flow
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // --- Draw connecting lines between close particles ---
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
            const hue = (a.hue + b.hue) / 2;
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // --- Draw particles with glowing effect ---
      for (let p of particles2D) {
        // Outer glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        g.addColorStop(0, `hsla(${p.hue}, 80%, 60%, 0.18)`);
        g.addColorStop(0.4, `hsla(${p.hue}, 80%, 60%, 0.08)`);
        g.addColorStop(1, `hsla(${p.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Solid particle core
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize and start animation
    resize();
    window.addEventListener('resize', resize);
    frameRef.current = requestAnimationFrame(draw);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (canvas && container.contains(canvas)) container.removeChild(canvas);
    };
  }, [fallbackImage]);

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

export default NetworkBackground2D;
