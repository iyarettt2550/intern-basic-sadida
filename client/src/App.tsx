import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminContacts } from './pages/admin/AdminContacts';
import { AdminWebsite } from './pages/admin/AdminWebsite';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรก (Home / แบนร์) */}
        <Route path="/" element={<HomePage />} />
        
        {/* หน้าสินค้า (Products Page) */}
        <Route path="/products" element={<ProductsPage />} />

        {/* หน้าติดต่อเรา (Contact Page) */}
        <Route path="/contact" element={<ContactPage />} />

        {/* ===== ระบบหลังบ้าน Admin ===== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="website" element={<AdminWebsite />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
