import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ContactPage } from './pages/ContactPage';

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

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
