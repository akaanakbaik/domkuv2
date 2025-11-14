import React, { useState, useEffect } from 'react';
import { createDNSRecord, deleteDNSRecord, listDNSRecords } from '../utils/cloudflareApi';
import { supabase } from '../utils/supabaseClient';

const SubdomainPage = ({ user }) => {
  const [subdomain, setSubdomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [recordValue, setRecordValue] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
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
    if (!subdomain || !recordValue) return;

    setLoading(true);
    try {
      const fullDomain = `${subdomain}.domku.my.id`;
      const res = await createDNSRecord(fullDomain, recordType, recordValue);

      if (res.success) {
        const newRecord = {
          id: res.result.id,
          name: fullDomain,
          type: recordType,
          content: recordValue
        };
        setHistory([...history, newRecord]);
        await supabase.from('subdomains').insert([{ user_id: user.id, name: fullDomain, type: recordType, content: recordValue, cf_id: res.result.id }]);
        setSubdomain('');
        setRecordValue('');
      } else {
        alert('Gagal membuat subdomain: ' + JSON.stringify(res.errors));
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id, cfId) => {
    await deleteDNSRecord(cfId);
    await supabase.from('subdomains').delete().eq('cf_id', cfId);
    setHistory(history.filter(item => item.id !== id));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Disalin!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">Buat Subdomain</h1>
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Subdomain</label>
            <input
              type="text"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="contoh: node"
            />
            {subdomain && <p className="text-sm text-gray-400 mt-1">{subdomain}.domku.my.id</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type Record</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="A">A (IPv4)</option>
              <option value="CNAME">CNAME</option>
              <option value="TXT">TXT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nilai</label>
            <input
              type="text"
              value={recordValue}
              onChange={(e) => setRecordValue(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="contoh: 165.232.166.128"
            />
            {subdomain && recordType === 'A' && recordValue && (
              <p className="text-sm text-gray-400 mt-1">{subdomain}.domku.my.id menunjuk ke {recordValue}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Membuat...' : 'Apply'}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">Riwayat Subdomain</h2>
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
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
    </div>
  );
};

export default SubdomainPage;
