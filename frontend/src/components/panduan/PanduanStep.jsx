import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "./Panduan.css";

// Catatan bisa berupa satu string atau beberapa poin (array) — keduanya dirender sebagai bullet list.
const toList = (value) => (Array.isArray(value) ? value : [value]);

// Satu section accordion pada halaman Panduan Penggunaan.
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
