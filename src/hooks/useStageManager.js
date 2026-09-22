import { useState, useCallback } from 'react';

/**
 * Stages of the romantic experience
 */
export const STAGES = {
  WELCOME: 0,
  TRANSITION: 1,
  GARDEN_GROWING: 2,
  MESSAGE: 3,
  LETTER: 4,
  RECUERDOS: 5,
  PHRASES: 6,
  FINAL: 7,
};

/**
 * Hook to manage the progression through the 7 stages.
 * Provides current stage, advancement, and stage checks.
 */
export function useStageManager() {
  const [stage, setStage] = useState(STAGES.WELCOME);

  const advanceStage = useCallback(() => {
    setStage((prev) => Math.min(prev + 1, STAGES.FINAL));
  }, []);

  const goBack = useCallback(() => {
    setStage((prev) => Math.max(prev - 1, STAGES.WELCOME));
  }, []);

  const goToStage = useCallback((targetStage) => {
    setStage((prev) => {
      const next = typeof targetStage === 'function' ? targetStage(prev) : targetStage;
      return next;
    });
  }, []);

  const isAtLeast = useCallback(
    (targetStage) => stage >= targetStage,
    [stage]
  );

  return {
    stage,
    advanceStage,
    goBack,
    goToStage,
    isAtLeast,
  };
}
