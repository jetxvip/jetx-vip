'use client';
import { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

// Small visible YouTube player — required by YouTube ToS (cannot hide video element)
// Positioned bottom-right above the floating buttons, minimised to 200×113px.
export default function YouTubeAudioPlayer() {
  const { isYoutube, youtubeVideoId, isPlaying, isMuted, ytPlayerRef } = useAudio();
  const containerRef = useRef(null);
  const internalPlayerRef = useRef(null);

  useEffect(() => {
    if (!isYoutube || !isPlaying || !youtubeVideoId) return;

    function createPlayer() {
      if (!containerRef.current) return;
      // Destroy existing player if present
      if (internalPlayerRef.current) {
        try { internalPlayerRef.current.destroy(); } catch {}
        internalPlayerRef.current = null;
        ytPlayerRef.current = null;
      }

      internalPlayerRef.current = new window.YT.Player(containerRef.current, {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: youtubeVideoId, // required for loop to work
          controls: 1,
          rel: 0,
          modestbranding: 1,
          fs: 0,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(60);
            if (isMuted) e.target.mute();
            else e.target.unMute();
            ytPlayerRef.current = e.target;
            console.info('[YouTubePlayer] ready, video:', youtubeVideoId);
          },
          onError: (e) => {
            console.error('[YouTubePlayer] error code:', e.data);
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      // Load the IFrame API script once
      if (!document.getElementById('yt-iframe-api-script')) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
      // Callback invoked by the YT API once loaded
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        createPlayer();
      };
    }

    return () => {
      ytPlayerRef.current = null;
      if (internalPlayerRef.current) {
        try { internalPlayerRef.current.destroy(); } catch {}
        internalPlayerRef.current = null;
      }
    };
    // Only recreate when video ID or playing state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYoutube, isPlaying, youtubeVideoId]);

  // Keep mute in sync after player is ready
  useEffect(() => {
    if (!ytPlayerRef.current) return;
    try {
      if (isMuted) ytPlayerRef.current.mute();
      else ytPlayerRef.current.unMute();
    } catch {}
  }, [isMuted, ytPlayerRef]);

  if (!isYoutube || !isPlaying) return null;

  return (
    // Hidden container — IFrame API needs a real DOM node to attach to,
    // but we keep it completely invisible and out of the layout.
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
