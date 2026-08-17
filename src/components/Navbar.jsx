import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, Box, Briefcase, Home, Shield, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-neon">
          <span className="font-bold text-lg text-white">MH</span>
        </div>
        <div>
          <span className="text-xl font-bold tracking-wider text-white glow-text">MRHAILE</span>
          <span className="text-xs block text-cyan-400 tracking-widest uppercase">Studio & Academy</span>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors">
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link to="/courses" className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors">
          <Video size={18} />
          <span>Courses</span>
        </Link>
        <Link to="/asset-hub" className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors">
          <Box size={18} />
          <span>Asset Hub</span>
        </Link>
        <Link to="/services" className="flex items-center space-x-2 text-slate-300 hover:text-cyan-400 transition-colors">
          <Briefcase size={18} />
          <span>Service Portfolio</span>
        </Link>
        {isAdmin && (
          <Link to="/admin" className="flex items-center space-x-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/30">
            <Shield size={18} />
            <span>3D Admin Dashboard</span>
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
            <User size={16} className="text-cyan-400" />
            <span className="text-sm font-medium text-slate-200">{user.name}</span>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors ml-2" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/admin')} 
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium hover:opacity-95 shadow-neon transition-all text-sm"
          >
            Admin Login
          </button>
        )}
      </div>
    </nav>
  );
}
