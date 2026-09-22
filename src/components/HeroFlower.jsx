import React, { useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';

/**
 * HeroFlower
 * Una implementación hiper-realista, orgánica y detallada de un Girasol.
 * No utiliza formas geométricas simples. Utiliza matemáticas (Espiral de Fermat para semillas),
 * curvas Bezier orgánicas para pétalos, y una orquestación GSAP profesional.
 */
export default function HeroFlower({ x = 50, y = 50, scale = 1, layer = 'front', delay = 0, isFullGarden = false, onGrown }) {
  const containerRef = useRef(null);
  const stemRef = useRef(null);
  const leafLeftRef = useRef(null);
  const leafRightRef = useRef(null);
  const centerRef = useRef(null);
  const petalsRef = useRef([]);

  // Generación de semillas usando la Espiral de Fermat para un centro hiper-realista
  const seeds = useMemo(() => {
    const numSeeds = 160;
    const goldenAngle = 137.508 * (Math.PI / 180);
    const arr = [];
    for (let i = 0; i < numSeeds; i++) {
      // El radio máximo del centro es aproximadamente 25
      const r = Math.sqrt(i) * 1.9;
      const theta = i * goldenAngle;
      const sx = r * Math.cos(theta);
      const sy = r * Math.sin(theta);
      // Las semillas del borde son más oscuras/grandes, las del centro más claras/pequeñas
      const isEdge = i > numSeeds - 40;
      arr.push({
        x: sx,
        y: sy,
        r: isEdge ? 1.5 : 1.2,
        fill: isEdge ? '#451a03' : '#78350f',
      });
    }
    return arr;
  }, []);

  // Generación de pétalos multicapa orgánicos
  const petalsData = useMemo(() => {
    const layers = [
      { count: 18, radiusBase: 0, scaleBase: 1, type: 'back' },
      { count: 18, radiusBase: 0, scaleBase: 0.95, type: 'middle' },
      { count: 12, radiusBase: 5, scaleBase: 0.85, type: 'front' }
    ];

    const arr = [];
    layers.forEach((layer, layerIndex) => {
      const angleStep = 360 / layer.count;
      for (let i = 0; i < layer.count; i++) {
        const baseAngle = i * angleStep;
        // Variación orgánica: rotación y escala ligeramente aleatorias
        const angleOffset = (Math.random() - 0.5) * 8;
        const scaleOffset = (Math.random() - 0.5) * 0.1;
        arr.push({
          angle: baseAngle + angleOffset + (layerIndex * 10), // Desfasar capas
          scale: layer.scaleBase + scaleOffset,
          type: layer.type,
        });
      }
    });
    return arr;
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Configuración inicial invisible
      gsap.set(stemRef.current, { strokeDasharray: 200, strokeDashoffset: 200 });
      gsap.set([leafLeftRef.current, leafRightRef.current], { scale: 0, opacity: 0 });
      gsap.set(centerRef.current, { scale: 0, opacity: 0, rotation: -45 });
      gsap.set(petalsRef.current, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({ 
        delay: delay,
        onComplete: () => onGrown && onGrown()
      });

      // 1. Tallo crece orgánicamente (desde abajo hacia arriba)
      tl.to(stemRef.current, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power3.inOut'
      });

      // 2. Hojas brotan
      tl.to([leafLeftRef.current, leafRightRef.current], {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)'
      }, "-=1.5");

      // 3. Aparece el centro
      tl.to(centerRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.5,
        ease: 'back.out(1.2)'
      }, "-=1.0");

      // 4. Pétalos se abren radialmente
      tl.to(petalsRef.current, {
        scale: (i) => petalsData[i].scale,
        opacity: 1,
        duration: 1,
        stagger: {
          amount: 1.5,
          from: "start" // Animación circular
        },
        ease: 'back.out(1.5)'
      }, "-=0.8");

      // 5. Animación continua de viento al finalizar
      tl.add(() => {
        gsap.to(containerRef.current, {
          rotation: 3,
          duration: 4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 100%' // Desde la base del tallo
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [petalsData]);

  // viewBox de 0 0 200 400 para dar mucho espacio al tallo y los pétalos grandes
  return (
    <div 
      className={`hero-flower-wrapper layer-${layer}`} 
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: `${y}%`,
        transform: `translate(-50%, 50%) scale(${scale})`,
        zIndex: layer === 'back' ? 10 : layer === 'middle' ? 20 : 30,
        width: '300px',
        height: '500px',
        pointerEvents: 'none',
      }}
    >
      <svg 
        ref={containerRef}
        viewBox="0 0 200 400" 
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Filtros de sombreado y glow */}
          <filter id="petal-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <filter id="center-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Gradientes Orgánicos */}
          <linearGradient id="stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3f20" />
            <stop offset="40%" stopColor="#3a7d44" />
            <stop offset="100%" stopColor="#173118" />
          </linearGradient>

          <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#52a65a" />
            <stop offset="100%" stopColor="#25522b" />
          </linearGradient>

          {/* Gradiente de pétalo: desde naranja profundo en la base, pasando a oro, hasta amarillo brillante */}
          <linearGradient id="petal-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="30%" stopColor="#eab308" />
            <stop offset="80%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="70%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1a0a00" />
          </radialGradient>
        </defs>

        {/* --- TALLO --- */}
        {/* Curva bezier suave. Comienza en el centro de la flor (100, 100) y baja hasta (100, 400) */}
        <path
          ref={stemRef}
          d="M 100 100 C 90 200, 115 300, 100 400"
          stroke="url(#stem-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* --- HOJAS --- */}
        <g ref={leafLeftRef} style={{ transformOrigin: '95px 250px' }}>
          {/* Forma de hoja botánica realista */}
          <path 
            d="M 95 250 C 40 230, 10 270, 20 310 C 50 290, 80 280, 95 250 Z" 
            fill="url(#leaf-grad)" 
            filter="url(#petal-shadow)"
          />
          {/* Nervadura central */}
          <path d="M 95 250 C 70 260, 45 275, 25 305" stroke="#173118" strokeWidth="2" fill="none" opacity="0.6"/>
        </g>

        <g ref={leafRightRef} style={{ transformOrigin: '105px 200px' }}>
          <path 
            d="M 105 200 C 160 180, 190 220, 180 260 C 150 240, 120 230, 105 200 Z" 
            fill="url(#leaf-grad)" 
            filter="url(#petal-shadow)"
          />
          <path d="M 105 200 C 130 210, 155 225, 175 255" stroke="#173118" strokeWidth="2" fill="none" opacity="0.6"/>
        </g>

        {/* --- FLOR (Centro en 100, 100) --- */}
        <g transform="translate(100, 100)">
          
          {/* Brillo mágico detrás de los pétalos */}
          <circle cx="0" cy="0" r="80" fill="rgba(250, 204, 21, 0.15)" filter="url(#glow)" />

          {/* PÉTALOS */}
          <g className="petals-container">
            {petalsData.map((petal, i) => (
              <g 
                key={i} 
                transform={`rotate(${petal.angle})`}
                ref={el => petalsRef.current[i] = el}
              >
                {/* 
                  El path del pétalo dibuja orgánicamente hacia arriba desde (0,0).
                  C -12 -30, -18 -70, 0 -110 : Lado izquierdo curvo
                  C 18 -70, 12 -30, 0 0     : Lado derecho curvo
                */}
                <path
                  d="M 0 0 C -12 -30, -18 -70, 0 -105 C 18 -70, 12 -30, 0 0 Z"
                  fill="url(#petal-grad)"
                  filter="url(#petal-shadow)"
                  opacity="0.95"
                />
                {/* Pliegue/Detalle interno del pétalo */}
                <path 
                  d="M 0 -10 Q 0 -50, 0 -90" 
                  stroke="#b45309" 
                  strokeWidth="1" 
                  fill="none" 
                  opacity="0.4"
                />
              </g>
            ))}
          </g>

          {/* CENTRO DE LA FLOR */}
          <g ref={centerRef} filter="url(#center-shadow)">
            {/* Base del centro */}
            <circle cx="0" cy="0" r="28" fill="url(#center-grad)" />
            {/* Textura de semillas usando la espiral generada */}
            <g>
              {seeds.map((seed, i) => (
                <circle key={i} cx={seed.x} cy={seed.y} r={seed.r} fill={seed.fill} />
              ))}
            </g>
            {/* Sombras/Brillos superpuestos para dar esfericidad */}
            <circle cx="0" cy="0" r="28" fill="transparent" stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
            <circle cx="-5" cy="-5" r="23" fill="rgba(255,255,255,0.05)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
