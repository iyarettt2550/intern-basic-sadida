import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, X, Upload, Layers, Tag, Check, RefreshCw } from 'lucide-react';
import {
  mapBackendProductToProduct,
  saveProductsToCache,
  loadAllCategories,
  getCachedCategories,
  createCategory,
  uploadProductImage,
  API_BASE,
} from '../../utils/productStore';
import type { CategoryItem } from '../../utils/productStore';
import { CustomDropdown } from '../../components/CustomDropdown';
import type { DropdownOption } from '../../components/CustomDropdown';

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

const COMMON_UK_SIZES = ['6 UK', '6.5 UK', '7 UK', '7.5 UK', '8 UK', '8.5 UK', '9 UK', '9.5 UK', '10 UK', '10.5 UK', '11 UK', '12 UK'];

const STOCK_IMAGES = [
  '/images/shoe_runner_1.jpg',
  '/images/shoe_runner_2.jpg',
  '/images/shoe_walker_1.jpg',
  '/images/shoe_walker_2.jpg',
  '/images/hero_sketch.jpg',
];

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetailOption[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(getCachedCategories());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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
    img: '/images/shoe_runner_1.jpg',
    // Custom size/price mode
    useCustomDetail: true,
    customSize: '8.5 UK',
    customPrice: 2190,
  });

  // Category modal states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [categorySuccess, setCategorySuccess] = useState('');

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        const mapped = data.data.map(mapBackendProductToProduct);
        saveProductsToCache(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all product details (sizes & prices)
  const fetchProductDetails = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/product-details/all`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProductDetails(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    }
  }, []);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await loadAllCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchProductDetails();
    fetchCategories();
  }, [fetchProducts, fetchProductDetails, fetchCategories]);

  // Ensure size is formatted strictly as "X UK"
  const formatUKSize = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '8.5 UK';
    if (trimmed.toUpperCase().endsWith('UK')) {
      const withoutUK = trimmed.replace(/uk$/i, '').trim();
      return `${withoutUK} UK`;
    }
    return `${trimmed} UK`;
  };

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
      img: product.img || '/images/shoe_runner_1.jpg',
      useCustomDetail: false,
      customSize: product.prodetailSize || '8.5 UK',
      customPrice: product.price || 1800,
    });
    setShowEditModal(true);
  };

  // Add modal
  const handleOpenAdd = () => {
    const nextNum = products.length + 1;
    setFormData({
      proId: `pro_${String(nextNum).padStart(3, '0')}`,
      proName: '',
      description: '',
      prodetailId: productDetails[0]?.prodetailId || '',
      categoryId: categories[0]?.categoryId || 'cg_1',
      img: '/images/shoe_runner_1.jpg',
      useCustomDetail: true,
      customSize: '8.5 UK',
      customPrice: 2190,
    });
    setShowAddModal(true);
  };

  // Category Modal open
  const handleOpenCategoryModal = () => {
    const nextCatNum = categories.length + 1;
    setNewCategoryId(`cg_${nextCatNum}`);
    setNewCategoryName('');
    setCategorySuccess('');
    setShowCategoryModal(true);
  };

  // Handle Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setCategoryCreating(true);
    try {
      const created = await createCategory(newCategoryName.trim(), newCategoryId.trim() || undefined);
      setCategories((prev) => {
        const exists = prev.some((c) => c.categoryId === created.categoryId);
        return exists ? prev.map((c) => (c.categoryId === created.categoryId ? created : c)) : [...prev, created];
      });
      setCategorySuccess(`เพิ่มหมวดหมู่ "${created.categoryName}" เรียบร้อยแล้ว!`);
      setNewCategoryName('');
      const nextNum = categories.length + 2;
      setNewCategoryId(`cg_${nextNum}`);
      // Refresh categories list
      fetchCategories();
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setCategoryCreating(false);
    }
  };

  // Handle local image file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const finalUrl = await uploadProductImage(base64);
          setFormData((prev) => ({ ...prev, img: finalUrl }));
        } catch (uploadErr) {
          console.error('Image upload failed, fallback to base64:', uploadErr);
          setFormData((prev) => ({ ...prev, img: base64 }));
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to read file:', err);
      setUploadingImage(false);
    }
  };

  // Submit add product
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      let finalDetailId = formData.prodetailId;

      // If admin entered custom UK size and price, create or resolve product_detail
      if (formData.useCustomDetail) {
        const formattedSize = formatUKSize(formData.customSize);
        const detailRes = await fetch(`${API_BASE}/api/admin/products/product-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prodetailSize: formattedSize,
            price: Number(formData.customPrice) || 1800,
          }),
        });
        const detailData = await detailRes.json();
        if (detailData.success && detailData.data?.prodetailId) {
          finalDetailId = detailData.data.prodetailId;
        }
      }

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proId: formData.proId,
          proName: formData.proName,
          description: formData.description,
          prodetailId: finalDetailId,
          categoryId: formData.categoryId,
          img: formData.img,
          price: Number(formData.customPrice) || 1800,
          size: formData.useCustomDetail ? formatUKSize(formData.customSize) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        await fetchProducts();
        await fetchProductDetails();
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.message || 'ไม่สามารถเพิ่มสินค้าได้'}`);
      }
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit edit product
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      let finalDetailId = formData.prodetailId;

      // If admin entered custom UK size and price
      if (formData.useCustomDetail) {
        const formattedSize = formatUKSize(formData.customSize);
        const detailRes = await fetch(`${API_BASE}/api/admin/products/product-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prodetailSize: formattedSize,
            price: Number(formData.customPrice) || 1800,
          }),
        });
        const detailData = await detailRes.json();
        if (detailData.success && detailData.data?.prodetailId) {
          finalDetailId = detailData.data.prodetailId;
        }
      }

      const res = await fetch(`${API_BASE}/api/admin/products/${formData.proId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proName: formData.proName,
          description: formData.description,
          prodetailId: finalDetailId,
          categoryId: formData.categoryId,
          img: formData.img,
          price: Number(formData.customPrice) || 1800,
          size: formData.useCustomDetail ? formatUKSize(formData.customSize) : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        await fetchProducts();
        await fetchProductDetails();
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.message || 'ไม่สามารถแก้ไขสินค้าได้'}`);
      }
    } catch (err) {
      console.error('Failed to edit product:', err);
      alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm click
  const handleDeleteClick = (product: ProductItem) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
  };

  // Delete product
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
        await fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Prepare category dropdown options
  const categoryFilterOptions: DropdownOption[] = [
    { value: 'all', label: 'หมวดหมู่ทั้งหมด', badge: `${products.length}` },
    ...categories.map((c) => ({
      value: c.categoryId,
      label: c.categoryName,
      badge: `${products.filter((p) => p.categoryId === c.categoryId).length}`,
    })),
  ];

  const categoryFormOptions: DropdownOption[] = categories.map((c) => ({
    value: c.categoryId,
    label: c.categoryName,
    badge: c.categoryId,
  }));

  const detailFormOptions: DropdownOption[] = productDetails.map((d) => ({
    value: d.prodetailId,
    label: `${d.prodetailSize} — ฿${d.price.toLocaleString()}`,
    badge: d.prodetailId,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-neutral-500">กำลังโหลดข้อมูลสินค้า...</p>
        </div>
      </div>
    );
  }

  // Enhanced Image Selector Component with Local File Upload
  const EnhancedImageSelector = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-wider text-black">
          รูปภาพสินค้า (Image Upload)
        </label>
        <span className="text-[11px] text-neutral-500">อัปโหลดจากเครื่อง หรือเลือกภาพตัวอย่าง</span>
      </div>

      {/* Upload button area */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="product-image-upload-input"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-xl text-black font-bold text-xs shadow-[2px_2px_0px_#000000] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
        >
          {uploadingImage ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>กำลังอัปโหลดรูปภาพ...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-black" />
              <span>เลือกไฟล์จากเครื่อง (Upload Photo)</span>
            </>
          )}
        </button>

        <div className="text-xs font-bold text-neutral-400">หรือ</div>

        <button
          type="button"
          onClick={() => {
            const nextIdx = (STOCK_IMAGES.indexOf(formData.img) + 1) % STOCK_IMAGES.length;
            setFormData((p) => ({ ...p, img: STOCK_IMAGES[nextIdx] }));
          }}
          className="w-full sm:w-auto px-4 py-3 bg-white border-2 border-black rounded-xl text-black font-bold text-xs shadow-[2px_2px_0px_#000000] hover:bg-neutral-50 active:translate-y-0.5 transition-all cursor-pointer"
        >
          สลับรูปตัวอย่าง
        </button>
      </div>

      {/* Preset stock thumbnails */}
      <div>
        <span className="text-[10px] font-bold text-neutral-500 block mb-1.5">คลังภาพสำเร็จรูป:</span>
        <div className="grid grid-cols-5 gap-2">
          {STOCK_IMAGES.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, img }))}
              className={`relative h-14 rounded-lg border-2 overflow-hidden transition-all cursor-pointer ${
                formData.img === img
                  ? 'border-black ring-2 ring-black shadow-[2px_2px_0px_#000000]'
                  : 'border-neutral-300 opacity-60 hover:opacity-100 hover:border-black'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              {formData.img === img && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active preview */}
      {formData.img && (
        <div className="relative w-full h-36 bg-neutral-100 border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_#000000] flex items-center justify-center p-2">
          <img
            src={formData.img}
            alt="Product Preview"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/shoe_runner_1.jpg';
            }}
          />
          <span className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 text-white px-2 py-0.5 rounded truncate max-w-[80%]">
            {formData.img}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black font-['Space_Grotesk']">
            หน้าจัดการสินค้า
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            เพิ่ม แก้ไข ลบ สินค้ารองเท้า พร้อมระบบหมวดหมู่ และขนาด UK
          </p>
        </div>

        {/* Action Buttons: Add Category & Add Product */}
        <div className="flex items-center gap-3">
          <button
            id="admin-add-category-btn"
            onClick={handleOpenCategoryModal}
            className="flex items-center gap-2 px-4 py-3 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer"
          >
            <Layers className="w-5 h-5" />
            <span>เพิ่มหมวดหมู่</span>
          </button>

          <button
            id="admin-add-product-btn"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>add สินค้า</span>
          </button>
        </div>
      </div>

      {/* Search and Custom Dropdown filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="admin-product-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า หรือรหัสสินค้า..."
            className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-[2px_2px_0px_#000000]"
          />
        </div>

        {/* Custom Neo-Minimalist Dropdown for Category Filter */}
        <div className="w-full sm:w-64">
          <CustomDropdown
            id="admin-product-category-filter"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryFilterOptions}
            placeholder="เลือกหมวดหมู่"
          />
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
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">ไซส์ (UK)</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">ราคา</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">หมวดหมู่</th>
                <th className="text-center px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider w-48">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-12 text-neutral-400 text-sm font-bold">
                    ไม่พบสินค้าตรงกับเงื่อนไข
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/shoe_runner_1.jpg';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-black">{p.proName}</div>
                      <div className="text-xs text-neutral-400 font-mono">{p.proId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-bold text-neutral-800">
                      {p.prodetailSize ? (p.prodetailSize.includes('UK') ? p.prodetailSize : `${p.prodetailSize} UK`) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-black">
                      {p.price ? `฿${p.price.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-neutral-100 border-2 border-black rounded-full text-xs font-bold text-neutral-800 shadow-[1px_1px_0px_#000000]">
                        {p.categoryName || p.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(p)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 cursor-pointer"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-neutral-100 transition-all shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 cursor-pointer"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-red-50 hover:border-red-500 transition-all shadow-[2px_2px_0px_#000000] hover:translate-y-0.5 cursor-pointer"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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

      {/* ===== CATEGORY MANAGEMENT MODAL ===== */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-black" />
                <h3 className="text-lg font-black text-black font-['Space_Grotesk']">
                  จัดการหมวดหมู่สินค้า
                </h3>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Existing categories list */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                  หมวดหมู่ปัจจุบัน ({categories.length})
                </label>
                <div className="space-y-2">
                  {categories.map((c) => (
                    <div
                      key={c.categoryId}
                      className="flex items-center justify-between p-3 bg-neutral-50 border-2 border-black rounded-xl shadow-[2px_2px_0px_#000000]"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-neutral-600" />
                        <span className="text-sm font-bold text-black">{c.categoryName}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 bg-white px-2 py-0.5 rounded border border-neutral-300">
                        {c.categoryId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to add new category */}
              <form onSubmit={handleCreateCategory} className="pt-4 border-t-2 border-neutral-200 space-y-4">
                <label className="block text-xs font-black uppercase tracking-wider text-black">
                  + เพิ่มหมวดหมู่ใหม่
                </label>

                {categorySuccess && (
                  <div className="p-3 bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    <span>{categorySuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold text-neutral-600 mb-1">รหัส ID</label>
                    <input
                      type="text"
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                      placeholder="cg_3"
                      className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-neutral-600 mb-1">ชื่อหมวดหมู่</label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="เช่น รองเท้าบาสเก็ตบอล"
                      className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={categoryCreating}
                  className="w-full py-3 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {categoryCreating ? 'กำลังบันทึก...' : 'บันทึกหมวดหมู่'}
                </button>
              </form>
            </div>

            <div className="p-6 border-t-2 border-black flex justify-end bg-neutral-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 transition-all cursor-pointer"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW MODAL ===== */}
      {showViewModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h3 className="text-lg font-black text-black font-['Space_Grotesk']">รายละเอียดสินค้า</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="w-full h-48 bg-neutral-100 border-2 border-black rounded-xl overflow-hidden p-2 flex items-center justify-center">
                <img
                  src={selectedProduct.img || '/images/shoe_runner_1.jpg'}
                  alt={selectedProduct.proName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-1">รหัสสินค้า</p>
                  <p className="text-sm font-bold text-black font-mono">{selectedProduct.proId}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-1">ชื่อสินค้า</p>
                  <p className="text-sm font-bold text-black">{selectedProduct.proName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-1">หมวดหมู่</p>
                  <p className="text-sm font-bold text-black">{selectedProduct.categoryName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-1">ไซส์ (UK Format)</p>
                  <p className="text-sm font-bold text-black font-mono">
                    {selectedProduct.prodetailSize
                      ? selectedProduct.prodetailSize.includes('UK')
                        ? selectedProduct.prodetailSize
                        : `${selectedProduct.prodetailSize} UK`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-1">ราคา</p>
                  <p className="text-sm font-black text-black">
                    {selectedProduct.price ? `฿${selectedProduct.price.toLocaleString()}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-1">ไฟล์รูปภาพ</p>
                  <p className="text-xs text-neutral-600 truncate font-mono">{selectedProduct.img}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 mb-1">คำอธิบาย</p>
                <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  {selectedProduct.description}
                </p>
              </div>
            </div>
            <div className="p-6 border-t-2 border-black flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h3 className="text-lg font-black text-black font-['Space_Grotesk']">เพิ่มสินค้าใหม่</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAdd} className="p-6 space-y-5">
              {/* Pro ID & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">รหัสสินค้า</label>
                  <input
                    type="text"
                    value={formData.proId}
                    onChange={(e) => setFormData((p) => ({ ...p, proId: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-black rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">หมวดหมู่สินค้า</label>
                  <CustomDropdown
                    value={formData.categoryId}
                    onChange={(val) => setFormData((p) => ({ ...p, categoryId: val }))}
                    options={categoryFormOptions}
                    placeholder="เลือกหมวดหมู่"
                  />
                </div>
              </div>

              {/* Pro Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={formData.proName}
                  onChange={(e) => setFormData((p) => ({ ...p, proName: e.target.value }))}
                  placeholder="เช่น Sadida Ultralight Pro"
                  className="w-full px-3 py-2.5 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">คำอธิบายสินค้า</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="ข้อมูลจุดเด่น เทคโนโลยี และความเหมาะสม..."
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={2}
                  required
                />
              </div>

              {/* UK Size & Price Section */}
              <div className="p-4 bg-neutral-50 border-2 border-black rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    ขนาดและราคา (UK Format & Price)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, useCustomDetail: !p.useCustomDetail }))}
                      className="text-[11px] font-bold text-black underline cursor-pointer"
                    >
                      {formData.useCustomDetail ? 'เลือกจากชุดเดิม' : 'กำหนดขนาดใหม่'}
                    </button>
                  </div>
                </div>

                {formData.useCustomDetail ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">
                          ไซส์รองเท้า (ระบุเป็น UK)
                        </label>
                        <input
                          type="text"
                          value={formData.customSize}
                          onChange={(e) => setFormData((p) => ({ ...p, customSize: e.target.value }))}
                          onBlur={(e) =>
                            setFormData((p) => ({ ...p, customSize: formatUKSize(e.target.value) }))
                          }
                          placeholder="8.5 UK"
                          className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">
                          ราคา (บาท)
                        </label>
                        <input
                          type="number"
                          value={formData.customPrice}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, customPrice: Number(e.target.value) }))
                          }
                          placeholder="2190"
                          className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                    </div>

                    {/* Quick UK Size Selector Chips */}
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 block mb-1">
                        คลิกเลือกขนาด UK ด่วน:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_UK_SIZES.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, customSize: sz }))}
                            className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                              formData.customSize === sz
                                ? 'bg-black text-white border-black shadow-[1px_1px_0px_#000000]'
                                : 'bg-white hover:bg-neutral-100 border-neutral-300'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1">
                      เลือกจากไซส์และราคาที่มีในระบบ
                    </label>
                    <CustomDropdown
                      value={formData.prodetailId}
                      onChange={(val) => setFormData((p) => ({ ...p, prodetailId: val }))}
                      options={detailFormOptions}
                      placeholder="เลือกขนาด/ราคา"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Image Selector with Upload */}
              <EnhancedImageSelector />

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadingImage}
                  className="flex-1 px-4 py-3 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'กำลังบันทึกสินค้า...' : 'เพิ่มสินค้าลงระบบ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h3 className="text-lg font-black text-black font-['Space_Grotesk']">แก้ไขสินค้า</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">รหัสสินค้า</label>
                  <input
                    type="text"
                    value={formData.proId}
                    disabled
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded-xl text-sm font-mono font-medium bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">หมวดหมู่สินค้า</label>
                  <CustomDropdown
                    value={formData.categoryId}
                    onChange={(val) => setFormData((p) => ({ ...p, categoryId: val }))}
                    options={categoryFormOptions}
                    placeholder="เลือกหมวดหมู่"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={formData.proName}
                  onChange={(e) => setFormData((p) => ({ ...p, proName: e.target.value }))}
                  className="w-full px-3 py-2.5 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={2}
                  required
                />
              </div>

              {/* Size & Price */}
              <div className="p-4 bg-neutral-50 border-2 border-black rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    ขนาดและราคา (UK Format & Price)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, useCustomDetail: !p.useCustomDetail }))}
                    className="text-[11px] font-bold text-black underline cursor-pointer"
                  >
                    {formData.useCustomDetail ? 'เลือกจากชุดเดิม' : 'กำหนดขนาด/ราคาใหม่'}
                  </button>
                </div>

                {formData.useCustomDetail ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">
                          ไซส์รองเท้า (UK)
                        </label>
                        <input
                          type="text"
                          value={formData.customSize}
                          onChange={(e) => setFormData((p) => ({ ...p, customSize: e.target.value }))}
                          onBlur={(e) =>
                            setFormData((p) => ({ ...p, customSize: formatUKSize(e.target.value) }))
                          }
                          className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">
                          ราคา (บาท)
                        </label>
                        <input
                          type="number"
                          value={formData.customPrice}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, customPrice: Number(e.target.value) }))
                          }
                          className="w-full px-3 py-2 border-2 border-black rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_UK_SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, customSize: sz }))}
                          className={`px-2 py-1 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                            formData.customSize === sz
                              ? 'bg-black text-white border-black shadow-[1px_1px_0px_#000000]'
                              : 'bg-white hover:bg-neutral-100 border-neutral-300'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-1">
                      เลือกจากไซส์และราคาในระบบ
                    </label>
                    <CustomDropdown
                      value={formData.prodetailId}
                      onChange={(val) => setFormData((p) => ({ ...p, prodetailId: val }))}
                      options={detailFormOptions}
                      placeholder="เลือกขนาด/ราคา"
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Image Selector */}
              <EnhancedImageSelector />

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || uploadingImage}
                  className="flex-1 px-4 py-3 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {showDeleteConfirm && selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-black mb-2">ยืนยันการลบ?</h3>
              <p className="text-sm text-neutral-600">
                คุณต้องการลบ <strong>"{selectedProduct.proName}"</strong> ({selectedProduct.proId}) หรือไม่?
              </p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl border-2 border-red-500 shadow-[3px_3px_0px_#ef4444] hover:shadow-[1px_1px_0px_#ef4444] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? 'กำลังลบ...' : 'ลบสินค้า'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
