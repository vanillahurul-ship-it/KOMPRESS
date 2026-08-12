/**
 * Bagian Manfaat Bergabung
 *
 * Menampilkan keuntungan menjadi nasabah bank sampah, dibagi menjadi dua
 * kelompok berdampingan: manfaat ekonomi dan manfaat lingkungan.
 */

import manfaatekonomi from "../../assets/icons/landingpage/manfaatekonomi.svg";
import manfaatlingkungan from "../../assets/icons/landingpage/manfaatlingkungan.svg";
import ceklis from "../../assets/icons/landingpage/ceklismanfaat.svg";

function Benefits() {
  // Daftar poin manfaat ekonomi
  const econ = [
    'Penghasilan tambahan dari penjualan sampah',
    'Sistem tabungan yang transparan dan aman',
    'Harga sampah yang kompetitif',
    'Pencairan saldo yang mudah dan cepat',
  ];
  // Daftar poin manfaat lingkungan
  const env = [
    'Mengurangi volume sampah di TPA',
    'Mencegah pencemaran lingkungan',
    'Meningkatkan kesadaran pengelolaan sampah',
    'Berkontribusi untuk bumi yang lebih hijau',
  ];

  return (
    <section id="manfaat" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl text-center font-semibold text-[#4E6F3B]" style={{ fontFamily: 'var(--font-heading)' }}>Manfaat Bergabung</h3>
        <p className="text-center text-sm text-[#374151] mt-2" style={{ fontFamily: 'var(--font-body)' }}>Dapatkan berbagai keuntungan dengan menjadi anggota Bank Sampah Macodes</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F7F3E6] border border-[#E7E1CF] rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}><img src={manfaatekonomi} alt="ekonomi" className="w-6 h-6" /></div>
              <h4 className="font-semibold text-[#334E20]" style={{ fontFamily: 'var(--font-heading)' }}>MANFAAT EKONOMI</h4>
            </div>
            <ul className="mt-4 space-y-2 text-[#5B5B53]" style={{ fontFamily: 'var(--font-body)' }}>
              {econ.map((e, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="check-badge">
                    <img src={ceklis} alt="cek" className="w-4 h-4" />
                  </div>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#F7F3E6] border border-[#E7E1CF] rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}><img src={manfaatlingkungan} alt="lingkungan" className="w-6 h-6" /></div>
              <h4 className="font-semibold text-[#334E20]" style={{ fontFamily: 'var(--font-heading)' }}>MANFAAT LINGKUNGAN</h4>
            </div>
            <ul className="mt-4 space-y-2 text-[#5B5B53]" style={{ fontFamily: 'var(--font-body)' }}>
              {env.map((e, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="check-badge">
                    <img src={ceklis} alt="cek" className="w-4 h-4" />
                  </div>
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Benefits;
