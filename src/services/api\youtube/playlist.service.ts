import { fetchFromYouTube } from './fetcher';
import { YOUTUBE_API_CONFIG } from './config';
import { formatDuration } from './utils';
import type { PlaylistResponse, PlaylistItemsResponse, VideoDetailsResponse } from './types';

export async function fetchPlaylistData(playlistId: string) {
  // First, verify the playlist exists
  const playlistData = await fetchFromYouTube<PlaylistResponse>({
    endpoint: YOUTUBE_API_CONFIG.endpoints.playlists,
    params: {
      part: YOUTUBE_API_CONFIG.parts.playlist,
      id: playlistId
    }
  });

  if (!playlistData.items?.length) {
    throw new Error('Playlist not found or is private');
  }

  // Fetch all videos using pagination
  let nextPageToken: string | undefined;
  let allVideos: PlaylistItemsResponse['items'] = [];

  do {
    const videosData = await fetchFromYouTube<PlaylistItemsResponse>({
      endpoint: YOUTUBE_API_CONFIG.endpoints.playlistItems,
      params: {
        part: YOUTUBE_API_CONFIG.parts.playlistItems,
        maxResults: '50',
        playlistId,
        ...(nextPageToken ? { pageToken: nextPageToken } : {})
      }
    });

    allVideos = [...allVideos, ...videosData.items];
    nextPageToken = videosData.nextPageToken;
  } while (nextPageToken);

  // Fetch video details in batches of 50
  const videoDetails: VideoDetailsResponse['items'] = [];
  for (let i = 0; i < allVideos.length; i += 50) {
    const batch = allVideos.slice(i, i + 50);
    const videoIds = batch.map(item => item.contentDetails.videoId).join(',');
    
    const batchDetails = await fetchFromYouTube<VideoDetailsResponse>({
      endpoint: YOUTUBE_API_CONFIG.endpoints.videos,
      params: {
        part: YOUTUBE_API_CONFIG.parts.video,
        id: videoIds
      }
    });

    videoDetails.push(...batchDetails.items);
  }

  return {
    id: playlistId,
    title: playlistData.items[0].snippet.title,
    videos: allVideos.map((item, index) => ({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      completed: false,
      duration: formatDuration(videoDetails[index]?.contentDetails?.duration || 'PT0M0S')
    }))
  };
}