
import { User, Transaction } from '../types';
import { START_BALANCE } from '../constants.tsx';

const DB_KEY = 'kb_users_db';
const DEVICE_KEY = 'kb_device_registration';

export const getUsers = (): User[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

export const getUserByUsername = (username: string): User | undefined => {
  return getUsers().find(u => u.username === username);
};

export const registerUser = (username: string, password: string): User | null => {
  const users = getUsers();
  if (users.find(u => u.username === username)) return null;

  const newUser: User = {
    username,
    password,
    balance: START_BALANCE,
    kbp: 0,
    level: 0,
    accountType: 'Personal',
    transactions: [{
      id: Math.random().toString(36).substr(2, 9),
      type: 'StartBonus',
      amount: START_BALANCE,
      sender: 'Kaiserliche Bank',
      recipient: username,
      timestamp: new Date().toISOString(),
      note: 'Willkommensgeschenk der Majestät'
    }],
    registrationDate: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  
  // Lock this device
  localStorage.setItem(DEVICE_KEY, username);
  
  return newUser;
};

export const isDeviceLocked = (): string | null => {
  return localStorage.getItem(DEVICE_KEY);
};

export const unlockDevice = () => {
  localStorage.removeItem(DEVICE_KEY);
};

export const updateUser = (username: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.username === username);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
  }
};

export const deleteUserAccount = (username: string) => {
  const users = getUsers();
  const filtered = users.filter(u => u.username !== username);
  saveUsers(filtered);
  unlockDevice();
};
