import React from 'react';
import YouTube from 'react-youtube';
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  onVideoComplete: () => void;
}

export function VideoPlayer({ videoId, onVideoComplete }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  const opts = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 1,
    },
  };

  const handleStateChange = (event: any) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      onVideoComplete();
    }
  };

  const handleReady = () => {
    setIsLoading(false);
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-black relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      <YouTube
        videoId={videoId}
        opts={opts}
        onStateChange={handleStateChange}
        onReady={handleReady}
        className="w-full aspect-video"
      />
    </div>
  );
}