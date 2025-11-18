import React, { useState, useEffect } from 'react';
import { createDNSRecord, deleteDNSRecord } from '../utils/cloudflareApi';
import { supabase } from '../utils/supabaseClient';
import AuthPrompt from '../components/AuthPrompt';

const SubdomainPage = ({ user, setOverlayLoading, onToast }) => {
  const [subdomain, setSubdomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [recordValue, setRecordValue] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(!user);

  useEffect(() => {
    if (user) {
      fetchHistory();
      setShowPrompt(false);
    } else {
      setShowPrompt(true);
      setHistory([]);
    }
  }, [user]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('subdomains')
      .select('*')
      .eq('user_id', user.id);

    if (!error) setHistory(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowPrompt(true);
      return;
    }
    if (!subdomain || !recordValue) {
      onToast?.('Lengkapi semua kolom', 'error');
      return;
    }
    if (history.length >= 30) {
      onToast?.('Batas 30 subdomain per akun sudah tercapai', 'error');
      return;
    }

    setLoading(true);
    setOverlayLoading?.(true);
    try {
      const fullDomain = `${subdomain}.domku.my.id`;
      const res = await createDNSRecord(fullDomain, recordType, recordValue);

      if (res.success) {
        const { data: inserted } = await supabase
          .from('subdomains')
          .insert([{ user_id: user.id, name: fullDomain, type: recordType, content: recordValue, cf_id: res.result.id }])
          .select()
          .single();
        const newRecord = inserted || {
          id: res.result.id,
          cf_id: res.result.id,
          name: fullDomain,
          type: recordType,
          content: recordValue
        };
        setHistory([...history, newRecord]);
        setSubdomain('');
        setRecordValue('');
        onToast?.('Subdomain dibuat', 'success');
      } else {
        onToast?.('Gagal membuat subdomain', 'error');
      }
    } catch (err) {
      console.error(err);
      onToast?.('Error: ' + err.message, 'error');
    }
    setLoading(false);
    setOverlayLoading?.(false);
  };

  const handleDelete = async (id, cfId) => {
    await deleteDNSRecord(cfId);
    await supabase.from('subdomains').delete().eq('cf_id', cfId);
    setHistory(history.filter(item => item.id !== id));
    onToast?.('Subdomain dihapus', 'success');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    onToast?.('Disalin ke clipboard', 'success');
  };

  const fullDomain = subdomain ? `${subdomain}.domku.my.id` : '';

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-sm text-gray-400">Area Subdomain</p>
        <h1 className="text-3xl font-bold text-blue-400">Buat Subdomain</h1>
        <p className="text-gray-300">Kelola DNS untuk domku.my.id dengan cepat. Semua aksi tersimpan di akun kamu.</p>
      </div>
      <div className={`card max-w-2xl mx-auto relative ${!user ? 'opacity-60 pointer-events-none' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Subdomain</label>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.trim())}
                className="input w-full"
                placeholder="contoh: node atau node.aka"
                disabled={!user}
              />
              {fullDomain && <p className="text-sm text-gray-400 mt-1">{fullDomain}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type Record</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="input w-full"
                disabled={!user}
              >
                <option value="A">A (IPv4)</option>
                <option value="CNAME">CNAME</option>
                <option value="TXT">TXT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nilai</label>
            <input
              type="text"
              value={recordValue}
              onChange={(e) => setRecordValue(e.target.value)}
              className="input w-full"
              placeholder={recordType === 'A' ? 'contoh: 165.232.166.128' : 'contoh: target.domain.com'}
              disabled={!user}
            />
            {fullDomain && recordValue && (
              <p className="text-sm text-gray-400 mt-1">
                {recordType === 'A'
                  ? `${fullDomain} menunjuk ke ${recordValue}`
                  : recordType === 'CNAME'
                    ? `${fullDomain} alias ke ${recordValue}`
                    : `${fullDomain} TXT: ${recordValue}`}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-blue w-full"
          >
            {loading ? 'Membuat...' : 'Apply'}
          </button>
        </form>
        {!user && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-center text-gray-300 bg-dark-900/80 px-4 py-2 rounded-lg border border-dark-700">Masuk atau daftar untuk mulai membuat subdomain.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">Riwayat Subdomain</h2>
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">{item.type}: {item.content}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(item.name)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Salin
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.cf_id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPrompt && !user && <AuthPrompt onClose={() => setShowPrompt(false)} title="Harus login dulu" />}
    </div>
  );
};

export default SubdomainPage;
