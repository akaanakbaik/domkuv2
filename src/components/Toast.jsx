import React, { useEffect, useRef, useState } from 'react';

const Toast = ({ message, position = 'top-right', onClose }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const startRef = useRef(null);

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onClose?.(), 1600);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const handleStart = (clientX, clientY) => {
    startRef.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX, clientY) => {
    if (!startRef.current) return;
    setOffset({ x: clientX - startRef.current.x, y: clientY - startRef.current.y });
  };

  const handleEnd = () => {
    if (!startRef.current) return;
    const distance = Math.max(Math.abs(offset.x), Math.abs(offset.y));
    startRef.current = null;
    if (distance > 40) {
      onClose?.();
      setOffset({ x: 0, y: 0 });
      return;
    }
    setOffset({ x: 0, y: 0 });
  };

  if (!message) return null;

  const positionClass = {
    'top-right': 'top-4 right-4 sm:right-6',
    'bottom-right': 'bottom-6 right-4 sm:right-6',
  }[position];

  return (
    <div
      className={`fixed z-[70] ${positionClass} animate-fade-in`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)` ,
        transition: startRef.current ? 'none' : 'transform 0.2s ease',
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
    >
      <div className="bg-surface-alt border border-stroke text-sm px-4 py-2 rounded-lg shadow-sm text-white cursor-pointer select-none">
        {message}
      </div>
    </div>
  );
};

export default Toast;
