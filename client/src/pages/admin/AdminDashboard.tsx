import React, { useEffect, useState } from 'react';
import { Package, MessageSquare, Layers, TrendingUp, Clock } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

interface ContactItem {
  contactsId: string;
  contactsName: string;
  email: string;
  phone: string;
  subject: string;
  contactsMessage: string;
}

interface CategoryItem {
  categoryId: string;
  categoryName: string;
}

export const AdminDashboard: React.FC = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [recentContacts, setRecentContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, contRes, contactsListRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/products/stats/summary`),
          fetch(`${API_BASE}/api/admin/products/categories`),
          fetch(`${API_BASE}/api/admin/contacts/stats/summary`),
          fetch(`${API_BASE}/api/admin/contacts`),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const contData = await contRes.json();
        const contactsList = await contactsListRes.json();

        if (prodData.success) {
          setTotalProducts(prodData.data.totalProducts);
          if (typeof prodData.data.totalCategories === 'number') {
            setTotalCategories(prodData.data.totalCategories);
          }
          if (Array.isArray(prodData.data.categories)) {
            setCategoriesList(prodData.data.categories);
          }
        }
        if (catData.success && Array.isArray(catData.data)) {
          setCategoriesList(catData.data);
          setTotalCategories(catData.data.length);
        }
        if (contData.success) setTotalContacts(contData.data.totalContacts);
        if (contactsList.success) setRecentContacts(contactsList.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-black font-['Space_Grotesk']">
          หน้า Dashboard
        </h1>
        <p className="text-sm text-neutral-500 mt-1">หน้าโชว์รายละเอียดต่างๆ</p>
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Contacts stat card */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-black" />
            </div>
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-sm font-bold text-neutral-500 mb-1">จำนวนข้อความติดต่อที่ไม่ได้อ่าน</p>
          <p className="text-4xl font-black text-black font-['Space_Grotesk']">{totalContacts}</p>
        </div>

        {/* Products stat card */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-sm font-bold text-neutral-500 mb-1">จำนวนสินค้า</p>
          <p className="text-4xl font-black text-black font-['Space_Grotesk']">{totalProducts}</p>
        </div>

        {/* Categories stat card */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-black" />
            </div>
            <TrendingUp className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-sm font-bold text-neutral-500 mb-1">หมวดหมู่สินค้า</p>
          <p className="text-4xl font-black text-black font-['Space_Grotesk']">{totalCategories}</p>
          <p className="text-xs text-neutral-400 mt-1 truncate" title={categoriesList.map(c => c.categoryName).join(' • ')}>
            {categoriesList.length > 0
              ? categoriesList.map((c) => c.categoryName.replace(/^รองเท้า/, '') || c.categoryName).join(' • ')
              : 'ไม่มีหมวดหมู่'}
          </p>
        </div>
      </div>

      {/* Recent contacts table */}
      <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden">
        <div className="p-6 border-b-2 border-black flex items-center gap-3">
          <Clock className="w-5 h-5 text-black" />
          <h2 className="text-lg font-black text-black font-['Space_Grotesk']">
            ข้อความที่ติดต่อมาล่าสุด 5 รายการ
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b-2 border-black">
                <th className="text-left px-6 py-3 text-xs font-black text-neutral-600 uppercase tracking-wider">ชื่อผู้ใช้</th>
                <th className="text-left px-6 py-3 text-xs font-black text-neutral-600 uppercase tracking-wider">อีเมล</th>
                <th className="text-left px-6 py-3 text-xs font-black text-neutral-600 uppercase tracking-wider">หัวข้อ</th>
                <th className="text-left px-6 py-3 text-xs font-black text-neutral-600 uppercase tracking-wider">เบอร์โทร</th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-12 text-neutral-400 text-sm">
                    ยังไม่มีข้อความติดต่อ
                  </td>
                </tr>
              ) : (
                recentContacts.map((contact, index) => (
                  <tr
                    key={contact.contactsId}
                    className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors ${
                      index === recentContacts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-black">{contact.contactsName}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{contact.subject}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{contact.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
