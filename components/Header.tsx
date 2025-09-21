
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-sky-400 to-cyan-300 text-transparent bg-clip-text">
          AI Social Media News Post Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
