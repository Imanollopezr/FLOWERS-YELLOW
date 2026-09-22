import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/FinalMessage.css';

/**
 * Stage 7 — Final dedication message over the full garden.
 * Shows the name dedication, love message, and a return note.
 *
 * @param {string} name - The recipient's name
 */
export default function FinalMessage({ name = 'Mi Amor' }) {
  const containerRef = useRef(null);
  const dedicationRef = useRef(null);
  const loveRef = useRef(null);
  const returnRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(dedicationRef.current, { opacity: 1 });
      gsap.set(loveRef.current, { opacity: 1 });
      gsap.set(returnRef.current, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(containerRef.current, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    });

    tl.fromTo(
      dedicationRef.current,
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    tl.fromTo(
      loveRef.current,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      },
      '>0.5'
    );

    tl.fromTo(
      returnRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out',
      },
      '>1'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="final-message"
      aria-label="Mensaje final"
    >
      <h2 ref={dedicationRef} className="final-message__dedication">
        Para ti, {name}. 💛
      </h2>
      <p ref={loveRef} className="final-message__love">
        Con todo mi amor.
      </p>
      <p ref={returnRef} className="final-message__return">
        Puedes volver aquí cuando quieras.
      </p>
    </section>
  );
}
