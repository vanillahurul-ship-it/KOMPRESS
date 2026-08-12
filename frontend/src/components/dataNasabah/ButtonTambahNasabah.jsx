/**
 * Tombol Tambah Nasabah
 *
 * Tombol pembuka modal penambahan nasabah pada halaman Data Nasabah.
 *
 * @param {{onClick: Function}} props - Dipanggil saat tombol ditekan.
 */

import tambahIcon from "../../assets/icons/datanasabah/tambahnasabah.svg";

export default function ButtonTambahNasabah({ onClick }) {
  return (
    <button type="button" className="shared-button-primary" onClick={onClick}>
      <img src={tambahIcon} alt="" />
      <span>Tambah Nasabah</span>
    </button>
  );
}
