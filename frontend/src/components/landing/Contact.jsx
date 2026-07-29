import alamat from "../../assets/icons/landingpage/alamat.svg";
import telepon from "../../assets/icons/landingpage/telepon.svg";
import email from "../../assets/icons/landingpage/email.svg";
import jam from "../../assets/icons/landingpage/jam.svg";

function Contact() {
  return (
    <section id="kontak" className="py-12 bg-[#EAF1D9]">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl text-center font-semibold text-[#4E6F3B]" style={{ fontFamily: 'var(--font-heading)' }}>Kontak Kami</h3>
        <p className="text-center text-sm text-[#374151] mt-2" style={{ fontFamily: 'var(--font-body)' }}>
          Siap bergabung atau punya pertanyaan? Hubungi kami sekarang dan mulai perjalanan Anda menuju lingkungan yang lebih hijau!
        </p>

        <div className="mt-8 max-w-3xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}>
                <img src={alamat} alt="alamat" className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[#334E20]">Alamat</div>
              <div className="text-sm text-[#5B5B53]">Jl. Kemuning IX, RT.02/RW.10, Kedung Waringin, Tanah Sareal, Kota Bogor, Jawa Barat 16164</div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}>
                <img src={telepon} alt="telepon" className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[#334E20]">Telepon</div>
              <div className="text-sm text-[#5B5B53]">081387324870 (Aisyah)</div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}>
                <img src={email} alt="email" className="w-6 h-6" />
              </div>
              <div className="font-semibold text-[#334E20]">Email</div>
              <div className="text-sm text-[#5B5B53]">macodesbanksampah@gmail.com</div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#C7D9B6]" style={{ background: 'rgba(84,107,65,0.9)' }}>
                <img src={jam} alt="jam" className="w-8 h-8" />
              </div>
              <div className="font-semibold text-[#334E20]">Jam Operasional</div>
              <div className="text-sm text-[#5B5B53]">Setiap Rabu pukul 09.00-10.00 WIB</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
