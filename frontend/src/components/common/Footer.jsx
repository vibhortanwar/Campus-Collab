import React from 'react';
import logo from "../../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col items-center">
        
        {/* Logo */}
        <img src={logo} alt="Campus Collab Logo" className="h-12 mb-4" />

        {/* Title & Description */}
        <div className="mb-4 text-center">
          <h3 className="text-2xl font-semibold">Campus Collab</h3>
          <p className="text-sm text-gray-400">
            Connecting GGSIPU Students for Collaborative Projects
          </p>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Campus Collab. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
