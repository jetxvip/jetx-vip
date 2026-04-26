'use client';
import { useState, useEffect } from 'react';
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

  const { triggerPrompt } = useAudio();
  const { company } = useAdmin();

  // SSR: mounted=false → no overlay → page content visible to crawlers.
  useEffect(() => {
    setIntroDone(introPlayedThisLoad);
    setMounted(true);
  }, []);

  function handleComplete() {
    introPlayedThisLoad = true;
    setIntroDone(true);
    // Trigger audio prompt only on the first load of this session
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
