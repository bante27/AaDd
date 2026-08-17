import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize, RotateCcw } from 'lucide-react';

export default function VideoPlayer({ src, poster, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden glass-card group border border-cyan-500/30 shadow-neon">
      <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
        {poster && !isPlaying && (
          <img src={poster} alt={title || 'Video thumbnail'} className="absolute inset-0 w-full h-full object-cover opacity-80" />
        )}
        {!isPlaying ? (
          <button 
            onClick={togglePlay}
            className="absolute z-10 w-16 h-16 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-neon hover:scale-110 transition-transform"
          >
            <Play size={28} className="ml-1" />
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-cyan-300 font-medium">Playing course module: {title || 'Lesson 1'}</p>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-3">
            <button onClick={togglePlay} className="text-white hover:text-cyan-400">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => setProgress(0)} className="text-white hover:text-cyan-400">
              <RotateCcw size={18} />
            </button>
            <span className="text-xs text-slate-300">01:25 / 14:40</span>
          </div>
          <div className="flex items-center space-x-3">
            <Volume2 size={18} className="text-white hover:text-cyan-400 cursor-pointer" />
            <Maximize size={18} className="text-white hover:text-cyan-400 cursor-pointer" />
          </div>
        </div>
      </div>
      {title && (
        <div className="p-4 bg-slate-900/90 border-t border-slate-800">
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
      )}
    </div>
  );
}
