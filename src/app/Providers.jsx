'use client';
import { AuthProvider } from '../context/AuthContext';
import { AdminProvider } from '../context/AdminContext';
import { LanguageProvider } from '../context/LanguageContext';
import { LegalConsentProvider } from '../context/LegalConsentContext';
import { AudioProvider } from '../context/AudioContext';
import FloatingWidgets from '../components/FloatingWidgets';
import ScrollIndicator from '../components/ScrollIndicator';
import CookieBanner from '../components/CookieBanner';
import AnnouncementPopup from '../components/AnnouncementPopup';
import LegalConsentModal from '../components/LegalConsentModal';
import AudioModal from '../components/AudioModal';
import YouTubeAudioPlayer from '../components/YouTubeAudioPlayer';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <LanguageProvider>
          <LegalConsentProvider>
            <AudioProvider>
              <FloatingWidgets />
              <ScrollIndicator />
              <CookieBanner />
              <AnnouncementPopup />
              <AudioModal />
              <YouTubeAudioPlayer />
              {children}
              <LegalConsentModal />
            </AudioProvider>
          </LegalConsentProvider>
        </LanguageProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
