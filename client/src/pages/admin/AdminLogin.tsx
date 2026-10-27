import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { setCookie } from '../../utils/cookies';

const API_BASE = 'http://localhost:3000';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
        setLoading(false);
        return;
      }

      // Store user data in Cookie (expire in 7 days)
      setCookie('sadida_admin', JSON.stringify(data.data), 7);
      localStorage.removeItem('sadida_admin');
      navigate('/admin/dashboard');
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 bg-grid-light">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 border-[3px] border-black/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 border-[3px] border-black/5 rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000000] mb-4">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-black font-['Space_Grotesk']">
            SADIDA ADMIN
          </h1>
          <p className="text-sm text-neutral-500 mt-1 tracking-wide">
            เข้าสู่ระบบหลังบ้าน
          </p>
        </div>

        {/* Login form card */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000000] p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Username field */}
            <div>
              <label htmlFor="admin-username" className="block text-sm font-bold text-black mb-2 tracking-wide">
                ชื่อผู้ใช้
              </label>
              <input
                id="admin-username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ เช่น Admin Sadida"
                className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
                required
                autoComplete="username"
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-bold text-black mb-2 tracking-wide">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white text-black font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-black transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-bold text-base rounded-xl border-2 border-black shadow-[4px_4px_0px_#000000] transition-all duration-200 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-neutral-400 mt-6 tracking-wide">
          สำหรับผู้ดูแลระบบและเจ้าของร้านเท่านั้น
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
