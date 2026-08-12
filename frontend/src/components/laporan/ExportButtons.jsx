/**
 * Tombol Unduh Laporan
 *
 * Menyediakan dua tombol untuk mengunduh laporan sebagai berkas PDF atau Excel.
 *
 * Penyusunan berkas dilakukan di peramban melalui utils/exportLaporan.js,
 * sehingga isi berkas selalu sama dengan yang sedang ditampilkan di layar.
 *
 * @param {{laporan: object}} props - Data laporan yang sedang ditampilkan.
 */

import toast from "react-hot-toast";
import { exportLaporanToPdf, exportLaporanToExcel } from "../../utils/exportLaporan";

export default function ExportButtons({ laporan }) {
  /** Mengunduh laporan sebagai berkas PDF. */
  const handleExportPdf = async () => {
    try {
      await exportLaporanToPdf(laporan);
    } catch {
      toast.error("Gagal mengekspor PDF");
    }
  };

  /** Mengunduh laporan sebagai berkas Excel. */
  const handleExportExcel = async () => {
    try {
      await exportLaporanToExcel(laporan);
    } catch {
      toast.error("Gagal mengekspor Excel");
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button type="button" className="shared-button-primary" onClick={handleExportPdf}>
        Export PDF
      </button>
      <button type="button" className="shared-button-primary" onClick={handleExportExcel}>
        Export Excel
      </button>
    </div>
  );
}
