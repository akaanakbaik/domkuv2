import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setShowSidebar, user, theme, setTheme }) => {
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    setTheme(next);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-800/80 backdrop-blur border-b border-dark-700 flex items-center justify-between px-4 z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xl font-bold text-blue-500">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">d</span>
        <span>domku</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="hidden sm:flex items-center gap-2 text-white bg-dark-700 hover:bg-dark-600 rounded-lg px-3 py-2 border border-dark-600"
        >
          <span className="text-sm">Tema: {theme}</span>
        </button>
        {!user && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate('/auth', { state: { mode: 'login' } })}
              className="px-3 py-1.5 text-sm rounded-lg border border-dark-600 text-gray-200 hover:border-blue-500"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/auth', { state: { mode: 'register' } })}
              className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Daftar
            </button>
          </div>
        )}
        <button
          onClick={() => setShowSidebar(true)}
          className="flex items-center gap-2 text-white focus:outline-none bg-dark-700 hover:bg-dark-600 rounded-lg px-3 py-2 border border-dark-600"
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
