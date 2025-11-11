
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLoginClick, onLogout }) => {
  return (
    <header className="bg-background-card border-b border-border-gray p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">RuralRoots</h1>
          <p className="text-text-gray">Your guide to local farms and agricultural jobs.</p>
        </div>
        <div>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-text-gray">Welcome, <span className="font-semibold text-gray-800">{currentUser.name}</span></span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
