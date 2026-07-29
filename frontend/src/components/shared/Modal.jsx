import { useEffect, useState } from "react";
import "./Modal.css";

// Reusable blur-backdrop modal, same visual pattern as the Landing Page's LoginModal.
// Usage: <Modal isOpen={open} onClose={close} title="Tambah Nasabah">{...form...}</Modal>
export default function Modal({ isOpen, onClose, title, children, maxWidth }) {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setVisible(false);
    const timeout = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="shared-modal-root">
      <div className="shared-modal-backdrop" onClick={onClose} />
      <div
        className={`shared-modal-container ${visible ? "visible" : ""}`}
        style={maxWidth ? { "--shared-modal-max-width": maxWidth } : undefined}
      >
        <div className="shared-modal-header">
          <h2 className="shared-modal-title">{title}</h2>
          <button type="button" className="shared-modal-close" onClick={onClose} aria-label="Tutup">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
