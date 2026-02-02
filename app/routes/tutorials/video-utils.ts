import type { Tutorial, TutorialStep, TutorialVideoLinks } from "./data";

/**
 * Type pour un tutoriel enrichi avec les URLs des vidéos
 */
export type EnrichedTutorial = Omit<Tutorial, 'steps'> & {
  video?: string;
  steps: Array<Omit<TutorialStep, 'videoId'> & { video?: string }>;
};

/**
 * Enrichit un tutoriel avec les URLs des vidéos récupérées depuis le serveur
 */
export function enrichTutorialWithVideoUrls(
  tutorial: Tutorial,
  videoLinks: TutorialVideoLinks
): EnrichedTutorial {
  const tutorialVideos = videoLinks[tutorial.id];
  
  if (!tutorialVideos) {
    return {
      ...tutorial,
      steps: tutorial.steps.map(step => ({ ...step })),
    };
  }

  return {
    ...tutorial,
    video: tutorialVideos.main || undefined,
    steps: tutorial.steps.map(step => ({
      ...step,
      video: tutorialVideos.steps[step.id.toString()] || undefined,
    })),
  };
}

/**
 * Enrichit une liste de tutoriels avec les URLs des vidéos
 */
export function enrichTutorialsWithVideoUrls(
  tutorials: Tutorial[],
  videoLinks: TutorialVideoLinks
): EnrichedTutorial[] {
  return tutorials.map(tutorial => enrichTutorialWithVideoUrls(tutorial, videoLinks));
}

