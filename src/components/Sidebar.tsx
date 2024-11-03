import React from 'react';
import { Menu, X, Search, CheckCircle, Circle, Play, Clock } from 'lucide-react';
import type { Video } from '../types';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  title: string;
  videos: Video[];
  currentVideo: number;
  searchQuery: string;
  onSearch: (query: string) => void;
  onVideoSelect: (index: number) => void;
  onToggleComplete: (index: number) => void;
}

export function Sidebar({
  open,
  onToggle,
  title,
  videos,
  currentVideo,
  searchQuery,
  onSearch,
  onVideoSelect,
  onToggleComplete
}: SidebarProps) {
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`${
        open ? 'w-80' : 'w-0'
      } flex-shrink-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
    >
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 gap-2">
        <h2 className="font-semibold text-gray-900 dark:text-white truncate flex-1">
          {open ? title : ''}
        </h2>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 space-y-1">
              {filteredVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`group p-3 rounded-lg flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                    currentVideo === index ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <button
                    onClick={() => onToggleComplete(index)}
                    className="flex-shrink-0 hover:scale-110 transition-transform"
                  >
                    {video.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => onVideoSelect(index)}
                    className="flex-1 text-left flex items-center gap-3 min-w-0"
                  >
                    {currentVideo === index ? (
                      <Play className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${
                        currentVideo === index
                          ? 'text-primary-500'
                          : 'text-gray-900 dark:text-white'
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
        </>
      )}
    </div>
  );
}