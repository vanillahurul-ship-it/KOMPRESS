function HowItWorks() {
  const steps = [
    { title: "Daftar Sebagai Admin", desc: "Daftarkan diri Anda dan dapatkan buku tabungan sampah secara gratis." },
    { title: "Pilah Sampah", desc: "Pisahkan sampah organik dan anorganik di rumah Anda dengan benar." },
    { title: "Setor Sampah", desc: "Bawa sampah yang sudah dipilah ke Bank Sampah Macodes pada hari operasional." },
    { title: "Terima Penghasilan", desc: "Sampah ditimbang dan saldo tabungan Anda akan langsung bertambah." },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="section-title text-[22px]">Cara Kerja</h3>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 items-stretch">
          {steps.map((s, i) => (
            <div key={i} className="card text-center">
              <div className="w-12 h-12 rounded-md bg-[#DDE7C9] mx-auto flex items-center justify-center text-lg font-bold text-[#334E20]">{i+1}</div>
              <h4 className="mt-4 font-semibold">{s.title}</h4>
              <p className="mt-2 text-sm text-[#5B5B53]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
