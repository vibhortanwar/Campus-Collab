import React from 'react';
import logo from "../../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#0a0f16] border-t border-[#1e2d3d] text-slate-400 py-8 mt-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-3">
        
        {/* Logo */}
        <img
          src={logo}
          alt="Campus Collab Logo"
          className="h-10 rounded-full border border-[#2d4a6e] bg-[#0f1923] p-1"
        />

        {/* Title & Description */}
        <div className="text-center">
          <h3 className="text-white font-semibold text-lg">Campus Collab</h3>
          <p className="text-slate-500 text-sm mt-1">
            Connecting GGSIPU Students for Collaborative Projects
          </p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-600 mt-2">
          <p>&copy; {new Date().getFullYear()} Campus Collab. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
