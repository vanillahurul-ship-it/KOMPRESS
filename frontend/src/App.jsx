/**
 * Komponen Utama Aplikasi
 *
 * Merakit lapisan-lapisan pembungkus yang berlaku untuk seluruh aplikasi.
 * Urutan pembungkusnya penting:
 *
 *   BrowserRouter - menyediakan kemampuan navigasi antar halaman
 *   AuthProvider  - menyediakan status login; diletakkan di dalam router
 *                   karena proses masuk dan keluar memerlukan navigasi
 *   Toaster       - wadah pemberitahuan singkat, diletakkan di tingkat ini
 *                   agar dapat dipanggil dari halaman mana pun
 *   AppRoutes     - daftar seluruh halaman aplikasi
 */

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
