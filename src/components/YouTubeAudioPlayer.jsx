'use client';
import { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

// Fallback YouTube player — used only when the pre-created player in AudioContext
// wasn't ready in time (e.g. very fast user tap before IFrame API loaded).
// On iOS Safari the pre-created player + synchronous playVideo() in the gesture
// is the primary path. This component handles the non-iOS / fallback path.
export default function YouTubeAudioPlayer() {
  const { isYoutube, youtubeVideoId, isPlaying, isMuted, ytPlayerRef } = useAudio();
  const containerRef = useRef(null);
  const internalPlayerRef = useRef(null);

  useEffect(() => {
    if (!isYoutube || !isPlaying || !youtubeVideoId) return;

    // If the pre-created player is already handling playback, don't create another
    if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
      try {
        const state = ytPlayerRef.current.getPlayerState();
        // YT.PlayerState: -1=unstarted, 1=playing, 3=buffering
        if (state === 1 || state === 3) {
          console.info('[YouTubeAudioPlayer] Pre-created player already playing, skipping fallback');
          return;
        }
      } catch {}
    }

    function createPlayer() {
      if (!containerRef.current) return;
      // Destroy any existing fallback player
      if (internalPlayerRef.current) {
        try { internalPlayerRef.current.destroy(); } catch {}
        internalPlayerRef.current = null;
      }

      internalPlayerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: youtubeVideoId,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          playsinline: 1, // Required for iOS inline playback
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(60);
            if (isMuted) e.target.mute();
            else e.target.unMute();
            // Only update ytPlayerRef if not already set by pre-created player
            if (!ytPlayerRef.current) {
              ytPlayerRef.current = e.target;
            }
            console.info('[YouTubeAudioPlayer] fallback player ready, video:', youtubeVideoId);
          },
          onError: (e) => {
            console.error('[YouTubeAudioPlayer] error code:', e.data);
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.getElementById('yt-iframe-api-script')) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        createPlayer();
      };
    }

    return () => {
      if (internalPlayerRef.current) {
        try { internalPlayerRef.current.destroy(); } catch {}
        internalPlayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYoutube, isPlaying, youtubeVideoId]);

  // Keep mute in sync
  useEffect(() => {
    if (!ytPlayerRef.current) return;
    try {
      if (isMuted) ytPlayerRef.current.mute();
      else ytPlayerRef.current.unMute();
    } catch {}
  }, [isMuted, ytPlayerRef]);

  if (!isYoutube || !isPlaying) return null;

  // Hidden container — needed as a mount point for the fallback IFrame player
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      <div ref={containerRef} style={{ width: 1, height: 1 }} />
    </div>
  );
}
