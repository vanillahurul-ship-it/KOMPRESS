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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  const openLogin = () => {
    setIsLoginOpen(true);
    setIsLoginVisible(true);
  };

  const closeLogin = () => setIsLoginVisible(false);

  const finishCloseLogin = () => setIsLoginOpen(false);

  return (
    <>
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