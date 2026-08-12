/**
 * Hook useDebounce
 *
 * Menunda pembaruan sebuah nilai sampai pengguna berhenti mengubahnya selama
 * jangka waktu tertentu.
 *
 * Dipakai pada kolom pencarian agar penyaringan data tidak dijalankan pada
 * setiap ketikan, melainkan hanya setelah pengguna selesai mengetik.
 */

import { useEffect, useState } from "react";

/**
 * @param {any} value - Nilai yang ingin ditunda pembaruannya.
 * @param {number} [delay=300] - Lama penundaan dalam milidetik.
 * @returns {any} Nilai yang sudah tertunda.
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    // Pembersihan ini yang membuat penundaan bekerja: setiap kali nilai
    // berubah, penghitung waktu sebelumnya dibatalkan dan dimulai dari awal.
    // Nilai baru baru benar-benar diterapkan bila tidak ada perubahan lagi
    // selama jangka waktu yang ditentukan.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
