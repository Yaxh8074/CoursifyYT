import { useLocalStorage } from './useLocalStorage';
import type { CourseProgress } from '../types';

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<Record<string, CourseProgress>>('course-progress', {});

  const updateVideoProgress = (courseId: string, videoId: string, completed: boolean) => {
    setProgress(prev => {
      const courseProgress = prev[courseId] || { completedVideos: [], currentVideo: 0 };
      
      const completedVideos = completed
        ? [...new Set([...courseProgress.completedVideos, videoId])]
        : courseProgress.completedVideos.filter(id => id !== videoId);

      return {
        ...prev,
        [courseId]: {
          ...courseProgress,
          completedVideos
        }
      };
    });
  };

  const updateCurrentVideo = (courseId: string, videoIndex: number) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        currentVideo: videoIndex
      }
    }));
  };

  const deleteCourseProgress = (courseId: string) => {
    setProgress(prev => {
      const { [courseId]: removed, ...rest } = prev;
      return rest;
    });
  };

  return {
    progress,
    updateVideoProgress,
    updateCurrentVideo,
    deleteCourseProgress
  };
}