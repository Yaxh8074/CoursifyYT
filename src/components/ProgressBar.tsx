import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({completed}/{total} videos completed)
          </span>
        </div>
        <span className="text-sm font-semibold text-primary-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}