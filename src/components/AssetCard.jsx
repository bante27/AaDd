import React from 'react';
import { Download, Star, Tag } from 'lucide-react';

export default function AssetCard({ title, category, price, rating, downloads, image, onDownload }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 group flex flex-col">
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img 
          src={image || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800"} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-xs text-cyan-300 flex items-center space-x-1">
          <Tag size={12} />
          <span>{category}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-lg tracking-wide group-hover:text-cyan-400 transition-colors">{title}</h3>
            <span className="text-cyan-400 font-bold text-lg">${price}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400 mb-4">
            <div className="flex items-center space-x-1 text-amber-400">
              <Star size={14} fill="currentColor" />
              <span>{rating || '4.9'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download size={14} className="text-cyan-400" />
              <span>{downloads || '1.2k'} downloads</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onDownload}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 text-cyan-400 font-semibold transition-all flex items-center justify-center space-x-2 text-sm shadow-neon"
        >
          <Download size={16} />
          <span>Download Preset / Asset</span>
        </button>
      </div>
    </div>
  );
}
