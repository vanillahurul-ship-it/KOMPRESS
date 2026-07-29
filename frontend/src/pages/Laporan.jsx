import Header from "../components/layouts/Header";
import YearFilter from "../components/laporan/YearFilter";
import ExportButtons from "../components/laporan/ExportButtons";
import LaporanTable from "../components/laporan/LaporanTable";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import useLaporan from "../hooks/useLaporan";
import "../components/shared/Card.css";

export default function Laporan() {
  const { data, loading, tahun, changeTahun } = useLaporan();

  return (
    <>
      <Header title="Laporan" subtitle="Laporan pendapatan bulanan" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : !data ? (
        <EmptyState
          title="Laporan belum tersedia"
          description="Pastikan migrasi database sudah dijalankan dan koneksi ke server berhasil."
        />
      ) : (
        <div className="shared-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <div>
              <h2 className="shared-card-title">Tren Bulanan {tahun}</h2>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <YearFilter years={data.available_years} value={tahun} onChange={changeTahun} />
              <ExportButtons laporan={data} />
            </div>
          </div>

          <LaporanTable laporan={data} />
        </div>
      )}
    </>
  );
}
