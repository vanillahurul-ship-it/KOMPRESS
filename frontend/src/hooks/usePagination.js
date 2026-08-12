/**
 * Hook usePagination
 *
 * Memotong sebuah daftar menjadi beberapa halaman.
 *
 * Hook ini menerima daftar yang sudah tersaring, sehingga penyaringan dan
 * pembagian halaman tetap menjadi dua urusan yang terpisah.
 */

import { useMemo, useState } from "react";

/**
 * @param {Array} items - Daftar data yang sudah tersaring.
 * @param {number} [pageSize=10] - Jumlah baris per halaman.
 * @returns {{page: number, setPage: Function, totalPages: number, pageItems: Array}}
 */
export default function usePagination(items, pageSize = 10) {
  const [requestedPage, setPage] = useState(1);

  // Minimal satu halaman, supaya daftar kosong tetap menampilkan "Halaman 1 dari 1"
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Nomor halaman dibatasi saat render, bukan lewat useEffect. Bila jumlah data
  // menyusut (misalnya karena kata kunci pencarian dipersempit) sedangkan
  // pengguna sedang berada di halaman akhir, tampilan langsung mundur ke
  // halaman terakhir yang masih ada tanpa sempat menampilkan halaman kosong.
  const page = Math.min(requestedPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return { page, setPage, totalPages, pageItems };
}
