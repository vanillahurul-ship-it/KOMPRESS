import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "../shared/ConfirmDialog";
import "../shared/Form.css";
import "../shared/Card.css";
import { emailRule, phoneRule, requiredRule } from "../../utils/validators";

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

  const [pendingValues, setPendingValues] = useState(null);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(profil?.logo_url || null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const logoFileList = watch("logo");

  useEffect(() => {
    // Reset on every profil change — including profil === null (e.g. right after
    // a delete), so the form actually clears instead of keeping stale values.
    reset(buildDefaultValues(profil));
    setLogoPreview(profil?.logo_url || null);
  }, [profil, reset]);

  useEffect(() => {
    const file = logoFileList?.[0];
    if (!(file instanceof File)) return;
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFileList]);

  const stageSubmit = (values) => {
    console.log("[ProfilForm] form valid, awaiting confirmation before saving:", values);
    setPendingValues(values);
  };

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

  // "Hapus Perubahan" clears the saved profile (including the stored logo)
  // back to its default, blank state — via the existing DELETE /profil
  // endpoint. The form/preview then follow `profil` becoming null through
  // the effect above, and the sidebar falls back to the default logo.
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

      <ConfirmDialog
        isOpen={Boolean(pendingValues)}
        onClose={() => setPendingValues(null)}
        onConfirm={confirmSubmit}
        title="Konfirmasi Perubahan"
        message="Apakah Anda yakin ingin menyimpan perubahan ini?"
        confirmLabel="Ya, Simpan"
        cancelLabel="Batal"
      />

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
