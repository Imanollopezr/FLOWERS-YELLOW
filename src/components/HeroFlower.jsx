import React, { useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';

// Unique ID counter to avoid SVG filter/gradient ID collisions
let _flowerIdCounter = 0;

/**
 * HeroFlower — Optimized for mobile
 * Reduces DOM nodes dramatically while keeping the sunflower look.
 * - Seeds reduced from 160 → 60
 * - Petal layers reduced from 3 (48 total) → 2 (24 total)
 * - All SVG filters REMOVED (use solid colors/gradients instead)
 * - Unique gradient/filter IDs per flower to avoid SVG conflicts
 */
export default function HeroFlower({ x = 50, y = 50, scale = 1, layer = 'front', delay = 0, onGrown }) {
  const containerRef = useRef(null);
  const stemRef = useRef(null);
  const leafLeftRef = useRef(null);
  const leafRightRef = useRef(null);
  const centerRef = useRef(null);
  const petalsRef = useRef([]);
  
  // Unique ID for this flower instance
  const uid = useMemo(() => `f${++_flowerIdCounter}`, []);

  // Reduced seeds: 60 instead of 160
  const seeds = useMemo(() => {
    const numSeeds = 60;
    const goldenAngle = 137.508 * (Math.PI / 180);
    const arr = [];
    for (let i = 0; i < numSeeds; i++) {
      const r = Math.sqrt(i) * 2.8;
      const theta = i * goldenAngle;
      arr.push({
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
        r: i > numSeeds - 15 ? 1.8 : 1.4,
        fill: i > numSeeds - 15 ? '#451a03' : '#78350f',
      });
    }
    return arr;
  }, []);

  // Simplified petals: 2 layers, 24 total instead of 48
  const petalsData = useMemo(() => {
    const layers = [
      { count: 14, scaleBase: 1, offset: 0 },
      { count: 10, scaleBase: 0.88, offset: 13 },
    ];
    const arr = [];
    layers.forEach((l) => {
      const step = 360 / l.count;
      for (let i = 0; i < l.count; i++) {
        const angleOffset = (Math.random() - 0.5) * 6;
        arr.push({
          angle: i * step + angleOffset + l.offset,
          scale: l.scaleBase + (Math.random() - 0.5) * 0.08,
        });
      }
    });
    return arr;
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(stemRef.current, { strokeDasharray: 200, strokeDashoffset: 200 });
      gsap.set([leafLeftRef.current, leafRightRef.current], { scale: 0, opacity: 0 });
      gsap.set(centerRef.current, { scale: 0, opacity: 0, rotation: -45 });
      gsap.set(petalsRef.current.filter(Boolean), { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        delay,
        onComplete: () => onGrown?.(),
      });

      // Stem grows
      tl.to(stemRef.current, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power3.inOut',
      });

      // Leaves sprout
      tl.to([leafLeftRef.current, leafRightRef.current], {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.5)',
      }, '-=1');

      // Center appears
      tl.to(centerRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1,
        ease: 'back.out(1.2)',
      }, '-=0.6');

      // Petals open
      tl.to(petalsRef.current.filter(Boolean), {
        scale: (i) => petalsData[i]?.scale ?? 1,
        opacity: 1,
        duration: 0.8,
        stagger: { amount: 0.8, from: 'start' },
        ease: 'back.out(1.5)',
      }, '-=0.5');

      // Wind sway — single lightweight CSS animation instead of per-element GSAP
      tl.add(() => {
        if (containerRef.current) {
          containerRef.current.style.animation = `flowerSway ${3 + Math.random() * 2}s ease-in-out infinite alternate`;
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [petalsData]);

  return (
    <div
      className={`hero-flower-wrapper layer-${layer}`}
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: `${y}%`,
        transform: `translate(-50%, 50%) scale(${scale})`,
        zIndex: layer === 'back' ? 10 : layer === 'middle' ? 20 : 30,
        width: '250px',
        height: '420px',
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <svg
        ref={containerRef}
        viewBox="0 0 200 400"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Gradients — unique IDs per flower */}
          <linearGradient id={`${uid}-stem`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3f20" />
            <stop offset="40%" stopColor="#3a7d44" />
            <stop offset="100%" stopColor="#173118" />
          </linearGradient>

          <linearGradient id={`${uid}-leaf`} x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#52a65a" />
            <stop offset="100%" stopColor="#25522b" />
          </linearGradient>

          <linearGradient id={`${uid}-petal`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          <radialGradient id={`${uid}-center`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1a0a00" />
          </radialGradient>
        </defs>

        {/* STEM */}
        <path
          ref={stemRef}
          d="M 100 100 C 90 200, 115 300, 100 400"
          stroke={`url(#${uid}-stem)`}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* LEFT LEAF */}
        <g ref={leafLeftRef} style={{ transformOrigin: '95px 250px' }}>
          <path
            d="M 95 250 C 40 230, 10 270, 20 310 C 50 290, 80 280, 95 250 Z"
            fill={`url(#${uid}-leaf)`}
          />
          <path d="M 95 250 C 70 260, 45 275, 25 305" stroke="#173118" strokeWidth="2" fill="none" opacity="0.6" />
        </g>

        {/* RIGHT LEAF */}
        <g ref={leafRightRef} style={{ transformOrigin: '105px 200px' }}>
          <path
            d="M 105 200 C 160 180, 190 220, 180 260 C 150 240, 120 230, 105 200 Z"
            fill={`url(#${uid}-leaf)`}
          />
          <path d="M 105 200 C 130 210, 155 225, 175 255" stroke="#173118" strokeWidth="2" fill="none" opacity="0.6" />
        </g>

        {/* FLOWER HEAD at (100, 100) */}
        <g transform="translate(100, 100)">
          {/* Glow — simple circle, no filter */}
          <circle cx="0" cy="0" r="70" fill="rgba(250, 204, 21, 0.08)" />

          {/* PETALS */}
          <g>
            {petalsData.map((petal, i) => (
              <g
                key={i}
                transform={`rotate(${petal.angle})`}
                ref={(el) => (petalsRef.current[i] = el)}
              >
                <path
                  d="M 0 0 C -12 -30, -18 -70, 0 -105 C 18 -70, 12 -30, 0 0 Z"
                  fill={`url(#${uid}-petal)`}
                  opacity="0.95"
                />
                <path
                  d="M 0 -10 Q 0 -50, 0 -90"
                  stroke="#b45309"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.35"
                />
              </g>
            ))}
          </g>

          {/* CENTER */}
          <g ref={centerRef}>
            <circle cx="0" cy="0" r="28" fill={`url(#${uid}-center)`} />
            <g>
              {seeds.map((seed, i) => (
                <circle key={i} cx={seed.x} cy={seed.y} r={seed.r} fill={seed.fill} />
              ))}
            </g>
            <circle cx="0" cy="0" r="28" fill="transparent" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
            <circle cx="-5" cy="-5" r="22" fill="rgba(255,255,255,0.04)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
