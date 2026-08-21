import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getUsersAdmin, deleteUserAdmin, toggleBlockUserAdmin, updateUserRoleAdmin } from '../services/adminApi';
import { Users, Shield, ShieldAlert, Trash2, Ban, CheckCircle, X, Search, Mail, Phone, Lock, UserCheck, Eye, UserPlus, UserMinus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManageUsers() {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersAdmin();
      setUsers(res.data || []);
      setErrorMsg('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorMsg('Failed to load users from database.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user permanently?')) return;
    try {
      await deleteUserAdmin(id);
      setUsers(users.filter(u => (u._id || u.id) !== id));
      setSuccessMsg('User removed successfully from database.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete user error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to delete user.');
      setTimeout(() => setErrorMsg(''), 4000);
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
      setErrorMsg(err.response?.data?.message || 'Failed to update block status.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleToggleAdminRole = async (user) => {
    const userId = user._id || user.id;
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      const res = await updateUserRoleAdmin(userId, newRole);
      setUsers(users.map(u => {
        if ((u._id || u.id) === userId) {
          return { ...u, role: newRole };
        }
        return u;
      }));
      setSuccessMsg(res.data?.message || `User role successfully updated to ${newRole}`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Toggle admin role error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update user role.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
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
                Manage registered users, make/remove admin privileges, block/unblock accounts, or delete users.
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
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No users found in database.</p>
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
                      const isAdmin = user.role === 'admin' || user.role === 'superadmin';
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
                              isAdmin
                                ? (darkMode ? 'bg-purple-950/40 border-purple-800 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600')
                                : (darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')
                            }`}>
                              {isAdmin ? <Shield size={12} /> : <UserCheck size={12} />}
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
                              onClick={() => handleViewUser(user)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold text-xs border border-blue-500/20 inline-flex items-center space-x-1"
                              title="View Details"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                            <button 
                              onClick={() => handleToggleAdminRole(user)}
                              className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs border transition-colors inline-flex items-center space-x-1 ${
                                isAdmin 
                                  ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 border-purple-500/20' 
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
                              }`}
                              title={isAdmin ? 'Remove Admin' : 'Make Admin'}
                            >
                              {isAdmin ? <UserMinus size={12} /> : <UserPlus size={12} />}
                              <span>{isAdmin ? 'Remove Admin' : 'Make Admin'}</span>
                            </button>
                            <button 
                              onClick={() => handleToggleBlock(userId)}
                              className={`px-2.5 py-1.5 rounded-lg font-semibold text-xs border transition-colors ${
                                user.isBlocked 
                                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20'
                                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20'
                              }`}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button 
                              onClick={() => handleDelete(userId)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs border border-red-500/20"
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

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 relative shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center font-bold text-xl text-blue-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                {selectedUser.profileImage ? (
                  <img src={selectedUser.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{selectedUser.firstName?.[0] || 'U'}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {selectedUser._id || selectedUser.id}</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Email Address</span>
                <span className="font-medium">{selectedUser.email}</span>
              </div>
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Phone Number</span>
                <span className="font-medium">{selectedUser.phone || 'N/A'}</span>
              </div>
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Account Role</span>
                <span className="font-bold capitalize text-blue-500">{selectedUser.role || 'student'}</span>
              </div>
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Email Verification</span>
                <span className={selectedUser.isVerified ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                  {selectedUser.isVerified ? 'Verified' : 'Pending OTP'}
                </span>
              </div>
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Account Status</span>
                <span className={selectedUser.isBlocked ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>
                  {selectedUser.isBlocked ? 'Blocked / Restricted' : 'Active'}
                </span>
              </div>
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Enrolled Courses</span>
                <span className="font-medium">{selectedUser.enrolledCourses?.length || 0} courses</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
