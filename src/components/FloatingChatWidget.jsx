import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Minus, Maximize2 } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_BASE_URL = 'https://mrhaile-lms-hub.onrender.com/api';

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [conversationId, setConversationId] = useState(null);
  
  // Dragging state
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 90 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const u = localStorage.getItem('userInfo');
      return u && u !== 'undefined' ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const user = getUserInfo();

  // Handle Dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('button') && !e.target.closest('.drag-handle')) return;
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(20, Math.min(window.innerWidth - 70, e.clientX - offsetRef.current.x));
      const newY = Math.max(20, Math.min(window.innerHeight - 70, e.clientY - offsetRef.current.y));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Setup Socket & Fetch initial conversation/messages
  useEffect(() => {
    if (!user || !user.token) return;

    // Connect socket
    const socket = io('https://mrhaile-lms-hub.onrender.com', {
      auth: { token: user.token },
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Floating chat connected:', socket.id);
    });

    socket.on('new_message', (msg) => {
      setMessages(prev => {
        if (!prev.some(m => m._id === msg._id)) {
          return [...prev, msg];
        }
        return prev;
      });

      if (!isOpen) {
        setUnreadCount(c => c + 1);
      }
    });

    // Fetch conversation & messages via REST
    const fetchChatData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const convRes = await axios.get(`${API_BASE_URL}/conversations`, config);
        
        let conv = convRes.data.conversation;
        if (!conv && convRes.data.conversations && convRes.data.conversations.length > 0) {
          conv = convRes.data.conversations[0];
        }

        if (conv) {
          setConversationId(conv._id);
          socket.emit('join_conversation', { conversationId: conv._id });

          const msgRes = await axios.get(`${API_BASE_URL}/conversations/${conv._id}/messages`, config);
          setMessages(msgRes.data.messages || []);
        }
      } catch (err) {
        console.error('Error fetching chat widget data:', err);
      }
    };

    fetchChatData();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    try {
      if (socketRef.current && socketRef.current.connected && conversationId) {
        socketRef.current.emit('send_message', { conversationId, text });
      } else if (conversationId) {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.post(`${API_BASE_URL}/conversations/${conversationId}/messages`, { text }, config);
        if (res.data?.message) {
          setMessages(prev => [...prev, res.data.message]);
        }
      }
    } catch (err) {
      console.error('Failed to send message via widget:', err);
    }
  };

  if (!user) return null; // Only show for logged in users

  return (
    <div className="fixed z-50 select-none" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {/* Chat Window / Popup */}
      {isOpen && (
        <div className={`absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-all ${isMinimized ? 'h-14' : ''}`}>
          
          {/* Header */}
          <div 
            onMouseDown={handleMouseDown}
            className="drag-handle bg-orange-600 text-white px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-bold text-xs uppercase tracking-wider">Live Support Chat</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-orange-700 rounded-lg text-white">
                <Minus size={14} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-orange-700 rounded-lg text-white">
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-950/50">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">
                    <p className="font-bold mb-1">Hello! How can we help you?</p>
                    <p>Send a message and our team/bot will reply shortly.</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId?._id === user._id || msg.senderId === user._id;
                    return (
                      <div key={msg._id || Math.random()} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                          isMe 
                            ? 'bg-orange-600 text-white rounded-br-sm' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-0.5 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center space-x-2">
                <input 
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
                <button 
                  type="submit"
                  className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-600/20"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button (Movable Orange Icon) */}
      <div 
        onMouseDown={handleMouseDown}
        onClick={() => { if (!isDragging) setIsOpen(!isOpen); }}
        className="w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-xl cursor-pointer relative transition-transform hover:scale-105 active:scale-95"
        title="Live Support Chat"
      >
        <MessageSquare size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-gray-900">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
}
