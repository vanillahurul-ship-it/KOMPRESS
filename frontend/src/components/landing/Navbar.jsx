import { useState } from "react";
import logobanksampah from "../../assets/icons/logobanksampah.png";

function Navbar({ onOpenLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleMobileLogin = () => {
    closeMenu();
    onOpenLogin();
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-[#F6F4E8] border-b border-[#D8D5C7]">
        <div className="max-w-7xl mx-auto px-14 flex items-center relative" style={{ minHeight: '80px' }}>

          <div className="flex items-center shrink-0 min-w-0">
            <img src={logobanksampah} alt="logo" className="nav-logo" />
            <h1 className="nav-brand text-[#4E6F3B] font-bold truncate" style={{ fontFamily: "var(--font-heading)" }}>Bank Sampah Macodes</h1>
          </div>

          <div className="nav-spacer grow" />

          <div className="nav-links hidden xl:flex items-center gap-8 text-[15px] text-[#6B6B60]">
            <a href="#beranda" className="hover:text-[#4E6F3B]">Beranda</a>
            <a href="#tentang" className="hover:text-[#4E6F3B]">Tentang</a>
            <a href="#layanan" className="hover:text-[#4E6F3B]">Layanan</a>
            <a href="#manfaat" className="hover:text-[#4E6F3B]">Manfaat</a>
            <a href="#kontak" className="hover:text-[#4E6F3B]">Kontak</a>
            <button
              type="button"
              onClick={onOpenLogin}
              className="nav-login-btn rounded-[10px] bg-[#9EBF73] text-white font-semibold hover:bg-[#89aa63] transition duration-200 ease-out transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Masuk
            </button>
          </div>

          <button
            type="button"
            className="nav-toggle xl:hidden"
            aria-label="Buka menu navigasi"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>

        </div>

        {isMenuOpen && (
          <div className="nav-mobile-menu xl:hidden">
            <a href="#beranda" onClick={closeMenu}>Beranda</a>
            <a href="#tentang" onClick={closeMenu}>Tentang</a>
            <a href="#layanan" onClick={closeMenu}>Layanan</a>
            <a href="#manfaat" onClick={closeMenu}>Manfaat</a>
            <a href="#kontak" onClick={closeMenu}>Kontak</a>
            <button
              type="button"
              onClick={handleMobileLogin}
              className="nav-login-btn nav-login-btn-mobile rounded-[10px] bg-[#9EBF73] text-white font-semibold hover:bg-[#89aa63]"
            >
              Masuk
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
