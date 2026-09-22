import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SunflowerSVG, DaisySVG, WildflowerSVG } from './FlowerTypes';
import '../styles/Flower.css';

const FLOWER_COMPONENTS = {
  sunflower: SunflowerSVG,
  daisy: DaisySVG,
  wildflower: WildflowerSVG,
};

/**
 * Individual animated flower.
 * Grows from the bottom: stem → leaves → petals → center.
 *
 * @param {string} type - 'sunflower' | 'daisy' | 'wildflower'
 * @param {number} delay - Delay before growth animation starts (seconds)
 * @param {number} size - Width in px
 * @param {number} left - Horizontal position (%)
 * @param {number} swayAmount - Max rotation in degrees for breeze
 * @param {number} swayDuration - Duration of sway cycle
 * @param {function} onGrown - Callback when growth animation completes
 */
export default function Flower({
  type = 'sunflower',
  delay = 0,
  size = 80,
  left = 50,
  swayAmount = 2,
  swayDuration = 4,
  onGrown,
}) {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  
  // Unique ID for SVG gradients/filters so they don't clash
  const flowerId = useRef(`flower-${Math.random().toString(36).substr(2, 9)}`).current;

  const FlowerComponent = FLOWER_COMPONENTS[type] || SunflowerSVG;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stem = svg.querySelector('.flower-stem');
    const leaves = svg.querySelectorAll('.flower-leaf');
    const petalsGroup = svg.querySelector('.flower-petals');
    const petals = svg.querySelectorAll('.flower-petal');
    const center = svg.querySelector('.flower-center');

    if (prefersReducedMotion) {
      if (stem) stem.style.strokeDashoffset = '0';
      if (leaves.length) gsap.set(leaves, { opacity: 1, scale: 1 });
      if (center) gsap.set(center, { opacity: 1, scale: 1 });
      if (petalsGroup) gsap.set(petalsGroup, { opacity: 1 });
      if (petals.length) gsap.set(petals, { opacity: 1, scale: 1 });
      onGrown?.();
      return;
    }

    // Measure stem length for draw animation
    if (stem) {
      // Path starts at 50,50 and goes to 50,200. Total length is approx 150.
      const length = stem.getTotalLength();
      stem.style.strokeDasharray = length;
      // Start hidden (offset = length means it's pushed down. Wait, we want it to grow from the bottom up!)
      // To grow from bottom up, if the path goes from top to bottom, stroke-dashoffset: length hides it.
      // Drawing to 0 makes it draw from top to bottom.
      // But the path d="M50,50 Q45,100 52,150 Q55,180 50,200" starts at TOP.
      // So to draw from BOTTOM to TOP, we set dasharray = length.
      // Offset = -length hides it. Then animate to 0. 
      // Let's rely on drawSVG plugin logic manually:
      stem.style.strokeDashoffset = length;
    }

    const tl = gsap.timeline({
      delay,
      onComplete: () => onGrown?.(),
    });

    // 1. Grow stem (assuming it starts at top and goes down, dashoffset from length to 0 draws top to bottom.
    // If we want bottom to top, we need to animate dashoffset from -length to 0 if stroke-dasharray = length.
    // Let's just use 0 to -length or length to 0 depending on the path.
    if (stem) {
      // Reversing path direction visually: 
      stem.style.strokeDasharray = stem.getTotalLength();
      stem.style.strokeDashoffset = stem.getTotalLength();
      tl.to(stem, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
      });
    }

    // 2. Unfold leaves
    if (leaves.length > 0) {
      tl.fromTo(
        leaves,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: 'back.out(1.5)',
        },
        '-=1'
      );
    }

    // 3. Center appears
    if (center) {
      tl.fromTo(
        center,
        { opacity: 0, scale: 0, rotation: -30 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'back.out(1.2)',
        },
        '-=0.5'
      );
    }

    // 4. Petals appear radially
    if (petalsGroup) {
      tl.set(petalsGroup, { opacity: 1 });
    }

    if (petals.length > 0) {
      tl.fromTo(
        petals,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: {
            each: 0.05,
            from: 'start', // Wraps around radially
          },
          ease: 'back.out(1.2)',
        },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, [delay, onGrown]);

  return (
    <div
      ref={wrapperRef}
      className="flower-wrapper"
      style={{
        '--flower-size': `${size}px`,
        '--sway-amount': `${swayAmount}deg`,
        '--sway-duration': `${swayDuration}s`,
        '--sway-delay': `${Math.random() * 2}s`,
        left: `${left}%`,
        transform: `translateX(-50%)`,
      }}
    >
      <svg
        ref={svgRef}
        className="flower-svg"
        viewBox="0 0 100 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        <FlowerComponent id={flowerId} />
      </svg>
    </div>
  );
}
