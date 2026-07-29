import tambahIcon from "../../assets/icons/datanasabah/tambahnasabah.svg";

export default function ButtonTambahNasabah({ onClick }) {
  return (
    <button type="button" className="shared-button-primary" onClick={onClick}>
      <img src={tambahIcon} alt="" />
      <span>Tambah Nasabah</span>
    </button>
  );
}
