/**
 * Halaman Awal (Landing Page)
 *
 * Halaman publik yang memperkenalkan Bank Sampah Macodes kepada pengunjung,
 * tersusun dari beberapa bagian: navigasi, sambutan, tentang kami, cara kerja,
 * layanan, manfaat, kontak, dan catatan kaki.
 *
 * Halaman ini juga menjadi pintu masuk admin melalui modal login.
 *
 * @param {{onLoginSuccess: Function}} props - Dipanggil setelah admin berhasil
 *        masuk. Perpindahan halaman diatur oleh AppRoutes, bukan di sini,
 *        supaya komponen ini tidak perlu mengetahui urusan navigasi.
 */

import { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import HowItWorks from "../components/landing/HowItWorks";
import Services from "../components/landing/Services";
import Benefits from "../components/landing/Benefits";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import LoginModal from "../components/landing/LoginModal";

function LandingPage({ onLoginSuccess }) {
  // Status modal login sengaja dipecah menjadi dua:
  //   isLoginOpen    - menentukan apakah modal masih ada di halaman
  //   isLoginVisible - menentukan apakah modal terlihat (memicu animasi)
  //
  // Pemisahan ini diperlukan agar modal sempat menampilkan animasi memudar
  // sebelum benar-benar dilepas dari halaman. Bila hanya memakai satu status,
  // modal akan hilang seketika tanpa animasi. Lihat onCloseComplete pada
  // komponen LoginModal.
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  /** Membuka modal login. */
  const openLogin = () => {
    setIsLoginOpen(true);
    setIsLoginVisible(true);
  };

  /** Memulai penutupan modal, yaitu menjalankan animasi memudar. */
  const closeLogin = () => setIsLoginVisible(false);

  /** Melepas modal dari halaman setelah animasinya selesai. */
  const finishCloseLogin = () => setIsLoginOpen(false);

  return (
    <>
      {/* Isi halaman diburamkan dan dinonaktifkan selama modal login terbuka */}
      <div className={isLoginOpen ? "pointer-events-none blur-sm" : ""}>
        <Navbar onOpenLogin={openLogin} />
        <Hero onOpenLogin={openLogin} />
        <About />
        <HowItWorks />
        <Services />
        <Benefits />
        <Contact />
        <Footer />
      </div>
      <LoginModal
        isOpen={isLoginOpen}
        isVisible={isLoginVisible}
        onClose={closeLogin}
        onCloseComplete={finishCloseLogin}
        onLoginSuccess={onLoginSuccess}
      />
    </>
  );
}

export default LandingPage;