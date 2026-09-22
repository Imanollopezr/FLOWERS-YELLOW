import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/LoveLetter.css';

/**
 * Stages 4-5 — First the romantic message, then the personal letter.
 *
 * @param {'message' | 'letter'} mode - Which content to show
 * @param {function} onContinue - Called when user presses the continue button
 * @param {function} onLetterDone - Called when the letter has finished showing
 */
export default function LoveLetter({ mode = 'message', onContinue, onLetterDone }) {
  const containerRef = useRef(null);
  const phrasesRef = useRef([]);
  const buttonRef = useRef(null);
  const personalRef = useRef(null);
  const tlRef = useRef(null);

  // Animate container in
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(containerRef.current, { opacity: 1 });
    } else {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, []);

  // Animate content based on mode
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (tlRef.current) {
      tlRef.current.kill();
    }

    if (mode === 'message') {
      const phrases = phrasesRef.current.filter(Boolean);
      const button = buttonRef.current;

      if (prefersReducedMotion) {
        phrases.forEach((el) => gsap.set(el, { opacity: 1 }));
        if (button) gsap.set(button, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline();

      phrases.forEach((phrase, i) => {
        tl.fromTo(
          phrase,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          },
          i === 0 ? 0.5 : `>0.8`
        );
      });

      if (button) {
        tl.fromTo(
          button,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '>0.6'
        );
      }

      tlRef.current = tl;
    }

    if (mode === 'letter') {
      const personal = personalRef.current;
      if (!personal) return;

      if (prefersReducedMotion) {
        gsap.set(personal, { opacity: 1 });
        onLetterDone?.();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          // Wait a moment then signal done
          setTimeout(() => onLetterDone?.(), 3000);
        },
      });

      tl.fromTo(
        personal,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.5,
        }
      );

      tlRef.current = tl;
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [mode, onLetterDone]);

  const handleContinue = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onContinue?.();
      return;
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => onContinue?.(),
    });
  };

  return (
    <section
      ref={containerRef}
      className="love-letter"
      aria-label={mode === 'message' ? 'Mensaje romántico' : 'Carta personal'}
    >
      <div className="love-letter__card">
        {mode === 'message' && (
          <div className="love-letter__message">
            <p
              className="love-letter__phrase"
              ref={(el) => (phrasesRef.current[0] = el)}
            >
              Estas flores son virtuales,
              <br />
              pero lo que siento por ti no lo es.
            </p>
            <p
              className="love-letter__phrase"
              ref={(el) => (phrasesRef.current[1] = el)}
            >
              Quería regalarte algo diferente,
              <br />
              algo que pudieras guardar y volver a visitar cuando quisieras.
            </p>
            <button
              ref={buttonRef}
              className="love-letter__button"
              onClick={handleContinue}
              id="continue-button"
              aria-label="Hay algo más"
            >
              Hay algo más... 💛
            </button>
          </div>
        )}

        {mode === 'letter' && (
          <div className="love-letter__personal">
            <div className="love-letter__personal-text" ref={personalRef}>
              <p>Gracias por llegar a mi vida,<br />
              por cada momento, cada sonrisa<br />
              y cada recuerdo que hemos construido juntos.</p>

              <p>Tal vez estas flores no pueda entregártelas<br />
              en las manos...</p>

              <p>pero quería que tuvieras un pequeño lugar<br />
              en Internet que fuera solamente para ti.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
