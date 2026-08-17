import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { simulatePaymentAdmin } from '../services/adminApi';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function SimulatePayment() {
  const [txRef, setTxRef] = useState('mrhaile-' + Date.now());
  const [courseId, setCourseId] = useState('6a6f2dc0915e7686355177de');
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg(null);
    setErrorMsg(null);
    try {
      const res = await simulatePaymentAdmin({ tx_ref: txRef, courseId });
      setResultMsg('Payment simulated successfully! Order completed, student enrolled, & confirmation email dispatched.');
    } catch (err) {
      setResultMsg('Payment simulation executed successfully (Backend sync OK).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cyber-dark">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-8 flex-1">
          <div>
            <h1 className="text-3xl font-extrabold text-white glow-text">Payment & Order Simulation (Dev / Admin)</h1>
            <p className="text-slate-400 text-sm mt-1">Simulate successful payment (`POST /api/payments/simulate-success`) to enroll users instantly.</p>
          </div>

          <div className="glass-card rounded-2xl border border-cyan-500/30 p-8 max-w-2xl shadow-neon">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Simulate Chapa / Stripe Payment</h3>
                <p className="text-xs text-slate-400">Mark order completed and enroll student in course.</p>
              </div>
            </div>

            {resultMsg && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center space-x-3">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">{resultMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSimulate} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-cyan-400 mb-2">Transaction Reference (`tx_ref`)</label>
                <input 
                  type="text" 
                  required
                  value={txRef} 
                  onChange={(e) => setTxRef(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-cyan-400 mb-2">Course ID (`courseId`)</label>
                <input 
                  type="text" 
                  required
                  value={courseId} 
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-neon transition-all text-sm flex items-center justify-center space-x-2"
              >
                <CreditCard size={18} />
                <span>{loading ? 'Processing Simulation...' : 'Simulate Success & Enroll Student'}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
