import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import SubdomainPage from './pages/SubdomainPage';
import ApiPage from './pages/ApiPage';
import DeveloperPage from './pages/DeveloperPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      // Perbaikan di sini:
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

  const protectedRoutes = ['/subdomain', '/api'];
  if (protectedRoutes.includes(location.pathname) && !user) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar setShowSidebar={setShowSidebar} />
      <Sidebar show={showSidebar} setShow={setShowSidebar} user={user} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subdomain" element={<SubdomainPage user={user} />} />
          <Route path="/api" element={<ApiPage user={user} />} />
          <Route path="/developer" element={<DeveloperPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
