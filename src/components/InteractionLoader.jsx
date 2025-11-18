import React from 'react';

const InteractionLoader = ({ message = 'Memproses permintaan kamu...' }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-surface border border-stroke rounded-xl px-6 py-5 flex flex-col items-center gap-3 shadow-none">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-200 text-center">{message}</p>
      </div>
    </div>
  );
};

export default InteractionLoader;
