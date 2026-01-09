
import React, { useState, useEffect, useCallback } from 'react';
import { User, Transaction } from './types';
import { getUsers, getUserByUsername, isDeviceLocked, registerUser, deleteUserAccount, unlockDevice, updateUser } from './utils/db';
import { ADMIN_PASSWORD, NAV_ITEMS, THEME } from './constants.tsx';
import HomeView from './views/HomeView';
import TransferView from './views/TransferView';
import ProgressView from './views/ProgressView';
import WalletView from './views/WalletView';
import SettingsView from './views/SettingsView';
import AdminView from './views/AdminView';
import AuthView from './views/AuthView';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [error, setError] = useState<string | null>(null);

  // Sync current user with "DB"
  const refreshUserData = useCallback(() => {
    if (currentUser) {
      const updated = getUserByUsername(currentUser.username);
      if (updated) setCurrentUser(updated);
    }
  }, [currentUser]);

  useEffect(() => {
    // Session check
    const sessionUser = localStorage.getItem('kb_session');
    if (sessionUser) {
      const user = getUserByUsername(sessionUser);
      if (user) setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username: string, pass: string) => {
    const user = getUserByUsername(username);
    if (user && user.password === pass) {
      setCurrentUser(user);
      localStorage.setItem('kb_session', username);
      setError(null);
    } else {
      setError('Ungültiger Benutzername oder Passwort.');
    }
  };

  const handleAdminLogin = (pass: string) => {
    if (pass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setError(null);
    } else {
      setError('Admin-Zugriff verweigert.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('kb_session');
    setCurrentView('home');
  };

  const handleDeleteAccount = () => {
    if (currentUser) {
      deleteUserAccount(currentUser.username);
      handleLogout();
    }
  };

  if (isAdmin) {
    return <AdminView onExit={() => setIsAdmin(false)} />;
  }

  if (!currentUser) {
    return (
      <AuthView 
        onLogin={handleLogin} 
        onAdminLogin={handleAdminLogin}
        error={error} 
        setError={setError}
      />
    );
  }

  return (
    <div className="min-h-screen pb-24 flex flex-col max-w-md mx-auto shadow-2xl relative bg-[#fdf6e3]">
      {/* Header */}
      <header className="bg-red-900 text-amber-200 p-6 shadow-md border-b-4 border-amber-600 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">Willkommen,</p>
            <h1 className="font-imperial text-2xl font-bold">{currentUser.username}</h1>
          </div>
          <ShieldCheck className="text-amber-400" size={32} />
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-grow p-4 overflow-y-auto">
        {currentView === 'home' && <HomeView user={currentUser} refresh={refreshUserData} />}
        {currentView === 'transfer' && <TransferView user={currentUser} refresh={refreshUserData} />}
        {currentView === 'kbp' && <ProgressView user={currentUser} refresh={refreshUserData} />}
        {currentView === 'wallet' && <WalletView user={currentUser} refresh={refreshUserData} />}
        {currentView === 'settings' && (
          <SettingsView 
            user={currentUser} 
            onLogout={handleLogout} 
            onDelete={handleDeleteAccount} 
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-amber-50 border-t-4 border-amber-600 flex justify-around py-3 rounded-t-3xl shadow-[0_-5px_15px_rgba(0,0,0,0.1)]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              currentView === item.id ? 'text-red-800 scale-110' : 'text-amber-700 opacity-60'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
