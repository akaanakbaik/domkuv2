import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Sidebar = ({ show, setShow, user, onToast }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showAccountActions, setShowAccountActions] = useState(false);
  const [processing, setProcessing] = useState(false);

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
    setShowAccountActions(false);
    onToast?.('Keluar dari akun', 'success');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setProcessing(true);
    try {
      await supabase.from('subdomains').delete().eq('user_id', user.id);
      await supabase.from('users').delete().eq('id', user.id);
      await supabase.auth.signOut();
      onToast?.('Akun dihapus dari catatan aplikasi.', 'success');
    } catch (err) {
      onToast?.('Gagal menghapus akun, coba lagi.', 'error');
    }
    setProcessing(false);
    setShow(false);
    setShowAccountActions(false);
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    onToast?.('API key disalin', 'success');
  };

  const truncateName = (name) => (name && name.length > 16 ? name.substring(0, 16) + '...' : name);

  const handleNavigate = (path) => {
    navigate(path);
    setShow(false);
    setShowAccountActions(false);
  };

  return (
    <>
      {show && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => { setShow(false); setShowAccountActions(false); }}
        ></div>
      )}
      <div
        className={`fixed top-3 right-3 w-[60vw] sm:w-[340px] lg:w-[28vw] max-w-md min-w-[250px] h-[45vh] sm:h-[60vh] bg-surface/95 border border-stroke rounded-2xl z-50 transform transition-transform duration-300 ease-in-out sidebar overflow-hidden ${
          show ? 'translate-x-0 opacity-100' : 'translate-x-[130%] opacity-0'
        }`}
      >
        <div className="p-4 h-full flex flex-col gap-4 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Navigasi</p>
              <h2 className="text-lg font-semibold text-white">Panel cepat</h2>
            </div>
            <button
              onClick={() => { setShow(false); setShowAccountActions(false); }}
              className="text-foreground bg-surface-alt rounded-full p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {user && userData ? (
            <div className="rounded-xl border border-stroke bg-surface-alt p-4 space-y-3">
              <button className="flex items-center gap-3 w-full text-left" onClick={() => setShowAccountActions(true)}>
                <img
                  src={`https://robohash.org/${user.email}?size=64x64&set=set4`}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full border border-stroke"
                />
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400">Info akun</p>
                  <p className="text-lg font-semibold truncate">{truncateName(userData.username || user.email)}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </button>
              <div className="flex flex-col gap-2 text-xs text-green-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  <span>Akun aktif & siap membuat subdomain</span>
                </div>
                {apiKey && (
                  <div className="flex items-center gap-2 bg-dark-900/60 border border-stroke rounded-lg px-2 py-2">
                    <input
                      type="text"
                      value={apiKey}
                      readOnly
                      className="bg-transparent text-xs px-1 py-1 rounded w-full truncate"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); copyApiKey(); }}
                      className="px-3 py-1 text-xs rounded bg-accent text-white"
                    >
                      Salin
                    </button>
                  </div>
                )}
              </div>
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

          {showAccountActions && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowAccountActions(false)}>
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="relative w-full max-w-sm bg-surface-alt border border-stroke rounded-2xl p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
                <p className="text-sm text-gray-300">Kelola akun</p>
                <p className="text-xs text-gray-400">Pilih aksi cepat untuk akun aktif kamu.</p>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-blue w-full" onClick={handleLogout} disabled={processing}>Keluar</button>
                  <button className="btn btn-gray w-full" onClick={handleDeleteAccount} disabled={processing}>Hapus akun dari app</button>
                  <button className="w-full px-3 py-2 rounded-lg border border-stroke" onClick={() => setShowAccountActions(false)}>Batal</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
