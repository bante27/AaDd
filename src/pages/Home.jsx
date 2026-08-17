import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoPlayer from '../components/VideoPlayer';
import AssetCard from '../components/AssetCard';
import { Play, Sparkles, Shield, ArrowRight, Video, Box, Briefcase, Award } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/25 via-transparent to-cyber-dark pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Sparkles size={14} />
              <span>Ethiopia's Premier Video Editing Studio & Academy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Master Cinematic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 glow-text">Video Editing</span> & 3D Motion
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Learn advanced storytelling, color grading, and VFX from Mr. Haile. Access professional LUTs, presets, and high-end video production services.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/courses" 
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-neon hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Video size={20} />
                <span>Explore Masterclasses</span>
              </Link>
              <Link 
                to="/services" 
                className="px-8 py-4 rounded-xl glass-card hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-semibold transition-all flex items-center space-x-2"
              >
                <Briefcase size={20} />
                <span>Book Editing Services</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
              <div>
                <span className="text-3xl font-extrabold text-white glow-text">2,450+</span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Enrolled Students</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-cyan-400 glow-text">15k+</span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Asset Downloads</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-purple-400 glow-text">99.8%</span>
                <span className="block text-xs text-slate-400 uppercase tracking-wider mt-1">Satisfaction Rate</span>
              </div>
            </div>
          </div>

          <div>
            <VideoPlayer 
              title="MrHaile.com Showreel 2026" 
              poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1000" 
            />
          </div>
        </div>
      </section>

      {/* Featured Courses & Assets Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Masterclasses & Presets</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Featured Creator Resources</h2>
          </div>
          <Link to="/asset-hub" className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold text-sm">
            <span>View All Asset Hub</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AssetCard 
            title="Cyberpunk Neon LUTs & Presets" 
            category="LUTs" 
            price="19" 
            rating="4.9" 
            downloads="1.4k" 
            image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
            onDownload={() => navigate('/checkout-success')}
          />
          <AssetCard 
            title="Premiere Pro Seamless Transitions" 
            category="Transitions" 
            price="29" 
            rating="5.0" 
            downloads="2.1k" 
            image="https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800"
            onDownload={() => navigate('/checkout-success')}
          />
          <AssetCard 
            title="Cinematic Sound Effects & Atmospheres" 
            category="Audio Kit" 
            price="24" 
            rating="4.8" 
            downloads="980" 
            image="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
            onDownload={() => navigate('/checkout-success')}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
