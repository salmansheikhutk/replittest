import { useLocalStorage } from 'usehooks-ts';

interface ProgressState {
  completedLessonIds: number[];
  xp: number;
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<ProgressState>('fasaha-learning-progress', {
    completedLessonIds: [],
    xp: 0
  });

  const markLessonComplete = (lessonId: number, earnedXp: number = 50) => {
    setProgress((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) {
        return prev; // Already completed
      }
      return {
        completedLessonIds: [...prev.completedLessonIds, lessonId],
        xp: prev.xp + earnedXp,
      };
    });
  };

  const isLessonComplete = (lessonId: number) => {
    return progress.completedLessonIds.includes(lessonId);
  };

  return {
    progress,
    markLessonComplete,
    isLessonComplete,
  };
}
