/**
 * Penyaring Tahun
 *
 * Dropdown pemilih tahun yang dipakai bersama oleh halaman Laporan dan
 * Transaksi.
 *
 * Kedua halaman memakainya dengan cara berbeda. Halaman Laporan selalu
 * menampilkan satu tahun tertentu, sedangkan halaman Transaksi menyediakan
 * pilihan tambahan untuk menampilkan seluruh tahun. Perbedaan itulah yang
 * diatur lewat pilihan includeAll.
 *
 * @param {object} props
 * @param {Array<number>} props.years - Daftar tahun yang tersedia.
 * @param {number|string} props.value - Tahun yang sedang dipilih.
 * @param {Function} props.onChange - Dipanggil dengan tahun terpilih berupa
 *        angka, atau teks kosong bila pilihan "semua tahun" dipilih.
 * @param {boolean} [props.includeAll=false] - Menyertakan pilihan semua tahun.
 * @param {string} [props.allLabel="Semua Tahun"] - Tulisan pada pilihan tersebut.
 */

export default function YearFilter({ years, value, onChange, includeAll = false, allLabel = "Semua Tahun" }) {
  return (
    <select
      value={value || ""}
      // Nilai dari elemen select selalu berupa teks, sedangkan tahun diolah
      // sebagai angka, sehingga perlu diubah lebih dahulu. Teks kosong
      // dibiarkan apa adanya sebagai penanda pilihan "semua tahun".
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
      className="shared-form-select"
      style={{ maxWidth: 160 }}
      aria-label="Filter Tahun"
    >
      {includeAll && <option value="">{allLabel}</option>}
      {years.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  );
}
