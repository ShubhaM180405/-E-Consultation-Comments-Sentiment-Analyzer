import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Sentiment<span className="text-gray-800">Analyzer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
