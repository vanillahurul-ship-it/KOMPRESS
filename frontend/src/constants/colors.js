/**
 * Palet Warna Aplikasi
 *
 * Nilai-nilai di sini merupakan salinan dari CSS custom properties (--admin-*)
 * yang didefinisikan di src/index.css.
 *
 * Penyalinan ini diperlukan karena pustaka grafik seperti Recharts menerima
 * warna dalam bentuk nilai JavaScript, bukan variabel CSS. Dengan menyimpan
 * salinannya di sini, tampilan grafik tetap selaras dengan warna panel admin.
 *
 * Catatan pemeliharaan: bila warna di index.css diubah, nilai di berkas ini
 * perlu ikut disesuaikan agar keduanya tidak berbeda.
 */

export const COLORS = {
  background: "#F6F4E8",
  sidebar: "#E1EAD3",
  sidebarActive: "#FDFAF6",
  sidebarStroke: "#000000",
  header: "#2C3947",
  headerText: "#E1EAD3",
  brand: "#39701A",
  adminBox: "rgba(131, 147, 113, 0.8)",
  adminText: "#FFFFFF",
  adminName: "#000000",
  iconCircle: "#2C3947",
  card: "#FDFAF6",
  tableHeader: "rgba(168, 178, 152, 0.91)",
  search: "rgba(90, 136, 65, 0.75)",
  button: "#AFC99C",
  primary: "#546B41",
  text: "#2C3947",
  rupiah: "#5A8841",
};

/**
 * Urutan warna untuk garis dan batang pada grafik.
 * Disusun agar warna antarseri tetap mudah dibedakan.
 */
export const CHART_PALETTE = [COLORS.primary, COLORS.rupiah, COLORS.brand, COLORS.button];
