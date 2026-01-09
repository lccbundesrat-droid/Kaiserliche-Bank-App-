
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getUsers, saveUsers, updateUser } from '../utils/db';
import { ShieldCheck, LogOut, Users, Plus, Trash2, Search, Coins, ArrowLeft, Star } from 'lucide-react';

interface Props {
  onExit: () => void;
}

const AdminView: React.FC<Props> = ({ onExit }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amountToAdd, setAmountToAdd] = useState(0);
  const [kbpToAdd, setKbpToAdd] = useState(0);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleUpdateUsers = () => {
    setUsers(getUsers());
  };

  const addKBG = () => {
    if (selectedUser && amountToAdd !== 0) {
      const txId = 'ADMIN-G-' + Math.random().toString(36).substr(2, 5);
      const newBalance = selectedUser.balance + amountToAdd;
      
      updateUser(selectedUser.username, {
        balance: newBalance,
        transactions: [{
          id: txId,
          type: 'AdminCorrection',
          amount: Math.abs(amountToAdd),
          sender: 'SYSTEM-ADMIN',
          recipient: selectedUser.username,
          timestamp: new Date().toISOString(),
          note: `Admin-Korrektur (KBG): ${amountToAdd > 0 ? 'Hinzugefügt' : 'Abgezogen'}`
        }, ...selectedUser.transactions]
      });
      
      handleUpdateUsers();
      setSelectedUser(getUsers().find(u => u.username === selectedUser.username) || null);
      setAmountToAdd(0);
    }
  };

  const addKBP = () => {
    if (selectedUser && kbpToAdd !== 0) {
      const newKbp = Math.max(0, selectedUser.kbp + kbpToAdd);
      
      updateUser(selectedUser.username, {
        kbp: newKbp
      });
      
      handleUpdateUsers();
      setSelectedUser(getUsers().find(u => u.username === selectedUser.username) || null);
      setKbpToAdd(0);
    }
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col max-w-2xl mx-auto shadow-2xl font-sans">
      <header className="bg-zinc-800 p-6 flex justify-between items-center border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-red-500" size={32} />
          <div>
            <h1 className="font-bold text-xl uppercase tracking-tighter">Kaiserliche Bank • Admin</h1>
            <p className="text-[10px] text-zinc-400">Master-Kontroll-Interface v1.0</p>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut size={18} />
          Exit
        </button>
      </header>

      <div className="flex-grow p-6 overflow-hidden flex flex-col gap-6">
        {/* User Search & List */}
        <div className="flex-1 overflow-hidden flex flex-col bg-zinc-800/50 rounded-2xl border border-zinc-700">
          <div className="p-4 border-b border-zinc-700 flex items-center gap-3">
             <Search size={18} className="text-zinc-500" />
             <input 
               type="text" 
               placeholder="Benutzer suchen..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-transparent w-full outline-none text-sm"
             />
          </div>
          <div className="flex-grow overflow-y-auto divide-y divide-zinc-700">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 italic">Keine Benutzer gefunden.</div>
            ) : (
              filteredUsers.map(u => (
                <button 
                  key={u.username}
                  onClick={() => {
                    setSelectedUser(u);
                    setAmountToAdd(0);
                    setKbpToAdd(0);
                  }}
                  className={`w-full p-4 flex justify-between items-center hover:bg-zinc-700/50 transition-colors ${selectedUser?.username === u.username ? 'bg-red-500/10 border-l-4 border-red-500' : ''}`}
                >
                  <div className="text-left">
                    <p className="font-bold">{u.username}</p>
                    <p className="text-[10px] text-zinc-400 uppercase">{u.accountType} • Stufe {u.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-500">{u.balance} KBG</p>
                    <p className="text-[10px] text-zinc-500">{u.kbp} KBP</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Selected User Management */}
        {selectedUser ? (
          <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 space-y-4 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold flex items-center gap-2 text-red-500">
                <Users size={20} />
                Management: {selectedUser.username}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               {/* KBG Management */}
               <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">KBG Kontostand</label>
                    <span className="text-xs font-bold text-amber-500">{selectedUser.balance} KBG</span>
                 </div>
                 <div className="flex gap-2">
                   <input 
                     type="number" 
                     value={amountToAdd || ''}
                     onChange={(e) => setAmountToAdd(Number(e.target.value))}
                     className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 w-full text-sm outline-none focus:border-red-500 transition-colors"
                     placeholder="+/- KBG"
                   />
                   <button 
                    onClick={addKBG} 
                    disabled={amountToAdd === 0}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 p-2 rounded-lg transition-colors"
                   >
                    <Plus size={18} />
                   </button>
                 </div>
               </div>
               
               {/* KBP Management */}
               <div className="space-y-2">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">KBP Kontostand</label>
                    <span className="text-xs font-bold text-blue-400">{selectedUser.kbp} KBP</span>
                 </div>
                 <div className="flex gap-2">
                   <input 
                     type="number" 
                     value={kbpToAdd || ''}
                     onChange={(e) => setKbpToAdd(Number(e.target.value))}
                     className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 w-full text-sm outline-none focus:border-blue-500 transition-colors"
                     placeholder="+/- KBP"
                   />
                   <button 
                    onClick={addKBP} 
                    disabled={kbpToAdd === 0}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 p-2 rounded-lg transition-colors"
                   >
                    <Star size={18} />
                   </button>
                 </div>
               </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-zinc-500 mb-2 uppercase font-bold border-b border-zinc-700 pb-1">Letzte Transaktionen (Vorschau)</p>
              <div className="max-h-32 overflow-y-auto text-[10px] bg-zinc-900 p-2 rounded-lg divide-y divide-zinc-800">
                {selectedUser.transactions.length === 0 ? (
                  <p className="text-center py-2 text-zinc-600">Keine Transaktionen</p>
                ) : (
                  selectedUser.transactions.slice(0, 8).map(t => (
                    <div key={t.id} className="py-1.5 flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-300">{t.type}</span>
                        <span className="text-zinc-500 opacity-70">{new Date(t.timestamp).toLocaleDateString()}</span>
                      </div>
                      <span className={t.sender === selectedUser.username ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                        {t.sender === selectedUser.username ? '-' : '+'}{t.amount} KBG
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800/30 p-12 rounded-2xl border border-dashed border-zinc-700 text-center flex flex-col items-center gap-3">
             <Users className="text-zinc-600" size={48} />
             <p className="text-zinc-500 text-sm">Wählen Sie einen Benutzer aus der Liste,<br/>um Konten und Boni zu verwalten.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
