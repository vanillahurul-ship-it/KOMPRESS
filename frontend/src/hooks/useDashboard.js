/**
 * Hook useDashboard
 *
 * Mengambil data ringkasan untuk halaman beranda, sekaligus mengelola status
 * pemuatan dan penanganan kegagalannya.
 */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as dashboardApi from "../services/dashboardApi";

/**
 * @returns {{data: object|null, loading: boolean, refetch: Function}}
 */
export default function useDashboard() {
  const [data, setData] = useState(null);

  // Bernilai true sejak awal karena pengambilan data langsung dijalankan
  // saat komponen dimuat
  const [loading, setLoading] = useState(true);

  /**
   * Mengambil ulang data beranda.
   *
   * Dibungkus useCallback agar acuan fungsinya tetap sama antar-render,
   * sehingga useEffect di bawah tidak berjalan berulang tanpa henti.
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await dashboardApi.getDashboard();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, refetch };
}
