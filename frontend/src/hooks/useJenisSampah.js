/**
 * Hook useJenisSampah
 *
 * Menyediakan data daftar harga sampah beserta operasi tambah, ubah, dan
 * hapusnya untuk halaman Jenis Sampah.
 *
 * Hook ini juga dipakai halaman Transaksi untuk mengisi pilihan jenis sampah
 * pada form setoran.
 */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as jenisSampahApi from "../services/jenisSampahApi";

/**
 * @returns {{data: Array, loading: boolean, create: Function, update: Function, remove: Function, refetch: Function}}
 */
export default function useJenisSampah() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Mengambil ulang daftar jenis sampah dari backend. */
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await jenisSampahApi.getAllJenisSampah();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data jenis sampah");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Menambahkan jenis sampah baru.
   * @param {object} payload - Data jenis sampah dari form.
   */
  const create = async (payload) => {
    try {
      await jenisSampahApi.createJenisSampah(payload);
      toast.success("Jenis sampah berhasil ditambahkan");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan jenis sampah");
      throw error;
    }
  };

  /**
   * Memperbarui data jenis sampah.
   * @param {number|string} id - Id jenis sampah.
   * @param {object} payload - Data baru dari form.
   */
  const update = async (id, payload) => {
    try {
      await jenisSampahApi.updateJenisSampah(id, payload);
      toast.success("Jenis sampah berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan jenis sampah");
      throw error;
    }
  };

  /**
   * Menghapus jenis sampah.
   * @param {number|string} id - Id jenis sampah.
   */
  const remove = async (id) => {
    try {
      await jenisSampahApi.deleteJenisSampah(id);
      toast.success("Jenis sampah berhasil dihapus");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus jenis sampah");
      throw error;
    }
  };

  return { data, loading, create, update, remove, refetch };
}
