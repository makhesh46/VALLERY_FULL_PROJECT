import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../../store/useStore.js';
import { LogOut, Settings as SettingsIcon, Package, Inbox, Plus, Edit, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin, logout, settings, setSettings } = useStore();
  const navigate = useNavigate();

  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', isPublished: true, image: null as File | null
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    websiteTitle: settings?.websiteTitle || '',
    adminEmail: settings?.adminEmail || '',
    adminPhone: settings?.adminPhone || '',
    adminName: admin?.name || '',
    logo: null as File | null
  });

  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [admin, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (activeTab === 'products') {
        const res = await axios.get('/api/products/admin', config);
        setProducts(res.data);
      } else if (activeTab === 'requests') {
        const res = await axios.get('/api/requests', config);
        setRequests(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch data');
      if ((error as any).response?.status === 401) {
        logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Product Handlers
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price);
    formData.append('description', productForm.description);
    formData.append('isPublished', productForm.isPublished.toString());
    if (productForm.image) {
      formData.append('image', productForm.image);
    }

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/products', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: '', description: '', isPublished: true, image: null });
      fetchData();
      showMessage('Product saved successfully');
    } catch (error) {
      showMessage('Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showMessage('Product deleted successfully');
      setProductToDelete(null);
    } catch (error) {
      showMessage('Failed to delete product', 'error');
      setProductToDelete(null);
    }
  };

  // Settings Handler
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('websiteTitle', settingsForm.websiteTitle);
    formData.append('adminEmail', settingsForm.adminEmail);
    formData.append('adminPhone', settingsForm.adminPhone);
    formData.append('adminName', settingsForm.adminName);
    if (settingsForm.logo) {
      formData.append('logo', settingsForm.logo);
    }

    try {
      const res = await axios.put('/api/settings', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setSettings(res.data);
      showMessage('Settings updated successfully');
    } catch (error) {
      showMessage('Failed to update settings', 'error');
    }
  };

  // Request Status Handler
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      showMessage('Status updated successfully');
    } catch (error) {
      showMessage('Failed to update status', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#1a1a1a] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-serif text-white mb-1">Admin Panel</h2>
          <p className="text-xs text-white/50 uppercase tracking-widest">Welcome, {admin?.name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-[#c5a059] text-black font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
          >
            <Package size={18} className="mr-3" /> Products
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'requests' ? 'bg-[#c5a059] text-black font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
          >
            <Inbox size={18} className="mr-3" /> Requests
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#c5a059] text-black font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
          >
            <SettingsIcon size={18} className="mr-3" /> Settings
          </button>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto relative">
        {message && (
          <div className={`absolute top-8 right-8 px-6 py-3 rounded-lg shadow-lg z-50 transition-all ${
            message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'
          }`}>
            {message.text}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#c5a059]"></div>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-serif text-white">Product Management</h1>
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({ name: '', price: '', description: '', isPublished: true, image: null });
                      setIsProductModalOpen(true);
                    }}
                    className="flex items-center bg-[#c5a059] text-black px-4 py-2 rounded-lg text-sm uppercase tracking-widest font-medium hover:bg-white transition-colors"
                  >
                    <Plus size={16} className="mr-2" /> Add Product
                  </button>
                </div>

                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-sm text-white/70">
                    <thead className="text-xs uppercase tracking-widest bg-black/50 text-white/50 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product: any) => (
                        <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 flex items-center">
                            <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                            <span className="font-medium text-white">{product.name}</span>
                          </td>
                          <td className="px-6 py-4">₹{product.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${product.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {product.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setProductForm({
                                  name: product.name,
                                  price: product.price.toString(),
                                  description: product.description,
                                  isPublished: product.isPublished,
                                  image: null
                                });
                                setIsProductModalOpen(true);
                              }}
                              className="text-white/50 hover:text-[#c5a059] mr-3 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => setProductToDelete(product._id)}
                              className="text-white/50 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h1 className="text-3xl font-serif text-white mb-8">Customer Requests</h1>
                <div className="grid gap-6">
                  {requests.map((req: any) => (
                    <div key={req._id} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-serif text-white">{req.customerName}</h3>
                            <p className="text-sm text-white/50">{new Date(req.createdAt).toLocaleString()}</p>
                          </div>
                          <select
                            value={req.status}
                            onChange={(e) => handleUpdateStatus(req._id, e.target.value)}
                            className={`bg-black/50 border border-white/10 rounded px-3 py-1 text-xs uppercase tracking-widest focus:outline-none ${
                              req.status === 'pending' ? 'text-yellow-400' : req.status === 'contacted' ? 'text-blue-400' : 'text-green-400'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-white/70 mb-4">
                          <div><strong className="text-white/40 uppercase tracking-widest text-xs block mb-1">Email</strong> {req.email}</div>
                          <div><strong className="text-white/40 uppercase tracking-widest text-xs block mb-1">Phone</strong> {req.phoneNumber}</div>
                          <div className="col-span-2"><strong className="text-white/40 uppercase tracking-widest text-xs block mb-1">Address</strong> {req.address}</div>
                        </div>
                        {req.message && (
                          <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                            <strong className="text-white/40 uppercase tracking-widest text-xs block mb-2">Message</strong>
                            <p className="text-sm text-white/80">{req.message}</p>
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-48 bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <img src={req.product?.imageUrl} alt={req.product?.name} className="w-20 h-20 object-cover rounded-lg mb-3" />
                        <p className="text-sm font-medium text-white line-clamp-2">{req.product?.name}</p>
                        <p className="text-xs text-[#c5a059] mt-1">₹{req.product?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h1 className="text-3xl font-serif text-white mb-8">Website Settings</h1>
                <form onSubmit={handleSettingsSubmit} className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Website Title</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                      value={settingsForm.websiteTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, websiteTitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Admin Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                      value={settingsForm.adminName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, adminName: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Admin Email</label>
                      <input
                        type="email"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                        value={settingsForm.adminEmail}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Admin Phone (WhatsApp)</label>
                      <input
                        type="tel"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                        value={settingsForm.adminPhone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPhone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Website Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                      onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.files?.[0] || null })}
                    />
                    {settings?.logoUrl && !settingsForm.logo && (
                      <img src={settings.logoUrl} alt="Current Logo" className="mt-4 h-12 object-contain" />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#c5a059] text-black font-medium py-4 rounded-lg uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Save Settings
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-8 text-center">
            <h2 className="text-2xl font-serif text-white mb-4">Delete Product</h2>
            <p className="text-white/70 mb-8">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-6 py-3 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete)}
                className="px-6 py-3 bg-red-500/20 text-red-500 font-medium rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden p-8">
            <h2 className="text-2xl font-serif text-white mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Product Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Price (₹)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059] resize-none"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingProduct}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a059]"
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.files?.[0] || null })}
                />
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isPublished"
                  className="mr-2 accent-[#c5a059]"
                  checked={productForm.isPublished}
                  onChange={(e) => setProductForm({ ...productForm, isPublished: e.target.checked })}
                />
                <label htmlFor="isPublished" className="text-sm text-white/80">Publish immediately</label>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-6 py-3 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#c5a059] text-black font-medium rounded-lg uppercase tracking-widest hover:bg-white transition-colors"
                >
                  {editingProduct ? 'Update' : 'Create'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
