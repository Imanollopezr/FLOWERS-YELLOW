import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/MessageSequence.css';

const HEADER = 'Y sobre todo...';

const PHRASES = [
  'Gracias por estar conmigo.',
  'Gracias por hacer mis días más bonitos.',
  'Gracias por cada sonrisa.',
  'Gracias por cada momento.',
];

const FINAL_PHRASE = 'gracias por ser tú. 💛';

/**
 * Stage 6 — Sequential phrases that appear one by one.
 * Uses strict GSAP timeline sequencing so no two phrases overlap.
 *
 * @param {function} onComplete - Called when all phrases have been shown
 */
export default function MessageSequence({ onComplete }) {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const phrasesRef = useRef([]);
  const finalRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Mostrar contenedor principal
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: prefersReducedMotion ? 0.01 : 0.8,
        ease: 'power2.out',
      });

      if (prefersReducedMotion) {
        gsap.set(headerRef.current, { opacity: 1 });
        gsap.set(finalRef.current, { opacity: 1 });
        setTimeout(() => onComplete?.(), 3000);
        return;
      }

      // 2. Timeline maestra para todo el componente
      const tl = gsap.timeline({
        onComplete: () => {
          // Después de mostrar la última frase, mantener la escena unos segundos y salir
          setTimeout(() => {
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 1.5,
              ease: 'power2.inOut',
              onComplete: () => onComplete?.(),
            });
          }, 3000);
        },
      });

      // 3. Animación de entrada del Título (Header)
      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }
      );

      // Pequeña pausa antes de las frases
      tl.to({}, { duration: 0.5 });

      // 4. Bucle secuencial estricto para cada frase
      // opacity 0 -> 1 -> (hold) -> 1 -> 0
      phrasesRef.current.forEach((el) => {
        if (!el) return;
        
        // ENTRADA
        tl.fromTo(
          el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );
        
        // MANTENER (HOLD)
        tl.to(el, { duration: 2.5 });
        
        // SALIDA (solo desaparece, y=-15)
        tl.to(
          el,
          { opacity: 0, y: -15, duration: 0.6, ease: 'power2.in' }
        );
      });

      // 5. Frase final
      if (finalRef.current) {
        tl.fromTo(
          finalRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <section
      ref={containerRef}
      className="message-sequence"
      aria-label="Frases de agradecimiento"
    >
      <div className="message-sequence__content">
        <h2 ref={headerRef} className="message-sequence__header">
          {HEADER}
        </h2>
        
        <div className="message-sequence__phrases-wrapper">
          {PHRASES.map((phrase, index) => (
            <p
              key={index}
              ref={(el) => (phrasesRef.current[index] = el)}
              className="message-sequence__phrase"
            >
              {phrase}
            </p>
          ))}
          <p
            ref={finalRef}
            className="message-sequence__phrase message-sequence__phrase--final"
          >
            {FINAL_PHRASE}
          </p>
        </div>
      </div>
    </section>
  );
}
