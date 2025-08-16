import { useEffect, useRef, useCallback } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  onVideoEnd: () => void;
  onVideoStart: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    ytApiReady?: boolean;
  }
}

export const YouTubePlayer = ({ videoId, onVideoEnd, onVideoStart }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  const initializePlayer = useCallback(() => {
    if (!isMountedRef.current || !containerRef.current || !window.YT?.Player) {
      return;
    }

    try {
      // Destroy existing player if it exists
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Clear the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (!isMountedRef.current) return;
            
            if (event.data === window.YT.PlayerState.ENDED) {
              onVideoEnd();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              onVideoStart();
            }
          },
        },
      });
    } catch (error) {
      console.warn('YouTube player initialization failed:', error);
    }
  }, [videoId, onVideoEnd, onVideoStart]);

  useEffect(() => {
    isMountedRef.current = true;
    
    const loadYouTubeAPI = () => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      // Check if script is already loading
      if (window.ytApiReady) {
        const checkAPI = setInterval(() => {
          if (window.YT && window.YT.Player) {
            clearInterval(checkAPI);
            initializePlayer();
          }
        }, 100);
        return;
      }

      // Mark that we're loading the API
      window.ytApiReady = true;

      // Load the API script
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
      }

      // Set up the callback
      const originalCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (originalCallback && typeof originalCallback === 'function') {
          originalCallback();
        }
        if (isMountedRef.current) {
          initializePlayer();
        }
      };
    };

    loadYouTubeAPI();

    return () => {
      isMountedRef.current = false;
      
      // Safe cleanup of player
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (error) {
          console.warn('YouTube player cleanup failed:', error);
        }
        playerRef.current = null;
      }
    };
  }, [initializePlayer]);

  return <div ref={containerRef} className="w-full h-full" />;
};