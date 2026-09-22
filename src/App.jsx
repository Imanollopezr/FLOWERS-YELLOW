import { useCallback } from 'react';
import { useStageManager, STAGES } from './hooks/useStageManager';
import Particles from './components/Particles';
import WelcomeScreen from './components/WelcomeScreen';
import Garden from './components/Garden';
import LoveLetter from './components/LoveLetter';
import MessageSequence from './components/MessageSequence';
import FinalMessage from './components/FinalMessage';
import PhotoCarousel from './components/PhotoCarousel';
import BackButton from './components/BackButton';
import './App.css';

/**
 * Main orchestrator for the 7-stage romantic experience.
 *
 * Flow:
 *   WELCOME → TRANSITION → GARDEN_GROWING → MESSAGE → LETTER → RECUERDOS → PHRASES → FINAL
 *
 * Change the `recipientName` variable below to personalize the dedication.
 */

// ══════════════════════════════════════════════════════
// ✏️  PERSONALIZA AQUÍ el nombre de tu novia
const recipientName = 'Mi Amor';
// ══════════════════════════════════════════════════════

export default function App() {
  const { stage, advanceStage, goBack, goToStage } = useStageManager();

  const isWarm = stage >= STAGES.WELCOME; // Always warm now because Garden is present

  // ── Stage transition handlers ──

  const handleDiscover = useCallback(() => {
    goToStage(STAGES.TRANSITION);
    // Short delay then show garden growing
    setTimeout(() => {
      goToStage(STAGES.GARDEN_GROWING);
    }, 800);
  }, [goToStage]);

  const handleGardenReady = useCallback(() => {
    // Let's add a safe advance.
    setTimeout(() => {
      goToStage((current) => {
         return current === STAGES.GARDEN_GROWING ? STAGES.MESSAGE : current;
      });
    }, 2500);
  }, [goToStage]);

  const handleContinueToLetter = useCallback(() => {
    goToStage(STAGES.LETTER);
  }, [goToStage]);

  const handleLetterDone = useCallback(() => {
    goToStage(STAGES.RECUERDOS);
  }, [goToStage]);

  const handleCarouselDone = useCallback(() => {
    goToStage(STAGES.PHRASES);
  }, [goToStage]);

  const handlePhrasesComplete = useCallback(() => {
    goToStage(STAGES.FINAL);
  }, [goToStage]);

  return (
    <main className={`app ${isWarm ? 'app--warm' : ''}`}>
      {/* Particles — always visible, intensity increases with stage */}
      <Particles
        warm={isWarm}
        starCount={stage >= STAGES.FINAL ? 30 : 20}
        fireflyCount={stage >= STAGES.FINAL ? 25 : stage >= STAGES.GARDEN_GROWING ? 15 : 5}
      />

      {/* Back Navigation — visible on all screens after welcome */}
      {stage > STAGES.WELCOME && (
        <BackButton onClick={goBack} />
      )}

      {/* Stage 1: Welcome */}
      {stage === STAGES.WELCOME && (
        <WelcomeScreen onDiscover={handleDiscover} />
      )}

      {/* Stages 1-8: Garden (persists everywhere) */}
      {stage >= STAGES.WELCOME && (
        <Garden
          stage={stage}
          isFullGarden={stage >= STAGES.FINAL}
          onGardenReady={handleGardenReady}
        />
      )}

      {/* Stage 4: Message */}
      {stage === STAGES.MESSAGE && (
        <LoveLetter
          mode="message"
          onContinue={handleContinueToLetter}
        />
      )}

      {/* Stage 5: Personal Letter */}
      {stage === STAGES.LETTER && (
        <LoveLetter
          mode="letter"
          onLetterDone={handleLetterDone}
        />
      )}

      {/* Stage 6: Memories */}
      {stage === STAGES.RECUERDOS && (
        <PhotoCarousel onComplete={handleCarouselDone} />
      )}

      {/* Stage 7: Phrases */}
      {stage === STAGES.PHRASES && (
        <MessageSequence onComplete={handlePhrasesComplete} />
      )}

      {/* Stage 8: Final */}
      {stage === STAGES.FINAL && (
        <FinalMessage name={recipientName} />
      )}
    </main>
  );
}
