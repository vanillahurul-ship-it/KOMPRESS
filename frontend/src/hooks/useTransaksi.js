/**
 * Hook useTransaksi
 *
 * Menyediakan seluruh keperluan data transaksi bagi halaman Transaksi:
 * pengambilan data, pencatatan setoran, perubahan data, perubahan status,
 * dan penghapusan.
 *
 * Setiap operasi tulis selalu diakhiri dengan pengambilan ulang data, sebab
 * backend menghitung sendiri harga satuan dan total setoran. Nilai hasil
 * perhitungan tersebut hanya dapat diketahui dengan membaca ulang datanya.
 */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as transaksiApi from "../services/transaksiApi";

/**
 * @returns {{data: Array, loading: boolean, create: Function, update: Function, updateStatus: Function, remove: Function, refetch: Function}}
 */
export default function useTransaksi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Mengambil ulang seluruh data transaksi dari backend. */
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transaksiApi.getAllTransaksi();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Mencatat setoran sampah baru.
   * @param {object} payload - Data setoran dari form.
   */
  const create = async (payload) => {
    try {
      await transaksiApi.createTransaksi(payload);
      toast.success("Setoran berhasil ditambahkan");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan setoran");
      throw error;
    }
  };

  /**
   * Memperbarui data setoran.
   * @param {number|string} id - Id transaksi.
   * @param {object} payload - Data baru dari form.
   */
  const update = async (id, payload) => {
    try {
      await transaksiApi.updateTransaksi(id, payload);
      toast.success("Setoran berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan setoran");
      throw error;
    }
  };

  /**
   * Mengubah status setoran melalui dropdown pada tabel.
   * @param {number|string} id - Id transaksi.
   * @param {string} status - Status baru.
   */
  const updateStatus = async (id, status) => {
    try {
      await transaksiApi.updateTransaksiStatus(id, status);
      toast.success("Status setoran berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui status");
      throw error;
    }
  };

  /**
   * Menghapus setoran.
   * @param {number|string} id - Id transaksi.
   */
  const remove = async (id) => {
    try {
      await transaksiApi.deleteTransaksi(id);
      toast.success("Setoran berhasil dihapus");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus setoran");
      throw error;
    }
  };

  return { data, loading, create, update, updateStatus, remove, refetch };
}
