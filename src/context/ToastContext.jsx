import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ addToast: () => {} });

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 2000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[240px] max-w-sm px-4 py-3 rounded-xl shadow-lg border text-sm animate-slide-up bg-dark-800/90 border-dark-600 text-white`}
          >
            <p className="font-semibold text-blue-300 mb-1">{toast.type === 'error' ? 'Peringatan' : 'Info'}</p>
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
