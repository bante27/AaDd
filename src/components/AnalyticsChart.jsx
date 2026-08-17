import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsChart() {
  const data = [
    { month: 'Jan', revenue: 45000, students: 320 },
    { month: 'Feb', revenue: 62000, students: 480 },
    { month: 'Mar', revenue: 58000, students: 420 },
    { month: 'Apr', revenue: 89000, students: 750 },
    { month: 'May', revenue: 110000, students: 980 },
    { month: 'Jun', revenue: 145000, students: 1350 },
  ];

  const maxRevenue = 150000;

  return (
    <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 shadow-neon">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">Revenue & Enrollment Analytics</h3>
          <p className="text-xs text-slate-400">Monthly performance tracking (ETB)</p>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300">Revenue (ETB)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="text-slate-300">Students</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between space-x-4 pt-4 border-b border-slate-800">
        {data.map((item, index) => {
          const heightPercent = (item.revenue / maxRevenue) * 100;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-cyan-500/50 px-2 py-1 rounded text-xs text-cyan-300 whitespace-nowrap z-20">
                {item.revenue.toLocaleString()} ETB ({item.students} students)
              </div>
              <div className="w-full flex space-x-1 items-end h-full justify-center">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg shadow-neon"
                />
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent * 0.7}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  className="w-1/2 bg-gradient-to-t from-purple-700 to-purple-500 rounded-t-lg shadow-neon-purple"
                />
              </div>
              <span className="text-xs text-slate-400 mt-3 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
