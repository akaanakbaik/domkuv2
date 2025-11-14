import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setShowSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 z-50">
      <h1 className="text-xl font-bold text-blue-400">domku</h1>
      <button
        onClick={() => setShowSidebar(true)}
        className="text-white focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </nav>
  );
};

export default Navbar;
