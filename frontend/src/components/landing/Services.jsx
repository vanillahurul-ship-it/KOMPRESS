function Services() {
  const cards = [
    { title: 'Plastik', items: ['Botol Plastik', 'Plastik Kemasan', 'Pet Campur', 'dan lain - lain'] },
    { title: 'Kertas', items: ['Kertas HVS', 'Koran', 'Majalah', 'dan lain - lain'] },
    { title: 'Lain - Lain', items: ['Naso', 'Duplek', 'Besi', 'dan lain - lain'] },
  ];

  return (
    <section id="layanan" className="py-12 bg-[#EAF1D9]">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="section-title text-[22px]">Layanan Bank Sampah</h3>
        <p className="text-center text-sm text-[#374151] mt-2 center-content">Jenis sampah yang kami terima yaitu, berbagai jenis sampah anorganik yang dapat didaur ulang.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, idx) => (
            <div key={idx} className="bg-[#F7F3E6] border border-[#E7E1CF] rounded-lg p-6 text-center">
              <h4 className="font-semibold text-[#334E20] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{c.title}</h4>
              <ul className="text-sm text-[#5B5B53] mx-auto" style={{ fontFamily: 'var(--font-body)', maxWidth: '220px' }}>
                {c.items.map((it, i) => (<li key={i} className="mb-1">• {it}</li>))}
              </ul>
              <div className="mt-4 font-semibold text-sm text-[#334E20]">Harga Bervariasi</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
