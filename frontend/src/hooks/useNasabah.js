/**
 * Hook useNasabah
 *
 * Menyediakan seluruh keperluan data nasabah bagi halaman Data Nasabah:
 * pengambilan data, penambahan, perubahan, dan penghapusan.
 *
 * Pola yang dipakai pada setiap operasi tulis:
 *   1. Kirim permintaan ke backend
 *   2. Tampilkan pemberitahuan berhasil
 *   3. Ambil ulang data agar tampilan selalu sama dengan isi basis data
 *
 * Error tetap dilempar kembali setelah pemberitahuan ditampilkan, supaya
 * komponen pemanggil dapat menahan modal agar tidak tertutup ketika
 * penyimpanan gagal.
 */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as nasabahApi from "../services/nasabahApi";

/**
 * @returns {{data: Array, loading: boolean, create: Function, update: Function, remove: Function, refetch: Function}}
 */
export default function useNasabah() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Mengambil ulang seluruh data nasabah dari backend. */
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await nasabahApi.getAllNasabah();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data nasabah");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Menambahkan nasabah baru.
   * @param {object} payload - Data nasabah dari form.
   */
  const create = async (payload) => {
    try {
      await nasabahApi.createNasabah(payload);
      toast.success("Nasabah berhasil ditambahkan");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan nasabah");
      throw error;
    }
  };

  /**
   * Memperbarui data nasabah.
   * @param {number|string} id - Id nasabah.
   * @param {object} payload - Data baru dari form.
   */
  const update = async (id, payload) => {
    try {
      await nasabahApi.updateNasabah(id, payload);
      toast.success("Nasabah berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan nasabah");
      throw error;
    }
  };

  /**
   * Menghapus nasabah.
   * @param {number|string} id - Id nasabah.
   */
  const remove = async (id) => {
    try {
      await nasabahApi.deleteNasabah(id);
      toast.success("Nasabah berhasil dihapus");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus nasabah");
      throw error;
    }
  };

  return { data, loading, create, update, remove, refetch };
}
