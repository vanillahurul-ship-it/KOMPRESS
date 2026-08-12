/**
 * Hook useAdmins
 *
 * Mengambil daftar akun admin dan menyediakan operasi pengelolaannya, yaitu
 * mengganti nama dan menyetel ulang kata sandi.
 *
 * Kata sandi yang sedang berlaku tidak dapat ditampilkan, karena Supabase
 * Auth menyimpannya dalam bentuk terenkripsi dan tidak pernah
 * mengembalikannya. Karena itu yang tersedia hanya penggantian kata sandi.
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as profilApi from "../services/profilApi";

/**
 * @returns {{admins: Array, loading: boolean, resetPassword: Function, updateName: Function}}
 */
export default function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Daftar admin hanya diambil sekali saat komponen dimuat, sebab datanya
  // jarang berubah dan perubahan yang terjadi selalu berasal dari halaman ini
  useEffect(() => {
    profilApi
      .listAdmins()
      .then(setAdmins)
      .catch((error) => toast.error(error.message || "Gagal memuat daftar admin"))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Menyetel ulang kata sandi seorang admin.
   *
   * Tidak perlu memperbarui tampilan, karena kata sandi memang tidak
   * ditampilkan di daftar admin.
   *
   * @param {string} id - Id admin.
   * @param {string} password - Kata sandi baru.
   */
  const resetPassword = async (id, password) => {
    try {
      await profilApi.resetAdminPassword(id, password);
      toast.success("Password admin berhasil diperbarui");
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui password admin");
      throw error;
    }
  };

  /**
   * Mengubah nama seorang admin.
   *
   * Nama pada daftar diperbarui langsung di sisi peramban, tanpa mengambil
   * ulang seluruh data, karena nilai barunya sudah pasti diketahui.
   *
   * @param {string} id - Id admin.
   * @param {string} name - Nama baru.
   */
  const updateName = async (id, name) => {
    try {
      await profilApi.updateAdminName(id, name);
      setAdmins((current) => current.map((admin) => (admin.id === id ? { ...admin, nama: name } : admin)));
      toast.success("Nama admin berhasil diperbarui");
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui nama admin");
      throw error;
    }
  };

  return { admins, loading, resetPassword, updateName };
}
