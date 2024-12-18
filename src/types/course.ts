export interface Video {
    id: string;
    title: string;
    completed: boolean;
    duration: string;
  }
  
  export interface Course {
    id: string;
    title: string;
    videos: Video[];
    currentVideo: number;
  }
  
  export interface CourseProgress {
    completedVideos: string[];
    currentVideo: number;
  }