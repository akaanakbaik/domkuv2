import React from 'react';

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const tone = toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[20000]">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white shadow-none ${tone} animate-fade-in cursor-pointer`}
        onClick={onClose}
      >
        <span className="text-sm font-semibold">{toast.message}</span>
        <span className="text-xs opacity-80">geser / klik untuk tutup</span>
      </div>
    </div>
  );
};

export default Toast;
