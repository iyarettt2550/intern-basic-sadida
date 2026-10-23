import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* หน้าแรก (Home Page) */}
        <Route path="/" element={<HomePage />} />
        
        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
