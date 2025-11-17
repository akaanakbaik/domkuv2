import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import SubdomainPage from './pages/SubdomainPage';
import ApiPage from './pages/ApiPage';
import DeveloperPage from './pages/DeveloperPage';
import AuthPage from './pages/AuthPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <Navbar setShowSidebar={setShowSidebar} user={user} />
      <Sidebar show={showSidebar} setShow={setShowSidebar} user={user} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subdomain" element={<SubdomainPage user={user} />} />
          <Route path="/api" element={<ApiPage user={user} />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
