'use client';
import { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

// Fallback YouTube player — mounts ONLY when activePlayerType === 'fallback'.
// This fires when the pre-created player was not ready at the time the user
// tapped "Enable Sound" (extremely fast tap before IFrame API loaded).
//
// When activePlayerType === 'preloaded', this component renders nothing and
// creates no player — guaranteeing only one player ever plays at a time.
export default function YouTubeAudioPlayer() {
  const { isYoutube, youtubeVideoId, isPlaying, isMuted, activePlayerType, ytPlayerRef } = useAudio();
  const containerRef = useRef(null);
  const internalPlayerRef = useRef(null);

  useEffect(() => {
    // Gate: only run when we are the designated active player type
    if (!isYoutube || !isPlaying || !youtubeVideoId) return;
    if (activePlayerType !== 'fallback') {
      // Pre-created player is handling it — do nothing
      console.info('[YT/fallback] skipped — activePlayerType is', activePlayerType);
      return;
    }

    function createPlayer() {
      if (!containerRef.current) return;
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
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(60);
            if (isMuted) e.target.mute();
            else e.target.unMute();
            ytPlayerRef.current = e.target;
            console.info('[YT/fallback] player ready, video:', youtubeVideoId);
          },
          onError: (e) => {
            console.error('[YT/fallback] error code:', e.data);
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
  }, [isYoutube, isPlaying, youtubeVideoId, activePlayerType]);

  // Mute sync for the fallback player
  useEffect(() => {
    if (activePlayerType !== 'fallback') return;
    if (!ytPlayerRef.current) return;
    try {
      if (isMuted) ytPlayerRef.current.mute();
      else ytPlayerRef.current.unMute();
    } catch {}
  }, [isMuted, activePlayerType, ytPlayerRef]);

  // Render nothing when not needed — no DOM, no IFrame
  if (!isYoutube || !isPlaying || activePlayerType !== 'fallback') return null;

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
