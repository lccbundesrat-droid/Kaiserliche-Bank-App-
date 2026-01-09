
import React from 'react';
import { User } from '../types';
import { Crown, Coins, TrendingUp } from 'lucide-react';
import { getLevelInfo } from '../constants.tsx';

interface Props {
  user: User;
  refresh: () => void;
}

const HomeView: React.FC<Props> = ({ user }) => {
  const levelData = getLevelInfo(user.kbp);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Imperial Balance Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-red-800 rounded-2xl p-6 text-amber-100 shadow-xl border-2 border-amber-500">
        <div className="absolute top-0 right-0 opacity-10 -rotate-12 translate-x-4 -translate-y-4">
          <Crown size={150} />
        </div>
        <div className="relative z-10">
          <p className="text-amber-400 font-bold uppercase text-xs tracking-widest mb-1">Verfügbares Vermögen</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-imperial font-bold">{user.balance.toLocaleString()}</span>
            <span className="text-xl font-bold text-amber-400 mb-1">KBG</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-200/80">
            <Coins size={16} />
            <span>{(user.balance * 10).toLocaleString()} Goldmünzen (GM)</span>
          </div>
        </div>
      </div>

      {/* Quick Level Overview */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-amber-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-imperial font-bold text-amber-900">Rang & Fortschritt</h3>
          </div>
          <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full font-bold">Stufe {levelData.level}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-amber-800">
            <span>{user.kbp} KBP</span>
            <span>Ziel: {levelData.totalToNext} KBP</span>
          </div>
          <div className="h-3 w-full bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000"
              style={{ width: `${(levelData.currentKbp / levelData.neededKbp) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Info Sections from AGB */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-100/50 p-4 rounded-xl border border-amber-200 text-center">
          <p className="text-[10px] uppercase tracking-tighter text-amber-800 mb-1">Kaufwert</p>
          <p className="font-bold text-amber-900 text-sm">1000 KBG = 1 €</p>
        </div>
        <div className="bg-amber-100/50 p-4 rounded-xl border border-amber-200 text-center">
          <p className="text-[10px] uppercase tracking-tighter text-amber-800 mb-1">Umrechnung</p>
          <p className="font-bold text-amber-900 text-sm">1 KBG = 10 GM</p>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
