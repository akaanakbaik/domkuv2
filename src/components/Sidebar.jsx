import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { generateApiKey } from '../utils/generateApiKey';
import InteractionLoader from './InteractionLoader';
import Toast from './Toast';
import { useTimedLoader } from '../utils/useTimedLoader';

const Sidebar = ({ show, setShow, user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showAccountActions, setShowAccountActions] = useState(false);
  const [toast, setToast] = useState('');
  const { active: blocking, start: startBlocking, stop: stopBlocking } = useTimedLoader(1500);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserData(null);
      setApiKey('');
    }
  }, [user]);

  const fetchUserData = async () => {
    startBlocking();
    const { data, error } = await supabase
      .from('users')
      .select('username, api_key, avatar_url')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user ', error);
      stopBlocking();
      return;
    }

    const username = data?.username || user.email.split('@')[0];
    let storedKey = data?.api_key;

    if (!storedKey) {
      storedKey = generateApiKey();
      const { error: updateError } = await supabase.from('users').upsert({
        id: user.id,
        username,
        api_key: storedKey,
        avatar_url: data?.avatar_url || null,
      });

      if (updateError) {
        console.error('Error saving api key', updateError);
      }
    }

    setUserData({ ...data, username });
    if (storedKey) setApiKey(storedKey);
    stopBlocking();
  };

  const handleLogout = async () => {
    startBlocking();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out', error);
      setToast('Gagal logout, coba lagi');
    } else {
      setShow(false);
      setShowAccountActions(false);
      setToast('Kamu sudah logout');
    }
    stopBlocking();
  };

  const handleDeleteAccount = async () => {
    startBlocking();
    try {
      await supabase.from('subdomains').delete().eq('user_id', user.id);
      await supabase.from('users').delete().eq('id', user.id);
      await supabase.auth.signOut();
      setToast('Akun dihapus');
      setShow(false);
    } catch (error) {
      console.error('Error deleting account', error);
      setToast('Gagal hapus akun');
    }
    setShowAccountActions(false);
    stopBlocking();
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setToast('API key disalin');
  };

  const truncateName = (name) => (name && name.length > 16 ? name.substring(0, 16) + '...' : name);

  const handleNavigate = (path) => {
    navigate(path);
    setShow(false);
    setShowAccountActions(false);
  };

  const renderAvatar = () => {
    const letter = (userData?.username || user?.email || 'D')[0]?.toUpperCase();
    if (userData?.avatar_url) {
      return (
        <img
          src={userData.avatar_url}
          alt="Avatar"
          className="w-14 h-14 rounded-full border border-stroke object-cover"
        />
      );
    }

    return (
      <div className="w-14 h-14 rounded-full border border-stroke bg-accent/20 text-accent flex items-center justify-center text-lg font-semibold">
        {letter}
      </div>
    );
  };

  return (
    <>
      {blocking && <InteractionLoader message="Memuat data akun..." />}
      {show && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setShow(false)}
        ></div>
      )}
      <Toast message={toast} onClose={() => setToast('')} />
      <div
        className={`fixed top-4 right-4 w-[92vw] sm:w-[70vw] md:w-[55vw] lg:w-[32vw] max-w-xl min-w-[260px] max-h-[78vh] bg-surface/95 border border-stroke rounded-2xl z-50 transform transition-transform duration-300 ease-in-out sidebar overflow-hidden ${
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
              className="text-foreground bg-surface-alt rounded-full p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {user && userData ? (
            <div className="rounded-xl border border-stroke bg-surface-alt p-4 space-y-4 relative">
              <div className="flex items-center gap-3">
                {renderAvatar()}
                <div>
                  <p className="text-sm text-gray-400">Akun aktif</p>
                  <p className="text-lg font-semibold">{truncateName(userData.username || user.email)}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                <span>Login berhasil, siap membuat subdomain</span>
              </div>
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm text-gray-300">API Key akun kamu</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="bg-surface text-xs px-2 py-2 rounded w-full truncate border border-stroke"
                    placeholder="API key belum tersedia"
                  />
                  <button
                    onClick={copyApiKey}
                    className="px-3 py-2 text-xs rounded bg-accent text-white"
                  >
                    Salin
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">Gunakan API key ini untuk memanggil layanan API kamu. Jaga kerahasiaannya.</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAccountActions(true)}
                  className="px-4 py-2 text-sm rounded-lg border border-stroke text-foreground hover:border-accent"
                >
                  Kelola akun
                </button>
              </div>

              {showAccountActions && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                  <div className="absolute inset-0 bg-black/30" onClick={() => setShowAccountActions(false)}></div>
                  <div className="relative w-full max-w-xs bg-surface border border-stroke rounded-xl p-4 space-y-4 animate-fade-in shadow-none">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-300">Kelola akun kamu</p>
                        <p className="text-lg font-semibold">Manajemen akun</p>
                      </div>
                      <button
                        onClick={() => setShowAccountActions(false)}
                        className="text-gray-400 hover:text-white"
                        aria-label="Tutup"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Kelola sesi kamu, keluar dari akun, atau hapus akun secara permanen. Pastikan sudah menyimpan data penting sebelum melanjutkan.
                    </p>
                    <div className="space-y-2 text-sm">
                      <button
                        className="w-full rounded-lg bg-surface-alt border border-stroke px-3 py-2 text-left hover:border-accent"
                        onClick={handleLogout}
                      >
                        Keluar / Logout
                      </button>
                      <button
                        className="w-full rounded-lg bg-red-600/10 border border-red-500/40 px-3 py-2 text-left text-red-200 hover:border-red-400"
                        onClick={handleDeleteAccount}
                      >
                        Hapus akun
                      </button>
                      <button
                        className="w-full rounded-lg border border-stroke px-3 py-2 text-left hover:border-accent"
                        onClick={() => setShowAccountActions(false)}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-stroke bg-surface-alt p-4 space-y-3">
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
        </div>
      </div>
    </>
  );
};

export default Sidebar;
