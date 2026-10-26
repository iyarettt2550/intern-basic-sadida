import React, { useEffect, useState, useCallback } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, X, ChevronDown } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

interface ProductItem {
  proId: string;
  proName: string;
  description: string;
  img: string;
  prodetailId: string;
  prodetailSize: string | null;
  price: number | null;
  categoryId: string;
  categoryName: string | null;
}

interface ProductDetailOption {
  prodetailId: string;
  prodetailSize: string;
  price: number;
}

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetailOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    proId: '',
    proName: '',
    description: '',
    prodetailId: '',
    categoryId: 'cg_1',
    img: '',
  });

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductDetails = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/product-details/all`);
      const data = await res.json();
      if (data.success) setProductDetails(data.data);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchProductDetails();
  }, [fetchProducts, fetchProductDetails]);

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.proName.toLowerCase().includes(search.toLowerCase()) ||
      p.proId.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // View modal
  const handleView = (product: ProductItem) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Edit modal
  const handleEdit = (product: ProductItem) => {
    setSelectedProduct(product);
    setFormData({
      proId: product.proId,
      proName: product.proName,
      description: product.description,
      prodetailId: product.prodetailId,
      categoryId: product.categoryId,
      img: product.img || '',
    });
    setShowEditModal(true);
  };

  // Add modal
  const handleOpenAdd = () => {
    setFormData({
      proId: `pro_${String(products.length + 1).padStart(3, '0')}`,
      proName: '',
      description: '',
      prodetailId: productDetails[0]?.prodetailId || '',
      categoryId: 'cg_1',
      img: '/images/shoe_runner_1.jpg',
    });
    setShowAddModal(true);
  };

  // Delete confirm
  const handleDeleteClick = (product: ProductItem) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
  };

  // Submit add
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to add product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${formData.proId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proName: formData.proName,
          description: formData.description,
          prodetailId: formData.prodetailId,
          categoryId: formData.categoryId,
          img: formData.img,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to edit product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${selectedProduct.proId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteConfirm(false);
        setSelectedProduct(null);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Available images in public/images/
  const availableImages = [
    '/images/shoe_runner_1.jpg',
    '/images/shoe_runner_2.jpg',
    '/images/shoe_walker_1.jpg',
    '/images/shoe_walker_2.jpg',
    '/images/hero_sketch.jpg',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-neutral-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Shared image selector component
  const ImageSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div>
      <label className="block text-xs font-bold text-neutral-600 mb-1">เลือกรูปภาพ</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black mb-2"
      >
        {availableImages.map((img) => (
          <option key={img} value={img}>{img.split('/').pop()}</option>
        ))}
      </select>
      {value && (
        <div className="w-full h-32 bg-neutral-100 border-2 border-neutral-200 rounded-xl overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black font-['Space_Grotesk']">
            หน้าจัดการสินค้า
          </h1>
          <p className="text-sm text-neutral-500 mt-1">เพิ่ม แก้ไข ลบ สินค้ารองเท้า</p>
        </div>
        <button
          id="admin-add-product-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>add</span>
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="admin-product-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา"
            className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
          />
        </div>
        <div className="relative">
          <select
            id="admin-product-category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none px-6 py-3 pr-12 border-2 border-black rounded-xl bg-white text-black font-bold text-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
          >
            <option value="all">หมวดหมู่</option>
            <option value="cg_1">รองเท้าวิ่ง</option>
            <option value="cg_2">รองเท้าเดิน</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b-2 border-black">
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider w-20">รูปภาพ</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">ชื่อสินค้า</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">ไซส์</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">ราคา</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">หมวดหมู่</th>
                <th className="text-center px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider w-48">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-12 text-neutral-400 text-sm">
                    ไม่พบสินค้า
                  </td>
                </tr>
              ) : (
                filtered.map((p, index) => (
                  <tr
                    key={p.proId}
                    className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors ${
                      index === filtered.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 bg-neutral-100 border-2 border-black rounded-xl overflow-hidden shadow-[2px_2px_0px_#000000]">
                        <img
                          src={p.img || '/images/shoe_runner_1.jpg'}
                          alt={p.proName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-black">{p.proName}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{p.prodetailSize || '-'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-black">
                      {p.price ? `฿${p.price.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-full text-xs font-bold text-neutral-700">
                        {p.categoryName || p.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(p)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all shadow-[2px_2px_0px_#000000] hover:shadow-[2px_2px_0px_#3b82f6]"
                          title="ดู"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-amber-50 hover:border-amber-500 transition-all shadow-[2px_2px_0px_#000000] hover:shadow-[2px_2px_0px_#f59e0b]"
                          title="แก้"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-red-50 hover:border-red-500 transition-all shadow-[2px_2px_0px_#000000] hover:shadow-[2px_2px_0px_#ef4444]"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== VIEW MODAL ===== */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h3 className="text-lg font-black text-black font-['Space_Grotesk']">รายละเอียดสินค้า</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="w-full h-48 bg-neutral-100 border-2 border-black rounded-xl overflow-hidden">
                <img src={selectedProduct.img || '/images/shoe_runner_1.jpg'} alt={selectedProduct.proName} className="w-full h-full object-contain" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs font-bold text-neutral-500 mb-1">รหัสสินค้า</p><p className="text-sm font-bold text-black">{selectedProduct.proId}</p></div>
                <div><p className="text-xs font-bold text-neutral-500 mb-1">ชื่อสินค้า</p><p className="text-sm font-bold text-black">{selectedProduct.proName}</p></div>
                <div><p className="text-xs font-bold text-neutral-500 mb-1">หมวดหมู่</p><p className="text-sm font-bold text-black">{selectedProduct.categoryName || '-'}</p></div>
                <div><p className="text-xs font-bold text-neutral-500 mb-1">ไซส์</p><p className="text-sm font-bold text-black">{selectedProduct.prodetailSize || '-'}</p></div>
                <div><p className="text-xs font-bold text-neutral-500 mb-1">ราคา</p><p className="text-sm font-bold text-black">{selectedProduct.price ? `฿${selectedProduct.price.toLocaleString()}` : '-'}</p></div>
                <div><p className="text-xs font-bold text-neutral-500 mb-1">ไฟล์รูป</p><p className="text-sm text-neutral-600 truncate">{selectedProduct.img}</p></div>
              </div>
              <div><p className="text-xs font-bold text-neutral-500 mb-1">คำอธิบาย</p><p className="text-sm text-neutral-700">{selectedProduct.description}</p></div>
            </div>
            <div className="p-6 border-t-2 border-black flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">ปิด</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h3 className="text-lg font-black text-black font-['Space_Grotesk']">เพิ่มสินค้าใหม่</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">รหัสสินค้า</label>
                  <input type="text" value={formData.proId} onChange={(e) => setFormData((p) => ({ ...p, proId: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">หมวดหมู่</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black">
                    <option value="cg_1">รองเท้าวิ่ง</option>
                    <option value="cg_2">รองเท้าเดิน</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">ชื่อสินค้า</label>
                <input type="text" value={formData.proName} onChange={(e) => setFormData((p) => ({ ...p, proName: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">คำอธิบาย</label>
                <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none" rows={3} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">ขนาด / ราคา</label>
                <select value={formData.prodetailId} onChange={(e) => setFormData((p) => ({ ...p, prodetailId: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black">
                  {productDetails.map((d) => (<option key={d.prodetailId} value={d.prodetailId}>{d.prodetailSize} — ฿{d.price.toLocaleString()}</option>))}
                </select>
              </div>
              <ImageSelector value={formData.img} onChange={(v) => setFormData((p) => ({ ...p, img: v }))} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">ยกเลิก</button>
                <button type="submit" disabled={actionLoading} className="flex-1 px-4 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">{actionLoading ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h3 className="text-lg font-black text-black font-['Space_Grotesk']">แก้ไขสินค้า</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">รหัสสินค้า</label>
                  <input type="text" value={formData.proId} disabled className="w-full px-3 py-2 border-2 border-neutral-300 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">หมวดหมู่</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData((p) => ({ ...p, categoryId: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black">
                    <option value="cg_1">รองเท้าวิ่ง</option>
                    <option value="cg_2">รองเท้าเดิน</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">ชื่อสินค้า</label>
                <input type="text" value={formData.proName} onChange={(e) => setFormData((p) => ({ ...p, proName: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">คำอธิบาย</label>
                <textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none" rows={3} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">ขนาด / ราคา</label>
                <select value={formData.prodetailId} onChange={(e) => setFormData((p) => ({ ...p, prodetailId: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black">
                  {productDetails.map((d) => (<option key={d.prodetailId} value={d.prodetailId}>{d.prodetailSize} — ฿{d.price.toLocaleString()}</option>))}
                </select>
              </div>
              <ImageSelector value={formData.img} onChange={(v) => setFormData((p) => ({ ...p, img: v }))} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">ยกเลิก</button>
                <button type="submit" disabled={actionLoading} className="flex-1 px-4 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">{actionLoading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {showDeleteConfirm && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
              <h3 className="text-lg font-black text-black mb-2">ยืนยันการลบ?</h3>
              <p className="text-sm text-neutral-600">คุณต้องการลบ <strong>"{selectedProduct.proName}"</strong> หรือไม่?</p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">ยกเลิก</button>
              <button onClick={handleDelete} disabled={actionLoading} className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl border-2 border-red-500 shadow-[3px_3px_0px_#ef4444] hover:shadow-[1px_1px_0px_#ef4444] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50">{actionLoading ? 'กำลังลบ...' : 'ลบ'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
