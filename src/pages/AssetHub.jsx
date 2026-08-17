import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AssetCard from '../components/AssetCard';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';

export default function AssetHub() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await apiService.getAssets();
      setAssets(res.assets || res || []);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load digital assets from database.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(a => 
    (a.title && a.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-cyber-dark text-slate-100 flex flex-col">
      <Navbar />

      <section className="py-16 px-6 max-w-7xl mx-auto w-full flex-1 space-y-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              Digital Preset Store
            </span>
            <h1 className="text-4xl font-extrabold text-white mt-2">Asset Hub</h1>
            <p className="text-slate-400 text-sm mt-1">Professional grade LUTs, transitions, sound fx, and templates.</p>
          </div>

          <div className="w-full md:w-96 relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assets, LUTs, sound fx..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader className="animate-spin text-cyan-400" size={36} />
            <p className="text-slate-400 text-sm">Loading database digital assets...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-center text-sm">
            {error}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm glass-card rounded-2xl">
            No digital assets found in database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredAssets.map((asset) => (
              <AssetCard 
                key={asset._id || asset.id} 
                title={asset.title}
                category={asset.category}
                price={asset.price}
                rating={asset.rating || '4.9'}
                downloads={asset.downloads || '1k'}
                thumbnail={asset.thumbnail}
                onDownload={() => navigate('/checkout-success')} 
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
