import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { MEMORIES } from '../photos-config';
import '../styles/PhotoCarousel.css';

/**
 * Stage 5 — Memories (Photo Carousel)
 * Displays personal photos or a graceful fallback if none exist.
 */
export default function PhotoCarousel({ onComplete }) {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  // Touch variables for swipe
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' }
    );
    
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 0.5, ease: 'back.out(1.2)' }
      );
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < MEMORIES.length - 1) {
      // Animate transition to next photo
      gsap.to(cardRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        onComplete: () => {
          setCurrentIndex(prev => prev + 1);
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      gsap.to(cardRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.3,
        onComplete: () => {
          setCurrentIndex(prev => prev - 1);
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      });
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  const handleContinue = () => {
    if (isExiting) return;
    setIsExiting(true);
    
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: onComplete
    });
  };

  const hasMemories = MEMORIES && MEMORIES.length > 0;

  return (
    <section ref={containerRef} className="photo-carousel">
      <div 
        className="photo-carousel__content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="photo-carousel__header">
          <h2 className="photo-carousel__title">Nuestros Recuerdos</h2>
          <div className="photo-carousel__indicator">
            {hasMemories ? `${currentIndex + 1} / ${MEMORIES.length}` : '💛'}
          </div>
        </div>

        <div className="photo-carousel__card-container">
          <div ref={cardRef} className="photo-carousel__card">
            {hasMemories ? (
              <>
                <div className="photo-carousel__image-wrapper">
                  <img 
                    src={`/photos/${MEMORIES[currentIndex].image}`} 
                    alt={MEMORIES[currentIndex].text || 'Recuerdo'} 
                    className="photo-carousel__image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('error-fallback');
                      e.target.parentElement.innerHTML = '<span>📸<br/><small>No se pudo cargar la imagen.<br/>Revisa el nombre en photos-config.js</small></span>';
                    }}
                  />
                </div>
                {MEMORIES[currentIndex].text && (
                  <p className="photo-carousel__text">{MEMORIES[currentIndex].text}</p>
                )}
              </>
            ) : (
              <div className="photo-carousel__empty">
                <span className="photo-carousel__empty-icon">📸</span>
                <p>Pronto habrá recuerdos aquí. 💛</p>
                <small>(Puedes agregar fotos en <code>public/photos</code> y configurar <code>src/photos-config.js</code>)</small>
              </div>
            )}
          </div>
        </div>

        <div className="photo-carousel__controls">
          {hasMemories && (
            <div className="photo-carousel__arrows">
              <button 
                className="photo-carousel__arrow" 
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Foto anterior"
              >
                ←
              </button>
              <button 
                className="photo-carousel__arrow" 
                onClick={handleNext}
                disabled={currentIndex === MEMORIES.length - 1}
                aria-label="Siguiente foto"
              >
                →
              </button>
            </div>
          )}
          
          <button 
            className="photo-carousel__continue"
            onClick={handleContinue}
          >
            {(!hasMemories || currentIndex === MEMORIES.length - 1) ? 'Continuar' : 'Omitir recuerdos'}
          </button>
        </div>
      </div>
    </section>
  );
}
