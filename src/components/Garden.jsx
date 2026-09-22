import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import HeroFlower from './HeroFlower';
import '../styles/Garden.css';

/**
 * Abundant Magic Garden Layout
 * 30 flowers distributed in 3 depth layers to frame the center text.
 */
const FLOWER_LAYOUT = [
  // --- BACKGROUND (layer: 'back') - Very small, blurred, low opacity, slow wind
  { layer: 'back', left: 5, y: 15, scale: 0.35, delay: 0.5 },
  { layer: 'back', left: 12, y: 22, scale: 0.4, delay: 1.2 },
  { layer: 'back', left: 20, y: 10, scale: 0.3, delay: 0.8 },
  { layer: 'back', left: 28, y: 25, scale: 0.45, delay: 2.0 },
  { layer: 'back', left: 35, y: 12, scale: 0.35, delay: 1.5 },
  
  { layer: 'back', left: 65, y: 15, scale: 0.35, delay: 1.8 },
  { layer: 'back', left: 72, y: 28, scale: 0.45, delay: 0.7 },
  { layer: 'back', left: 80, y: 12, scale: 0.3, delay: 1.3 },
  { layer: 'back', left: 88, y: 20, scale: 0.4, delay: 2.2 },
  { layer: 'back', left: 95, y: 15, scale: 0.35, delay: 1.0 },

  // --- MIDGROUND (layer: 'middle') - Medium size, slight blur
  { layer: 'middle', left: 8, y: -5, scale: 0.6, delay: 2.5 },
  { layer: 'middle', left: 18, y: 5, scale: 0.7, delay: 3.2 },
  { layer: 'middle', left: 25, y: -10, scale: 0.55, delay: 2.8 },
  { layer: 'middle', left: 32, y: 8, scale: 0.65, delay: 3.5 },
  
  { layer: 'middle', left: 68, y: 5, scale: 0.65, delay: 3.0 },
  { layer: 'middle', left: 75, y: -8, scale: 0.55, delay: 3.8 },
  { layer: 'middle', left: 82, y: 6, scale: 0.7, delay: 2.6 },
  { layer: 'middle', left: 92, y: -5, scale: 0.6, delay: 3.4 },

  // --- FOREGROUND (layer: 'front') - Large, sharp, detailed, framing the edges
  // Left frame
  { layer: 'front', left: 2, y: -25, scale: 1.1, delay: 4.5 },
  { layer: 'front', left: 15, y: -15, scale: 0.9, delay: 5.0 },
  { layer: 'front', left: 25, y: -30, scale: 1.0, delay: 5.5 },
  
  // Right frame
  { layer: 'front', left: 75, y: -25, scale: 1.0, delay: 5.2 },
  { layer: 'front', left: 85, y: -10, scale: 0.95, delay: 4.8 },
  { layer: 'front', left: 98, y: -30, scale: 1.15, delay: 5.8 },

  // Very bottom fill (to anchor the ground)
  { layer: 'front', left: 40, y: -45, scale: 0.8, delay: 6.0 },
  { layer: 'front', left: 60, y: -40, scale: 0.85, delay: 6.2 },
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (groundRef.current) {
      if (prefersReducedMotion) {
        gsap.set(groundRef.current, { opacity: 1 });
      } else {
        gsap.fromTo(
          groundRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 2, ease: 'power2.out' }
        );
      }
    }
  }, []);

  // Notify when front flowers have started growing
  useEffect(() => {
    // We notify when about half the flowers have grown so the message appears 
    // while the garden is still organically forming in the background
    if (grownCount >= 10 && !hasNotified.current && onGardenReady) {
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
      {/* Glow mágico nocturno */}
      <div 
        className="garden__glow" 
        style={{
          background: 'radial-gradient(circle at 50% 100%, rgba(250, 204, 21, 0.12) 0%, rgba(8, 5, 18, 0) 70%)',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          bottom: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="garden__flowers">
        {FLOWER_LAYOUT.map((config, i) => {
          const isWelcomeStage = stage === 0; // STAGES.WELCOME
          // On WelcomeScreen, only show the front layer flowers to frame the screen
          const isVisible = !isWelcomeStage || config.layer === 'front';
          
          if (!isVisible) return null;

          return (
            <HeroFlower
              key={i} // Using original index ensures they don't unmount/remount
              layer={config.layer}
              x={config.left}
              y={config.y}
              scale={config.scale}
              delay={config.delay}
              onGrown={handleFlowerGrown}
              isFullGarden={isFullGarden}
            />
          );
        })}
      </div>

      <div ref={groundRef} className="garden__ground" />
    </section>
  );
}
