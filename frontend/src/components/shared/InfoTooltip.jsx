/**
 * Komponen Keterangan Bantuan
 *
 * Tombol berikon huruf i yang menampilkan kotak penjelasan ketika ditekan.
 * Dipakai di samping judul grafik dan nilai evaluasi pada halaman Beranda dan
 * Prediksi, untuk menjelaskan arti dari yang ditampilkan.
 *
 * @param {{text: string}} props - Isi penjelasan yang ingin ditampilkan.
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./InfoTooltip.css";

// Jarak aman minimal antara kotak penjelasan dan tepi layar, dalam piksel
const VIEWPORT_MARGIN = 16;

export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);

  // Pergeseran mendatar kotak penjelasan agar tidak keluar dari layar
  const [shiftX, setShiftX] = useState(0);

  const wrapperRef = useRef(null);
  const popoverRef = useRef(null);

  // Menutup kotak penjelasan ketika pengguna menekan di luar areanya
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Tombol pemicu dapat berada di mana saja, mengikuti panjang judul dan letak
  // kartunya. Akibatnya kotak penjelasan yang secara bawaan sejajar dengan tepi
  // kiri tombol berpeluang keluar dari layar, entah di sisi kanan maupun kiri.
  //
  // Karena itu posisinya diukur setiap kali kotak dibuka atau ukuran jendela
  // berubah, lalu digeser secukupnya agar kembali masuk ke dalam layar. Cara ini
  // dipilih daripada menetapkan posisi tetap untuk tiap ukuran layar, sebab
  // letak judulnya sendiri tidak dapat dipastikan.
  //
  // useLayoutEffect dipakai, bukan useEffect, supaya pengukuran dan pergeseran
  // terjadi sebelum tampilan digambar. Dengan begitu kotak tidak terlihat
  // meloncat dari posisi awal ke posisi yang sudah diperbaiki.
  useLayoutEffect(() => {
    if (!open) {
      setShiftX(0);
      return undefined;
    }

    const recalc = () => {
      const trigger = wrapperRef.current?.getBoundingClientRect();
      const popover = popoverRef.current?.getBoundingClientRect();
      if (!trigger || !popover) return;

      // Posisi kotak seandainya tidak digeser sama sekali
      const naturalLeft = trigger.left;
      const naturalRight = trigger.left + popover.width;
      let shift = 0;

      // Bila melewati tepi kanan, geser ke kiri secukupnya
      if (naturalRight > window.innerWidth - VIEWPORT_MARGIN) {
        shift -= naturalRight - (window.innerWidth - VIEWPORT_MARGIN);
      }

      // Pemeriksaan tepi kiri dilakukan setelahnya, sebab pergeseran ke kiri
      // di atas dapat membuat kotak justru melewati tepi yang satunya
      if (naturalLeft + shift < VIEWPORT_MARGIN) {
        shift += VIEWPORT_MARGIN - (naturalLeft + shift);
      }
      setShiftX(shift);
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [open]);

  return (
    <span className="shared-info-tooltip" ref={wrapperRef}>
      <button
        type="button"
        className="shared-info-tooltip-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Penjelasan"
      >
        <FiInfo size={16} />
      </button>

      {open && (
        <div
          className="shared-info-tooltip-popover"
          ref={popoverRef}
          style={{ transform: shiftX ? `translateX(${shiftX}px)` : undefined }}
        >
          {text}
        </div>
      )}
    </span>
  );
}
