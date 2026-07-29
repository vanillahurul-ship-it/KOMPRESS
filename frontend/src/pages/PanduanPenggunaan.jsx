import Header from "../components/layouts/Header";
import PanduanStep from "../components/panduan/PanduanStep";
import { PANDUAN_STEPS } from "../data/panduanContent";
import "../components/shared/Card.css";
import "../components/panduan/Panduan.css";

export default function PanduanPenggunaan() {
  return (
    <>
      <Header
        title="Cara Penggunaan Website"
        subtitle="Panduan langkah demi langkah menggunakan website Bank Sampah Macodes"
      />

      <section className="shared-card">
        <h2 className="shared-card-title">Panduan Admin</h2>
        <p className="shared-card-subtitle">
          Klik setiap bagian di bawah untuk melihat langkah-langkahnya.
        </p>

        <div className="panduan-list">
          {PANDUAN_STEPS.map((step) => (
            <PanduanStep key={step.judul} {...step} />
          ))}
        </div>
      </section>
    </>
  );
}
