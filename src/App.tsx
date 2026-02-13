import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import ChargerDetailPage from './pages/ChargerDetailPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ListChargerPage from './pages/ListChargerPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/list" element={<ListChargerPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen gradient-dark">
      <AdBanner />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'toast-custom',
          duration: 4000,
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}
