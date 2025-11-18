import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPrompt = ({ onClose, title = 'Akses memerlukan akun' }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Keamanan</p>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p className="text-gray-300 text-sm">
          Silakan daftar atau masuk terlebih dahulu untuk mengakses fitur ini. Kami memerlukan akun agar riwayat subdomain dan API key tersimpan dengan aman.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => navigate('/auth', { state: { mode: 'register' } })}
            className="btn btn-blue flex-1"
          >
            Daftar sekarang
          </button>
          <button
            onClick={() => navigate('/auth', { state: { mode: 'login' } })}
            className="btn btn-gray flex-1"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
