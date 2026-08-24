import React from 'react';
import { LayoutDashboard, Users, Video, Box, Film, MessageSquare, CreditCard, Scissors, Mail, BarChart2, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode } = useTheme();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Courses', icon: Video, path: '/admin/courses' },
    { name: 'Assets', icon: Box, path: '/admin/assets' },
    { name: 'Portfolios', icon: Film, path: '/admin/portfolios' },
    { name: 'Editing Orders', icon: Scissors, path: '/admin/editing' },
    { name: 'Live Support Chat', icon: MessageSquare, path: '/admin/chat' },
    { name: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
    { name: 'Contact', icon: Mail, path: '/admin/contact-newsletter' },
    { name: 'Stats', icon: BarChart2, path: '/admin/home-video' },
    { name: 'Payment', icon: CreditCard, path: '/admin/payment-simulate' },
  ];

  return (
    <aside className={`w-56 border-r flex flex-col justify-between p-4 min-h-screen select-none ${
      darkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <div>
        <div className="flex items-center space-x-2.5 mb-6 px-1 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            TA
          </div>
          <div>
            <span className="font-extrabold tracking-wide text-base block leading-tight">TailAdmin</span>
            <span className={`text-[9px] block uppercase font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin</span>
          </div>
        </div>

        <div className="mb-2 px-2 text-[10px] font-bold tracking-wider uppercase text-gray-400">Menu</div>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg font-medium text-xs transition-none ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : ''} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`space-y-1.5 pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
            darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Website</span>
        </button>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 text-xs font-medium"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
