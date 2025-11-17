import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3.5 bg-dark-900">
      <div className="loader w-[clamp(32px,8vw,50px)] h-[clamp(32px,8vw,50px)] rounded-full animate-spin-slow border-t-2 border-blue-500 border-opacity-50"></div>
      <div className="letter-wrapper flex gap-0.5">
        {['L','o','a','d','i','n','g','.','.','.'].map((l, i) => (
          <span key={i} className="text-[clamp(1rem,5vw,1.6rem)] opacity-40 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{l}</span>
        ))}
      </div>
      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{opacity:0.4;transform:translateY(0);} 20%{opacity:1;transform:scale(1.12);} 40%{opacity:0.7;transform:translateY(0);} }
        .animate-spin-slow { animation: spin-slow 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        .animate-bounce { animation: bounce 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Loading;
