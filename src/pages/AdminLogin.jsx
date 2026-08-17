import React, { useState } from 'react';
import { loginAdmin } from '../services/adminApi';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAdmin(email, password);
      const data = response.data;
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-5xl bg-[#031d22] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative min-h-[520px] items-center border border-slate-100">
        
        {/* Left Side: Brand Logo and Name using public/logo.png */}
        <div className="flex flex-col items-center lg:items-start justify-center p-8 lg:p-16 space-y-4">
          <div className="flex items-center space-x-4">
            {/* Logo Image */}
            <div className="w-16 h-16 relative flex items-center justify-center">
              <img 
                src="/Logo.png" 
                alt="MrHaile Hub Logo" 
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            {/* Brand Title */}
            <span className="text-2xl lg:text-3xl font-light tracking-wide text-white font-sans">
              MrHaile <span className="font-semibold text-cyan-400">Hub</span>
            </span>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div className="hidden lg:block absolute left-1/2 top-16 bottom-16 w-[1px] bg-slate-700 -translate-x-1/2"></div>

        {/* Right Side: Welcome Form */}
        <div className="flex flex-col justify-center p-8 lg:p-16">
          <div className="w-full max-w-sm mx-auto space-y-6">
            
            {/* Header Titles */}
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-light tracking-wider text-white">Welcome</h1>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
                Please login to Admin Dashboard.
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Form Inputs */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  required 
                  placeholder="USERNAME"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-xs tracking-wider text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                />
              </div>

              <div>
                <input 
                  type="password" 
                  required 
                  placeholder="PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-transparent rounded-lg px-4 py-3 text-xs tracking-wider text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-sm"
                />
              </div>

              {/* Orange Action Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-white font-semibold tracking-widest text-xs transition-all flex items-center justify-center shadow-md shadow-orange-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    <span>LOGGING IN...</span>
                  </>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>
            </form>

            {/* Forgotten Password Link */}
            <div className="text-center pt-2">
              <a 
                href="#forgot" 
                onClick={(e) => e.preventDefault()} 
                className="text-[10px] tracking-widest uppercase text-slate-400 hover:text-white transition-colors font-medium"
              >
                Forgotten Your Password?
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}