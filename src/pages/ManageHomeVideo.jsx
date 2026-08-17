import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { updateHomeVideoAdmin } from '../services/adminApi';
import { useTheme } from '../context/ThemeContext';
import { Video, Upload, CheckCircle, X } from 'lucide-react';

export default function ManageHomeVideo() {
  const { darkMode } = useTheme();
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeUrl2, setYoutubeUrl2] = useState('');
  const [bunnyVideoId, setBunnyVideoId] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');

      const formData = new FormData();
      formData.append('youtubeUrl', youtubeUrl);
      formData.append('youtubeUrl2', youtubeUrl2);
      formData.append('bunnyVideoId', bunnyVideoId);
      if (videoFile) formData.append('video', videoFile);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      await updateHomeVideoAdmin(formData);
      setSuccessMsg('Hero video updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to update hero video.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
              <Video className="text-blue-500" size={20} />
              <span>Hero Video Management</span>
            </h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage homepage background or featured video streams.</p>
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium flex items-center space-x-2"><X size={16} /><span>{error}</span></div>}
          {successMsg && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium flex items-center space-x-2"><CheckCircle size={16} /><span>{successMsg}</span></div>}

          <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>YouTube URL 1</label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>YouTube URL 2 (Optional)</label>
                <input
                  type="text"
                  value={youtubeUrl2}
                  onChange={(e) => setYoutubeUrl2(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bunny.net Video ID</label>
                <input
                  type="text"
                  value={bunnyVideoId}
                  onChange={(e) => setBunnyVideoId(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-sm border font-mono focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  placeholder="e.g. abc12345-6789-..."
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Hero Video'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
