
import React from 'react';
import { User } from '../types';
import { getLevelInfo, THEME } from '../constants.tsx';
import { Trophy, Star, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  user: User;
  refresh: () => void;
}

const ProgressView: React.FC<Props> = ({ user }) => {
  const levelData = getLevelInfo(user.kbp);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-imperial text-xl text-amber-900 flex items-center gap-2">
        <Trophy className="text-amber-600" />
        Kaiserlicher Fortschritt
      </h2>

      {/* Main Progress Indicator */}
      <div className="bg-white/90 p-8 rounded-3xl border-2 border-amber-500 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200"></div>
        
        <div className="flex justify-between items-center px-4">
          <div className="text-center">
            <p className="text-[10px] font-bold text-amber-600 uppercase">Aktuell</p>
            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-600 shadow-inner">
              <span className="text-2xl font-imperial font-bold text-amber-900">{levelData.level}</span>
            </div>
            <p className="text-xs font-bold mt-1 text-amber-800 italic">Stufe</p>
          </div>

          <div className="flex-grow mx-4 relative">
             <div className="h-4 w-full bg-amber-50 rounded-full border-2 border-amber-200 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 transition-all duration-1000"
                  style={{ width: `${(levelData.currentKbp / levelData.neededKbp) * 100}%` }}
                />
             </div>
             <div className="mt-2 text-sm font-imperial font-bold text-amber-900">
               {user.kbp} / {levelData.totalToNext} KBP
             </div>
          </div>

          <div className="text-center opacity-60">
            <p className="text-[10px] font-bold text-amber-600 uppercase">Nächste</p>
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center border-2 border-amber-200">
              <span className="text-2xl font-imperial font-bold text-amber-400">{levelData.level + 1}</span>
            </div>
            <p className="text-xs font-bold mt-1 text-amber-800 italic">Stufe</p>
          </div>
        </div>

        <p className="text-sm text-amber-800 bg-amber-50 py-2 px-4 rounded-full inline-block border border-amber-200">
          Noch <span className="font-bold">{(levelData.totalToNext - user.kbp)} KBP</span> bis zum nächsten Rang!
        </p>
      </div>

      {/* Benefits / Unlocks */}
      <div className="space-y-4">
        <h3 className="font-imperial font-bold text-amber-900 text-sm uppercase tracking-widest px-1">Freigeschaltete Privilegien</h3>
        
        <div className="bg-white/60 p-4 rounded-xl border border-amber-200 flex items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-lg"><Star className="text-amber-600" size={20} /></div>
          <div>
            <p className="font-bold text-amber-900 text-sm">Grundlegende Bankgeschäfte</p>
            <p className="text-xs text-amber-700">Ab Stufe 0: Erlaubt Überweisungen und Empfang von KBG.</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${levelData.level >= 1 ? 'bg-white/60 border-amber-200' : 'bg-gray-100/50 border-gray-200 grayscale opacity-50'}`}>
          <div className="bg-amber-100 p-2 rounded-lg"><ShieldCheck className="text-amber-600" size={20} /></div>
          <div>
            <p className="font-bold text-amber-900 text-sm">Erhöhtes Transaktionslimit</p>
            <p className="text-xs text-amber-700">Ab Stufe 1: Ermöglicht größere Goldtransfers.</p>
          </div>
          {levelData.level < 1 && <div className="ml-auto text-[10px] font-bold text-red-800">GESPERRT</div>}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
