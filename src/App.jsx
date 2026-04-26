import { useState, Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '__secret_admin__';

// ── Route-level error boundary ─────────────────────────────────────────────────
class RouteErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#2A2521', gap: 16, padding: 32 }}>
          <p style={{ fontSize: 14, color: 'rgba(42,37,33,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Page error</p>
          <p style={{ fontSize: 13, color: 'rgba(42,37,33,0.4)', maxWidth: 360, textAlign: 'center' }}>Something went wrong loading this page. Please try refreshing or return home.</p>
          <Link to="/" style={{ fontSize: 13, color: '#E8651A', textDecoration: 'underline' }} onClick={() => this.setState({ error: null })}>Return to home</Link>
        </div>
      );
    }
    return this.props.children;
  }
}
import { LanguageProvider } from './context/LanguageContext';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import EmptyLegs from './pages/EmptyLegs';
import Quote from './pages/Quote';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AircraftDetail from './pages/AircraftDetail';
import FleetPage from './pages/FleetPage';
import AmbulancePage from './pages/AmbulancePage';
import SpecialOffers from './pages/SpecialOffers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import AccessibilityStatement from './pages/AccessibilityStatement';
import IntroAnimation from './components/IntroAnimation';
import FloatingWidgets from './components/FloatingWidgets';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollIndicator from './components/ScrollIndicator';
import { LegalConsentProvider } from './context/LegalConsentContext';
import LegalConsentModal from './components/LegalConsentModal';
import CookieBanner from './components/CookieBanner';
import AnnouncementPopup from './components/AnnouncementPopup';

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [introDone, setIntroDone] = useState(!isHome);

  return (
    <>
      {isHome && !introDone && (
        <IntroAnimation onComplete={() => setIntroDone(true)} />
      )}

      <FloatingWidgets />
      <ScrollIndicator />
      <CookieBanner />
      <AnnouncementPopup />

      <Routes>
        {/* Secret admin path — only this path loads admin */}
        <Route path={`/${ADMIN_PATH}`} element={<Login />} />
        <Route path={`/${ADMIN_PATH}/panel`} element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />

        {/* Block all common admin/login paths — redirect to home */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />

        {/* Public site */}
        <Route path="/*" element={
          <Layout>
            <RouteErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/empty-legs" element={<EmptyLegs />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/fleet" element={<FleetPage />} />
                <Route path="/fleet/:slug" element={<AircraftDetail />} />
                <Route path="/ambulance" element={<AmbulancePage />} />
                <Route path="/special-offers" element={<SpecialOffers />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
                <Route path="/accessibility" element={<AccessibilityStatement />} />
              </Routes>
            </RouteErrorBoundary>
          </Layout>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <LanguageProvider>
          <LegalConsentProvider>
            <BrowserRouter>
              <AppRoutes />
              <LegalConsentModal />
            </BrowserRouter>
          </LegalConsentProvider>
        </LanguageProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
