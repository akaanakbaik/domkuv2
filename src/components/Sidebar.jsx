import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ show, setShow, user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const { addToast } = useToast();

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
      .maybeSingle();

    if (error) {
      console.error('Error fetching user ', error);
      setUserData({ username: user.email.split('@')[0], email: user.email });
      return;
    }

    const fallbackUser = { username: user.email.split('@')[0], email: user.email };
    const mergedUser = data ? { ...fallbackUser, ...data } : fallbackUser;

    setUserData(mergedUser);
    if (mergedUser.api_key) setApiKey(mergedUser.api_key);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShow(false);
    addToast('Berhasil keluar.', 'info');
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    addToast('API key disalin.', 'info');
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
        className={`fixed top-4 right-4 w-[50vw] sm:w-[42vw] lg:w-[24vw] max-w-xs max-h-[38vh] bg-dark-800/90 border border-dark-700 rounded-2xl z-50 transform transition-transform duration-300 ease-in-out sidebar overflow-hidden ${
          show ? 'translate-x-0 opacity-100' : 'translate-x-[140%] opacity-0'
        }`}
        aria-hidden={!show}
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
            <button
              type="button"
              onClick={() => setShowAccountModal(true)}
              className="rounded-xl border border-dark-700 bg-dark-900/70 p-4 space-y-3 text-left w-full"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`https://robohash.org/${user.email}?size=48x48&set=set4`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-sm text-gray-400">Info akun</p>
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
            </button>
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

      {showAccountModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" onClick={() => setShowAccountModal(false)}>
          <div className="absolute inset-0 bg-black/60"></div>
          <div
            className="relative w-full max-w-sm bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-3 text-white animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase text-gray-400">Akun</p>
                <h3 className="text-lg font-semibold">Kelola sesi</h3>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="text-gray-400 hover:text-white">×</button>
            </div>
            <p className="text-sm text-gray-300">Keluar untuk ganti akun atau hapus akun dari database.</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { handleLogout(); setShowAccountModal(false); }}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Keluar
              </button>
              <button
                onClick={async () => {
                  await supabase.from('users').delete().eq('id', user.id);
                  await supabase.auth.signOut();
                  addToast('Akun dihapus.', 'info');
                  setShow(false);
                  setShowAccountModal(false);
                }}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                Hapus akun
              </button>
              <button
                onClick={() => setShowAccountModal(false)}
                className="w-full py-2 rounded-lg bg-dark-700 hover:bg-dark-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
