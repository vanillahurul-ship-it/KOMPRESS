/**
 * Bagian Tentang Kami
 *
 * Memperkenalkan Bank Sampah Macodes beserta tiga nilai utamanya, yang
 * ditampilkan memakai komponen FeatureCard.
 *
 * Seluruh ikon di bagian ini memakai noBadge, sebab ikon-ikonnya sudah
 * berwarna sehingga tidak perlu lingkaran latar tambahan.
 */

import FeatureCard from "./FeatureCard";
import terpercaya from "../../assets/icons/landingpage/terpercaya.svg";
import peduli from "../../assets/icons/landingpage/peduli.svg";
import menguntungkan from "../../assets/icons/landingpage/menguntungkan.svg";

function About() {
  return (
    <section id="tentang" className="bg-[#F6F4E8] py-20">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="section-title text-[36px]">Tentang Bank Sampah Macodes</h2>

        <p className="text-center text-[18px] text-[#374151] mt-6 max-w-3xl mx-auto leading-8"
           style={{ fontFamily: "var(--font-body)" }}
        >
          Bank Sampah Macodes merupakan tempat pengelolaan sampah yang
          bertujuan meningkatkan kesadaran masyarakat terhadap pentingnya
          menjaga lingkungan sekaligus memberikan manfaat ekonomi melalui
          sistem tabungan sampah.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-stretch">

          <FeatureCard
            icon={terpercaya}
            title="Terpercaya"
            description="Telah melayani masyarakat selama 5 tahun dengan sistem yang transparan dan akuntabel. Kepercayaan Anda adalah prioritas kami."
            noBadge={true}
          />

          <FeatureCard
            icon={peduli}
            title="Peduli Lingkungan"
            description="Mengurangi pencemaran dan meningkatkan kesadaran masyarakat terhadap pengelolaan sampah yang bertanggung jawab."
            noBadge={true}
          />

          <FeatureCard
            icon={menguntungkan}
            title="Menguntungkan"
            description="Dapatkan penghasilan tambahan dari sampah yang Anda kumpulkan dengan harga yang kompetitif dan sistem yang mudah."
            noBadge={true}
          />

        </div>

      </div>

    </section>
  );
}

export default About;