import FotoMacodes from "../../assets/images/foto-macodes.png";
import adminIcon from "../../assets/icons/landingpage/admin.svg";

function Hero({ onOpenLogin }) {
  return (
    <section id="beranda" className="bg-[#DDE7C9]">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2" style={{ minHeight: '620px' }}>

        {/* Kiri */}
        <div className="flex flex-col justify-center pl-20 pt-8 pb-8">

          <h1
            className="text-[56px] font-bold text-[#4E6F3B]"
            style={{ fontFamily: "var(--font-heading)", lineHeight: '68px' }}
          >
            Ubah Sampah
            <br />
            Menjadi
            <br />
            Bermanfaat
          </h1>

          <p className="mt-6 text-[18px] leading-8 text-[#374151]"
             style={{ fontFamily: "var(--font-body)", maxWidth: '560px' }}
          >
            Bank Sampah Macodes membantu masyarakat mengelola sampah dengan
            bijak, mengubahnya menjadi nilai ekonomi sambil menjaga
            kelestarian lingkungan.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-[10px] bg-[#9EBF73] text-white font-semibold hover:bg-[#89aa63] transition duration-200 ease-out transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3"
              style={{ width: 200, height: 52 }}
            >
             <span>Masuk Admin</span>
             <img src={adminIcon} alt="admin" className="w-8 h-8" />
            </button>
          </div>

        </div>

        {/* Kanan */}
        <div className="w-full h-full flex items-center justify-end overflow-hidden pr-10">

          <img
            src={FotoMacodes}
            alt="Bank Sampah Macodes"
            className="h-auto object-cover"
            style={{ width: '100%', maxWidth: '760px' }}
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;