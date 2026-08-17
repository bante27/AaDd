import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VideoPlayer from '../components/VideoPlayer';
import { useNavigate } from 'react-router-dom';
import { Video, Star, Clock, Users, CheckCircle } from 'lucide-react';

export default function Courses() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: 'Advanced Premiere Pro & Sound Design Masterclass',
      category: 'Video Editing',
      price: '3,500 ETB',
      rating: '4.9',
      students: '1,200',
      duration: '14 Hours',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'DaVinci Resolve Pro Color Grading & Cinematography',
      category: 'Color Grading',
      price: '4,200 ETB',
      rating: '5.0',
      students: '850',
      duration: '18 Hours',
      image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'After Effects 3D Motion Graphics & VFX Bootcamp',
      category: 'Motion Design',
      price: '5,000 ETB',
      rating: '4.95',
      students: '400',
      duration: '22 Hours',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      <Navbar />

      <section className="py-16 px-6 max-w-7xl mx-auto w-full flex-1 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            Academy Masterclasses
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Professional Video Editing Curriculum</h1>
          <p className="text-slate-300 text-sm md:text-base">
            Equip yourself with industry-standard skills. Complete with project files, raw footage, and 1-on-1 mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-2xl overflow-hidden border border-cyan-500/30 flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/30 text-xs text-cyan-300">
                    {course.category}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg tracking-wide group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                    <span className="text-cyan-400 font-extrabold text-lg">{course.price}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-xs text-slate-400">
                    <div className="flex items-center space-x-1 text-amber-400"><Star size={14} fill="currentColor" /><span>{course.rating}</span></div>
                    <div className="flex items-center space-x-1"><Users size={14} className="text-cyan-400" /><span>{course.students} enrolled</span></div>
                    <div className="flex items-center space-x-1"><Clock size={14} className="text-purple-400" /><span>{course.duration}</span></div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => navigate('/checkout-success')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-neon hover:opacity-95 transition-all text-sm"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
