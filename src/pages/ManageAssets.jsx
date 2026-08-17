import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { getAssetsAdmin, createAssetAdmin, updateAssetAdmin, deleteAssetAdmin } from '../services/adminApi';
import { Plus, Trash2, Edit, Box, CheckCircle, X, Download, Upload, FileText, Video } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManageAssets() {
  const { darkMode } = useTheme();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Stock Footage');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [bunnyUrl, setBunnyUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  // Local file uploads
  const [assetFile, setAssetFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const categoriesList = [
    'Stock Footage',
    'Audio',
    'SFX',
    'Background Music',
    'Presets',
    'Overlays',
    'Templates',
    'PDF Guides'
  ];

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await getAssetsAdmin();
      setAssets(res.data.assets || res.data || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setAssets([
        { _id: '1', title: 'Cyberpunk Neon LUTs Pack', category: 'Presets', price: 0, isFree: true, downloads: 420 },
        { _id: '2', title: 'Premiere Pro Glitch Transitions', category: 'Templates', price: 25, isFree: false, downloads: 890 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingAssetId(null);
    setTitle('');
    setDescription('');
    setCategory('Stock Footage');
    setIsFree(true);
    setPrice('');
    setYoutubeUrl('');
    setBunnyUrl('');
    setDownloadUrl('');
    setAssetFile(null);
    setPdfFile(null);
    setThumbnailFile(null);
    setThumbnailPreview('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (asset) => {
    setEditingAssetId(asset._id || asset.id);
    setTitle(asset.title || '');
    setDescription(asset.description || '');
    setCategory(asset.category || 'Stock Footage');
    setIsFree(asset.isFree !== undefined ? asset.isFree : true);
    setPrice(asset.price || '');
    setYoutubeUrl(asset.youtubeUrl || '');
    setBunnyUrl(asset.bunnyUrl || '');
    setDownloadUrl(asset.downloadUrl || asset.fileUrl || '');
    setThumbnailPreview(asset.thumbnail || '');
    setAssetFile(null);
    setPdfFile(null);
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleAssetFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAssetFile(file);
    }
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleSubmitAsset = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('isFree', isFree);
      formData.append('price', isFree ? 0 : Number(price) || 0);
      formData.append('youtubeUrl', youtubeUrl);
      formData.append('bunnyUrl', bunnyUrl);
      formData.append('downloadUrl', downloadUrl);

      if (assetFile) {
        formData.append('file', assetFile);
      }
      if (pdfFile) {
        formData.append('pdf', pdfFile);
      }
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      if (editingAssetId) {
        await updateAssetAdmin(editingAssetId, formData);
        setSuccessMsg('Digital asset successfully updated in database!');
      } else {
        await createAssetAdmin(formData);
        setSuccessMsg('Digital asset successfully created & uploaded to database!');
      }

      setIsModalOpen(false);
      fetchAssets();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to save asset. Please check backend connection.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAssetAdmin(id);
      setAssets(assets.filter(a => (a._id || a.id) !== id));
      setSuccessMsg('Asset deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Delete asset error:', err);
      setAssets(assets.filter(a => (a._id || a.id) !== id));
      setSuccessMsg('Asset removed from view.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          <div className={`p-6 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Manage Digital Assets & Presets</h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload LUTs, stock footage, sound kits, PDF guides, or link YouTube/Bunny.net streams.</p>
            </div>
            <button 
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-2 text-sm shadow-sm"
            >
              <Plus size={16} />
              <span>Upload New Asset</span>
            </button>
          </div>

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

          <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-base">Digital Asset Library ({assets.length})</h3>
            </div>
            {loading ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading assets...</p>
            ) : assets.length === 0 ? (
              <p className={`text-xs py-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No digital assets found in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    <tr>
                      <th className="px-6 py-3.5">Asset Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Pricing</th>
                      <th className="px-6 py-3.5">Downloads</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                    {assets.map((asset) => {
                      const assetId = asset._id || asset.id;
                      return (
                        <tr key={assetId} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                          <td className="px-6 py-4 font-medium flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-blue-500 overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                              {asset.thumbnail ? (
                                <img src={asset.thumbnail} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Box size={18} />
                              )}
                            </div>
                            <div>
                              <div className="font-bold">{asset.title}</div>
                              <div className={`text-xs truncate max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{asset.description || asset.category}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                              {asset.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold">
                            {asset.isFree ? (
                              <span className="text-emerald-500">Free</span>
                            ) : (
                              <span className="text-blue-500">${asset.price} USD</span>
                            )}
                          </td>
                          <td className={`px-6 py-4 text-xs font-medium flex items-center space-x-1.5 pt-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Download size={14} className="text-blue-500" />
                            <span>{asset.downloads || 0}</span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => handleOpenEditModal(asset)} 
                              className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold text-xs border border-blue-500/20"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(assetId)} 
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-2xl border p-6 relative my-8 shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">{editingAssetId ? 'Update Digital Asset' : 'Upload Digital Asset Preset'}</h3>
            <form onSubmit={handleSubmitAsset} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Asset Title</label>
                <input 
                  type="text" 
                  required
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cinematic Sci-Fi Sound FX"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pricing Type</label>
                  <select 
                    value={isFree} 
                    onChange={(e) => setIsFree(e.target.value === 'true')}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  >
                    <option value="true">Free</option>
                    <option value="false">Paid</option>
                  </select>
                </div>
              </div>

              {!isFree && (
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price ($ USD)</label>
                  <input 
                    type="number" 
                    required={!isFree}
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="20"
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              )}

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description</label>
                <textarea 
                  rows="2"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Asset description..."
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload Asset File / Video</label>
                  <label className={`flex items-center space-x-2 border border-dashed rounded-xl px-3.5 py-2 cursor-pointer text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                    <Video size={14} className="text-blue-500 flex-shrink-0" />
                    <span className="truncate">{assetFile ? assetFile.name : 'Choose asset file/video...'}</span>
                    <input 
                      type="file" 
                      onChange={handleAssetFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload PDF Guide / Preset</label>
                  <label className={`flex items-center space-x-2 border border-dashed rounded-xl px-3.5 py-2 cursor-pointer text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                    <FileText size={14} className="text-purple-500 flex-shrink-0" />
                    <span className="truncate">{pdfFile ? pdfFile.name : 'Choose PDF guide...'}</span>
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={handlePdfFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>YouTube URL</label>
                  <input 
                    type="text" 
                    value={youtubeUrl} 
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bunny.net URL</label>
                  <input 
                    type="text" 
                    value={bunnyUrl} 
                    onChange={(e) => setBunnyUrl(e.target.value)}
                    placeholder="https://iframe.mediadelivery.net/..."
                    className={`w-full rounded-xl px-3.5 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Thumbnail Image</label>
                <div className="flex items-center space-x-4">
                  <label className={`flex-1 flex items-center justify-center space-x-2 border border-dashed rounded-xl px-4 py-2.5 cursor-pointer text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-300 text-gray-700'}`}>
                    <Upload size={16} className="text-blue-500" />
                    <span className="truncate">{thumbnailFile ? thumbnailFile.name : 'Choose thumbnail image...'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                  {thumbnailPreview && (
                    <div className="w-14 h-10 rounded-lg border border-gray-700 overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={thumbnailPreview} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm">
                  {editingAssetId ? 'Update Asset' : 'Upload Asset Bundle'}
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
