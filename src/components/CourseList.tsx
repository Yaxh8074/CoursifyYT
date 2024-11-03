import React from 'react';
import { Trash2, PlayCircle, CheckCircle } from 'lucide-react';
import type { Course, CourseProgress } from '../types';

interface CourseListProps {
  courses: Course[];
  progress: Record<string, CourseProgress>;
  onSelect: (courseId: string) => void;
  onDelete: (courseId: string) => void;
}

export function CourseList({ courses, progress, onSelect, onDelete }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Add your first course to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => {
        const completedCount = course.videos.filter(v => v.completed).length;
        const percentage = Math.round((completedCount / course.videos.length) * 100);

        return (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(course.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>{completedCount} of {course.videos.length} videos completed</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <button
                  onClick={() => onSelect(course.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" />
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}