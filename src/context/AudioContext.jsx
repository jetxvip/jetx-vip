'use client';
import { createContext, useContext, useState, useRef, useCallback } from 'react';

// ─── Module-level: survives SPA navigation, resets on full page load ──────────
let audioChoiceMadeThisLoad = false;
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

  // ── Single source-of-truth for which player is active ─────────────────────
  // 'preloaded' → pre-created player is handling playback (primary path, iOS-safe)
  // 'fallback'  → YouTubeAudioPlayer component handles playback (Android/Desktop fallback)
  // null        → no YouTube player active
  const [activePlayerType, setActivePlayerType] = useState(null);

  const audioRef = useRef(null);
  // Shared ref — populated by whichever player is active; used by toggleMute
  const ytPlayerRef = useRef(null);
  // Pre-created player (built during modal display, before user tap)
  const ytPreloadPlayerRef = useRef(null);
  // DOM container for the pre-created player
  const ytPreloadContainerRef = useRef(null);

  // ── Pre-create the YouTube player while the modal is visible ──────────────
  // Player starts paused/muted. When user taps "Enable Sound", playVideo() is
  // called synchronously inside the click handler — the only iOS-safe approach.
  const preloadYouTubePlayer = useCallback((videoId) => {
    if (typeof window === 'undefined') return;

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
      if (ytPreloadPlayerRef.current) {
        try { ytPreloadPlayerRef.current.destroy(); } catch {}
        ytPreloadPlayerRef.current = null;
      }

      ytPreloadPlayerRef.current = new window.YT.Player(ytPreloadContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,      // No autoplay — user hasn't consented yet
          loop: 1,
          playlist: videoId,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          playsinline: 1,   // Required for iOS inline playback
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.setVolume(60);
            ytPlayerRef.current = e.target;
            console.info('[YT/preloaded] player ready, video:', videoId);
          },
          onError: (e) => {
            console.error('[YT/preloaded] error code:', e.data);
          },
        },
      });
    }

    ensureYTApiScript(buildPlayer);
  }, []);

  // ── Destroy the pre-created player and its DOM container ──────────────────
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

  // ── Called by IntroWrapper after intro / on first interaction ─────────────
  const triggerPrompt = useCallback((url) => {
    if (audioChoiceMadeThisLoad) return;
    if (!url) return;
    pendingAudioUrl = url;
    setAudioUrl(url);

    const ytId = extractYouTubeId(url);
    if (ytId) {
      setIsYoutube(true);
      setYoutubeVideoId(ytId);
      preloadYouTubePlayer(ytId);
    } else {
      setIsYoutube(false);
      setYoutubeVideoId('');
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
    setHasChosen(true);
    setShowPrompt(false);
    setIsMuted(false);

    const url = pendingAudioUrl || audioUrl;
    const ytId = extractYouTubeId(url);

    if (ytId) {
      const player = ytPlayerRef.current || ytPreloadPlayerRef.current;
      if (player) {
        try {
          player.unMute();
          player.setVolume(60);
          player.playVideo(); // ← synchronous, inside user gesture — iOS-safe ✓
          // Mark preloaded as active BEFORE setIsPlaying so YouTubeAudioPlayer
          // sees 'preloaded' immediately and skips creating a second player.
          setActivePlayerType('preloaded');
          setIsPlaying(true);
          console.info('[YT/preloaded] playVideo() called synchronously in gesture');
        } catch (err) {
          console.error('[YT/preloaded] playVideo() failed:', err);
          // Pre-created player failed → let fallback component handle it
          setActivePlayerType('fallback');
          setIsPlaying(true);
        }
      } else {
        // Player wasn't ready yet (very fast tap) → fallback handles playback
        console.warn('[YT] pre-created player not ready, using fallback');
        setActivePlayerType('fallback');
        setIsPlaying(true);
      }
      return;
    }

    // ── Direct audio file ──────────────────────────────────────────────────
    const el = audioRef.current;
    if (!el || !url) return;

    if (!el.src || !el.src.includes(url.replace(/^https?:\/\//, ''))) {
      el.src = url;
      el.load();
    }
    el.muted = false;
    el.volume = 0.6;
    el.loop = true;

    const playPromise = el.play(); // synchronous call inside user gesture — iOS-safe ✓
    if (playPromise !== undefined) {
      playPromise
        .then(() => { console.info('[AudioPlayer] started'); setIsPlaying(true); })
        .catch((err) => { console.error('[AudioPlayer] play() rejected:', err.name, err.message); setIsPlaying(false); });
    } else {
      setIsPlaying(true);
    }
  }, [audioUrl]);

  const declineAudio = useCallback(() => {
    audioChoiceMadeThisLoad = true;
    setHasChosen(true);
    setShowPrompt(false);
    setIsPlaying(false);
    setActivePlayerType(null);
    const el = audioRef.current;
    if (el) { el.pause(); el.src = ''; }
    destroyPreloadPlayer();
    ytPlayerRef.current = null;
  }, [destroyPreloadPlayer]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      if (audioRef.current) audioRef.current.muted = next;
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
      activePlayerType,
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
        onPlay={() => console.info('[AudioPlayer] onplay')}
        onPause={() => console.info('[AudioPlayer] onpause')}
        onError={(e) => {
          const err = e.currentTarget.error;
          const codes = ['MEDIA_ERR_ABORTED', 'MEDIA_ERR_NETWORK', 'MEDIA_ERR_DECODE', 'MEDIA_ERR_SRC_NOT_SUPPORTED'];
          console.error('[AudioPlayer] onerror:', err ? `code=${err.code} (${codes[err.code - 1] || '?'})` : 'unknown');
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
    activePlayerType: null,
    audioRef: { current: null }, ytPlayerRef: { current: null },
    triggerPrompt: () => {}, enableAudio: () => {}, declineAudio: () => {},
    toggleMute: () => {}, openPrompt: () => {},
  };
  return ctx;
}
