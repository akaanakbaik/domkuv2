import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Sidebar = ({ show, setShow, user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showAccountActions, setShowAccountActions] = useState(false);
  const [toast, setToast] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const touchStart = useRef({ x: 0, y: 0 });

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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleLogout = async () => {
    setActionLoading(true);
    await Promise.all([supabase.auth.signOut(), delay(1500)]);
    setShow(false);
    setShowAccountActions(false);
    setActionLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setActionLoading(true);
    await delay(1500);
    try {
      await supabase.from('subdomains').delete().eq('user_id', user.id);
      await supabase.from('users').delete().eq('id', user.id);
      await supabase.auth.signOut();
      setToast('Akun dihapus');
      setTimeout(() => setToast(''), 1600);
    } catch (error) {
      console.error('Error deleting account', error);
      setToast('Gagal hapus akun');
      setTimeout(() => setToast(''), 1600);
    } finally {
      setShow(false);
      setShowAccountActions(false);
      setActionLoading(false);
    }
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setToast('API key disalin');
    setTimeout(() => setToast(''), 1600);
  };

  const truncateName = (name) => (name && name.length > 16 ? name.substring(0, 16) + '...' : name);

  const handleNavigate = (path) => {
    setActionLoading(true);
    setTimeout(() => {
      navigate(path);
      setShow(false);
      setShowAccountActions(false);
      setActionLoading(false);
    }, 1500);
  };

  const handleToastTouchStart = (e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleToastTouchMove = (e) => {
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStart.current.x);
    const dy = Math.abs(touch.clientY - touchStart.current.y);
    if (dx > 30 || dy > 30) {
      setToast('');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setShow(false)}
        ></div>
      )}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-in" onTouchStart={handleToastTouchStart} onTouchMove={handleToastTouchMove}>
          <div className="bg-surface-alt border border-stroke text-sm px-4 py-2 rounded-lg shadow-sm text-white">
            {toast}
          </div>
        </div>
      )}
      {actionLoading && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <div className="h-12 w-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
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
              <div className="flex items-center gap-3" onClick={() => setShowAccountActions(true)}>
                {userData.avatar_url ? (
                  <img
                    src={userData.avatar_url}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full border border-stroke cursor-pointer object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border border-stroke cursor-pointer bg-accent/20 text-accent font-semibold text-xl flex items-center justify-center">
                    {getInitials(userData.username || user.email)}
                  </div>
                )}
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
              {apiKey && (
                <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xs text-gray-400">API key aktif kamu</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={apiKey}
                      readOnly
                      className="bg-surface text-xs px-2 py-1 rounded w-full truncate border border-stroke"
                    />
                    <button
                      onClick={copyApiKey}
                      className="px-3 py-1 text-xs rounded bg-accent text-white"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowAccountActions(true)}
                className="w-full rounded-lg bg-surface text-sm border border-stroke px-3 py-2 hover:border-accent text-left"
              >
                Kelola akun
              </button>
              {showAccountActions && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                  <div className="absolute inset-0 bg-black/30" onClick={() => setShowAccountActions(false)}></div>
                  <div className="relative w-full max-w-xs bg-surface border border-stroke rounded-xl p-4 space-y-3 animate-fade-in shadow-xl">
                    <p className="text-sm text-gray-300">Kelola akun kamu</p>
                    <div className="space-y-2 text-sm">
                      <button
                        className="w-full rounded-lg bg-red-600/90 text-white border border-red-500 px-3 py-2 text-left hover:bg-red-600"
                        onClick={handleDeleteAccount}
                      >
                        Hapus akun
                      </button>
                      <button
                        className="w-full rounded-lg bg-surface-alt border border-stroke px-3 py-2 text-left hover:border-accent"
                        onClick={handleLogout}
                      >
                        Keluar / Logout
                      </button>
                      <button
                        className="w-full rounded-lg bg-surface-alt border border-stroke px-3 py-2 text-left hover:border-accent"
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
