import React from 'react';

const InteractionLoader = ({ message = 'Memproses permintaan kamu...' }) => (
  <div className="app-loader-wrapper" role="status" aria-live="polite">
    <div className="app-loader" aria-hidden="true"></div>
    <div className="app-loader-letters" aria-hidden="true">
      <span className="app-loader-letter">L</span>
      <span className="app-loader-letter">o</span>
      <span className="app-loader-letter">a</span>
      <span className="app-loader-letter">d</span>
      <span className="app-loader-letter">i</span>
      <span className="app-loader-letter">n</span>
      <span className="app-loader-letter">g</span>
      <span className="app-loader-letter">.</span>
      <span className="app-loader-letter">.</span>
      <span className="app-loader-letter">.</span>
    </div>
    <p className="text-sm text-gray-200 text-center px-4">{message}</p>
  </div>
);

export default InteractionLoader;
