import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Sidebar = ({ show, setShow, user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserData(null);
      setApiKey('');
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('username, api_key')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user ', error);
      return;
    }
    setUserData(data);
    if (data.api_key) setApiKey(data.api_key);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShow(false);
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    alert('API Key disalin!');
  };

  const truncateName = (name) => (name && name.length > 16 ? name.substring(0, 16) + '...' : name);

  const handleNavigate = (path) => {
    navigate(path);
    setShow(false);
  };

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setShow(false)}
        ></div>
      )}
      <div
        className={`fixed top-4 right-4 w-[calc(100%-2rem)] sm:w-[380px] lg:w-[28vw] max-w-xl max-h-[80vh] bg-dark-800/95 border border-dark-700 rounded-2xl z-50 shadow-2xl transform transition-transform duration-300 ease-in-out sidebar overflow-hidden ${
          show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
        }`}
      >
        <div className="p-4 h-full flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Navigasi</p>
              <h2 className="text-lg font-semibold text-white">Panel cepat</h2>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-full p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {user && userData ? (
            <div className="rounded-xl border border-dark-700 bg-dark-900/70 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={`https://robohash.org/${user.email}?size=48x48&set=set4`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-400">Masuk sebagai</p>
                  <p className="text-lg font-semibold">{truncateName(userData.username || user.email)}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                <span>Akun aktif & siap membuat subdomain</span>
              </div>
              {apiKey && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="bg-dark-700 text-xs px-2 py-1 rounded w-full truncate border border-dark-600"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); copyApiKey(); }}
                    className="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Salin
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dark-700 bg-dark-900/70 p-4 space-y-3">
              <p className="text-sm text-gray-300">Belum masuk? Daftar atau login untuk menyimpan subdomain dan API key kamu.</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleNavigate('/auth')}
                  className="btn btn-blue flex-1 min-w-[120px] text-center"
                >
                  Masuk / Daftar
                </button>
                <button
                  onClick={() => handleNavigate('/developer')}
                  className="btn btn-gray flex-1 min-w-[120px] text-center"
                >
                  Lihat info dev
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-dark-700 bg-dark-900/60 text-left hover:border-blue-500"
            >
              <span>Home</span>
              <span className="text-xs text-gray-400">Halaman utama</span>
            </button>
            <button
              onClick={() => handleNavigate('/subdomain')}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-dark-700 bg-dark-900/60 text-left hover:border-blue-500"
            >
              <span>Subdomain</span>
              <span className="text-xs text-gray-400">Buat & kelola</span>
            </button>
            <button
              onClick={() => handleNavigate('/api')}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-dark-700 bg-dark-900/60 text-left hover:border-blue-500"
            >
              <span>API</span>
              <span className="text-xs text-gray-400">Dokumentasi</span>
            </button>
            <button
              onClick={() => handleNavigate('/developer')}
              className="flex items-center justify-between px-4 py-3 rounded-lg border border-dark-700 bg-dark-900/60 text-left hover:border-blue-500"
            >
              <span>Info Developer</span>
              <span className="text-xs text-gray-400">Tentang pembuat</span>
            </button>
          </div>

          {user && (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
