import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-400 mb-4">domku</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Platform untuk membuat subdomain gratis dan mudah untuk kebutuhan hosting, API, dan lainnya.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => navigate('/subdomain')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Buat Subdomain Anda
        </button>
        <button
          onClick={() => navigate('/auth')} // Asumsikan AuthModal di halaman ini
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Daftar
        </button>
        <button
          onClick={() => navigate('/auth')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Masuk
        </button>
      </div>

      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">Fitur</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2">
          <li>Buat subdomain gratis dengan mudah</li>
          <li>Dukungan DNS record A, CNAME, TXT, dll</li>
          <li>API untuk otomasi pembuatan subdomain</li>
          <li>Akses cepat dan aman</li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-gray-400 mb-2">Laporkan masalah:</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://t.me/akamodebaik"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Telegram: t.me/akamodebaik
          </a>
          <a
            href="mailto:akaanakbaik17@proton.me"
            className="text-blue-400 hover:underline"
          >
            Email: akaanakbaik17@proton.me
          </a>
        </div>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>©2025</p>
        <p>made with ❤️ and code by aka 🇮🇩</p>
      </footer>
    </div>
  );
};

export default Home;
