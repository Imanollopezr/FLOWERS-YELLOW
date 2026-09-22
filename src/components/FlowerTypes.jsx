import React from 'react';

/**
 * Organic, high-fidelity SVGs for the magic garden.
 */

/* ── Hero Sunflower (Highly Detailed) ── */
export function SunflowerSVG({ id }) {
  // Layers of petals
  const backLayer = 16;
  const middleLayer = 16;
  const frontLayer = 12;

  // Generate petals with slight organic variations
  const generatePetals = (count, radiusOffset, scale, className) => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (360 / count) * i;
      // Slight random wobble
      const rotation = angle + (Math.random() * 4 - 2);
      const stretch = 0.9 + Math.random() * 0.2;
      
      return (
        <g 
          key={i} 
          className="flower-petal-wrapper"
          style={{ transformOrigin: '50px 50px' }}
          transform={`rotate(${rotation}, 50, 50)`}
        >
          <path
            className={`flower-petal ${className}`}
            // Organic petal path starting from center (50,50) pointing UP.
            // Control points create a natural leaf/petal shape.
            d="M50,40 C45,20 42,5 50,-10 C58,5 55,20 50,40 Z"
            fill={`url(#petal-grad-${id})`}
            filter={`url(#drop-shadow-${id})`}
            style={{ 
              transformOrigin: '50px 50px',
              transform: `scale(0)`, // Handled by GSAP
              opacity: 0
            }}
          />
        </g>
      );
    });
  };

  return (
    <>
      <defs>
        {/* Gradients */}
        <linearGradient id={`stem-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3f20" />
          <stop offset="50%" stopColor="#3a7d44" />
          <stop offset="100%" stopColor="#25522b" />
        </linearGradient>
        
        <linearGradient id={`leaf-grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a9e52" />
          <stop offset="100%" stopColor="#2d5f35" />
        </linearGradient>

        <linearGradient id={`petal-grad-${id}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#eab308" />   {/* Dark golden base */}
          <stop offset="50%" stopColor="#facc15" />  {/* Bright yellow middle */}
          <stop offset="100%" stopColor="#fef08a" /> {/* Pale yellow tip */}
        </linearGradient>

        <radialGradient id={`center-grad-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="60%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#270e01" />
        </radialGradient>

        <radialGradient id={`center-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(250, 204, 21, 0.4)" />
          <stop offset="100%" stopColor="rgba(250, 204, 21, 0)" />
        </radialGradient>

        {/* Filters */}
        <filter id={`drop-shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.3" />
        </filter>
        
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Stem */}
      <path
        className="flower-stem"
        // Starting from 50,50 (flower center) down to 50,200 (ground).
        // Organic curve.
        d="M50,50 Q45,100 52,150 Q55,180 50,200"
        stroke={`url(#stem-grad-${id})`}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaves */}
      <g className="flower-leaf flower-leaf--left" style={{ transformOrigin: '48px 140px' }}>
        <path 
          d="M48,140 C20,130 5,145 10,160 C20,150 35,155 48,140 Z" 
          fill={`url(#leaf-grad-${id})`}
          filter={`url(#drop-shadow-${id})`}
        />
        <path d="M48,140 C35,145 25,150 15,158" stroke="#1e3f20" strokeWidth="1" fill="none" opacity="0.6"/>
      </g>

      <g className="flower-leaf flower-leaf--right" style={{ transformOrigin: '52px 110px' }}>
        <path 
          d="M52,110 C80,100 95,115 90,130 C80,120 65,125 52,110 Z" 
          fill={`url(#leaf-grad-${id})`}
          filter={`url(#drop-shadow-${id})`}
        />
        <path d="M52,110 C65,115 75,120 85,128" stroke="#1e3f20" strokeWidth="1" fill="none" opacity="0.6"/>
      </g>

      {/* Petals Group */}
      {/* We use specific class names so GSAP can animate them sequentially */}
      <g className="flower-petals">
        {generatePetals(backLayer, 0, 1, 'petal-back')}
        {generatePetals(middleLayer, 0, 0.9, 'petal-mid')}
        {generatePetals(frontLayer, 0, 0.75, 'petal-front')}
      </g>

      {/* Center of the flower */}
      <g className="flower-center" style={{ transformOrigin: '50px 50px' }}>
        {/* Inner shadow/glow to separate from petals */}
        <circle cx="50" cy="50" r="18" fill="#000" opacity="0.4" filter={`url(#glow-${id})`} />
        
        {/* Main center body */}
        <circle cx="50" cy="50" r="16" fill={`url(#center-grad-${id})`} />
        
        {/* Seeds / Texture (Dots arranged in fibonacci spiral conceptually, approximated here) */}
        <g opacity="0.7">
          {Array.from({ length: 40 }).map((_, i) => {
            const r = Math.sqrt(i) * 2.2;
            const theta = i * 137.5 * (Math.PI / 180);
            const x = 50 + r * Math.cos(theta);
            const y = 50 + r * Math.sin(theta);
            return (
              <circle key={i} cx={x} cy={y} r="0.8" fill="#facc15" opacity={0.5 + Math.random()*0.5} />
            );
          })}
        </g>
        
        {/* Ambient warm glow over the center */}
        <circle cx="50" cy="50" r="25" fill={`url(#center-glow-${id})`} style={{ mixBlendMode: 'screen' }} />
      </g>
    </>
  );
}

// Temporary stubs for Daisy and Wildflower so the app doesn't break while we test the Hero
export function DaisySVG({ id }) {
  return <SunflowerSVG id={id} />;
}

export function WildflowerSVG({ id }) {
  return <SunflowerSVG id={id} />;
}
