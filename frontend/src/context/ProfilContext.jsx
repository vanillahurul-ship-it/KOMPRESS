/**
 * Context Profil
 *
 * Menyimpan data profil bank sampah sebagai satu sumber data bersama.
 *
 * Data ini dipakai di dua tempat sekaligus, yaitu halaman Profil dan komponen
 * Sidebar. Dengan menyimpannya di context, logo maupun nama bank sampah yang
 * baru disimpan lewat form langsung ikut berubah di sidebar tanpa perlu
 * memuat ulang halaman.
 *
 * Komponen tidak memanggil context ini secara langsung, melainkan melalui
 * hook useProfil.
 */

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as profilApi from "../services/profilApi";

const ProfilContext = createContext(null);

/**
 * Penyedia context profil.
 *
 * @param {{children: React.ReactNode}} props
 */
export function ProfilProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /** Mengambil ulang data profil dari backend. */
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await profilApi.getProfil();
      setData(result);
    } catch (error) {
      console.error("[ProfilContext] refetch error:", error);
      toast.error(error.message || "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data saat provider pertama kali dimuat
  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Menyimpan perubahan profil.
   *
   * Data diambil ulang setelah penyimpanan berhasil, karena backend dapat
   * mengubah sebagian nilainya, misalnya alamat logo yang baru diunggah.
   *
   * @param {object} payload - Field profil, boleh disertai berkas logo.
   * @returns {Promise<object>} Response dari backend.
   */
  const update = async (payload) => {
    try {
      const result = await profilApi.updateProfil(payload);
      toast.success("Perubahan berhasil disimpan.");
      await refetch();
      return result;
    } catch (error) {
      console.error("[ProfilContext] update error:", error);
      toast.error(error.message || "Gagal menyimpan profil");
      throw error;
    }
  };

  /** Menghapus data profil bank sampah. */
  const remove = async () => {
    try {
      await profilApi.deleteProfil();
      toast.success("Data berhasil dihapus.");
      await refetch();
    } catch (error) {
      console.error("[ProfilContext] remove error:", error);
      toast.error(error.message || "Gagal menghapus data profil");
      throw error;
    }
  };

  const value = { data, loading, update, remove, refetch };

  return <ProfilContext.Provider value={value}>{children}</ProfilContext.Provider>;
}

/**
 * Hook untuk membaca context profil.
 *
 * Melempar error bila dipakai di luar ProfilProvider, agar kesalahan
 * penempatan komponen langsung ketahuan.
 *
 * @returns {{data: object|null, loading: boolean, update: Function, remove: Function, refetch: Function}}
 */
// eslint-disable-next-line react-refresh/only-export-components -- context dan hook-nya sengaja diletakkan pada satu berkas
export const useProfilContext = () => {
  const ctx = useContext(ProfilContext);
  if (!ctx) throw new Error("useProfilContext must be used within a ProfilProvider");
  return ctx;
};
