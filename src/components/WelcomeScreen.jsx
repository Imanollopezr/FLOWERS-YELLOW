import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/WelcomeScreen.css';

/**
 * Stage 1 — Welcome screen with a dark, starry atmosphere.
 * Shows "Tengo algo para ti..." and a discover button.
 */
export default function WelcomeScreen({ onDiscover }) {
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const buttonRef = useRef(null);

  // Cinematic fade in
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set([text1Ref.current, text2Ref.current, buttonRef.current], { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 1 });
    
    tl.fromTo(
      text1Ref.current,
      { opacity: 0, y: 15, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' }
    )
    .to(text1Ref.current, {
      opacity: 0.8, filter: 'blur(2px)', duration: 1.5, ease: 'power1.inOut'
    }, "+=1")
    .fromTo(
      text2Ref.current,
      { opacity: 0, y: 15, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.5, ease: 'power2.out' },
      "-=0.5"
    )
    .fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
      "+=0.5"
    );
  }, []);

  const handleDiscover = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onDiscover();
      return;
    }

    containerRef.current.classList.add('welcome--exiting');

    gsap.to([text1Ref.current, text2Ref.current, buttonRef.current], {
      opacity: 0,
      y: -20,
      filter: 'blur(5px)',
      duration: 1,
      stagger: 0.1,
      ease: 'power2.inOut',
    });

    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: 'power2.inOut',
      onComplete: onDiscover,
    });
  };

  return (
    <section ref={containerRef} className="welcome" aria-label="Bienvenida">
      <div ref={contentRef} className="welcome__content">
        <div className="welcome__cinematic-text">
          <h1 ref={text1Ref} className="welcome__title cinematic-line">Hola, mi amor...</h1>
          <h2 ref={text2Ref} className="welcome__subtitle cinematic-line">Tengo algo especial para ti. 💛</h2>
        </div>
        <div ref={buttonRef} className="welcome__action">
          <button
            className="welcome__button"
            onClick={handleDiscover}
            id="discover-button"
            aria-label="Descubrir mi sorpresa"
          >
            Descubrir mi sorpresa
          </button>
        </div>
      </div>
    </section>
  );
}
