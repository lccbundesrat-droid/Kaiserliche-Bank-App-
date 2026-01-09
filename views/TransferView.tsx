
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { getUserByUsername, updateUser } from '../utils/db';
import { Send, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  user: User;
  refresh: () => void;
}

const TransferView: React.FC<Props> = ({ user, refresh }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const handleTransfer = () => {
    setStatus(null);

    if (recipient === user.username) {
      setStatus({ type: 'error', message: 'Man kann kein Geld an sich selbst senden.' });
      return;
    }

    if (amount <= 0) {
      setStatus({ type: 'error', message: 'Ungültiger Betrag.' });
      return;
    }

    if (user.balance < amount) {
      setStatus({ type: 'error', message: 'Unzureichendes Guthaben.' });
      return;
    }

    const targetUser = getUserByUsername(recipient);
    if (!targetUser) {
      setStatus({ type: 'error', message: 'Empfänger existiert nicht.' });
      return;
    }

    const txId = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    const transferTx: Transaction = {
      id: txId,
      type: 'Transfer',
      amount,
      sender: user.username,
      recipient: recipient,
      timestamp: now,
      note: note || 'Kaiserliche Überweisung'
    };

    // Update Sender
    updateUser(user.username, {
      balance: user.balance - amount,
      kbp: user.kbp + 5, // Reward for activity
      transactions: [transferTx, ...user.transactions]
    });

    // Update Recipient
    updateUser(recipient, {
      balance: targetUser.balance + amount,
      transactions: [transferTx, ...targetUser.transactions]
    });

    setStatus({ type: 'success', message: `${amount} KBG erfolgreich an ${recipient} gesendet.` });
    setRecipient('');
    setAmount(0);
    setNote('');
    refresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="font-imperial text-xl text-amber-900 flex items-center gap-2">
        <Send className="text-red-800" />
        KBG Überweisen
      </h2>

      <div className="bg-white/80 p-6 rounded-2xl border-2 border-amber-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-amber-800 mb-1">Empfänger</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
            <input 
              type="text" 
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-500 outline-none transition-all"
              placeholder="Benutzername des Empfängers"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-amber-800 mb-1">Betrag (KBG)</label>
          <input 
            type="number" 
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-500 outline-none transition-all font-bold text-lg"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-amber-800 mb-1">Verwendungszweck (Optional)</label>
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl focus:border-amber-500 outline-none transition-all"
            placeholder="Wofür sind die Münzen?"
          />
        </div>

        {status && (
          <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-sm font-bold">{status.message}</span>
          </div>
        )}

        <button 
          onClick={handleTransfer}
          className="w-full bg-red-800 hover:bg-red-700 text-amber-100 font-imperial font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Transaktion Ausführen
        </button>
      </div>
    </div>
  );
};

export default TransferView;
