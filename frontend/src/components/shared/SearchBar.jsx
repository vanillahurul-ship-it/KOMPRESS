/**
 * Komponen Kolom Pencarian
 *
 * Kolom isian pencarian beserta ikon kaca pembesar.
 *
 * Komponen ini bersifat terkendali (controlled), yaitu nilainya sepenuhnya
 * diatur oleh komponen induk. Penundaan pencarian juga ditangani induk melalui
 * hook useDebounce, sehingga komponen ini cukup mengurus tampilannya saja.
 *
 * @param {object} props
 * @param {string} props.value - Kata kunci yang sedang diketik.
 * @param {Function} props.onChange - Penangan perubahan isian.
 * @param {string} [props.placeholder="Cari..."] - Teks petunjuk pada kolom isian.
 */

import searchIcon from "../../assets/icons/datanasabah/searchnasabah.svg";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="shared-search-bar">
      {/* Atribut alt sengaja dikosongkan karena ikon ini hanya hiasan,
          sehingga tidak perlu dibacakan oleh pembaca layar */}
      <img src={searchIcon} alt="" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
