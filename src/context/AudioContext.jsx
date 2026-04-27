'use client';
import { createContext, useContext, useState, useRef, useCallback } from 'react';

// ─── Module-level: survives SPA navigation, resets on full page load ──────────
let audioChoiceMadeThisLoad = false;
let audioEnabledThisLoad = false;
// Store the URL at module level so enableAudio never reads stale React state
let pendingAudioUrl = '';

const AudioContext = createContext(null);

// ─── Shared YouTube ID extractor ─────────────────────────────────────────────
export function extractYouTubeId(url = '') {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

// ─── Load YouTube IFrame API script once ─────────────────────────────────────
function ensureYTApiScript(onReady) {
  if (typeof window === 'undefined') return;
  if (window.YT && window.YT.Player) {
    onReady();
    return;
  }
  // Queue callback — multiple callers chain safely
  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (prev) prev();
    onReady();
  };
  if (!document.getElementById('yt-iframe-api-script')) {
    const s = document.createElement('script');
    s.id = 'yt-iframe-api-script';
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
}

export function AudioProvider({ children }) {
  const [audioUrl, setAudioUrl] = useState('');
  const [hasChosen, setHasChosen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');

  const audioRef = useRef(null);
  // Populated by YouTubeAudioPlayer once the YT IFrame API player is ready
  const ytPlayerRef = useRef(null);
  // Pre-created player built while modal is visible (before user tap)
  const ytPreloadPlayerRef = useRef(null);
  // DOM node created at triggerPrompt time for the pre-created player
  const ytPreloadContainerRef = useRef(null);

  // ── Pre-create the YouTube player while the modal is visible ──────────────
  // This way, when the user taps "Enable Sound", the player already exists
  // and we can call playVideo() + unMute() synchronously inside the gesture.
  const preloadYouTubePlayer = useCallback((videoId) => {
    if (typeof window === 'undefined') return;

    // Create a hidden container for the pre-load player
    if (!ytPreloadContainerRef.current) {
      const div = document.createElement('div');
      div.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;z-index:-1;';
      const inner = document.createElement('div');
      inner.style.cssText = 'width:1px;height:1px;';
      div.appendChild(inner);
      document.body.appendChild(div);
      ytPreloadContainerRef.current = inner;
    }

    function buildPlayer() {
      // Destroy any previous preload player
      if (ytPreloadPlayerRef.current) {
        try { ytPreloadPlayerRef.current.destroy(); } catch {}
        ytPreloadPlayerRef.current = null;
      }

      ytPreloadPlayerRef.current = new window.YT.Player(ytPreloadContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0, // Do NOT autoplay — user hasn't consented yet
          loop: 1,
          playlist: videoId,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          // playsinline required for iOS to allow inline playback
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            // Mute, cue the video (loads metadata/buffer), but do NOT play yet
            e.target.mute();
            e.target.setVolume(60);
            // Store in ytPlayerRef so toggleMute/floating button works
            ytPlayerRef.current = e.target;
            console.info('[YouTubePlayer] pre-created and ready for iOS gesture:', videoId);
          },
          onError: (e) => {
            console.error('[YouTubePlayer] preload error code:', e.data);
          },
        },
      });
    }

    ensureYTApiScript(buildPlayer);
  }, [ytPlayerRef]);

  // ── Cleanup pre-load player and its DOM container ─────────────────────────
  const destroyPreloadPlayer = useCallback(() => {
    if (ytPreloadPlayerRef.current) {
      try { ytPreloadPlayerRef.current.destroy(); } catch {}
      ytPreloadPlayerRef.current = null;
    }
    if (ytPreloadContainerRef.current) {
      try {
        const parent = ytPreloadContainerRef.current.parentElement;
        if (parent && parent.parentElement) parent.parentElement.removeChild(parent);
      } catch {}
      ytPreloadContainerRef.current = null;
    }
  }, []);

  // ── Called by IntroWrapper after intro animation completes ─────────────────
  const triggerPrompt = useCallback((url) => {
    if (audioChoiceMadeThisLoad) return;
    if (!url) return;
    pendingAudioUrl = url;
    setAudioUrl(url);

    const ytId = extractYouTubeId(url);
    if (ytId) {
      setIsYoutube(true);
      setYoutubeVideoId(ytId);
      // Pre-create the player NOW so it's ready when user taps Enable Sound
      preloadYouTubePlayer(ytId);
    } else {
      setIsYoutube(false);
      setYoutubeVideoId('');
      // Pre-load direct audio while modal is visible
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.volume = 0.6;
        audioRef.current.loop = true;
        audioRef.current.muted = true;
        audioRef.current.load();
      }
    }

    setShowPrompt(true);
  }, [preloadYouTubePlayer]);

  // ── Called when user clicks "Enable Sound" — direct user-gesture ───────────
  const enableAudio = useCallback(() => {
    audioChoiceMadeThisLoad = true;
    audioEnabledThisLoad = true;
    setHasChosen(true);
    setShowPrompt(false);
    setIsMuted(false);

    const url = pendingAudioUrl || audioUrl;
    const ytId = extractYouTubeId(url);

    if (ytId) {
      // ── YouTube: call playVideo() + unMute() synchronously inside this gesture ──
      // ytPlayerRef.current was populated by the pre-created player in triggerPrompt.
      // This is the ONLY way to unblock iOS Safari — the play call must happen
      // directly inside the user click handler with no async gaps.
      const player = ytPlayerRef.current || ytPreloadPlayerRef.current;
      if (player) {
        try {
          player.unMute();
          player.setVolume(60);
          player.playVideo(); // ← synchronous, inside user gesture ✓
          setIsPlaying(true);
          console.info('[YouTubePlayer] playVideo() called synchronously in gesture (iOS-safe)');
        } catch (err) {
          console.error('[YouTubePlayer] playVideo() failed:', err);
          setIsPlaying(true); // Still signal playing; YouTubeAudioPlayer will retry
        }
      } else {
        // Fallback: player wasn't ready yet — signal YouTubeAudioPlayer to handle it
        console.warn('[YouTubePlayer] pre-created player not ready, falling back to YouTubeAudioPlayer');
        setIsPlaying(true);
      }
      return;
    }

    // ── Direct audio file ──────────────────────────────────────────────────
    const el = audioRef.current;
    if (!el || !url) {
      console.warn('[AudioPlayer] enableAudio: no audio element or URL', { url, el });
      return;
    }

    if (!el.src || !el.src.includes(url.replace(/^https?:\/\//, ''))) {
      el.src = url;
      el.load();
    }

    el.muted = false;
    el.volume = 0.6;
    el.loop = true;

    // play() called synchronously inside user click handler — iOS-safe ✓
    const playPromise = el.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.info('[AudioPlayer] Playback started successfully');
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('[AudioPlayer] play() rejected:', err.name, err.message);
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
    }
  }, [audioUrl, ytPreloadPlayerRef]);

  const declineAudio = useCallback(() => {
    audioChoiceMadeThisLoad = true;
    audioEnabledThisLoad = false;
    setHasChosen(true);
    setShowPrompt(false);
    setIsPlaying(false);
    const el = audioRef.current;
    if (el) { el.pause(); el.src = ''; }
    // Destroy the pre-created YouTube player on decline
    destroyPreloadPlayer();
    ytPlayerRef.current = null;
  }, [destroyPreloadPlayer]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      // Direct audio element
      if (audioRef.current) audioRef.current.muted = next;
      // YouTube IFrame player
      if (ytPlayerRef.current) {
        try {
          if (next) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        } catch {}
      }
      return next;
    });
  }, []);

  const openPrompt = useCallback((url) => {
    if (!url) return;
    pendingAudioUrl = url;
    setAudioUrl(url);
    setShowPrompt(true);
  }, []);

  return (
    <AudioContext.Provider value={{
      audioUrl,
      hasChosen,
      isPlaying,
      isMuted,
      showPrompt,
      isYoutube,
      youtubeVideoId,
      audioRef,
      ytPlayerRef,
      triggerPrompt,
      enableAudio,
      declineAudio,
      toggleMute,
      openPrompt,
    }}>
      {/* Persistent direct-audio element — only used for non-YouTube URLs */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        playsInline
        style={{ display: 'none' }}
        onCanPlay={() => console.info('[AudioPlayer] canplay — buffer ready')}
        onPlay={() => console.info('[AudioPlayer] onplay')}
        onPause={() => console.info('[AudioPlayer] onpause')}
        onError={(e) => {
          const err = e.currentTarget.error;
          const codes = ['MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'];
          console.error('[AudioPlayer] onerror:', err ? `code=${err.code} (${codes[err.code - 1] || '?'}) — ${err.message}` : 'unknown error');
        }}
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) return {
    audioUrl: '', hasChosen: false, isPlaying: false, isMuted: false,
    showPrompt: false, isYoutube: false, youtubeVideoId: '',
    audioRef: { current: null }, ytPlayerRef: { current: null },
    triggerPrompt: () => {}, enableAudio: () => {}, declineAudio: () => {},
    toggleMute: () => {}, openPrompt: () => {},
  };
  return ctx;
}
