
import React from 'react';
import { Home, Banknote, BarChart3, Wallet, Settings, ShieldCheck, Crown, Coins } from 'lucide-react';

export const ADMIN_PASSWORD = "Imgczf89!";
export const START_BALANCE = 50;

export const THEME = {
  primary: 'bg-[#8B0000]', // Royal Red
  secondary: 'bg-[#C2A15E]', // Imperial Gold
  textPrimary: 'text-[#3E2723]',
  textAccent: 'text-[#D4AF37]',
  bgParchment: 'bg-[#FDF6E3]',
  borderGold: 'border-[#C2A15E]'
};

/**
 * Level logic based on "For each further level, 100 KBP more are needed than the previous one"
 * Lvl 0: 0 - 100
 * Lvl 1: 100 - 300 (+200)
 * Lvl 2: 300 - 600 (+300)
 * Lvl 3: 600 - 1000 (+400)
 */
export const getLevelInfo = (kbp: number) => {
  let currentLevel = 0;
  let threshold = 100;
  let prevThreshold = 0;
  
  while (kbp >= threshold) {
    currentLevel++;
    prevThreshold = threshold;
    threshold += (currentLevel + 1) * 100;
  }
  
  return {
    level: currentLevel,
    currentKbp: kbp - prevThreshold,
    neededKbp: threshold - prevThreshold,
    totalToNext: threshold
  };
};

export const NAV_ITEMS = [
  { id: 'home', icon: <Home size={24} />, label: 'Home' },
  { id: 'transfer', icon: <Banknote size={24} />, label: 'Transfer' },
  { id: 'kbp', icon: <BarChart3 size={24} />, label: 'Progress' },
  { id: 'wallet', icon: <Wallet size={24} />, label: 'Konto' },
  { id: 'settings', icon: <Settings size={24} />, label: 'Settings' }
];
