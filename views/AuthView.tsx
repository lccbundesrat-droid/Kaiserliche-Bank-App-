
import React, { useState } from 'react';
import { ShieldCheck, UserPlus, LogIn, Lock, User as UserIcon, AlertCircle, Crown } from 'lucide-react';
import { registerUser, isDeviceLocked } from '../utils/db';

interface Props {
  onLogin: (user: string, pass: string) => void;
  onAdminLogin: (pass: string) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthView: React.FC<Props> = ({ onLogin, onAdminLogin, error, setError }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const deviceLock = isDeviceLocked();

  const handleRegister = () => {
    if (deviceLock) {
      setError('Dieses Gerät ist bereits für einen Account registriert. Löschen Sie den bestehenden Account zuerst.');
      return;
    }
    if (username.length < 3 || password.length < 4) {
      setError('Benutzername (min. 3) und Passwort (min. 4) sind zu kurz.');
      return;
    }
    const success = registerUser(username, password);
    if (success) {
      onLogin(username, password);
    } else {
      setError('Benutzername bereits vergeben.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] flex flex-col items-center justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-amber-200/20 rounded-full -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-900/5 rounded-full translate-x-24 translate-y-24"></div>

      {/* Logo Area */}
      <div className="text-center mb-8 relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="inline-block bg-red-900 p-6 rounded-full shadow-2xl border-4 border-amber-500 mb-4 scale-110">
          <Crown className="text-amber-400" size={48} />
        </div>
        <h1 className="font-imperial text-3xl font-bold text-red-900 tracking-tighter">Kaiserliche Bank</h1>
        <p className="text-amber-700 font-bold uppercase text-[10px] tracking-widest mt-1">Sicherheit • Beständigkeit • Ehre</p>
      </div>

      {/* Auth Card */}
      <div className="w-full bg-white rounded-3xl shadow-2xl p-8 border-t-8 border-amber-600 relative z-10 animate-in slide-in-from-bottom-8 duration-500">
        <h2 className="font-imperial text-xl text-center text-amber-900 mb-6 uppercase tracking-wider">
          {mode === 'login' ? 'Anmeldung' : mode === 'register' ? 'Registrierung' : 'Administrator'}
        </h2>

        {mode !== 'admin' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-amber-700 mb-1 ml-1">Benutzername</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border-2 border-amber-100 rounded-xl focus:border-amber-500 outline-none transition-all"
                  placeholder="z.B. Maximilian"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-amber-700 mb-1 ml-1">Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border-2 border-amber-100 rounded-xl focus:border-amber-500 outline-none transition-all"
                  placeholder="Passwort"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex gap-2 items-center animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              onClick={() => mode === 'login' ? onLogin(username, password) : handleRegister()}
              className="w-full bg-red-900 hover:bg-red-800 text-amber-200 font-imperial font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
              {mode === 'login' ? 'Eintreten' : 'Konto Eröffnen'}
            </button>

            <div className="pt-4 flex items-center justify-between text-xs font-bold text-amber-700">
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="hover:text-amber-900 underline">
                {mode === 'login' ? 'Noch kein Konto? Registrieren' : 'Bereits registriert? Anmelden'}
              </button>
              <button onClick={() => { setMode('admin'); setError(null); }} className="opacity-50 hover:opacity-100">
                Admin
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <div>
              <label className="block text-[10px] font-bold uppercase text-amber-700 mb-1 ml-1">Master-Passwort</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" size={18} />
                <input 
                  type="password" 
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-red-50/50 border-2 border-red-200 rounded-xl focus:border-red-500 outline-none transition-all"
                  placeholder="Admin-Passwort"
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold flex gap-2 items-center">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              onClick={() => onAdminLogin(adminPass)}
              className="w-full bg-black text-white font-imperial font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} />
              Authorisieren
            </button>

            <button onClick={() => setMode('login')} className="w-full text-xs font-bold text-amber-700 hover:text-amber-900 pt-2">
              Zurück zur Anmeldung
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-[10px] uppercase font-bold text-amber-800 tracking-widest opacity-60">
        Offizielles Portal der Kaiserlichen Zentralbank
      </div>
    </div>
  );
};

export default AuthView;
