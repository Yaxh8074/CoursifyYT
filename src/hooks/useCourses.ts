import { useLocalStorage } from './useLocalStorage';
import { useProgress } from './useProgress';
import { getPlaylistId } from '../services/api/youtube/utils';
import { fetchPlaylistData } from '../services/api/youtube/playlist.service';
import type { Course } from '../types';

export function useCourses() {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [activeCourseId, setActiveCourseId] = useLocalStorage<string | null>('active-course', null);
  const { progress, updateVideoProgress, updateCurrentVideo, deleteCourseProgress } = useProgress();

  const addCourse = async (playlistUrl: string) => {
    try {
      const playlistId = getPlaylistId(playlistUrl);
      
      if (!playlistId) {
        throw new Error('Invalid playlist URL. Please check the URL and try again.');
      }

      const existingCourse = courses.find(course => course.id === playlistId);
      if (existingCourse) {
        throw new Error('This course is already in your library.');
      }

      const courseData = await fetchPlaylistData(playlistId);
      const savedProgress = progress[courseData.id];
      
      const newCourse = {
        ...courseData,
        currentVideo: savedProgress?.currentVideo || 0,
        videos: courseData.videos.map(video => ({
          ...video,
          completed: savedProgress?.completedVideos.includes(video.id) || false
        }))
      };

      setCourses(prev => [...prev, newCourse]);
      setActiveCourseId(newCourse.id);
      return newCourse;
    } catch (error) {
      console.error('Error in addCourse:', error);
      throw error;
    }
  };

  const updateCourseProgress = (courseId: string, videoIndex: number, completed: boolean) => {
    setCourses(prevCourses => {
      const courseIndex = prevCourses.findIndex(course => course.id === courseId);
      if (courseIndex === -1) return prevCourses;

      const updatedCourses = [...prevCourses];
      const course = { ...updatedCourses[courseIndex] };
      course.videos = [...course.videos];
      course.videos[videoIndex] = {
        ...course.videos[videoIndex],
        completed
      };

      updatedCourses[courseIndex] = course;
      return updatedCourses;
    });

    const videoId = courses.find(c => c.id === courseId)?.videos[videoIndex]?.id;
    if (videoId) {
      updateVideoProgress(courseId, videoId, completed);
    }
  };

  const setCurrentVideo = (courseId: string, videoIndex: number) => {
    setCourses(prevCourses => {
      const courseIndex = prevCourses.findIndex(course => course.id === courseId);
      if (courseIndex === -1) return prevCourses;

      const updatedCourses = [...prevCourses];
      updatedCourses[courseIndex] = {
        ...updatedCourses[courseIndex],
        currentVideo: videoIndex
      };

      return updatedCourses;
    });

    updateCurrentVideo(courseId, videoIndex);
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    deleteCourseProgress(courseId);
    if (activeCourseId === courseId) {
      setActiveCourseId(null);
    }
  };

  return {
    courses,
    activeCourseId,
    setActiveCourseId,
    addCourse,
    updateCourseProgress,
    setCurrentVideo,
    deleteCourse
  };
}