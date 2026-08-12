/**
 * Form Profil Bank Sampah
 *
 * Form pengaturan identitas bank sampah beserta unggahan logonya.
 *
 * Dua hal yang membedakan form ini dari form lain:
 *
 *   1. Penyimpanan memerlukan konfirmasi. Data yang telah lolos pemeriksaan
 *      ditahan lebih dahulu, lalu baru dikirim setelah pengguna menyetujuinya
 *      lewat dialog konfirmasi.
 *
 *   2. Logo yang baru dipilih langsung ditampilkan sebagai pratinjau, sebelum
 *      benar-benar disimpan ke server.
 *
 * @param {object} props
 * @param {object|null} props.profil - Data profil dari context.
 * @param {Function} props.onSubmit - Menyimpan perubahan.
 * @param {Function} props.onDelete - Menghapus data profil.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "../shared/ConfirmDialog";
import "../shared/Form.css";
import "../shared/Card.css";
import { emailRule, phoneRule, requiredRule } from "../../utils/validators";

/**
 * Menyusun nilai awal form dari data profil.
 *
 * Setiap field diberi nilai cadangan berupa teks kosong agar seluruh isian
 * tetap bersifat terkendali (controlled) sejak awal, termasuk ketika data
 * profil belum tersedia.
 *
 * @param {object|null} profil - Data profil dari backend.
 * @returns {object} Nilai awal seluruh isian form.
 */
const buildDefaultValues = (profil) => ({
  nama_bank: profil?.nama_bank || "",
  alamat: profil?.alamat || "",
  no_hp: profil?.no_hp || "",
  email: profil?.email || "",
  jam_operasional: profil?.jam_operasional || "",
  deskripsi: profil?.deskripsi || "",
  logo: null,
});

export default function ProfilForm({ profil, onSubmit, onDelete }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: buildDefaultValues(profil),
  });

  // Isi form yang sudah lolos pemeriksaan dan sedang menunggu persetujuan.
  // Nilainya juga menentukan tampil atau tidaknya dialog konfirmasi.
  const [pendingValues, setPendingValues] = useState(null);

  const [saving, setSaving] = useState(false);

  // Alamat gambar logo yang ditampilkan; bisa berasal dari server maupun dari
  // berkas yang baru saja dipilih
  const [logoPreview, setLogoPreview] = useState(profil?.logo_url || null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const logoFileList = watch("logo");

  // Selaraskan isi form setiap kali data profil berubah, termasuk ketika
  // datanya menjadi kosong setelah penghapusan. Tanpa langkah ini, isian lama
  // akan tetap tertinggal di layar meski datanya sudah tidak ada.
  useEffect(() => {
    reset(buildDefaultValues(profil));
    setLogoPreview(profil?.logo_url || null);
  }, [profil, reset]);

  // Tampilkan pratinjau segera setelah pengguna memilih berkas logo.
  //
  // createObjectURL membuat alamat sementara yang menunjuk ke berkas di
  // perangkat pengguna, sehingga gambar dapat ditampilkan tanpa perlu diunggah
  // lebih dahulu. Alamat tersebut dilepas kembali pada bagian pembersihan agar
  // memori peramban tidak terus terpakai.
  useEffect(() => {
    const file = logoFileList?.[0];
    if (!(file instanceof File)) return;
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFileList]);

  /**
   * Menahan data yang sudah lolos pemeriksaan dan membuka dialog konfirmasi.
   *
   * Data belum dikirim ke server pada tahap ini.
   */
  const stageSubmit = (values) => {
    console.log("[ProfilForm] form valid, awaiting confirmation before saving:", values);
    setPendingValues(values);
  };

  /**
   * Mengirim data yang tertahan setelah pengguna menyetujuinya.
   *
   * Berkas logo dipisahkan dari field lainnya karena elemen input berkas
   * menghasilkan daftar berkas, sedangkan yang diperlukan hanya berkas pertama.
   */
  const confirmSubmit = async () => {
    if (!pendingValues) return;
    const { logo, ...fields } = pendingValues;
    setSaving(true);
    try {
      console.log("[ProfilForm] confirmSubmit: saving", fields, "hasLogo:", Boolean(logo?.[0]));
      await onSubmit({ ...fields, logo: logo?.[0] });
    } catch (error) {
      console.error("[ProfilForm] confirmSubmit error:", error);
    } finally {
      setSaving(false);
      setPendingValues(null);
    }
  };

  /**
   * Menghapus seluruh data profil yang tersimpan, termasuk berkas logonya.
   *
   * Setelah penghapusan berhasil, data profil menjadi kosong. Form dan
   * pratinjau ikut menyesuaikan melalui useEffect di atas, sedangkan sidebar
   * kembali menampilkan logo bawaan aplikasi.
   */
  const confirmRemove = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("[ProfilForm] confirmRemove error:", error);
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  return (
    <section className="shared-card">
      <h2 className="shared-card-title">Informasi Bank Sampah</h2>

      <form onSubmit={handleSubmit(stageSubmit)} style={{ marginTop: 16 }}>
        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-nama">Nama Bank Sampah</label>
          <input id="profil-nama" className="shared-form-input" {...register("nama_bank", requiredRule("Nama bank sampah"))} />
          {errors.nama_bank && <span className="shared-form-error">{errors.nama_bank.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-hp">No Telepon</label>
          <input id="profil-hp" className="shared-form-input" {...register("no_hp", phoneRule)} />
          {errors.no_hp && <span className="shared-form-error">{errors.no_hp.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-email">Email</label>
          <input id="profil-email" type="email" className="shared-form-input" {...register("email", emailRule)} />
          {errors.email && <span className="shared-form-error">{errors.email.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-jam">Jam Operasional</label>
          <input id="profil-jam" className="shared-form-input" placeholder="Senin - Jumat, 08.00 - 16.00" {...register("jam_operasional", requiredRule("Jam operasional"))} />
          {errors.jam_operasional && <span className="shared-form-error">{errors.jam_operasional.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-alamat">Alamat</label>
          <input id="profil-alamat" className="shared-form-input" {...register("alamat", requiredRule("Alamat"))} />
          {errors.alamat && <span className="shared-form-error">{errors.alamat.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-deskripsi">Deskripsi</label>
          <input id="profil-deskripsi" className="shared-form-input" {...register("deskripsi")} />
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="profil-logo">Upload Logo</label>
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Preview logo"
              style={{
                width: 96,
                height: 96,
                objectFit: "contain",
                marginBottom: 10,
                borderRadius: 12,
                border: "1px solid #CFC7B0",
                background: "#F4ECD2",
              }}
            />
          )}
          <input id="profil-logo" type="file" accept="image/*" className="shared-form-input" {...register("logo")} />
        </div>

        <div className="shared-form-actions">
          <button type="submit" className="shared-form-submit" disabled={saving || deleting}>
            Simpan Perubahan
          </button>
          <button
            type="button"
            className="shared-form-cancel"
            onClick={() => setConfirmDeleteOpen(true)}
            disabled={saving || deleting}
          >
            Hapus Perubahan
          </button>
        </div>
      </form>

      {/* Dialog persetujuan penyimpanan */}
      <ConfirmDialog
        isOpen={Boolean(pendingValues)}
        onClose={() => setPendingValues(null)}
        onConfirm={confirmSubmit}
        title="Konfirmasi Perubahan"
        message="Apakah Anda yakin ingin menyimpan perubahan ini?"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
      />

      {/* Dialog persetujuan penghapusan data profil */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmRemove}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus data profil bank sampah ini? Tampilan akan kembali ke kondisi default, termasuk logo."
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        danger
      />
    </section>
  );
}
