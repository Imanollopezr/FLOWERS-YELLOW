import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import '../styles/Particles.css';

/**
 * Generates random stars and animated fireflies.
 * @param {boolean} warm - Whether to show warm-mode particles
 * @param {number} starCount - Number of stars to render
 * @param {number} fireflyCount - Number of fireflies to render
 */
export default function Particles({ warm = false, starCount = 18, fireflyCount = 6 }) {
  const containerRef = useRef(null);
  const firefliesRef = useRef([]);
  const animationsRef = useRef([]);

  // Generate stable star positions
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${2.5 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
      maxOpacity: 0.3 + Math.random() * 0.6,
      large: Math.random() > 0.8,
    }));
  }, [starCount]);

  // Animate fireflies with GSAP
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Clean previous animations
    animationsRef.current.forEach((tween) => tween.kill());
    animationsRef.current = [];

    firefliesRef.current.forEach((el) => {
      if (!el) return;

      const animateFirefly = () => {
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        gsap.set(el, { x: startX, y: startY, opacity: 0 });

        const tl = gsap.timeline({
          onComplete: animateFirefly,
        });

        tl.to(el, {
          opacity: 0.6 + Math.random() * 0.4,
          duration: 1 + Math.random() * 1.5,
          ease: 'power1.inOut',
        })
          .to(
            el,
            {
              x: startX + (Math.random() - 0.5) * 120,
              y: startY + (Math.random() - 0.5) * 80,
              duration: 3 + Math.random() * 4,
              ease: 'sine.inOut',
            },
            '<'
          )
          .to(el, {
            opacity: 0,
            duration: 1 + Math.random() * 1.5,
            ease: 'power1.inOut',
          })
          .to(
            el,
            {
              x: `+=${(Math.random() - 0.5) * 60}`,
              y: `+=${(Math.random() - 0.5) * 40}`,
              duration: 1.5,
              ease: 'sine.inOut',
            },
            '<'
          );

        animationsRef.current.push(tl);
      };

      // Stagger the start
      const delay = Math.random() * 3;
      const timeout = setTimeout(animateFirefly, delay * 1000);
      animationsRef.current.push({ kill: () => clearTimeout(timeout) });
    });

    return () => {
      animationsRef.current.forEach((tween) => tween.kill?.());
      animationsRef.current = [];
    };
  }, [fireflyCount]);

  return (
    <div
      ref={containerRef}
      className={`particles-container ${warm ? 'particles-container--warm' : ''}`}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={`star ${star.large ? 'star--large' : ''}`}
          style={{
            left: star.left,
            top: star.top,
            '--duration': star.duration,
            '--delay': star.delay,
            '--max-opacity': star.maxOpacity,
          }}
        />
      ))}

      {Array.from({ length: fireflyCount }, (_, i) => (
        <div
          key={`firefly-${i}`}
          ref={(el) => (firefliesRef.current[i] = el)}
          className="firefly"
          style={{
            '--size': `${3 + Math.random() * 3}px`,
          }}
        />
      ))}
    </div>
  );
}
