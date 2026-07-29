import Header from "../components/layouts/Header";
import StatCard from "../components/beranda/StatCard";
import RevenueTrendChart from "../components/beranda/RevenueTrendChart";
import WeightTrendChart from "../components/beranda/WeightTrendChart";
import PredictionMiniChart from "../components/beranda/PredictionMiniChart";
import LoadingSkeleton from "../components/shared/LoadingSkeleton";
import EmptyState from "../components/shared/EmptyState";
import InfoTooltip from "../components/shared/InfoTooltip";
import useDashboard from "../hooks/useDashboard";
import { formatCurrency, formatNumber } from "../utils/formatCurrency";
import uangIcon from "../assets/icons/home/uang.svg";
import beratIcon from "../assets/icons/home/berat.svg";
import prediksiIcon from "../assets/icons/home/prediksi.svg";
import "../components/shared/Card.css";

export default function Dashboard() {
  const { data, loading } = useDashboard();

  return (
    <>
      <Header title="Halo, Admin Macodes!" subtitle="Selamat datang Admin di website Bank Sampah Macodes" />

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : !data ? (
        <EmptyState
          title="Data dashboard belum tersedia"
          description="Pastikan migrasi database sudah dijalankan dan koneksi ke server berhasil."
        />
      ) : (
        <>
          <div className="stat-card-grid">
            <StatCard
              icon={uangIcon}
              value={formatCurrency(data.pendapatan_bulan_ini)}
              label="Pendapatan Bulan Ini"
              delta={data.persentase_dari_bulan_lalu}
            />
            <StatCard
              icon={beratIcon}
              value={`${formatNumber(data.total_berat_bulan_ini)} kg`}
              label="Berat Sampah Bulan Ini"
            />
            <StatCard
              icon={prediksiIcon}
              value={formatCurrency(data.total_pendapatan_12_bulan)}
              label="Total Pendapatan (12 Bulan)"
            />
            <StatCard value={data.jumlah_nasabah} label="Jumlah Nasabah" />
            <StatCard value={data.jumlah_transaksi} label="Jumlah Transaksi" />
          </div>

          <div className="chart-grid">
            <div className="shared-card">
              <h2 className="shared-card-title">
                Tren Pendapatan Bulanan
                <InfoTooltip
                  text={
                    "Grafik ini menunjukkan perkembangan pendapatan Bank Sampah berdasarkan transaksi yang telah dilakukan.\n\n" +
                    "Sumbu X menunjukkan periode waktu (bulan), sedangkan sumbu Y menunjukkan total pendapatan.\n\n" +
                    "Grafik ini membantu admin mengetahui tren kenaikan maupun penurunan pendapatan dari waktu ke waktu."
                  }
                />
              </h2>
              <p className="shared-card-subtitle">12 bulan terakhir</p>
              <RevenueTrendChart data={data.tren_pendapatan_bulanan} />
            </div>

            <div className="shared-card">
              <h2 className="shared-card-title">
                Tren Berat Sampah Bulanan
                <InfoTooltip
                  text={
                    "Grafik ini menunjukkan perkembangan berat sampah yang berhasil dikumpulkan Bank Sampah berdasarkan transaksi yang telah dilakukan.\n\n" +
                    "Sumbu X menunjukkan periode waktu (bulan), sedangkan sumbu Y menunjukkan total berat sampah dalam kilogram (Kg).\n\n" +
                    "Grafik ini membantu admin memantau naik turunnya jumlah sampah yang terkumpul dari waktu ke waktu."
                  }
                />
              </h2>
              <p className="shared-card-subtitle">12 bulan terakhir</p>
              <WeightTrendChart data={data.tren_berat_bulanan} />
            </div>
          </div>

          <div className="shared-card">
            <h2 className="shared-card-title">
              Grafik Prediksi Pendapatan
              <InfoTooltip
                text={
                  "Grafik ini menunjukkan proyeksi pendapatan Bank Sampah untuk 6 bulan ke depan, dihasilkan oleh algoritma Random Forest Regression berdasarkan data transaksi historis.\n\n" +
                  "Sumbu X menunjukkan periode bulan ke depan, sedangkan sumbu Y menunjukkan perkiraan total pendapatan.\n\n" +
                  "Untuk melihat evaluasi model dan rentang prediksi yang lebih panjang (12 bulan), buka halaman Prediksi."
                }
              />
            </h2>
            <p className="shared-card-subtitle">Prediksi 6 bulan ke depan (Random Forest Regression)</p>
            {data.prediksi ? (
              <PredictionMiniChart predictions={data.prediksi.predictions} />
            ) : (
              <p style={{ color: "#6B7280", fontSize: 13 }}>
                Data histori transaksi belum cukup untuk menjalankan prediksi.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
