import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { 
  getConversationsAdmin, 
  getConversationMessagesAdmin, 
  sendConversationMessageAdmin, 
  updateConversationStatusAdmin,
  markConversationReadAdmin 
} from '../services/adminApi';
import { MessageSquare, Send, CheckCircle, Search, User, Shield, Phone, Mail, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { io } from 'socket.io-client';

export default function ManageLiveChat() {
  const { darkMode } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize Admin Socket Connection
  useEffect(() => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.token) {
          const socket = io('http://localhost:5000', {
            auth: { token: userInfo.token },
            transports: ['websocket', 'polling']
          });

          socketRef.current = socket;

          socket.on('connect', () => {
            console.log('Admin socket connected:', socket.id);
          });

          socket.on('conversation_updated', (updatedConv) => {
            setConversations(prev => {
              const index = prev.findIndex(c => c._id === updatedConv._id);
              if (index >= 0) {
                const updated = [...prev];
                updated[index] = { ...updated[index], ...updatedConv };
                return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
              } else {
                return [updatedConv, ...prev];
              }
            });

            setSelectedConversation(current => {
              if (current && current._id === updatedConv._id) {
                return { ...current, ...updatedConv };
              }
              return current;
            });
          });

          socket.on('new_message', (message) => {
            setMessages(prev => {
              if (selectedConversation && message.conversationId === selectedConversation._id) {
                // Prevent duplicates
                if (!prev.some(m => m._id === message._id)) {
                  return [...prev, message];
                }
              }
              return prev;
            });
          });
        }
      }
    } catch (e) {
      console.error('Socket initialization error:', e);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch Conversations once on mount or status filter change (prevents infinite loop vibration)
  useEffect(() => {
    fetchConversations();
  }, [statusFilter]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await getConversationsAdmin(statusFilter || undefined);
      setConversations(res.data?.conversations || []);
      setErrorMsg('');
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setErrorMsg('Failed to load support conversations.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages only when selectedConversation ID changes
  const selectedConvId = selectedConversation?._id || selectedConversation?.id;
  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
      
      // Join conversation room via socket
      if (socketRef.current) {
        socketRef.current.emit('join_conversation', { conversationId: selectedConvId });
      }
    }
  }, [selectedConvId]);

  const fetchMessages = async (convId) => {
    try {
      setMessagesLoading(true);
      const res = await getConversationMessagesAdmin(convId);
      setMessages(res.data?.messages || []);
      
      // Mark as read
      await markConversationReadAdmin(convId);
      
      // Update local unread count
      setConversations(prev => prev.map(c => (c._id === convId || c.id === convId) ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const convId = selectedConversation?._id || selectedConversation?.id;
    if (!inputText.trim() || !convId) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      // Send via socket if connected, or fallback/alongside API
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('send_message', {
          conversationId: convId,
          text: textToSend
        });
      } else {
        const res = await sendConversationMessageAdmin(convId, textToSend);
        if (res.data?.message) {
          setMessages(prev => [...prev, res.data.message]);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setErrorMsg('Failed to send message.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const convId = selectedConversation?._id || selectedConversation?.id;
    if (!convId) return;
    try {
      const res = await updateConversationStatusAdmin(convId, newStatus);
      if (res.data?.conversation) {
        setSelectedConversation(res.data.conversation);
        setConversations(prev => prev.map(c => (c._id === res.data.conversation._id || c.id === res.data.conversation._id) ? res.data.conversation : c));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!conv.userId) return false;
    const name = `${conv.userId.firstName || ''} ${conv.userId.lastName || ''}`.toLowerCase();
    const email = (conv.userId.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query) || (conv.lastMessage || '').toLowerCase().includes(query);
  });

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminNavbar />
        
        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left Sidebar: Conversations List */}
          <div className={`w-full md:w-96 rounded-2xl border flex flex-col overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-base flex items-center space-x-2">
                  <MessageSquare className="text-blue-500" size={20} />
                  <span>Live Support Chats</span>
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${darkMode ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                  {filteredConversations.length}
                </span>
              </div>

              <div className="relative">
                <Search className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
                <input 
                  type="text"
                  placeholder="Search user or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="flex space-x-2">
                {['', 'active', 'pending', 'closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-semibold capitalize border transition-colors ${
                      statusFilter === st
                        ? 'bg-blue-600 text-white border-blue-600'
                        : (darkMode ? 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-600 hover:text-gray-900')
                    }`}
                  >
                    {st || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading conversations...</p>
              ) : filteredConversations.length === 0 ? (
                <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No support chats found.</p>
              ) : (
                filteredConversations.map(conv => {
                  const isSelected = selectedConversation?._id === conv._id;
                  const user = conv.userId || {};
                  return (
                    <div
                      key={conv._id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 cursor-pointer transition-colors flex items-start space-x-3 ${
                        isSelected 
                          ? (darkMode ? 'bg-blue-900/20 border-l-4 border-blue-500' : 'bg-blue-50/80 border-l-4 border-blue-600')
                          : (darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50')
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-blue-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.firstName?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs truncate">{user.firstName} {user.lastName}</span>
                          <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className={`text-xs truncate mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                            conv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            conv.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                          }`}>
                            {conv.status || 'active'}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Main Chat Area */}
          <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-blue-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                      {selectedConversation.userId?.profileImage ? (
                        <img src={selectedConversation.userId.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{selectedConversation.userId?.firstName?.[0] || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">
                        {selectedConversation.userId?.firstName} {selectedConversation.userId?.lastName}
                      </h3>
                      <p className={`text-xs flex items-center space-x-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="flex items-center space-x-1"><Mail size={12} /><span>{selectedConversation.userId?.email}</span></span>
                        <span>•</span>
                        <span className="flex items-center space-x-1"><Phone size={12} /><span>{selectedConversation.userId?.phone || 'N/A'}</span></span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={selectedConversation.status || 'active'}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold border focus:outline-none ${
                        darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Messages Container */}
                <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-950/40' : 'bg-gray-50/50'}`}>
                  {messagesLoading ? (
                    <p className={`text-xs text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p className={`text-xs text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No messages exchanged yet in this conversation.</p>
                  ) : (
                    messages.map((msg) => {
                      const senderRole = msg.senderRole;
                      const isAdminMsg = senderRole === 'admin' || senderRole === 'superadmin';
                      return (
                        <div key={msg._id || Math.random()} className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center space-x-1 mb-1">
                            <span className={`text-[10px] font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {isAdminMsg ? 'Admin' : `${selectedConversation.userId?.firstName || 'Client'}`}
                            </span>
                            <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                            isAdminMsg 
                              ? 'bg-blue-600 text-white rounded-br-sm' 
                              : (darkMode ? 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200 shadow-sm')
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Message Input Form */}
                <form onSubmit={handleSendMessage} className={`p-4 border-t flex items-center space-x-3 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                  <input 
                    type="text"
                    placeholder="Type your reply as Admin..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={`flex-1 rounded-xl px-4 py-3 text-xs border focus:outline-none focus:border-blue-500 ${
                      darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors flex-shrink-0 shadow-lg shadow-blue-600/20"
                  >
                    <span>Send</span>
                    <Send size={14} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare size={48} className={`mb-3 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                <h3 className="font-bold text-base mb-1">Select a conversation</h3>
                <p className={`text-xs max-w-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Choose a student conversation from the left sidebar to view live chat messages and reply in real time.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
