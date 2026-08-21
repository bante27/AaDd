import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { simulatePaymentAdmin, getAdminTransactions, getCoursesAdmin } from '../services/adminApi';
import { CreditCard, CheckCircle, AlertCircle, Search, Video, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SimulatePayment() {
  const { darkMode } = useTheme();
  const [txRef, setTxRef] = useState('mrhaile-' + Date.now());
  const [courseId, setCourseId] = useState('');
  const [resultMsg, setResultMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoadingTx(true);
      const [txRes, coursesRes] = await Promise.all([
        getAdminTransactions().catch(() => ({ data: [] })),
        getCoursesAdmin().catch(() => ({ data: [] }))
      ]);
      setTransactions(txRes.data || []);
      const coursesList = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data?.courses || [];
      setCourses(coursesList);
      if (coursesList.length > 0 && !courseId) {
        setCourseId(coursesList[0]._id || coursesList[0].id);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoadingTx(false);
    }
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultMsg(null);
    setErrorMsg(null);
    try {
      await simulatePaymentAdmin({ tx_ref: txRef, courseId: courseId || undefined });
      setResultMsg('Payment simulated successfully! Order completed, student enrolled, & confirmation email dispatched.');
      setTxRef('mrhaile-' + Date.now());
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (txId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    // Optimistic UI update or API call if available
    setTransactions(transactions.map(tx => {
      if ((tx._id || tx.id) === txId) {
        return { ...tx, status: newStatus };
      }
      return tx;
    }));
  };

  const filteredTransactions = transactions.filter(tx => {
    const userEmail = (tx.user?.email || '').toLowerCase();
    const userName = `${tx.user?.firstName || ''} ${tx.user?.lastName || ''}`.toLowerCase();
    const courseTitle = (tx.course?.title || '').toLowerCase();
    const ref = (tx.tx_ref || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return userEmail.includes(query) || userName.includes(query) || courseTitle.includes(query) || ref.includes(query);
  });

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-8 flex-1">
          
          {/* Top Row: Course ID Picker Guide + Simulation Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Course Directory for Admin ID Copy */}
            <div className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                    <Video size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Active Courses & IDs</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click Use ID to paste Course ID into the payment simulator.</p>
                  </div>
                </div>

                {courses.length === 0 ? (
                  <p className={`text-xs py-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No courses available.</p>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {courses.map(course => {
                      const cid = course._id || course.id;
                      return (
                        <div key={cid} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          <div>
                            <span className="font-bold block truncate max-w-[200px] sm:max-w-xs">{course.title}</span>
                            <span className={`font-mono text-[10px] ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>ID: {cid}</span>
                          </div>
                          <button 
                            onClick={() => { setCourseId(cid); }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center space-x-1"
                          >
                            <span>Use ID</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`mt-4 p-3 rounded-xl border text-xs ${darkMode ? 'bg-gray-800/40 border-gray-700 text-gray-300' : 'bg-blue-50/50 border-blue-100 text-blue-900'}`}>
                <span className="font-bold block mb-0.5">💡 Quick Tip</span>
                <span>Select any course ID above to auto-populate the simulation form and test enrollment.</span>
              </div>
            </div>

            {/* Simulation Form Card */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              {resultMsg && (
                <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-3.5 rounded-xl flex items-center space-x-3 text-xs font-medium">
                  <CheckCircle size={16} />
                  <span>{resultMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-500 p-3.5 rounded-xl flex items-center space-x-3 text-xs font-medium">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSimulate} className="space-y-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction Ref (`tx_ref`)</label>
                  <input 
                    type="text" 
                    required
                    value={txRef} 
                    onChange={(e) => setTxRef(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 font-mono ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Course ID (`courseId`)</label>
                  <input 
                    type="text" 
                    required
                    value={courseId} 
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="Click 'Use ID' from left or paste Course ID..."
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 font-mono ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm text-xs flex items-center justify-center space-x-2"
                >
                  <CreditCard size={16} />
                  <span>{loading ? 'Processing Simulation...' : 'Simulate Success & Enroll'}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Transactions List Card */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-bold text-base">Course Payment Transactions ({filteredTransactions.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className={`absolute left-3.5 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                <input 
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
            </div>

            {loadingTx ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading transactions from database...</p>
            ) : filteredTransactions.length === 0 ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No payment transactions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-3.5">User</th>
                      <th className="px-6 py-3.5">Course</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Status (Click to toggle)</th>
                      <th className="px-6 py-3.5 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {filteredTransactions.map((tx) => {
                      const txId = tx._id || tx.id;
                      const status = tx.status || 'completed';
                      return (
                        <tr key={txId} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4">
                            <div className="font-bold">{tx.user?.firstName} {tx.user?.lastName}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tx.user?.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{tx.course?.title || 'Course'}</div>
                            <div className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ref: {tx.tx_ref}</div>
                          </td>
                          <td className="px-6 py-4 text-emerald-500 font-bold">{tx.totalAmount || tx.amount || tx.course?.price || 0} ETB</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => handleStatusToggle(txId, status)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border inline-flex items-center space-x-1 cursor-pointer transition-colors ${
                                status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
                              }`}
                              title="Click to toggle status between Pending and Completed"
                            >
                              <CheckCircle size={12} />
                              <span className="capitalize">{status}</span>
                            </button>
                          </td>
                          <td className={`px-6 py-4 text-right text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(tx.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
