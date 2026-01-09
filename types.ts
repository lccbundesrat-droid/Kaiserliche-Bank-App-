
export interface User {
  username: string;
  password?: string;
  balance: number;
  kbp: number;
  level: number;
  accountType: 'Personal' | 'Business' | 'Guild';
  transactions: Transaction[];
  registrationDate: string;
}

export interface Transaction {
  id: string;
  type: 'Transfer' | 'Reward' | 'AdminCorrection' | 'StartBonus';
  amount: number;
  sender: string;
  recipient: string;
  timestamp: string;
  note?: string;
}

export interface LevelInfo {
  level: number;
  minKbp: number;
  maxKbp: number;
}
