/**
 * Tombol Tambah Setoran
 *
 * Tombol pembuka modal pencatatan setoran pada halaman Transaksi.
 *
 * @param {{onClick: Function}} props - Dipanggil saat tombol ditekan.
 */

import tambahIcon from "../../assets/icons/datanasabah/tambahnasabah.svg";

export default function ButtonTambahSetoran({ onClick }) {
  return (
    <button type="button" className="shared-button-primary" onClick={onClick}>
      <img src={tambahIcon} alt="" />
      <span>Tambah Setoran</span>
    </button>
  );
}
