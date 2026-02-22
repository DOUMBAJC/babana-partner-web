import { useState } from 'react';

export interface Step<T extends string> {
  id: T;
  title: string;
  label: string;
  icon: any;
  isValid: boolean;
}

export function useStepNavigation<T extends string>(steps: T[], initialStep?: T) {
  const [activeStep, setActiveStep] = useState<T>(initialStep || steps[0]);

  const goToStep = (step: T) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(activeStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  };

  return {
    activeStep,
    setActiveStep: goToStep,
    nextStep,
    prevStep,
    isFirstStep: activeStep === steps[0],
    isLastStep: activeStep === steps[steps.length - 1],
  };
}
