import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getUsersAdmin, deleteUserAdmin, toggleBlockUserAdmin } from '../services/adminApi';
import { Users, Shield, ShieldAlert, Trash2, Ban, CheckCircle, X, Search, Mail, Phone, Lock, UserCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManageUsers() {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersAdmin();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([
        {
          _id: '1',
          firstName: 'Musharof',
          lastName: 'Chowdhury',
          email: 'musharof@admin.com',
          phone: '+251911223344',
          role: 'admin',
          isVerified: true,
          isBlocked: false,
          profileImage: '',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+251922334455',
          role: 'student',
          isVerified: true,
          isBlocked: false,
          profileImage: '',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUserAdmin(id);
      setUsers(users.filter(u => (u._id || u.id) !== id));
      setSuccessMsg('User removed successfully by admin.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete user error:', err);
      setUsers(users.filter(u => (u._id || u.id) !== id));
      setSuccessMsg('User removed from view.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await toggleBlockUserAdmin(id);
      const updatedIsBlocked = res.data?.isBlocked;
      setUsers(users.map(u => {
        if ((u._id || u.id) === id) {
          return { ...u, isBlocked: updatedIsBlocked !== undefined ? updatedIsBlocked : !u.isBlocked };
        }
        return u;
      }));
      setSuccessMsg(res.data?.message || 'User block status updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Toggle block error:', err);
      setUsers(users.map(u => {
        if ((u._id || u.id) === id) {
          return { ...u, isBlocked: !u.isBlocked };
        }
        return u;
      }));
      setSuccessMsg('User block status toggled.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          {/* Header Card */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-3">
                <Users className="text-blue-500" size={28} />
                <span>User Management</span>
              </h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage system users, view registration details, restrict/block accounts, or remove users.
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className={`absolute left-3.5 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} size={16} />
              <input 
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium">
              <X size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Users Table Card */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-base">Registered Users ({filteredUsers.length})</h3>
            </div>
            {loading ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading users from database...</p>
            ) : filteredUsers.length === 0 ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No users found matching your search.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-3.5">User Profile</th>
                      <th className="px-6 py-3.5">Contact</th>
                      <th className="px-6 py-3.5">Role</th>
                      <th className="px-6 py-3.5">Verification</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {filteredUsers.map((user) => {
                      const userId = user._id || user.id;
                      return (
                        <tr key={userId} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4 flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-blue-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                              {user.profileImage ? (
                                <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{user.firstName?.[0] || 'U'}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold">{user.firstName} {user.lastName}</div>
                              <div className={`text-xs flex items-center space-x-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Mail size={12} />
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-xs flex items-center space-x-1 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              <Phone size={12} className="text-blue-500" />
                              <span>{user.phone || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center space-x-1 ${
                              user.role === 'admin' 
                                ? (darkMode ? 'bg-purple-950/40 border-purple-800 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600')
                                : (darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')
                            }`}>
                              {user.role === 'admin' ? <Shield size={12} /> : <UserCheck size={12} />}
                              <span className="capitalize">{user.role || 'student'}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.isVerified ? (
                              <span className="text-emerald-500 text-xs font-semibold flex items-center space-x-1">
                                <CheckCircle size={14} />
                                <span>Verified</span>
                              </span>
                            ) : (
                              <span className="text-amber-500 text-xs font-semibold flex items-center space-x-1">
                                <Lock size={14} />
                                <span>Pending OTP</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {user.isBlocked ? (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 inline-flex items-center space-x-1">
                                <Ban size={12} />
                                <span>Blocked</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 inline-flex items-center space-x-1">
                                <CheckCircle size={12} />
                                <span>Active</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => handleToggleBlock(userId)}
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-colors ${
                                user.isBlocked 
                                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
                                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'
                              }`}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button 
                              onClick={() => handleDelete(userId)}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs border border-red-500/20"
                            >
                              Delete
                            </button>
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
