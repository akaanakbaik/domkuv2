import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { generateApiKey } from '../utils/generateApiKey';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = location.state?.mode || 'login';
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Berhasil masuk! Mengalihkan...');
        setTimeout(() => navigate('/subdomain'), 1000);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const apiKey = generateApiKey();
        if (data.user) {
          await supabase.from('users').upsert({
            id: data.user.id,
            username: username || email.split('@')[0],
            api_key: apiKey,
          });
        }

        setMessage('Akun berhasil dibuat! Silakan login untuk mulai memakai domku.');
        setMode('login');
      }
    } catch (err) {
      setMessage(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-dark-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-dark-800/80 border border-dark-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400">Selamat datang di</p>
            <h1 className="text-2xl font-bold text-blue-400">domku</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white"
          >
            Kembali
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {['login', 'register'].map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                mode === item
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-dark-900 border-dark-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              {item === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input w-full"
              placeholder="you@email.com"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input w-full"
                placeholder="nama pengguna"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input w-full"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-blue w-full"
          >
            {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-300 bg-dark-900/60 border border-dark-700 rounded-lg p-3">
            {message}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-400">
          <div className="p-3 rounded-lg bg-dark-900/60 border border-dark-700">
            <p className="font-semibold text-white">Benefit</p>
            <p className="mt-1">Kelola subdomain, simpan API key, dan lacak aktivitas.</p>
          </div>
          <div className="p-3 rounded-lg bg-dark-900/60 border border-dark-700">
            <p className="font-semibold text-white">Keamanan</p>
            <p className="mt-1">Autentikasi Supabase dan validasi API key otomatis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
