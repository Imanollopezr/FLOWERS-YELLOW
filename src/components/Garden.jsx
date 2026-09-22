import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import HeroFlower from './HeroFlower';
import '../styles/Garden.css';

/**
 * Optimized Garden Layout for mobile
 * Reduced from 26 flowers to 16 for much better performance on phones.
 */
const FLOWER_LAYOUT = [
  // --- BACKGROUND (layer: 'back') — 5 small flowers
  { layer: 'back', left: 8, y: 18, scale: 0.35, delay: 0.3 },
  { layer: 'back', left: 30, y: 22, scale: 0.4, delay: 0.8 },
  { layer: 'back', left: 50, y: 15, scale: 0.3, delay: 0.6 },
  { layer: 'back', left: 70, y: 20, scale: 0.4, delay: 1.0 },
  { layer: 'back', left: 92, y: 18, scale: 0.35, delay: 0.5 },

  // --- MIDGROUND (layer: 'middle') — 4 medium flowers
  { layer: 'middle', left: 12, y: 0, scale: 0.6, delay: 1.5 },
  { layer: 'middle', left: 35, y: 5, scale: 0.55, delay: 2.0 },
  { layer: 'middle', left: 65, y: 3, scale: 0.6, delay: 1.8 },
  { layer: 'middle', left: 88, y: -2, scale: 0.55, delay: 2.2 },

  // --- FOREGROUND (layer: 'front') — 7 large flowers framing edges
  { layer: 'front', left: 2, y: -20, scale: 1.0, delay: 2.8 },
  { layer: 'front', left: 18, y: -12, scale: 0.85, delay: 3.2 },
  { layer: 'front', left: 30, y: -28, scale: 0.9, delay: 3.5 },
  { layer: 'front', left: 50, y: -40, scale: 0.75, delay: 3.8 },
  { layer: 'front', left: 70, y: -25, scale: 0.9, delay: 3.4 },
  { layer: 'front', left: 82, y: -10, scale: 0.85, delay: 3.0 },
  { layer: 'front', left: 98, y: -22, scale: 1.05, delay: 3.6 },
];

/**
 * Stage 1-8 — The magic garden where flowers grow.
 */
export default function Garden({ stage = 1, isFullGarden = false, onGardenReady }) {
  const gardenRef = useRef(null);
  const groundRef = useRef(null);
  const [grownCount, setGrownCount] = useState(0);
  const hasNotified = useRef(false);

  // Fade in ground
  useEffect(() => {
    if (groundRef.current) {
      gsap.fromTo(
        groundRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: 'power2.out' }
      );
    }
  }, []);

  // Notify when enough flowers have grown
  useEffect(() => {
    if (grownCount >= 6 && !hasNotified.current && onGardenReady) {
      hasNotified.current = true;
      onGardenReady();
    }
  }, [grownCount, onGardenReady]);

  const handleFlowerGrown = () => {
    setGrownCount((prev) => prev + 1);
  };

  return (
    <section
      ref={gardenRef}
      className={`garden ${isFullGarden ? 'garden--full' : ''}`}
      aria-label="Jardín de flores amarillas"
    >
      {/* Subtle glow */}
      <div className="garden__glow-bg" />

      <div className="garden__flowers">
        {FLOWER_LAYOUT.map((config, i) => {
          const isWelcomeStage = stage === 0;
          // On WelcomeScreen, only show front layer
          if (isWelcomeStage && config.layer !== 'front') return null;

          return (
            <HeroFlower
              key={i}
              layer={config.layer}
              x={config.left}
              y={config.y}
              scale={config.scale}
              delay={config.delay}
              onGrown={handleFlowerGrown}
            />
          );
        })}
      </div>

      <div ref={groundRef} className="garden__ground" />
    </section>
  );
}
