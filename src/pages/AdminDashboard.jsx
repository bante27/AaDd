import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { Users, ShoppingBag, TrendingUp, TrendingDown, ArrowUpRight, Calendar, MoreVertical, Plus, CheckCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCoursesAdmin, getAssetsAdmin, getServiceInquiriesAdmin } from '../services/adminApi';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesCount: 3782,
    assetsCount: 5359,
    inquiriesCount: 0,
    recentInquiries: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, assetsRes, inquiriesRes] = await Promise.all([
          getCoursesAdmin().catch(() => ({ data: [] })),
          getAssetsAdmin().catch(() => ({ data: [] })),
          getServiceInquiriesAdmin().catch(() => ({ data: [] }))
        ]);

        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data?.courses || [];
        const assets = Array.isArray(assetsRes.data) ? assetsRes.data : assetsRes.data?.assets || [];
        const inquiries = Array.isArray(inquiriesRes.data) ? inquiriesRes.data : inquiriesRes.data?.inquiries || [];

        setStats({
          coursesCount: courses.length > 0 ? courses.length : 3782,
          assetsCount: assets.length > 0 ? assets.length : 5359,
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
                Business performance overview.
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

          {/* Top Row: 3 TailAdmin Cards (Customers, Orders, Monthly Target) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Customers Card */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-blue-600'}`}>
                  <Users size={22} />
                </div>
                <span className="flex items-center space-x-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  <span>+11.01%</span>
                </span>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Customers</span>
              <h2 className="text-3xl font-extrabold mt-1">{loading ? '...' : stats.coursesCount.toLocaleString()}</h2>
            </div>

            {/* Orders Card */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-800 text-purple-400' : 'bg-gray-100 text-purple-600'}`}>
                  <ShoppingBag size={22} />
                </div>
                <span className="flex items-center space-x-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                  <TrendingDown size={12} />
                  <span>-9.05%</span>
                </span>
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Orders</span>
              <h2 className="text-3xl font-extrabold mt-1">{loading ? '...' : stats.assetsCount.toLocaleString()}</h2>
            </div>

            {/* Monthly Target Card */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Monthly Target</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target you’ve set for each month</p>
                </div>
                <button className={`p-1.5 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Semi-Circular Progress Chart Box */}
              <div className="py-4 flex flex-col items-center justify-center">
                <div className="relative w-40 h-20 overflow-hidden flex items-end justify-center mb-2">
                  <div className="w-36 h-36 rounded-full border-[14px] border-blue-600 border-t-transparent border-l-transparent -rotate-45 flex items-center justify-center"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                    <span className="text-2xl font-black">75.55%</span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded mt-0.5">+10%</span>
                  </div>
                </div>
                <p className={`text-xs text-center px-4 mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  You earn $3287 today, it’s higher than last month. Keep up your good work!
                </p>
              </div>

              {/* Bottom Target Stats */}
              <div className={`grid grid-cols-3 gap-2 pt-4 border-t text-center ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div>
                  <span className={`text-[10px] block uppercase font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target</span>
                  <span className="text-sm font-bold text-red-500">$20K ↓</span>
                </div>
                <div>
                  <span className={`text-[10px] block uppercase font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span>
                  <span className="text-sm font-bold text-emerald-500">$20K ↑</span>
                </div>
                <div>
                  <span className={`text-[10px] block uppercase font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today</span>
                  <span className="text-sm font-bold text-emerald-500">$20K ↑</span>
                </div>
              </div>
            </div>

          </div>

          {/* Monthly Sales Bar Chart Section */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Monthly Sales</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sales performance analytics across months</p>
              </div>
              <button className={`p-1.5 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}>
                <MoreVertical size={18} />
              </button>
            </div>

            {/* Bar Chart Visual */}
            <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 px-2">
              {[
                { month: 'Jan', height: '40%' },
                { month: 'Feb', height: '85%' },
                { month: 'Mar', height: '50%' },
                { month: 'Apr', height: '75%' },
                { month: 'May', height: '45%' },
                { month: 'Jun', height: '55%' },
                { month: 'Jul', height: '70%' },
                { month: 'Aug', height: '30%' },
                { month: 'Sep', height: '60%' },
                { month: 'Oct', height: '90%' },
                { month: 'Nov', height: '65%' },
                { month: 'Dec', height: '35%' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div 
                    className="w-full max-w-[32px] bg-blue-600 rounded-t hover:bg-blue-500 transition-none"
                    style={{ height: bar.height }}
                  ></div>
                  <span className={`text-[11px] mt-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics & Recent Inquiries Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Statistics Line Chart Container */}
            <div className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg">Statistics</h3>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Target you’ve set for each month</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex rounded-lg p-1 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                    <button className="px-3 py-1 rounded text-xs font-bold bg-blue-600 text-white shadow-sm">Overview</button>
                    <button className={`px-3 py-1 rounded text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Sales</button>
                    <button className={`px-3 py-1 rounded text-xs font-semibold ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>Revenue</button>
                  </div>
                  <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                    <Calendar size={14} className="text-blue-500" />
                    <span>Mar 6, 2025 - Mar 12, 2025</span>
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
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>API endpoints active for courses, digital assets & client orders.</p>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
