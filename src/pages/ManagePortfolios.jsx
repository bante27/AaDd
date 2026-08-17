import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getPortfoliosAdmin, createPortfolioAdmin, updatePortfolioAdmin, deletePortfolioAdmin } from '../services/adminApi';
import { Plus, Trash2, Edit2, X, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManagePortfolios() {
  const { darkMode } = useTheme();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Commercial');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['Commercial', 'YouTube', 'Music Video', 'Documentary', 'VFX'];

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const res = await getPortfoliosAdmin();
      const items = res.data.portfolioItems || res.data || [];
      setPortfolios(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setClient('');
    setCategory('Commercial');
    setYoutubeUrl('');
    setCompletionDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setClient(item.client || '');
    setCategory(item.category || 'Commercial');
    setYoutubeUrl(item.youtubeUrl || '');
    setCompletionDate(item.completionDate || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { title, description, client, category, youtubeUrl, completionDate };
      if (editingItem) {
        await updatePortfolioAdmin(editingItem._id || editingItem.id, payload);
        setSuccessMsg('Portfolio item updated successfully.');
      } else {
        await createPortfolioAdmin(payload);
        setSuccessMsg('Portfolio item created successfully.');
      }
      setIsModalOpen(false);
      fetchPortfolios();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio item?')) return;
    try {
      await deletePortfolioAdmin(id);
      setSuccessMsg('Portfolio item removed successfully.');
      fetchPortfolios();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const filteredPortfolios = portfolios.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          
          <div className={`p-6 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Portfolio Management</h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage database records for client video productions.</p>
            </div>
            <button 
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Portfolio</span>
            </button>
          </div>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl text-sm font-medium">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Portfolio Table & Search Panel */}
          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <h3 className="font-bold text-base">Portfolio Records ({filteredPortfolios.length})</h3>
              <div className="relative w-full md:w-80">
                <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
            </div>

            {loading ? (
              <div className={`p-12 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading database portfolios...</div>
            ) : filteredPortfolios.length === 0 ? (
              <div className={`p-12 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No portfolio items found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Client</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {filteredPortfolios.map((item) => (
                      <tr key={item._id || item.id} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 font-bold">{item.title}</td>
                        <td className={`px-6 py-4 text-xs font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{item.client || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                            {item.category || 'General'}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.completionDate || 'N/A'}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleOpenEdit(item)} 
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold text-xs border border-blue-500/20"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id || item.id)} 
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs border border-red-500/20"
                            title="Delete"
                          >
                            Delete
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border p-6 relative shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">
              {editingItem ? 'Edit Portfolio Item' : 'Create Portfolio Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Title</label>
                <input 
                  type="text" 
                  required
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Commercial TVC Ad"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Client</label>
                <input 
                  type="text" 
                  value={client} 
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Dashen Bank"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>YouTube URL</label>
                <input 
                  type="text" 
                  value={youtubeUrl} 
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Completion Date</label>
                <input 
                  type="text" 
                  value={completionDate} 
                  onChange={(e) => setCompletionDate(e.target.value)}
                  placeholder="2026 or Jan 2026"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
                <textarea 
                  rows={3}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project details and scope..."
                  className={`w-full rounded-xl p-3.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm">
                  {editingItem ? 'Save Changes' : 'Publish Portfolio'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-5 py-2.5 rounded-xl border font-semibold text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
