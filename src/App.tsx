import React, { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoList } from './components/VideoList';
import { ProgressBar } from './components/ProgressBar';
import { SearchBar } from './components/SearchBar';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CourseList } from './components/CourseList';
import { Youtube, Plus } from 'lucide-react';
import type { Course, CourseProgress } from './types';
import { getPlaylistId, fetchPlaylistData } from './services/youtube';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [activeCourseId, setActiveCourseId] = useLocalStorage<string | null>('active-course', null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useLocalStorage<Record<string, CourseProgress>>('course-progress', {});
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showCourseList, setShowCourseList] = useState(!activeCourseId);

  const activeCourse = courses.find(course => course.id === activeCourseId);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const playlistId = await getPlaylistId(playlistUrl);
      if (!playlistId) {
        throw new Error('Invalid playlist URL');
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
      setShowAddCourse(false);
      setShowCourseList(false);
      setPlaylistUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = () => {
    if (!activeCourse) return;
    
    setCourses(prev => prev.map(course => {
      if (course.id !== activeCourse.id) return course;
      const updatedVideos = [...course.videos];
      updatedVideos[course.currentVideo].completed = true;
      
      setProgress(p => ({
        ...p,
        [course.id]: {
          completedVideos: updatedVideos.filter(v => v.completed).map(v => v.id),
          currentVideo: course.currentVideo
        }
      }));

      return { ...course, videos: updatedVideos };
    }));
  };

  const handleToggleComplete = (index: number) => {
    if (!activeCourse) return;

    setCourses(prev => prev.map(course => {
      if (course.id !== activeCourse.id) return course;
      const updatedVideos = [...course.videos];
      updatedVideos[index].completed = !updatedVideos[index].completed;
      
      setProgress(p => ({
        ...p,
        [course.id]: {
          completedVideos: updatedVideos.filter(v => v.completed).map(v => v.id),
          currentVideo: course.currentVideo
        }
      }));

      return { ...course, videos: updatedVideos };
    }));
  };

  const handleVideoSelect = (index: number) => {
    if (!activeCourse) return;
    setCourses(prev => prev.map(course => {
      if (course.id !== activeCourse.id) return course;
      setProgress(p => ({
        ...p,
        [course.id]: {
          ...p[course.id],
          currentVideo: index
        }
      }));
      return { ...course, currentVideo: index };
    }));
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
    if (activeCourseId === courseId) {
      setActiveCourseId(null);
      setShowCourseList(true);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    setActiveCourseId(courseId);
    setShowCourseList(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showCourseList && !showAddCourse ? (
        <>
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="min-h-[calc(100vh-4rem)] p-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
                <button
                  onClick={() => setShowAddCourse(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Course
                </button>
              </div>
              <CourseList
                courses={courses}
                progress={progress}
                onSelect={handleCourseSelect}
                onDelete={handleDeleteCourse}
              />
            </div>
          </div>
        </>
      ) : showAddCourse ? (
        <>
          <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            showHomeButton={courses.length > 0}
            onHomeClick={() => {
              setShowAddCourse(false);
              setShowCourseList(true);
            }}
          />
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <Youtube className="w-12 h-12 text-primary-500" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                Add YouTube Course
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="playlist" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    YouTube Playlist URL
                  </label>
                  <input
                    id="playlist"
                    type="url"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://youtube.com/playlist?list=..."
                    required
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCourse(false);
                      setShowCourseList(true);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Loading...
                      </>
                    ) : (
                      'Add Course'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            title={activeCourse!.title}
            videos={activeCourse!.videos}
            currentVideo={activeCourse!.currentVideo}
            onVideoSelect={handleVideoSelect}
            onToggleComplete={handleToggleComplete}
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              showMenuButton={!sidebarOpen}
              onMenuClick={() => setSidebarOpen(true)}
              showHomeButton
              onHomeClick={() => setShowCourseList(true)}
            />
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="container mx-auto p-4 lg:p-8 max-w-5xl">
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      {activeCourse!.videos[activeCourse!.currentVideo].title}
                    </h1>
                    <ProgressBar
                      completed={activeCourse!.videos.filter(v => v.completed).length}
                      total={activeCourse!.videos.length}
                    />
                  </div>
                  <VideoPlayer
                    videoId={activeCourse!.videos[activeCourse!.currentVideo].id}
                    onVideoComplete={handleVideoComplete}
                  />
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;