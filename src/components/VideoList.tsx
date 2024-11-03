import React from 'react';
import { CheckCircle, Circle, Play, Clock } from 'lucide-react';
import type { Video } from '../types';

interface VideoListProps {
  videos: Video[];
  currentVideo: number;
  searchQuery: string;
  onVideoSelect: (index: number) => void;
  onToggleComplete: (index: number) => void;
}

export function VideoList({ 
  videos, 
  currentVideo, 
  searchQuery,
  onVideoSelect,
  onToggleComplete 
}: VideoListProps) {
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Content</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">{videos.length} videos</span>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {filteredVideos.map((video, index) => (
          <div
            key={video.id}
            className={`group w-full p-3 rounded-lg flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              currentVideo === index ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-700' : ''
            }`}
          >
            <button
              onClick={() => onToggleComplete(index)}
              className="flex-shrink-0 hover:scale-110 transition-transform"
              title={video.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {video.completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onVideoSelect(index)}
              className="flex-1 text-left flex items-center gap-3"
            >
              {currentVideo === index ? (
                <Play className="w-5 h-5 text-primary-500" />
              ) : (
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{index + 1}</span>
                </div>
              )}
              <div className="min-w-0">
                <p className={`font-medium truncate ${
                  currentVideo === index ? 'text-primary-500' : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {video.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{video.duration}</span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}