import React, { useEffect, useState } from 'react';
import AuthPrompt from '../components/AuthPrompt';
import { useToast } from '../context/ToastContext';

const ApiPage = ({ user }) => {
  const [showPrompt, setShowPrompt] = useState(!user);
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const { addToast } = useToast();

  useEffect(() => {
    setShowPrompt(!user);
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-sm text-gray-400">Integrasi Otomatis</p>
        <h1 className="text-3xl font-bold text-blue-400">API Dokumentasi</h1>
        <p className="text-gray-300 max-w-3xl">Gunakan endpoint resmi domku untuk membuat dan mengelola subdomain secara otomatis. Pastikan sudah masuk agar API key tersimpan.</p>
      </div>
      <div className={`card max-w-4xl mx-auto relative ${!user ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-lg font-semibold text-blue-300 mb-2">Deskripsi</h2>
        <p className="text-gray-300 mb-4">
          Gunakan API ini untuk membuat dan mengelola subdomain secara otomatis.
        </p>

        <h2 className="text-lg font-semibold text-blue-300 mb-2">Batasan</h2>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Maksimal 30 subdomain per akun</li>
          <li>Rate limit: 10 permintaan per menit</li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-300 mb-2">Peraturan</h2>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Jangan spam API</li>
          <li>Gunakan API dengan bijak</li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-300 mb-2">Contoh cURL</h2>
        <pre className="bg-black p-4 rounded text-sm text-gray-200 overflow-x-auto relative">
            {`{
  "author": "Aka",
  "email_author": "akaanakbaik17@proton.me",`}
            <br/>
            {`  "method": "POST",
  "url": "${currentUrl}/api/subdomain",
  "headers": {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  "body": {
    "name": "subdomain_anda",
    "type": "A",
    "content": "165.232.166.128"
  }
}`}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`curl -X POST "${currentUrl}/api/subdomain" -H "Authorization: Bearer YOUR_API_KEY" -H "Content-Type: application/json" -d '{"name":"subdomain_anda","type":"A","content":"165.232.166.128"}'`);
                addToast('Contoh cURL disalin.', 'info');
              }}
              className="absolute top-2 right-2 text-blue-400 hover:text-blue-300"
            >
              Salin
            </button>
        </pre>
      </div>
      {showPrompt && !user && (
        <AuthPrompt onClose={() => setShowPrompt(false)} title="Masuk untuk melihat API" />
      )}
    </div>
  );
};

export default ApiPage;
