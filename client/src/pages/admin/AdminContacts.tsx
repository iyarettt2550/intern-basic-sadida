import React, { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Trash2, X, Mail, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../../utils/productStore';
import { getAdminAuthHeaders } from '../../utils/cookies';

interface ContactItem {
  contactsId: string;
  contactsName: string;
  email: string;
  phone: string;
  subject: string;
  contactsMessage: string;
  status?: string;
  createdAt?: string;
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
      const res = await fetch(`${API_BASE}/api/admin/contacts`, {
        headers: {
          ...getAdminAuthHeaders(),
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setContacts(data.data);
      }
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
      c.email.toLowerCase().includes(s) ||
      (c.phone && c.phone.includes(s))
    );
  });

  // View detail & auto-mark as read
  const handleView = async (contact: ContactItem) => {
    setSelectedContact(contact);
    setShowDetailModal(true);

    if (contact.status === 'unread') {
      try {
        await fetch(`${API_BASE}/api/admin/contacts/${contact.contactsId}/read`, {
          method: 'PATCH',
          headers: {
            ...getAdminAuthHeaders(),
            Accept: 'application/json',
          },
        });
        setContacts((prev) =>
          prev.map((item) =>
            item.contactsId === contact.contactsId ? { ...item, status: 'read' } : item
          )
        );
        setSelectedContact((prev) => (prev ? { ...prev, status: 'read' } : null));
      } catch (err) {
        console.error('Failed to mark contact as read:', err);
      }
    }
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
        headers: {
          ...getAdminAuthHeaders(),
          Accept: 'application/json',
        },
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

  const unreadCount = contacts.filter((c) => (c.status || 'unread') === 'unread').length;

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black font-['Space_Grotesk'] flex items-center gap-3">
            ข้อความติดต่อ
            {unreadCount > 0 && (
              <span className="text-xs bg-amber-500 text-white font-bold px-3 py-1 rounded-full shadow-[2px_2px_0px_#000000] border border-black">
                {unreadCount} ข้อความใหม่
              </span>
            )}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">จัดการข้อความสอบถามและติดต่อจากลูกค้าหน้าร้าน</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] p-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, หัวข้อ, อีเมล หรือเบอร์โทร..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-black bg-neutral-50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black font-['Space_Grotesk']">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black font-['Space_Grotesk']">
                  ผู้ติดต่อ
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black font-['Space_Grotesk']">
                  หัวข้อ
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black font-['Space_Grotesk']">
                  อีเมล / เบอร์โทร
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-black font-['Space_Grotesk'] text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center px-6 py-12 text-neutral-400 text-sm">
                    ไม่มีข้อความติดต่อ
                  </td>
                </tr>
              ) : (
                filtered.map((contact, index) => {
                  const isUnread = (contact.status || 'unread') === 'unread';
                  return (
                    <tr
                      key={contact.contactsId}
                      className={`border-b border-neutral-200 hover:bg-neutral-50 transition-colors ${
                        isUnread ? 'bg-amber-50/40' : ''
                      } ${index === filtered.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {isUnread ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            ยังไม่อ่าน
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                            อ่านแล้ว
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-black">{contact.contactsName}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700 font-medium">{contact.subject}</td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        <div>{contact.email}</div>
                        {contact.phone && <div className="text-xs text-neutral-400 font-mono mt-0.5">{contact.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(contact)}
                            className="p-2 bg-white border-2 border-black rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all shadow-[2px_2px_0px_#000000] hover:shadow-[2px_2px_0px_#3b82f6] cursor-pointer"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(contact)}
                            className="p-2 bg-white border-2 border-black rounded-lg hover:bg-red-50 hover:border-red-500 transition-all shadow-[2px_2px_0px_#000000] hover:shadow-[2px_2px_0px_#ef4444] cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <div>
                <h3 className="text-lg font-black text-black font-['Space_Grotesk']">รายละเอียดที่ติดต่อ</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  รหัส: <span className="font-mono">{selectedContact.contactsId}</span>
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
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
                  <p className="text-base font-bold text-black">{selectedContact.subject}</p>
                </div>
              </div>

              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-0.5">ชื่อผู้ติดต่อ</p>
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
                  <a href={`tel:${selectedContact.phone}`} className="text-sm font-bold text-black hover:underline font-mono">
                    {selectedContact.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-100 border-2 border-black rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-500 mb-0.5">อีเมล</p>
                  <a href={`mailto:${selectedContact.email}`} className="text-sm font-bold text-black hover:underline font-mono">
                    {selectedContact.email}
                  </a>
                </div>
              </div>

              {/* Message */}
              <div className="pt-2">
                <p className="text-xs font-bold text-neutral-500 mb-2">เนื้อหาข้อความ</p>
                <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4">
                  <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{selectedContact.contactsMessage}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t-2 border-black flex justify-between items-center bg-neutral-50">
              <span className="text-xs font-bold text-neutral-500">
                สถานะ: <span className="text-black font-semibold">{selectedContact.status === 'read' ? 'อ่านแล้ว' : 'ยังไม่อ่าน'}</span>
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-8 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
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
                className="flex-1 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl border-2 border-red-500 shadow-[3px_3px_0px_#ef4444] hover:shadow-[1px_1px_0px_#ef4444] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
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
