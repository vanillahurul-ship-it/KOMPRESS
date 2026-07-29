import { useNavigate } from "react-router-dom";
import { FiHelpCircle } from "react-icons/fi";

export default function Header({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="admin-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <button
        type="button"
        className="admin-header-help"
        onClick={() => navigate("/admin/panduan")}
        aria-label="Cara Penggunaan Website"
        title="Cara Penggunaan Website"
      >
        <FiHelpCircle size={22} />
      </button>
    </header>
  );
}
