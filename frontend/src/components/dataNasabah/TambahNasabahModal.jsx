import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../shared/Modal";
import "../shared/Form.css";
import { requiredRule } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatCurrency";
import { NASABAH_STATUS } from "../../constants/statusOptions";

export default function TambahNasabahModal({ show, onClose, onSubmit, initialData }) {
  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nama: "",
      no_rekening: "",
      alamat: "",
      status: "Aktif",
    },
  });

  useEffect(() => {
    if (!show) return;
    reset({
      nama: initialData?.nama || "",
      no_rekening: initialData?.no_rekening || "",
      alamat: initialData?.alamat || "",
      status: initialData?.status || "Aktif",
    });
  }, [show, initialData, reset]);

  if (!show) return null;

  const submit = async (values) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title={isEditMode ? "Edit Nasabah" : "Tambah Nasabah Baru"}>
      <form onSubmit={handleSubmit(submit)}>
        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-nama">Nama Lengkap</label>
          <input id="nasabah-nama" className="shared-form-input" {...register("nama", requiredRule("Nama"))} />
          {errors.nama && <span className="shared-form-error">{errors.nama.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-rekening">No Rekening</label>
          <input
            id="nasabah-rekening"
            className="shared-form-input"
            {...register("no_rekening", requiredRule("Nomor rekening"))}
          />
          {errors.no_rekening && <span className="shared-form-error">{errors.no_rekening.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-alamat">Alamat</label>
          <input id="nasabah-alamat" className="shared-form-input" {...register("alamat", requiredRule("Alamat"))} />
          {errors.alamat && <span className="shared-form-error">{errors.alamat.message}</span>}
        </div>

        {isEditMode && (
          <div className="shared-form-field">
            <label className="shared-form-label">Saldo (Rp)</label>
            <input
              className="shared-form-input readonly"
              readOnly
              value={formatCurrency(initialData?.saldo ?? 0)}
            />
          </div>
        )}

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="nasabah-status">Status</label>
          <select id="nasabah-status" className="shared-form-select" {...register("status")}>
            {NASABAH_STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="shared-form-actions">
          <button type="button" className="shared-form-cancel" onClick={onClose}>Batal</button>
          <button type="submit" className="shared-form-submit" disabled={isSubmitting}>
            {isEditMode ? "Simpan" : "Tambah"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
