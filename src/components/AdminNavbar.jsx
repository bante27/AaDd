import React, { useState, useEffect } from 'react';
import { Bell, Search, Moon, Sun, ChevronDown, MessageSquare, CreditCard, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getServiceInquiriesAdmin, getAdminTransactions } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewedIds, setViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_viewed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [viewedIds]);

  const fetchNotifications = async () => {
    try {
      const [inquiriesRes, txRes] = await Promise.all([
        getServiceInquiriesAdmin().catch(() => ({ data: [] })),
        getAdminTransactions().catch(() => ({ data: [] }))
      ]);

      const inquiries = Array.isArray(inquiriesRes.data) ? inquiriesRes.data : inquiriesRes.data?.inquiries || [];
      const txs = Array.isArray(txRes.data) ? txRes.data : [];

      const combined = [
        ...inquiries.map(i => ({
          id: i._id || i.id,
          type: 'inquiry',
          title: `New Inquiry from ${i.name || 'Client'}`,
          desc: i.message ? i.message.substring(0, 40) + '...' : 'New service inquiry received',
          time: new Date(i.createdAt || Date.now()),
          path: '/admin/inquiries'
        })),
        ...txs.map(t => ({
          id: t._id || t.id,
          type: 'transaction',
          title: `New Order: ${t.course?.title || 'Course'}`,
          desc: `${t.user?.firstName || 'Student'} paid ${t.totalAmount || t.amount || 0} ETB`,
          time: new Date(t.createdAt || Date.now()),
          path: '/admin/payment-simulate'
        }))
      ].sort((a, b) => b.time - a.time);

      // Filter out viewed notifications
      const unviewed = combined.filter(n => !viewedIds.includes(n.id));
      setNotifications(unviewed);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleNotificationClick = (n) => {
    const updatedViewed = [...viewedIds, n.id];
    setViewedIds(updatedViewed);
    try {
      localStorage.setItem('admin_viewed_notifications', JSON.stringify(updatedViewed));
    } catch (e) {
      console.error(e);
    }
    setNotifications(notifications.filter(item => item.id !== n.id));
    setShowDropdown(false);
    navigate(n.path);
  };

  const adminName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.name || 'Administrator');
  const adminRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Super Admin';

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

      <div className="flex items-center space-x-4 relative">
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

        {/* Notification Bell with Live Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-2.5 rounded-xl border transition-none relative ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            )}
          </button>

          {showDropdown && (
            <div className={`absolute right-0 mt-3 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden ${
              darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h4 className="font-bold text-sm">Notifications ({notifications.length})</h4>
                <button onClick={() => setShowDropdown(false)} className="text-gray-400 hover:text-gray-200">
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800">
                {notifications.length === 0 ? (
                  <p className={`text-xs py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No unread notifications.</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 transition-colors cursor-pointer text-xs space-y-1 ${
                        darkMode ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-blue-500">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className={`truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Display with Exact Name & Role */}
        <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="w-9 h-9 rounded-full bg-blue-600 overflow-hidden flex items-center justify-center border border-gray-300 dark:border-gray-600">
            <img 
              src={user?.profileImage || "/Logo.png"} 
              alt="Admin Profile" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="pr-1">
            <span className="text-sm font-bold block leading-tight">{adminName}</span>
            <span className="text-[11px] text-gray-400 block leading-tight">{adminRole}</span>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
