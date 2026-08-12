/**
 * Hook useProfil
 *
 * Pembungkus tipis di atas ProfilContext.
 *
 * Data profil sengaja disimpan di context, bukan di dalam hook ini, karena
 * dipakai bersama oleh halaman Profil dan komponen Sidebar. Dengan berbagi
 * satu sumber data yang sama, logo yang baru disimpan lewat form langsung
 * ikut berubah pada sidebar tanpa perlu memuat ulang halaman.
 *
 * Hook ini tetap disediakan supaya komponen memanggil data profil dengan cara
 * yang sama seperti hook data lainnya.
 */

import { useProfilContext } from "../context/ProfilContext";

export default function useProfil() {
  return useProfilContext();
}
