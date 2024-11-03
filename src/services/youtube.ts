const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function getPlaylistId(url: string): Promise<string | null> {
  const regex = /[?&]list=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function fetchPlaylistData(playlistId: string) {
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`
  );
  const playlistData = await playlistResponse.json();
  
  if (!playlistData.items?.length) {
    throw new Error('Playlist not found');
  }

  // Fetch all videos using pagination
  let nextPageToken = '';
  let allVideos: any[] = [];

  do {
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
    );
    const videosData = await videosResponse.json();
    allVideos = [...allVideos, ...videosData.items];
    nextPageToken = videosData.nextPageToken;
  } while (nextPageToken);

  // Fetch video details in batches of 50
  const videoDetails: any[] = [];
  for (let i = 0; i < allVideos.length; i += 50) {
    const batch = allVideos.slice(i, i + 50);
    const videoIds = batch.map(item => item.contentDetails.videoId).join(',');
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
    );
    const batchDetails = await videoDetailsResponse.json();
    videoDetails.push(...batchDetails.items);
  }

  return {
    id: playlistId,
    title: playlistData.items[0].snippet.title,
    videos: allVideos.map((item: any, index: number) => ({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      completed: false,
      duration: formatDuration(videoDetails[index]?.contentDetails?.duration || 'PT0M0S')
    }))
  };
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '00:00';

  const hours = (match[1] ? parseInt(match[1]) : 0);
  const minutes = (match[2] ? parseInt(match[2]) : 0);
  const seconds = (match[3] ? parseInt(match[3]) : 0);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}