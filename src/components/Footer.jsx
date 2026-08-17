import React from 'react';
import { Youtube, Twitter, Instagram, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-cyan-500/20 py-12 px-6 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white text-sm">MH</span>
            </div>
            <span className="text-lg font-bold text-white tracking-wider">MRHAILE</span>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Professional video editing masterclasses, digital asset presets, and high-end video production services in Ethiopia & worldwide.
          </p>
          <div className="flex space-x-4 text-cyan-400">
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors"><Youtube size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors"><Twitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors"><Instagram size={20} /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors"><Github size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs text-cyan-400">Academy</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/courses" className="hover:text-cyan-400 transition-colors">Video Editing Masterclass</a></li>
            <li><a href="/courses" className="hover:text-cyan-400 transition-colors">Color Grading Pro</a></li>
            <li><a href="/courses" className="hover:text-cyan-400 transition-colors">Motion Graphics 3D</a></li>
            <li><a href="/courses" className="hover:text-cyan-400 transition-colors">DaVinci Resolve Bootcamp</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs text-cyan-400">Asset Hub</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/asset-hub" className="hover:text-cyan-400 transition-colors">Cyberpunk LUTs</a></li>
            <li><a href="/asset-hub" className="hover:text-cyan-400 transition-colors">Premiere Pro Transitions</a></li>
            <li><a href="/asset-hub" className="hover:text-cyan-400 transition-colors">Sound FX & Atmospheres</a></li>
            <li><a href="/asset-hub" className="hover:text-cyan-400 transition-colors">3D Title Templates</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs text-cyan-400">Newsletter</h4>
          <p className="text-sm mb-4">Subscribe for weekly editing presets, tips, and exclusive student discounts.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-slate-900 border border-slate-700 rounded-l-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
            />
            <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 rounded-r-xl transition-colors text-sm">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} MrHaile.com. All rights reserved. Powered by Advanced 3D Web Studio.
      </div>
    </footer>
  );
}
