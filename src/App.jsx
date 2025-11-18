import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import OverlayLoading from './components/OverlayLoading';
import Home from './pages/Home';
import SubdomainPage from './pages/SubdomainPage';
import ApiPage from './pages/ApiPage';
import DeveloperPage from './pages/DeveloperPage';
import AuthPage from './pages/AuthPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [theme, setTheme] = useState('system');
  const [overlayLoading, setOverlayLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = localStorage.getItem('domku-theme') || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('domku-theme', theme);
  }, [theme]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-page text-foreground transition-colors duration-300">
      <Navbar setShowSidebar={setShowSidebar} user={user} theme={theme} setTheme={setTheme} />
      <Sidebar
        show={showSidebar}
        setShow={setShowSidebar}
        user={user}
        onToast={showToast}
      />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/subdomain"
            element={<SubdomainPage user={user} setOverlayLoading={setOverlayLoading} onToast={showToast} />}
          />
          <Route path="/api" element={<ApiPage user={user} onToast={showToast} />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/auth" element={<AuthPage onToast={showToast} setOverlayLoading={setOverlayLoading} />} />
        </Routes>
      </main>
      <OverlayLoading show={overlayLoading} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
