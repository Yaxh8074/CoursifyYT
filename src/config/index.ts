// Configuration constants and environment variables
export const config = {
    youtube: {
      apiKey: import.meta.env.VITE_YOUTUBE_API_KEY,
      baseUrl: 'https://www.googleapis.com/youtube/v3',
      defaultApiKey: 'YOUR_DEFAULT_API_KEY', // Replace with your new API key
    }
  } as const;
  
  // Validation function to ensure required environment variables are set
  export function validateConfig() {
    const apiKey = config.youtube.apiKey || config.youtube.defaultApiKey;
    
    if (!apiKey) {
      throw new Error(
        'YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in your environment variables.'
      );
    }
  
    return {
      ...config,
      youtube: {
        ...config.youtube,
        apiKey
      }
    };
  }