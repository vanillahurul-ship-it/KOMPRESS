import searchIcon from "../../assets/icons/datanasabah/searchnasabah.svg";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="shared-search-bar">
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
