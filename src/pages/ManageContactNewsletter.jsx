import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getContactMessagesAdmin, getNewsletterSubscribersAdmin, sendNewsletterBroadcastAdmin } from '../services/adminApi';
import { Mail, Users, Send, MessageSquare, CheckCircle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManageContactNewsletter() {
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Broadcast form state
  const [broadcast, setBroadcast] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [msgRes, subRes] = await Promise.all([
        getContactMessagesAdmin().catch(() => ({ data: [] })),
        getNewsletterSubscribersAdmin().catch(() => ({ data: [] }))
      ]);
      setMessages(msgRes.data.messages || msgRes.data || []);
      setSubscribers(subRes.data.subscribers || subRes.data || []);
    } catch (err) {
      console.error('Error loading contact & newsletter data:', err);
      setError('Failed to load contact messages or newsletter subscribers.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setError('');
      await sendNewsletterBroadcastAdmin(broadcast);
      setSuccessMsg('Newsletter broadcast email sent successfully to all subscribers!');
      setBroadcast({ subject: '', message: '' });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send broadcast email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-8 flex-1">
          
          {/* Header Card */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-3">
              <Mail className="text-blue-500" size={26} />
              <span>Contact & Newsletter Hub</span>
            </h1>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Review visitor contact messages and broadcast updates to all newsletter subscribers simultaneously.
            </p>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
              <X size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* SECTION 1: Newsletter Broadcast (Standalone Card) */}
          <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-base font-bold flex items-center space-x-2">
                  <Send size={18} className="text-blue-500" />
                  <span>Newsletter Broadcast Center</span>
                </h3>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Compose and dispatch an announcement email to all <strong className="text-blue-500">{subscribers.length}</strong> active subscribers at once.
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                {subscribers.length} Subscribers
              </span>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email Subject</label>
                <input
                  type="text"
                  required
                  value={broadcast.subject}
                  onChange={(e) => setBroadcast({ ...broadcast, subject: e.target.value })}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="e.g. Exciting new video editing presets released!"
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Message Body</label>
                <textarea
                  rows={4}
                  required
                  value={broadcast.message}
                  onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="Write your broadcast announcement here..."
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>{sending ? 'Broadcasting to All...' : 'Send Broadcast to All Subscribers'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 2: Contact Messages & Subscribers Lists (Side-by-Side Clean Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Contact Messages Card */}
            <div className={`rounded-2xl border p-6 flex flex-col justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div>
                <h3 className="text-base font-bold mb-4 flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <MessageSquare size={18} className="text-purple-500" />
                  <span>Contact Messages ({messages.length})</span>
                </h3>
                {loading ? (
                  <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading contact messages...</p>
                ) : messages.length === 0 ? (
                  <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No contact messages received yet.</p>
                ) : (
                  <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-2">
                    {messages.map((msg, idx) => (
                      <div key={msg._id || idx} className={`p-4 rounded-xl border space-y-1.5 ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-blue-500">{msg.name || msg.fullName || 'Visitor'}</span>
                          <span className="text-gray-400">{msg.email}</span>
                        </div>
                        <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{msg.message || msg.content}</p>
                        <span className="text-[10px] text-gray-400 block text-right">{new Date(msg.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Subscribers List Card */}
            <div className={`rounded-2xl border p-6 flex flex-col justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div>
                <h3 className="text-base font-bold mb-4 flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <Users size={18} className="text-pink-500" />
                  <span>Subscribers Directory ({subscribers.length})</span>
                </h3>
                {loading ? (
                  <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading subscribers...</p>
                ) : subscribers.length === 0 ? (
                  <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No newsletter subscribers found.</p>
                ) : (
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2">
                    {subscribers.map((sub, idx) => (
                      <div key={sub._id || idx} className={`px-4 py-3 rounded-xl border flex justify-between items-center text-xs ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                        <span className="font-medium">{sub.email || sub}</span>
                        <span className="text-emerald-500 font-semibold text-[11px]">Active</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
