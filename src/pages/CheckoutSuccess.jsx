import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowLeft } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      <Navbar />

      <section className="py-24 px-6 max-w-2xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 md:p-12 border border-cyan-500/40 shadow-neon text-center space-y-6 w-full">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-neon">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white">Payment Successful!</h1>
            <p className="text-slate-400 text-sm">Thank you for your purchase. Your order has been securely processed and digital assets / course access are now unlocked.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Order Reference:</span>
              <span className="font-mono text-cyan-400">MH-TXN-998842</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Access Type:</span>
              <span className="text-white font-semibold">Instant Download & LMS Lifetime Access</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => alert('Downloading preset bundle archive (zip)...')}
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-neon hover:opacity-95 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Download size={18} />
              <span>Download Files Now</span>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-4 rounded-xl glass-card hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <ArrowLeft size={18} />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
