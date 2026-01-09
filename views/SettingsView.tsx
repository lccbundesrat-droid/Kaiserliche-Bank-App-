
import React, { useState } from 'react';
import { User } from '../types';
import { LogOut, Trash2, Info, UserCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
  onDelete: () => void;
}

const SettingsView: React.FC<Props> = ({ user, onLogout, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-imperial text-xl text-amber-900 flex items-center gap-2">
        <UserCircle className="text-amber-600" />
        Einstellungen
      </h2>

      <div className="space-y-4">
        {/* User Info Block */}
        <div className="bg-white/80 p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-300">
              <UserCircle size={40} />
            </div>
            <div>
              <h3 className="font-imperial text-lg font-bold text-amber-900">{user.username}</h3>
              <p className="text-xs text-amber-600 font-bold uppercase">{user.accountType}-Konto</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
             <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="text-[10px] text-amber-600 font-bold uppercase">Registriert seit</p>
                <p className="text-xs font-bold text-amber-900">{new Date(user.registrationDate).toLocaleDateString('de-DE')}</p>
             </div>
             <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="text-[10px] text-amber-600 font-bold uppercase">Sicherheitsstatus</p>
                <div className="flex items-center justify-center gap-1 text-green-700 font-bold">
                  <ShieldCheck size={12} />
                  <span className="text-xs uppercase">Aktiv</span>
                </div>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={onLogout}
            className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 border border-amber-300 transition-all active:scale-95"
          >
            <LogOut size={20} />
            Konto Abmelden
          </button>

          {!showConfirmDelete ? (
            <button 
              onClick={() => setShowConfirmDelete(true)}
              className="w-full bg-red-50 hover:bg-red-100 text-red-800 font-bold py-4 rounded-xl flex items-center justify-center gap-3 border border-red-200 transition-all active:scale-95"
            >
              <Trash2 size={20} />
              Account Löschen
            </button>
          ) : (
            <div className="bg-red-900 text-white p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-amber-400" />
                <p className="font-imperial font-bold">Account Unwiderruflich Löschen?</p>
              </div>
              <p className="text-xs leading-relaxed opacity-90 italic">
                Achtung: Alle KBG und Fortschritte gehen verloren. Eine Neuregistrierung auf diesem Gerät ist erst nach Löschung möglich.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg font-bold text-sm"
                >
                  Abbrechen
                </button>
                <button 
                  onClick={onDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg font-bold text-sm shadow-lg"
                >
                  Ja, Löschen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legal Info Link-style */}
        <div className="p-4 bg-amber-100/30 rounded-xl border border-amber-200/50 flex items-start gap-3">
          <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] text-amber-800 leading-tight">
            Kaiserliche Bank Version 1.0.1<br/>
            Sämtliche Rechte vorbehalten. Die Nutzung dieser App setzt das Einverständnis mit den AGB (Stand 2024) voraus.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
