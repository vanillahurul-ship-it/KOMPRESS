/**
 * Form Jenis Sampah
 *
 * Form penambahan dan perubahan data jenis sampah, ditampilkan berdampingan
 * dengan daftarnya di halaman Jenis Sampah.
 *
 * Admin hanya mengisi harga jual ke DLH. Harga beli dari nasabah dihitung
 * otomatis dari nilai tersebut dan tidak dapat disunting, sehingga
 * perbandingan keduanya selalu terjaga.
 *
 * @param {object} props
 * @param {object} [props.editingItem] - Jenis sampah yang sedang diubah.
 * @param {Function} props.onSubmit - Menyimpan data.
 * @param {Function} props.onCancelEdit - Membatalkan mode ubah.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import "../shared/Form.css";
import "../shared/Card.css";
import { requiredRule, nonNegativeNumberRule } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatCurrency";

// Harga beli dari nasabah selalu 75 persen dari harga jual ke DLH, sesuai
// kebijakan Bank Sampah Macodes. Selisih 25 persen menjadi pemasukan bank
// sampah untuk biaya operasional.
const HARGA_NASABAH_RATIO = 0.75;

// Nilai awal form saat dalam mode tambah data baru
const EMPTY_VALUES = { nama: "", harga_dlh_per_kg: "" };

export default function JenisSampahForm({ editingItem, onSubmit, onCancelEdit }) {
  const isEditMode = Boolean(editingItem?.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: EMPTY_VALUES,
  });

  // Isi form mengikuti data yang dipilih dari daftar. Bila pilihan dikosongkan,
  // form ikut kembali kosong dan siap dipakai menambah data baru.
  useEffect(() => {
    reset({
      nama: editingItem?.nama || "",
      harga_dlh_per_kg: editingItem?.harga_dlh_per_kg ?? "",
    });
  }, [editingItem, reset]);

  // watch membuat nilai ini dihitung ulang setiap kali isian harga DLH berubah,
  // sehingga harga ke nasabah langsung ikut diperbarui di layar
  const hargaDlh = Number(watch("harga_dlh_per_kg")) || 0;
  const hargaNasabah = hargaDlh * HARGA_NASABAH_RATIO;

  /**
   * Menyimpan data, lalu mengosongkan form agar siap untuk pengisian berikutnya.
   *
   * Harga beli dari nasabah ikut dikirim meski tidak diisi pengguna, sebab
   * nilainya merupakan hasil perhitungan yang perlu tersimpan di basis data.
   */
  const submit = async (values) => {
    await onSubmit({
      nama: values.nama,
      harga_dlh_per_kg: Number(values.harga_dlh_per_kg || 0),
      harga_per_kg: hargaNasabah,
    });
    reset(EMPTY_VALUES);
  };

  return (
    <section className="shared-card">
      <h2 className="shared-card-title">{isEditMode ? "Edit Jenis Sampah" : "Tambah Jenis Bank Sampah"}</h2>

      <form onSubmit={handleSubmit(submit)} style={{ marginTop: 16 }}>
        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="jenis-nama">Nama Jenis Sampah</label>
          <input id="jenis-nama" className="shared-form-input" {...register("nama", requiredRule("Nama jenis sampah"))} />
          {errors.nama && <span className="shared-form-error">{errors.nama.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="jenis-harga-dlh">Harga ke DLH per Kg (Rp)</label>
          <input
            id="jenis-harga-dlh"
            type="number"
            step="0.01"
            className="shared-form-input"
            {...register("harga_dlh_per_kg", nonNegativeNumberRule("Harga ke DLH"))}
          />
          {errors.harga_dlh_per_kg && <span className="shared-form-error">{errors.harga_dlh_per_kg.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="jenis-harga">Harga ke Nasabah per Kg (Rp)</label>
          <input
            id="jenis-harga"
            className="shared-form-input readonly"
            readOnly
            value={formatCurrency(hargaNasabah)}
          />
          <span style={{ color: "#6B7280", fontSize: 12, marginTop: 6 }}>
            Otomatis {HARGA_NASABAH_RATIO * 100}% dari Harga ke DLH, tidak bisa diedit manual.
          </span>
        </div>

        <div className="shared-form-actions">
          {isEditMode && (
            <button type="button" className="shared-form-cancel" onClick={onCancelEdit}>Batal</button>
          )}
          <button type="submit" className="shared-form-submit" disabled={isSubmitting}>
            {isEditMode ? "Simpan" : "Tambah"}
          </button>
        </div>
      </form>
    </section>
  );
}
