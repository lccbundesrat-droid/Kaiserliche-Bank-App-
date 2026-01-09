
import React from 'react';
import { User } from '../types';
import { History, ArrowUpRight, ArrowDownLeft, Gift, ShieldAlert } from 'lucide-react';

interface Props {
  user: User;
  refresh: () => void;
}

const WalletView: React.FC<Props> = ({ user }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-imperial text-xl text-amber-900 flex items-center gap-2">
        <History className="text-amber-600" />
        Kontoauszug
      </h2>

      <div className="bg-white/80 rounded-2xl border-2 border-amber-200 overflow-hidden shadow-sm">
        <div className="bg-amber-100/50 p-4 border-b border-amber-200 flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-amber-800">Letzte Aktivitäten</span>
          <span className="text-xs text-amber-600 italic">{user.transactions.length} Einträge</span>
        </div>

        <div className="divide-y divide-amber-100">
          {user.transactions.length === 0 ? (
            <div className="p-8 text-center text-amber-700 italic opacity-50">Keine Transaktionen gefunden.</div>
          ) : (
            user.transactions.map((tx) => {
              const isOutgoing = tx.sender === user.username;
              const isBonus = tx.type === 'StartBonus' || tx.type === 'Reward';
              
              return (
                <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-amber-50 transition-colors">
                  <div className={`p-2 rounded-full ${
                    isBonus ? 'bg-amber-100 text-amber-600' :
                    isOutgoing ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {isBonus ? <Gift size={18} /> : 
                     isOutgoing ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-amber-900">
                      {isBonus ? tx.type : isOutgoing ? `An: ${tx.recipient}` : `Von: ${tx.sender}`}
                    </p>
                    <p className="text-[10px] text-amber-600">{new Date(tx.timestamp).toLocaleString('de-DE')}</p>
                    {tx.note && <p className="text-[10px] text-amber-800 italic mt-1">"{tx.note}"</p>}
                  </div>

                  <div className={`font-imperial font-bold text-sm ${
                    isOutgoing ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {isOutgoing ? '-' : '+'}{tx.amount} KBG
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-amber-900 p-4 rounded-xl flex items-center gap-3 text-amber-100 border-2 border-amber-500">
        <ShieldAlert size={24} className="text-amber-400" />
        <p className="text-[10px] leading-relaxed italic">
          Hinweis: Alle Transaktionen unterliegen den AGB der Kaiserlichen Bank. Missbrauch wird strafrechtlich verfolgt.
        </p>
      </div>
    </div>
  );
};

export default WalletView;
