/**
 * Bagian Panduan
 *
 * Satu bagian panduan yang dapat dibuka dan ditutup pada halaman Cara
 * Penggunaan Website. Isinya terdiri dari langkah-langkah bernomor dan
 * catatan tambahan yang bersifat opsional.
 *
 * @param {object} props
 * @param {string} props.judul - Judul bagian yang selalu terlihat.
 * @param {string} [props.deskripsi] - Pengantar singkat sebelum langkah.
 * @param {Array<string>} props.langkah - Langkah-langkah yang perlu dilakukan.
 * @param {string|Array<string>} [props.catatan] - Catatan tambahan.
 */

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "./Panduan.css";

/**
 * Menyeragamkan catatan menjadi bentuk daftar.
 *
 * Catatan boleh ditulis sebagai satu kalimat maupun beberapa poin, sehingga
 * penulisan isi panduan tidak perlu terikat satu bentuk saja.
 *
 * @param {string|Array<string>} value - Catatan dalam bentuk apa pun.
 * @returns {Array<string>} Catatan dalam bentuk daftar.
 */
const toList = (value) => (Array.isArray(value) ? value : [value]);

export default function PanduanStep({ judul, deskripsi, langkah, catatan }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`panduan-step ${open ? "open" : ""}`}>
      <button type="button" className="panduan-step-header" onClick={() => setOpen((prev) => !prev)}>
        <span className="panduan-step-title">{judul}</span>
        <FiChevronDown className="panduan-step-chevron" size={20} />
      </button>

      {open && (
        <div className="panduan-step-body">
          {deskripsi && <p className="panduan-step-desc">{deskripsi}</p>}

          <ol className="panduan-step-numbered-list">
            {langkah.map((item, index) => (
              <li key={index} className="panduan-step-numbered-item">
                <span className="panduan-step-number">{index + 1}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>

          {catatan && (
            <div className="panduan-step-note">
              <p className="panduan-step-note-title">Catatan</p>
              <ul className="panduan-step-note-list">
                {toList(catatan).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
