import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-sm text-gray-300">
          <span className="h-2 w-2 bg-green-400 rounded-full"></span>
          Subdomain siap pakai + API gratis
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-500">domku</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Platform untuk membuat subdomain gratis dan mudah untuk kebutuhan hosting, API, dan lainnya. Desain baru yang rapi di mobile dan nyaman di desktop.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate('/subdomain')}
            className="btn btn-blue"
          >
            Buat Subdomain Anda
          </button>
          <button
            onClick={() => navigate('/auth', { state: { mode: 'register' } })}
            className="btn btn-gray"
          >
            Daftar
          </button>
          <button
            onClick={() => navigate('/auth', { state: { mode: 'login' } })}
            className="btn btn-gray"
          >
            Masuk
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-12">
        {[{
          title: 'Responsif & rapi',
          desc: 'Tata letak baru yang nyaman dilihat di layar kecil maupun besar.',
        }, {
          title: 'Subdomain instan',
          desc: 'Form sederhana dengan validasi sebelum membuat DNS.',
        }, {
          title: 'API siap pakai',
          desc: 'Akses API dengan panduan jelas dan proteksi login.',
        }].map((item) => (
          <div key={item.title} className="card h-full">
            <h3 className="text-xl font-semibold text-blue-300 mb-2">{item.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Fitur</h2>
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

      <footer className="mt-16 text-center text-gray-500 text-sm space-y-1">
        <p>©2025</p>
        <p>made with ❤️ and code by aka 🇮🇩</p>
      </footer>
    </div>
  );
};

export default Home;
