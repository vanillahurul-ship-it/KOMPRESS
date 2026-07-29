import toast from "react-hot-toast";
import { exportLaporanToPdf, exportLaporanToExcel } from "../../utils/exportLaporan";

export default function ExportButtons({ laporan }) {
  const handleExportPdf = async () => {
    try {
      await exportLaporanToPdf(laporan);
    } catch {
      toast.error("Gagal mengekspor PDF");
    }
  };

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
