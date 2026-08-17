import React from 'react';
import { Bell, Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminNavbar() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`px-8 py-4 border-b flex items-center justify-between sticky top-0 z-40 select-none ${
      darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <div className="flex items-center space-x-4 w-96">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search or type command..." 
            className={`w-full rounded-xl pl-10 pr-12 py-2 text-sm focus:outline-none border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          />
          <span className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded text-[10px] font-bold border border-gray-300 dark:border-gray-700 text-gray-400 bg-gray-100 dark:bg-gray-900">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark / Light Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl border transition-none ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' 
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell */}
        <button className={`p-2.5 rounded-xl border transition-none relative ${
          darkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
        }`}>
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>

        {/* Profile Display with Photo */}
        <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="w-9 h-9 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center border border-gray-300 dark:border-gray-600">
            <img 
              src="/Logo.png" 
              alt="Admin Profile" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="absolute text-white font-bold text-xs" style={{ display: 'none' }}>MH</span>
          </div>
          <div className="hidden md:block text-left pr-1">
            <span className="text-sm font-bold block leading-tight">{user?.name || 'Musharof'}</span>
            <span className="text-[11px] text-gray-400 block leading-tight">Super Admin</span>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
