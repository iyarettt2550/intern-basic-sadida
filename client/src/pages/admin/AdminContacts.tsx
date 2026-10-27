import React, { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Trash2, X, Mail, Phone, User, FileText } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

interface ContactItem {
  contactsId: string;
  contactsName: string;
  email: string;
  phone: string;
  subject: string;
  contactsMessage: string;
}

export const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/contacts`);
      const data = await res.json();
      if (data.success) setContacts(data.data);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Filter
  const filtered = contacts.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.contactsName.toLowerCase().includes(s) ||
      c.subject.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s)
    );
  });

  // View detail
  const handleView = (contact: ContactItem) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  // Delete
  const handleDeleteClick = (contact: ContactItem) => {
    setSelectedContact(contact);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedContact) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/contacts/${selectedContact.contactsId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteConfirm(false);
        setSelectedContact(null);
        fetchContacts();
      }
    } catch (err) {
      console.error('Failed to delete contact:', err);
    } finally {
      setActionLoading(false);
    }
  };

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
          ข้อความติดต่อ
        </h1>
        <p className="text-sm text-neutral-500 mt-1">ข้อความจากลูกค้าที่ติดต่อเข้ามา</p>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            id="admin-contact-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหา"
            className="w-full pl-12 pr-4 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
          />
        </div>
      </div>

      {/* Contacts table */}
      <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b-2 border-black">
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">ชื่อผู้ใช้</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">หัวข้อที่ติดต่อ</th>
                <th className="text-left px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider">อีเมล</th>
                <th className="text-center px-6 py-4 text-xs font-black text-neutral-600 uppercase tracking-wider w-32">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-12 text-neutral-400 text-sm">
                    ไม่มีข้อความติดต่อ
                  </td>
                </tr>
              ) : (
                filtered.map((contact, index) => (
                  <tr
                    key={contact.contactsId}
                    className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors ${
                      index === filtered.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-black">{contact.contactsName}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{contact.subject}</td>
                    <td className="px-6 py-4 text-sm text-neutral-500">{contact.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(contact)}
                          className="p-2 bg-white border-2 border-black rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all shadow-[2px_2px_0px_#000000] hover:shadow-[2px_2px_0px_#3b82f6]"
                          title="ดู"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(contact)}
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

      {/* ===== DETAIL MODAL ===== */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <div>
                <h3 className="text-lg font-black text-black font-['Space_Grotesk']">รายละเอียดที่ติดต่อ</h3>
                <p className="text-xs text-neutral-500 mt-0.5">วันที่ติดต่อ: —</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Subject */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-0.5">หัวข้อ</p>
                  <p className="text-sm font-bold text-black">{selectedContact.subject}</p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-0.5">ชื่อผู้ใช้</p>
                  <p className="text-sm font-bold text-black">{selectedContact.contactsName}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-0.5">เบอร์โทร</p>
                  <p className="text-sm font-bold text-black">{selectedContact.phone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-0.5">อีเมล</p>
                  <p className="text-sm font-bold text-black">{selectedContact.email}</p>
                </div>
              </div>

              {/* Message */}
              <div className="pt-2">
                <p className="text-xs font-bold text-neutral-500 mb-2">เนื้อหาที่ติดต่อ</p>
                <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4">
                  <p className="text-sm text-neutral-700 leading-relaxed">{selectedContact.contactsMessage}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t-2 border-black flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-8 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {showDeleteConfirm && selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-black mb-2">ยืนยันการลบ?</h3>
              <p className="text-sm text-neutral-600">
                ลบข้อความจาก <strong>"{selectedContact.contactsName}"</strong>?
              </p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl border-2 border-red-500 shadow-[3px_3px_0px_#ef4444] hover:shadow-[1px_1px_0px_#ef4444] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
              >
                {actionLoading ? 'กำลังลบ...' : 'ลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
