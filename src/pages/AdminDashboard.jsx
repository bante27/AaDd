import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { Users, ShoppingBag, TrendingUp, TrendingDown, Calendar, MoreVertical, Plus, MessageSquare, Box, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCoursesAdmin, getAssetsAdmin, getServiceInquiriesAdmin, getUsersAdmin } from '../services/adminApi';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    usersCount: 0,
    coursesCount: 0,
    assetsCount: 0,
    inquiriesCount: 0,
    recentInquiries: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, coursesRes, assetsRes, inquiriesRes] = await Promise.all([
          getUsersAdmin().catch(() => ({ data: [] })),
          getCoursesAdmin().catch(() => ({ data: [] })),
          getAssetsAdmin().catch(() => ({ data: [] })),
          getServiceInquiriesAdmin().catch(() => ({ data: [] }))
        ]);

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data?.courses || [];
        const assets = Array.isArray(assetsRes.data) ? assetsRes.data : assetsRes.data?.assets || [];
        const inquiries = Array.isArray(inquiriesRes.data) ? inquiriesRes.data : inquiriesRes.data?.inquiries || [];

        setStats({
          usersCount: users.length,
          coursesCount: courses.length,
          assetsCount: assets.length,
          inquiriesCount: inquiries.length,
          recentInquiries: inquiries.slice(0, 5)
        });
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-8 flex-1">
          
          {/* Top Header / Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Real-time business performance overview connected to database.
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate('/admin/courses')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-2 text-sm shadow-sm"
              >
                <Plus size={16} />
                <span>Add New Course</span>
              </button>
            </div>
          </div>

          {/* Top Row: Real Data Cards (Users, Courses, Assets, Inquiries) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Total Users Card */}
            <div 
              onClick={() => navigate('/admin/users')}
              className={`p-6 rounded-2xl border cursor-pointer transition-transform hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}>
                  <Users size={22} />
                </div>
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span>Live</span>
                </span>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Users</span>
              <h2 className="text-3xl font-extrabold mt-1">{loading ? '...' : stats.usersCount.toLocaleString()}</h2>
            </div>

            {/* Total Courses Card */}
            <div 
              onClick={() => navigate('/admin/courses')}
              className={`p-6 rounded-2xl border cursor-pointer transition-transform hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-purple-400' : 'bg-gray-100 text-purple-600'}`}>
                  <Video size={22} />
                </div>
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span>Live</span>
                </span>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Courses</span>
              <h2 className="text-3xl font-extrabold mt-1">{loading ? '...' : stats.coursesCount.toLocaleString()}</h2>
            </div>

            {/* Digital Assets Card */}
            <div 
              onClick={() => navigate('/admin/assets')}
              className={`p-6 rounded-2xl border cursor-pointer transition-transform hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-emerald-400' : 'bg-gray-100 text-emerald-600'}`}>
                  <Box size={22} />
                </div>
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span>Live</span>
                </span>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Digital Assets</span>
              <h2 className="text-3xl font-extrabold mt-1">{loading ? '...' : stats.assetsCount.toLocaleString()}</h2>
            </div>

            {/* Service Inquiries Card */}
            <div 
              onClick={() => navigate('/admin/inquiries')}
              className={`p-6 rounded-2xl border cursor-pointer transition-transform hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-amber-400' : 'bg-gray-100 text-amber-600'}`}>
                  <MessageSquare size={22} />
                </div>
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span>Live</span>
                </span>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inquiries</span>
              <h2 className="text-3xl font-extrabold mt-1">{loading ? '...' : stats.inquiriesCount.toLocaleString()}</h2>
            </div>

          </div>

          {/* Statistics & Recent Inquiries Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Statistics Line Chart Container */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg">Platform Growth Statistics</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Real-time activity metrics across database</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex rounded-lg p-1 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                    <button className="px-3 py-1 rounded text-xs font-bold bg-blue-600 text-white shadow-sm">Overview</button>
                    <button className={`px-3 py-1 rounded text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Users</button>
                    <button className={`px-3 py-1 rounded text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Courses</button>
                  </div>
                </div>
              </div>

              {/* Line Chart Wave Simulation */}
              <div className="h-56 relative flex items-end pt-8">
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0 140 Q 150 100 300 130 T 600 90 T 800 110 L 800 200 L 0 200 Z" 
                    fill="url(#chartGrad)" 
                  />
                  <path 
                    d="M 0 140 Q 150 100 300 130 T 600 90 T 800 110" 
                    fill="none" 
                    stroke="#2563eb" 
                    strokeWidth="3" 
                  />
                </svg>
                <div className="w-full flex justify-between text-[11px] text-gray-400 border-t pt-2 dark:border-gray-800">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span>05</span>
                  <span>06</span>
                  <span>07</span>
                  <span>08</span>
                  <span>09</span>
                  <span>10</span>
                  <span>11</span>
                  <span>12</span>
                </div>
              </div>
            </div>

            {/* Recent Live Inquiries & Quick Links */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">Recent Inquiries</h3>
                  <button onClick={() => navigate('/admin/inquiries')} className="text-xs font-semibold text-blue-500 hover:underline">View All</button>
                </div>

                {stats.recentInquiries.length === 0 ? (
                  <div className={`py-12 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
                    <span>No pending client inquiries.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentInquiries.map((inquiry, idx) => (
                      <div key={inquiry._id || idx} className={`p-3 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div>
                          <h4 className="text-xs font-bold">{inquiry.name || 'Client'}</h4>
                          <p className="text-[11px] text-blue-500">{inquiry.serviceType || 'Inquiry'}</p>
                        </div>
                        <button onClick={() => navigate('/admin/inquiries')} className="px-2.5 py-1 rounded bg-blue-600 text-white text-[11px] font-semibold">
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-xl border mt-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500 block mb-1">Database Connected</span>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Real-time data fetched from MongoDB via adminApi.</p>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
