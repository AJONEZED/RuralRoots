
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => boolean;
  onRegister: (name: string, email: string, password: string, type: UserType) => boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerType, setRegisterType] = useState<UserType>('customer');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setActiveTab('login');
        setLoginEmail('');
        setLoginPassword('');
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterType('customer');
        setError('');
      }, 300); // Delay to allow closing animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!onLogin(loginEmail, loginPassword)) {
      setError('Invalid email or password.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!onRegister(registerName, registerEmail, registerPassword, registerType)) {
      setError('An account with this email already exists.');
    }
  };

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome to RuralRoots">
      <div>
        <div className="flex border-b border-border-gray">
          <button
            onClick={() => switchTab('login')}
            className={`flex-1 py-2 px-4 text-center font-semibold transition-colors ${activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-text-gray hover:text-primary'}`}
          >
            Login
          </button>
          <button
            onClick={() => switchTab('register')}
            className={`flex-1 py-2 px-4 text-center font-semibold transition-colors ${activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-text-gray hover:text-primary'}`}
          >
            Register
          </button>
        </div>
        <div className="pt-6">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="mt-1 w-full p-2 border border-border-gray rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="mt-1 w-full p-2 border border-border-gray rounded-md shadow-sm" required />
              </div>
              <button type="submit" className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary-light transition-colors">Login</button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} className="mt-1 w-full p-2 border border-border-gray rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} className="mt-1 w-full p-2 border border-border-gray rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} className="mt-1 w-full p-2 border border-border-gray rounded-md shadow-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select value={registerType} onChange={e => setRegisterType(e.target.value as UserType)} className="mt-1 w-full p-2 border border-border-gray rounded-md shadow-sm bg-white">
                  <option value="customer">I'm a Customer</option>
                  <option value="farm">I'm a Farm Owner</option>
                  <option value="worker">I'm a Farm Worker</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary-light transition-colors">Register</button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
