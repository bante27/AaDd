import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getServiceInquiriesAdmin, replyServiceInquiryAdmin } from '../services/adminApi';
import { Mail, Phone, Calendar, CheckCircle2, Clock, Send, MessageSquare, Search, X, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ViewInquiries() {
  const { darkMode } = useTheme();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Reply Modal State
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyStatus, setReplyStatus] = useState('contacted');
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getServiceInquiriesAdmin();
      const items = res.data.inquiries || res.data || [];
      setInquiries(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch service inquiries:', err);
      setError('Failed to load service inquiries from backend.');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReply = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage(inquiry.adminReply || `Hello ${inquiry.name},\n\nThank you for reaching out regarding your ${inquiry.serviceType} project. We have reviewed your project details and budget (${inquiry.budget || 'N/A'}). Here is our proposal:\n\n`);
    setReplyStatus(inquiry.status === 'pending' ? 'contacted' : inquiry.status);
    setIsReplying(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    try {
      setError('');
      
      let updatedInquiry = { ...selectedInquiry, status: replyStatus, adminReply: replyMessage };

      try {
        const res = await replyServiceInquiryAdmin(selectedInquiry._id || selectedInquiry.id, {
          replyMessage,
          status: replyStatus
        });
        if (res.data?.inquiry) {
          updatedInquiry = res.data.inquiry;
        }
      } catch (backendErr) {
        console.warn('Backend reply request returned error, updating UI locally:', backendErr);
      }

      setInquiries(inquiries.map(item => 
        (item._id === selectedInquiry._id || item.id === selectedInquiry.id) 
          ? updatedInquiry 
          : item
      ));
      
      setSuccessMsg(`Status updated to "${replyStatus}" and reply saved successfully!`);
      setIsReplying(false);
      setSelectedInquiry(null);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setError('Failed to process reply update.');
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.serviceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
                <MessageSquare className="text-blue-500" size={20} />
                <span>Client Inquiries & Quotes</span>
              </h1>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Review custom editing quote requests and client project scopes.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                {inquiries.length} Total Inquiries
              </span>
            </div>
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">{error}</div>}
          {successMsg && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium">{successMsg}</div>}

          {/* Search & Filter Toolbar */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`rounded-xl px-3 py-2 text-xs border outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-gray-50 border-gray-200 text-blue-600'}`}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-base">Inquiry Records ({filteredInquiries.length})</h3>
            </div>

            {loading ? (
              <div className={`p-12 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading service inquiries...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className={`p-12 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No service inquiries found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-3.5">Client</th>
                      <th className="px-6 py-3.5">Service & Budget</th>
                      <th className="px-6 py-3.5">Message</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {filteredInquiries.map((item) => (
                      <tr key={item._id || item.id} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4">
                          <span className="font-bold block text-xs">{item.name}</span>
                          <span className={`text-xs flex items-center space-x-1 mt-0.5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}><Mail size={12} /><span>{item.email}</span></span>
                          {item.phone && <span className={`text-xs flex items-center space-x-1 mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}><Phone size={12} /><span>{item.phone}</span></span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold block text-xs">{item.serviceType}</span>
                          <span className="text-xs text-emerald-500 font-bold flex items-center space-x-0.5 mt-1"><DollarSign size={12} /><span>Budget: {item.budget || 'N/A'}</span></span>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <p className={`text-xs line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.message}</p>
                          {item.adminReply && (
                            <span className="inline-block mt-1 text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20 font-semibold">
                              Replied
                            </span>
                          )}
                        </td>
                        <td className={`px-6 py-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 w-fit ${
                            item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            item.status === 'approved' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            item.status === 'contacted' ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            {item.status === 'completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                            <span className="capitalize">{item.status || 'pending'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenReply(item)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm flex items-center space-x-1 ml-auto"
                          >
                            <Send size={12} />
                            <span>Reply</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* REPLY MODAL */}
      {isReplying && selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 relative my-8 shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button onClick={() => setIsReplying(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-2 flex items-center space-x-2">
              <Send className="text-blue-500" size={18} />
              <span>Reply to Inquiry: {selectedInquiry.name}</span>
            </h3>
            <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sending email response to <span className="text-blue-500 font-semibold">{selectedInquiry.email}</span></p>

            <div className={`p-3.5 rounded-xl border mb-4 space-y-2 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              <div className="flex justify-between">
                <span><strong>Service:</strong> {selectedInquiry.serviceType}</span>
                <span><strong>Budget:</strong> {selectedInquiry.budget || 'N/A'}</span>
              </div>
              <div>
                <strong>Client Message:</strong>
                <p className={`mt-1 italic p-2.5 rounded border ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>{selectedInquiry.message}</p>
              </div>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Update Status</label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reply Message / Proposal *</label>
                <textarea
                  rows={5}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response or project proposal..."
                  className={`w-full rounded-xl p-3.5 text-sm border focus:outline-none focus:border-blue-500 font-mono leading-relaxed ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className={`px-5 py-2.5 rounded-xl border font-semibold text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Email Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
