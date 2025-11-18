import React from 'react';
import Loading from './Loading';

const OverlayLoading = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[15000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <Loading embedded />
    </div>
  );
};

export default OverlayLoading;
