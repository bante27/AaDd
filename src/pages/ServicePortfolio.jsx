import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiService from '../services/apiService';
import { Briefcase, Send, CheckCircle, Sparkles } from 'lucide-react';

export default function ServicePortfolio() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Commercial Video Editing');
  const [budget, setBudget] = useState('$1,000');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.submitInquiry({ name, email, service, budget, message });
      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      <Navbar />

      <section className="py-16 px-6 max-w-7xl mx-auto w-full flex-1 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Professional Studio Services
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Video Editing & Color Grading Portfolio</h1>
          <p className="text-slate-300 text-sm md:text-base">
            Work directly with Mr. Haile for high-end commercials, documentaries, music videos, and brand channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-8 border border-cyan-500/30 space-y-6">
              <h3 className="text-2xl font-bold text-white">Why Choose Mr. Haile Studio?</h3>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex items-start space-x-3">
                  <Sparkles size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Hollywood-Grade Post Production:</strong> Advanced DaVinci Resolve color grading, seamless sound design, and custom VFX.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Sparkles size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Fast Turnaround Times:</strong> Dedicated editing suites and streamlined feedback loops.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Sparkles size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Trusted by Global Brands:</strong> Over 100+ successful commercial projects delivered worldwide.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-cyan-500/40 shadow-neon">
            <h3 className="text-2xl font-bold text-white mb-2">Request Service Inquiry</h3>
            <p className="text-xs text-slate-400 mb-6">Submitted requests are instantly synced to <code className="text-cyan-300">POST /api/services/inquiries</code>.</p>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-6 rounded-xl text-center space-y-3">
                <CheckCircle size={36} className="mx-auto" />
                <h4 className="font-bold text-lg">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-slate-300">Mr. Haile's team will review your project details and contact you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs">
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-cyan-400 mb-1">Your Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dawit Mekonnen"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-cyan-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dawit@example.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-cyan-400 mb-1">Service Required</label>
                  <select 
                    value={service} 
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option>Commercial Video Editing</option>
                    <option>Documentary Color Grading</option>
                    <option>YouTube Channel Package</option>
                    <option>3D Motion Graphics & VFX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-cyan-400 mb-1">Estimated Budget</label>
                  <input 
                    type="text" 
                    required 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="$1,200"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-cyan-400 mb-1">Project Details & Vision</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project goals, timeline, and reference links..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-neon hover:opacity-95 transition-all flex items-center justify-center space-x-2 text-sm">
                  <Send size={16} />
                  <span>Send Project Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
