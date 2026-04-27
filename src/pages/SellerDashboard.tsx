import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Package, ShoppingBag, LogOut, Upload, ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { products as productsApi, orders as ordersApi, upload as uploadApi, Product, Order } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['tables', 'chairs', 'cabinets', 'doors', 'windows', 'coffins', 'cupboards', 'couche', 'beds'];

type ProductForm = Omit<Product, 'id' | 'created_at' | 'seller_id' | 'seller_name' | 'seller_phone' | 'seller_whatsapp' | 'shop_name'>;

export function SellerDashboard() {
  const { seller, logout, role } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageReady, setImageReady] = useState(false); // true only after Cloudinary confirms
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductForm>();
  const watchedImageUrl = watch('image_url');

  useEffect(() => {
    if (role !== 'seller') { navigate('/login'); return; }
    productsApi.mine().then(setMyProducts).catch(console.error);
    ordersApi.sellerOrders().then(setMyOrders).catch(console.error);
  }, [role, navigate]);

  const onSubmit = async (data: ProductForm) => {
    try {
      const payload = { ...data, price: Number(data.price), stock_qty: Number(data.stock_qty) };
      if (editing) {
        const updated = await productsApi.update(editing.id, payload);
        setMyProducts(p => p.map(x => x.id === editing.id ? updated : x));
        toast.success('Product updated');
      } else {
        const created = await productsApi.create(payload);
        setMyProducts(p => [created, ...p]);
        toast.success('Product added');
      }
      reset(); setShowForm(false); setEditing(null); setImagePreview(''); setImageReady(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save product');
    }
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    (Object.keys(p) as (keyof Product)[]).forEach(k => setValue(k as keyof ProductForm, p[k] as never));
    setImagePreview(p.image_url);
    setImageReady(true);
    setShowForm(true);
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setImageReady(false);
    setImageUploading(true);
    try {
      const url = await uploadApi.image(file);
      setValue('image_url', url, { shouldValidate: true });
      setImagePreview(url);
      setImageReady(true);
      toast.success('Image uploaded successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      toast.error(`Image upload failed: ${msg}`);
      setImagePreview(localPreview);
      setImageReady(false);
      setValue('image_url', '', { shouldValidate: false });
    } finally {
      setImageUploading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await productsApi.remove(id);
    setMyProducts(p => p.filter(x => x.id !== id));
    toast.success('Deleted');
  };

  const updateOrderStatus = async (id: string, status: string) => {
    const updated = await ordersApi.updateStatus(id, status);
    setMyOrders(o => o.map(x => x.id === id ? updated : x));
    toast.success(`Order ${status}`);
  };

  if (!seller) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-amber-600">{seller.shop_name}</h1>
            <p className="text-xs text-gray-500">{seller.is_approved ? '✅ Approved' : '⏳ Pending approval'}</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center space-x-1 text-gray-500 hover:text-red-500 text-sm">
            <LogOut className="h-4 w-4" /> <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
          {[{ key: 'products', icon: Package, label: 'Products' }, { key: 'orders', icon: ShoppingBag, label: 'Orders' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as 'products' | 'orders')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-white dark:bg-gray-700 shadow text-amber-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              <t.icon className="h-4 w-4" /> <span>{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">My Products ({myProducts.length})</h2>
              <button onClick={() => { setEditing(null); reset(); setShowForm(true); }}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors">
                <Plus className="h-4 w-4" /> <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProducts.map(p => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                  <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{p.name}</p>
                    <p className="text-amber-600 font-bold">{p.price.toLocaleString()} FCFA</p>
                    <p className="text-xs text-gray-500 mt-1">Stock: {p.stock_qty} · {p.in_stock ? '✅ In stock' : '❌ Out of stock'}</p>
                    <div className="flex space-x-2 mt-3">
                      <button onClick={() => startEdit(p)} className="flex-1 flex items-center justify-center space-x-1 py-1.5 border border-amber-500 text-amber-600 text-sm rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20">
                        <Edit className="h-3.5 w-3.5" /> <span>Edit</span>
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="flex-1 flex items-center justify-center space-x-1 py-1.5 border border-red-400 text-red-500 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-3.5 w-3.5" /> <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Incoming Orders ({myOrders.length})</h2>
            {myOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {myOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{order.buyer_name}</p>
                        <p className="text-sm text-gray-500">{order.buyer_email} · {order.buyer_phone}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">{Number(order.total_amount).toLocaleString()} FCFA</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                    {order.delivery_address && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">📍 {order.delivery_address}</p>}
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                      {order.status === 'pending' && (
                        <button onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="text-xs px-3 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600">Confirm</button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Mark Shipped</button>
                      )}
                      {order.status === 'shipped' && (
                        <button onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-xs px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">Mark Delivered</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{editing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input {...register('name', { required: true })} placeholder="Name (English)"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                <input {...register('name_fr', { required: true })} placeholder="Name (French)"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" {...register('price', { required: true, min: 0 })} placeholder="Price (FCFA)"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                <input type="number" {...register('stock_qty', { required: true, min: 0 })} placeholder="Stock quantity"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
              </div>
              <select {...register('category', { required: true })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* Image Upload */}
              <div>
                <input type="hidden" {...register('image_url', { required: true })} />
                <div
                  onClick={() => !imageUploading && fileInputRef.current?.click()}
                  className={`relative w-full h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
                    ${ errors.image_url ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : imageReady ? 'border-green-400 bg-gray-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 hover:border-amber-400 bg-gray-50 dark:bg-gray-700' }`}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center space-y-1 text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-xs">Click to upload image</span>
                    </div>
                  )}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Uploading…</span>
                    </div>
                  )}
                  {imagePreview && !imageUploading && imageReady && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">✓ Uploaded</span>
                  )}
                  {imagePreview && !imageUploading && !imageReady && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center space-y-1">
                      <span className="text-orange-300 text-xs font-medium">⚠ Upload failed</span>
                      <span className="text-white text-xs">Click to retry</span>
                    </div>
                  )}
                </div>
                {imagePreview && !imageUploading && (
                  <button type="button" onClick={() => { setImagePreview(''); setImageReady(false); setValue('image_url', ''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="mt-1 text-xs text-red-500 hover:underline">Remove image</button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                {errors.image_url && <p className="text-xs text-red-500 mt-1">Product image is required — please upload an image first</p>}
              </div>
              <textarea {...register('description', { required: true })} placeholder="Description (English)" rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none" />
              <textarea {...register('description_fr', { required: true })} placeholder="Description (French)" rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none" />
              <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <input type="checkbox" {...register('in_stock')} className="rounded" />
                <span>In stock</span>
              </label>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); reset(); setImagePreview(''); setImageReady(false); }}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl">
                  {editing ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
