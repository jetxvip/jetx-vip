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
  }, []);

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
      // YouTube: YouTubeAudioPlayer component handles actual playback
      setIsPlaying(true);
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
  }, [audioUrl]);

  const declineAudio = useCallback(() => {
    audioChoiceMadeThisLoad = true;
    audioEnabledThisLoad = false;
    setHasChosen(true);
    setShowPrompt(false);
    setIsPlaying(false);
    const el = audioRef.current;
    if (el) { el.pause(); el.src = ''; }
  }, []);

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
