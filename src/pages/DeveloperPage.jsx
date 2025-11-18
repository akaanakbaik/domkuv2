import React from 'react';

const DeveloperPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="border border-stroke rounded-2xl p-6 bg-surface">
          <p className="text-sm text-gray-300">Kenalan dulu</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
            <img
              src="https://cdn.yupra.my.id/yp/2jz78png.jpg"
              alt="Aka"
              className="w-24 h-24 rounded-full object-cover border-2 border-stroke"
            />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Aka</h1>
              <p className="text-gray-300 leading-relaxed">
                Pelajar di SMA Negeri 1 Lembah Melintang. Developer pemula dari Sumatra Barat, Indonesia 🇮🇩 yang suka membangun tool gratis untuk komunitas.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-300">
                <span className="px-3 py-1 rounded-full bg-dark-700 border border-dark-600">Backend & API</span>
                <span className="px-3 py-1 rounded-full bg-dark-700 border border-dark-600">UI/UX Enthusiast</span>
                <span className="px-3 py-1 rounded-full bg-dark-700 border border-dark-600">Cloud tinkerer</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="https://aka-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-blue"
            >
              Lihat portofolio saya
            </a>
            <a
              href="mailto:akaanakbaik17@proton.me"
              className="btn btn-gray"
            >
              Email langsung
            </a>
            <a
              href="https://t.me/akamodebaik"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gray"
            >
              Chat Telegram
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[{
            title: 'Domku platform',
            desc: 'Layanan subdomain gratis & API mudah dipakai.',
          }, {
            title: 'Fokus pengalaman',
            desc: 'UI responsif untuk mobile & desktop.',
          }, {
            title: 'Support cepat',
            desc: 'Hubungi lewat Telegram atau email kapan saja.',
          }].map((item) => (
            <div key={item.title} className="card h-full flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-blue-300">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Misi</h2>
          <p className="text-gray-300 leading-relaxed">
            Saya ingin membuat developer lokal lebih produktif dengan menyediakan alat sederhana: subdomain gratis, API yang jelas, dan dukungan yang mudah dihubungi. Jika ada masukan, jangan ragu kirimkan!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
