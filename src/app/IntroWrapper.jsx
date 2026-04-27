'use client';
import { useState, useEffect, useRef } from 'react';
import IntroAnimation from '../components/IntroAnimation';
import { useAudio } from '../context/AudioContext';
import { useAdmin } from '../context/AdminContext';

// Module-level flag: lives as long as the JS bundle stays loaded.
// Survives SPA route changes (same JS context) but resets on full page
// refresh or new tab (fresh JS execution) — exactly the desired behavior.
let introPlayedThisLoad = false;

export default function IntroWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const interactionListenerRef = useRef(null);

  const { triggerPrompt, hasChosen } = useAudio();
  const { company } = useAdmin();

  // SSR: mounted=false → no overlay → page content visible to crawlers.
  useEffect(() => {
    setIntroDone(introPlayedThisLoad);
    setMounted(true);
  }, []);

  // When intro is already done (session already played it), listen for the first
  // user interaction and then fire the audio prompt — so the modal still appears
  // on every full page load after a user interacts.
  useEffect(() => {
    if (!mounted) return;
    if (!introDone) return;          // Intro still playing — handleComplete will fire
    if (hasChosen) return;           // User already chose — don't re-prompt
    const url = company?.audioExperienceUrl?.trim();
    if (!url) return;                // No audio configured

    function onFirstInteraction() {
      triggerPrompt(url);
      cleanup();
    }
    function cleanup() {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction, { capture: true });
      interactionListenerRef.current = null;
    }

    interactionListenerRef.current = cleanup;
    window.addEventListener('click', onFirstInteraction, { once: true });
    window.addEventListener('scroll', onFirstInteraction, { once: true, capture: true });

    return cleanup;
  }, [mounted, introDone, hasChosen, company?.audioExperienceUrl, triggerPrompt]);

  function handleComplete() {
    introPlayedThisLoad = true;
    setIntroDone(true);
    // Trigger audio prompt immediately after intro ends (intro itself is the interaction)
    const url = company?.audioExperienceUrl?.trim();
    if (url) triggerPrompt(url);
  }

  return (
    <>
      {mounted && !introDone && <IntroAnimation onComplete={handleComplete} />}
      {children}
    </>
  );
}
