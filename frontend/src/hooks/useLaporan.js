/**
 * Hook useLaporan
 *
 * Mengambil data laporan tahunan sekaligus mengelola tahun yang sedang
 * ditampilkan.
 *
 * Penyaringan tahun dilakukan di backend, bukan di peramban, karena backend
 * juga yang menentukan tahun bawaan dan menyusun daftar tahun yang tersedia.
 */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as laporanApi from "../services/laporanApi";

/**
 * @returns {{data: object|null, loading: boolean, tahun: number|null, changeTahun: Function}}
 */
export default function useLaporan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState(null);

  /**
   * Mengambil data laporan.
   *
   * Tahun yang tersimpan diambil dari response, bukan dari parameter, sebab
   * saat pemuatan pertama parameternya memang kosong dan backend-lah yang
   * menentukan tahun mana yang ditampilkan.
   *
   * @param {number|string} [targetTahun] - Tahun yang ingin ditampilkan.
   */
  const refetch = useCallback(async (targetTahun) => {
    setLoading(true);
    try {
      const result = await laporanApi.getLaporan(targetTahun);
      setData(result);
      setTahun(result.tahun);
    } catch (error) {
      toast.error(error.message || "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }, []);

  // Pemuatan pertama tanpa parameter, sehingga backend memilih tahun terbaru
  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Mengganti tahun yang ditampilkan lewat filter di halaman Laporan.
   * @param {number|string} targetTahun - Tahun yang dipilih pengguna.
   */
  const changeTahun = (targetTahun) => refetch(targetTahun);

  return { data, loading, tahun, changeTahun };
}
