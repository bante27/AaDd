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
import { MessageSquare, Send, Search, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get Auth Token
  const getToken = () => {
    try {
      const u = localStorage.getItem('userInfo');
      if (u && u !== 'undefined') {
        const parsed = JSON.parse(u);
        return parsed?.token;
      }
    } catch {}
    return null;
  };

  // Initialize Admin Socket Connection
  useEffect(() => {
    try {
      const token = getToken();
      if (token) {
        const socket = io('http://localhost:5000', {
          auth: { token },
          transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Admin socket connected:', socket.id);
        });

        socket.on('conversation_updated', (updatedConv) => {
          setConversations(prev => {
            const index = prev.findIndex(c => c._id === updatedConv._id || c.id === updatedConv._id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = { ...updated[index], ...updatedConv };
              return updated.sort((a, b) => new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0));
            } else {
              return [updatedConv, ...prev];
            }
          });

          setSelectedConversation(current => {
            if (current && (current._id === updatedConv._id || current.id === updatedConv._id)) {
              return { ...current, ...updatedConv };
            }
            return current;
          });
        });

        socket.on('new_message', (message) => {
          setMessages(prev => {
            const convId = selectedConversation?._id || selectedConversation?.id;
            if (convId && message.conversationId === convId) {
              if (!prev.some(m => m._id === message._id)) {
                return [...prev, message];
              }
            }
            return prev;
          });
        });

        socket.on('message_deleted', ({ messageId }) => {
          setMessages(prev => prev.map(m => m._id === messageId ? { ...m, text: 'This message was deleted', deletedAt: new Date() } : m));
        });

        socket.on('typing_start', ({ role }) => {
          if (role === 'student' || role === 'user') {
            setIsTyping(true);
          }
        });

        socket.on('typing_stop', ({ role }) => {
          if (role === 'student' || role === 'user') {
            setIsTyping(false);
          }
        });
      }
    } catch (e) {
      console.error('Socket initialization error:', e);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [selectedConversation]);

  // Fetch Conversations on mount or filter change
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

  // Fetch messages when selectedConversation ID changes
  const selectedConvId = selectedConversation?._id || selectedConversation?.id;
  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
      
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
      await markConversationReadAdmin(convId);
      setConversations(prev => prev.map(c => (c._id === convId || c.id === convId) ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    const convId = selectedConversation?._id || selectedConversation?.id;
    if (!convId || !socketRef.current) return;

    socketRef.current.emit('typing_start', { conversationId: convId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing_stop', { conversationId: convId });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const convId = selectedConversation?._id || selectedConversation?.id;
    if (!inputText.trim() || !convId) return;

    const textToSend = inputText.trim();
    setInputText('');

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('typing_stop', { conversationId: convId });
    }

    try {
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

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message for everyone?')) return;
    const convId = selectedConversation?._id || selectedConversation?.id;
    try {
      const token = getToken();
      await axios.patch(`${API_BASE_URL}/conversations/messages/${messageId}/delete`, { deleteType: 'everyone' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, text: 'This message was deleted', deletedAt: new Date() } : m));

      if (socketRef.current) {
        socketRef.current.emit('delete_message', { messageId, conversationId: convId, deleteType: 'everyone' });
      }
    } catch (err) {
      console.error('Delete message error:', err);
      setErrorMsg('Failed to delete message.');
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
          {/* Left Column: Client List (Telegram Chat List Style) */}
          <div className={`w-full md:w-80 rounded-2xl border flex flex-col overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-sm flex items-center space-x-2">
                  <MessageSquare className="text-orange-500" size={18} />
                  <span>Client Chats</span>
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${darkMode ? 'bg-orange-950 text-orange-400 border border-orange-800' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                  {filteredConversations.length}
                </span>
              </div>

              <div className="relative">
                <Search className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
                <input 
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full rounded-xl pl-8 pr-3 py-2 text-xs border focus:outline-none focus:border-orange-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="flex space-x-1.5">
                {['', 'active', 'pending', 'closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-semibold capitalize border transition-colors ${
                      statusFilter === st
                        ? 'bg-orange-600 text-white border-orange-600'
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
                <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading chats...</p>
              ) : filteredConversations.length === 0 ? (
                <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No clients found.</p>
              ) : (
                filteredConversations.map(conv => {
                  const isSelected = selectedConvId === (conv._id || conv.id);
                  const user = conv.userId || {};
                  return (
                    <div
                      key={conv._id || conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-3.5 cursor-pointer transition-colors flex items-start space-x-3 ${
                        isSelected 
                          ? (darkMode ? 'bg-orange-950/30 border-l-4 border-orange-500' : 'bg-orange-50/80 border-l-4 border-orange-600')
                          : (darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50')
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-orange-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-200'}`}>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.firstName?.[0] || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-xs truncate">{user.firstName} {user.lastName}</span>
                          <span className={`text-[9px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className={`text-[11px] truncate mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {conv.lastMessage || 'No messages yet'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${
                            conv.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            conv.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                          }`}>
                            {conv.status || 'active'}
                          </span>
                          {conv.unreadCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-orange-600 text-white font-bold text-[9px] flex items-center justify-center">
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

          {/* Right Column: Telegram Style Active Conversation (Without Rightmost Profile Panel) */}
          <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-orange-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-200'}`}>
                      {selectedConversation.userId?.profileImage ? (
                        <img src={selectedConversation.userId.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span>{selectedConversation.userId?.firstName?.[0] || 'U'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs">
                        {selectedConversation.userId?.firstName} {selectedConversation.userId?.lastName}
                      </h3>
                      <p className={`text-[10px] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Online Support Chat</p>
                    </div>
                  </div>

                  <select
                    value={selectedConversation.status || 'active'}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold border focus:outline-none ${
                      darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Messages Bubble List (Telegram Style: Client Left, Admin Right) */}
                <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-950/40' : 'bg-gray-50/50'}`}>
                  {messagesLoading ? (
                    <p className={`text-xs text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p className={`text-xs text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No messages exchanged yet.</p>
                  ) : (
                    messages.map((msg) => {
                      const senderRole = msg.senderRole;
                      const isClientMsg = senderRole === 'student' || senderRole === 'user' || (selectedConversation.userId && (msg.senderId === selectedConversation.userId._id || msg.senderId?._id === selectedConversation.userId._id));
                      return (
                        <div key={msg._id || Math.random()} className={`flex flex-col group relative ${isClientMsg ? 'items-start' : 'items-end'}`}>
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span className={`text-[10px] font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {isClientMsg ? `${selectedConversation.userId?.firstName || 'Client'}` : 'Admin (You)'}
                            </span>
                            <span className={`text-[9px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="relative group flex items-center space-x-2">
                            <div className={`max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                              isClientMsg 
                                ? (darkMode ? 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700' : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200 shadow-sm')
                                : 'bg-orange-600 text-white rounded-br-sm'
                            }`}>
                              {msg.text}
                            </div>
                            <button 
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700"
                              title="Delete Message"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Telegram Typing Indicator Bubble */}
                  {isTyping && (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center space-x-1.5 mb-1">
                        <span className={`text-[10px] font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {selectedConversation.userId?.firstName || 'Client'} is typing...
                        </span>
                      </div>
                      <div className={`rounded-2xl px-4 py-3 text-xs flex items-center space-x-1.5 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Message Input */}
                <form onSubmit={handleSendMessage} className={`p-3.5 border-t flex items-center space-x-3 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                  <input 
                    type="text"
                    placeholder="Type your reply to client..."
                    value={inputText}
                    onChange={handleInputChange}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-xs border focus:outline-none focus:border-orange-500 ${
                      darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors flex-shrink-0 shadow-lg shadow-orange-600/20"
                  >
                    <span>Send</span>
                    <Send size={13} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare size={48} className={`mb-3 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                <h3 className="font-bold text-sm mb-1">Select a client chat</h3>
                <p className={`text-xs max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Choose a client conversation from the left sidebar to open the Telegram-style chat.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
