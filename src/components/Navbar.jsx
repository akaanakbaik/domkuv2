import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setShowSidebar, user, theme, setTheme }) => {
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return 'dark';
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur border-b border-stroke flex items-center justify-between px-4 z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xl font-bold text-accent">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">d</span>
        <span>domku</span>
      </button>

      <div className="flex items-center gap-3">
        {!user && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate('/auth', { state: { mode: 'login' } })}
              className="px-3 py-1.5 text-sm rounded-lg border border-stroke text-foreground hover:border-accent"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/auth', { state: { mode: 'register' } })}
              className="px-3 py-1.5 text-sm rounded-lg bg-accent text-white"
            >
              Daftar
            </button>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="hidden sm:inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-stroke text-foreground"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? 'Terang' : 'Gelap'}
        </button>
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 text-foreground focus:outline-none bg-surface-alt rounded-lg px-3 py-2 border border-stroke"
        >
          <span className="text-sm hidden md:inline">Menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
