import React from 'react';

const DeveloperPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-400 mb-6">Info Developer</h1>
      <div className="flex flex-col items-center max-w-md mx-auto card">
        <img
          src="https://cdn.yupra.my.id/yp/2jz78png.jpg"
          alt="Aka"
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-center">Aka</h2>
        <p className="text-gray-400 text-center mt-2">
          Pelajar di SMA Negeri 1 Lembah Melintang<br/>
          Developer Pemula dari Sumatra Barat, Indonesia 🇮🇩
        </p>
        <p className="text-gray-300 text-center mt-4">
          Saya membuat website ini untuk membantu sesama developer lainnya.
        </p>
      </div>
    </div>
  );
};

export default DeveloperPage;
