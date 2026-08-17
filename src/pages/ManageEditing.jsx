import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import { 
  getEditingPlansAdmin, 
  createEditingPlanAdmin, 
  updateEditingPlanAdmin, 
  deleteEditingPlanAdmin,
  getEditingOrdersAdmin, 
  updateEditingOrderStatusAdmin 
} from '../services/adminApi';
import { Scissors, Plus, CheckCircle, Trash2, Edit3, X, Check, Search, Layers, ShoppingBag, Star, Code } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ManageEditing() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'orders'
  
  const [plans, setPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Plan Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Plan Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [billingType, setBillingType] = useState('per month');
  const [features, setFeatures] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [plansRes, ordersRes] = await Promise.allSettled([
        getEditingPlansAdmin(),
        getEditingOrdersAdmin()
      ]);
      
      let fetchedPlans = [];
      let fetchedOrders = [];

      if (plansRes.status === 'fulfilled') {
        const resData = plansRes.value.data;
        fetchedPlans = resData.plans || resData.editingPlans || resData || [];
      }

      if (ordersRes.status === 'fulfilled') {
        const resData = ordersRes.value.data;
        fetchedOrders = resData.orders || resData.editingOrders || resData || [];
      }

      setPlans(Array.isArray(fetchedPlans) ? fetchedPlans : []);
      setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
    } catch (err) {
      console.error('Error fetching editing data:', err);
      setError('Failed to load editing plans and orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setBillingType('per month');
    setFeatures('');
    setImage('');
    setIsActive(true);
    setIsPopular(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setTitle(plan.title || '');
    setDescription(plan.description || '');
    setPrice(plan.price !== undefined ? plan.price : '');
    setBillingType(plan.billingType || 'per month');
    setFeatures(Array.isArray(plan.features) ? plan.features.join(', ') : (plan.features || ''));
    setImage(plan.image || '');
    setIsActive(plan.isActive !== undefined ? plan.isActive : true);
    setIsPopular(plan.isPopular !== undefined ? plan.isPopular : false);
    setIsModalOpen(true);
  };

  const getCurrentPayload = () => ({
    title,
    description,
    price: price !== '' ? Number(price) : 0,
    billingType,
    features: features ? features.split(',').map(f => f.trim()).filter(Boolean) : [],
    image: image || undefined,
    isActive,
    isPopular
  });

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = getCurrentPayload();

      if (editingPlan) {
        await updateEditingPlanAdmin(editingPlan._id || editingPlan.id, payload);
        setSuccessMsg('Editing plan updated successfully!');
      } else {
        await createEditingPlanAdmin(payload);
        setSuccessMsg('Editing plan created successfully!');
      }

      setIsModalOpen(false);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save editing plan');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this editing plan?')) return;
    try {
      await deleteEditingPlanAdmin(id);
      setSuccessMsg('Editing plan deleted successfully.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to delete editing plan');
      setTimeout(() => setError(''), 4000);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateEditingOrderStatusAdmin(orderId, newStatus);
      setSuccessMsg(`Order status updated to ${newStatus}`);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to update order status');
      setTimeout(() => setError(''), 4000);
    }
  };

  const filteredPlans = plans.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.billingType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.planTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-8 space-y-6 flex-1">
          
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight flex items-center space-x-2">
                <Scissors className="text-blue-500" size={24} />
                <span>Editing Plans & Orders Hub</span>
              </h1>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage professional video editing pricing packages and monitor client orders.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center space-x-2 ${
                  activeTab === 'plans' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : darkMode 
                      ? 'bg-gray-900 text-gray-300 border border-gray-800' 
                      : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <Layers size={14} />
                <span>Editing Plans ({plans.length})</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center space-x-2 ${
                  activeTab === 'orders' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : darkMode 
                      ? 'bg-gray-900 text-gray-300 border border-gray-800' 
                      : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <ShoppingBag size={14} />
                <span>Customer Orders ({orders.length})</span>
              </button>
            </div>
          </div>

          {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium">{error}</div>}
          {successMsg && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm font-medium">{successMsg}</div>}

          {/* Search & Action Toolbar */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'plans' ? 'editing plans...' : 'orders...'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              />
            </div>

            {activeTab === 'plans' && (
              <button
                onClick={handleOpenCreate}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center space-x-2 text-xs shadow-sm"
              >
                <Plus size={16} />
                <span>Create Editing Plan</span>
              </button>
            )}
          </div>

          {/* PLANS TAB CONTENT */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {loading ? (
                <p className={`text-center py-12 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading editing plans...</p>
              ) : filteredPlans.length === 0 ? (
                <div className={`rounded-2xl p-12 text-center border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <Scissors className="mx-auto text-gray-400 mb-3" size={40} />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No editing service plans found.</p>
                  <button onClick={handleOpenCreate} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs">
                    Create Your First Plan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <div key={plan._id || plan.id} className={`rounded-2xl p-6 border relative flex flex-col justify-between ${
                      plan.isPopular 
                        ? (darkMode ? 'bg-gray-900 border-blue-500 shadow-sm' : 'bg-white border-blue-500 shadow-sm') 
                        : (darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm')
                    }`}>
                      {plan.isPopular && (
                        <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center space-x-1">
                          <Star size={10} fill="white" />
                          <span>POPULAR</span>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {plan.image && (
                          <div className="h-32 rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                            <img src={plan.image} alt={plan.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                              {plan.billingType || 'per month'}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${plan.isActive !== false ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                              {plan.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <h3 className="text-base font-bold">{plan.title}</h3>
                          <p className="text-xl font-black text-emerald-500 mt-1">${plan.price} <span className="text-xs font-normal text-gray-400">({plan.billingType})</span></p>
                          <p className={`text-xs mt-1.5 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</p>
                        </div>

                        {plan.features && plan.features.length > 0 && (
                          <div className={`space-y-1 pt-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Features:</p>
                            <ul className="space-y-1">
                              {plan.features.slice(0, 3).map((feat, idx) => (
                                <li key={idx} className={`text-xs flex items-center space-x-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  <Check size={12} className="text-blue-500 shrink-0" />
                                  <span className="truncate">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className={`pt-4 mt-4 border-t flex items-center justify-end space-x-2 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-semibold text-xs border border-blue-500/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan._id || plan.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs border border-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB CONTENT */}
          {activeTab === 'orders' && (
            <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <h3 className="text-base font-bold mb-4">Customer Editing Orders & Payment Tracking</h3>
              {loading ? (
                <p className={`text-xs py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p className={`text-xs py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No customer editing orders found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className={`uppercase text-[11px] font-bold tracking-wider border-b ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                      <tr>
                        <th className="py-3 px-4">Order / Tx Ref</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Plan Title</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                      {filteredOrders.map((order) => (
                        <tr key={order._id || order.id} className={`transition-none ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <span className="text-blue-500 font-bold block">{order.tx_ref || (order._id || order.id).slice(-8)}</span>
                            <span className="text-gray-400 text-[10px]">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold block text-xs">{order.user?.name || 'Client'}</span>
                            <span className="text-gray-400 text-[11px]">{order.user?.email || 'No email'}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-xs">{order.planTitle || 'Custom Edit'}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-500 text-xs">${order.price}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              order.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {order.paymentStatus || 'unpaid'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                              order.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                              order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleOrderStatusChange(order._id || order.id, e.target.value)}
                              className={`rounded-lg px-2.5 py-1 text-xs border font-semibold outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-blue-400' : 'bg-gray-50 border-gray-200 text-blue-600'}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* CREATE / EDIT PLAN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-4xl rounded-2xl border p-6 relative my-8 shadow-xl ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Scissors className="text-blue-500" size={20} />
              <span>{editingPlan ? 'Edit Editing Service Plan' : 'Create New Editing Plan'}</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <form onSubmit={handlePlanSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Plan Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Starter"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price ($ USD) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Billing Type *</label>
                    <select
                      value={billingType}
                      onChange={(e) => setBillingType(e.target.value)}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    >
                      <option value="per month">per month</option>
                      <option value="per year">per year</option>
                      <option value="one-time">one-time</option>
                      <option value="per video">per video</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Image / Banner URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className={`w-full rounded-xl px-3.5 py-2.5 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Features (Comma Separated)</label>
                  <textarea
                    rows={3}
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    placeholder="8 Short-form Videos, Basic cuts & transitions, Captions & subtitles..."
                    className={`w-full rounded-xl p-3 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="For creators who want consistent content."
                    className={`w-full rounded-xl p-3 text-sm border focus:outline-none focus:border-blue-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                  />
                </div>

                <div className={`flex items-center space-x-6 p-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>Active</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                    <span>Popular / Featured</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-5 py-2.5 rounded-xl border font-semibold text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm"
                  >
                    {editingPlan ? 'Save Changes' : 'Post Editing Plan'}
                  </button>
                </div>
              </form>

              {/* JSON Preview */}
              <div className={`border rounded-2xl p-4 flex flex-col ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between pb-3 border-b mb-3 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-blue-500 text-xs font-bold uppercase tracking-wider">
                    <Code size={16} />
                    <span>JSON Payload Preview</span>
                  </div>
                  <span className="text-[10px] text-gray-400">API Body</span>
                </div>
                
                <pre className={`flex-1 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-80 border ${darkMode ? 'bg-gray-900 border-gray-800 text-emerald-400' : 'bg-white border-gray-200 text-emerald-600'}`}>
                  {JSON.stringify(getCurrentPayload(), null, 2)}
                </pre>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
