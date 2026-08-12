/**
 * Modal Tambah dan Ubah Setoran
 *
 * Form pencatatan setoran sampah. Sama seperti modal nasabah, satu modal
 * dipakai untuk dua keperluan, dan modenya ditentukan dari ada atau tidaknya
 * initialData.
 *
 * Dua bagian yang perlu diperhatikan:
 *
 *   1. Isian nasabah memakai pencarian dengan saran otomatis, bukan dropdown
 *      biasa, sebab jumlah nasabah bisa banyak sehingga menggulir daftar
 *      menjadi tidak praktis. Nama yang diketik dan id yang terpilih disimpan
 *      terpisah, agar hanya nasabah yang benar-benar dipilih dari daftar yang
 *      dianggap sah.
 *
 *   2. Harga per kilogram dan total ditampilkan sebagai isian hanya-baca.
 *      Angka tersebut hanya berfungsi sebagai gambaran bagi pengguna;
 *      perhitungan yang sebenarnya tetap dilakukan backend.
 *
 * @param {object} props
 * @param {boolean} props.show - Menentukan modal terbuka atau tertutup.
 * @param {Function} props.onClose - Menutup modal.
 * @param {Function} props.onSubmit - Menyimpan data setoran.
 * @param {Array<object>} props.nasabahList - Pilihan nasabah.
 * @param {Array<object>} props.jenisSampahList - Pilihan jenis sampah.
 * @param {object} [props.initialData] - Data transaksi yang sedang diubah.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../shared/Modal";
import "../shared/Form.css";
import { requiredRule, positiveNumberRule } from "../../utils/validators";
import { formatCurrency } from "../../utils/formatCurrency";
import { toInputDate } from "../../utils/formatDate";

export default function TambahSetoranModal({ show, onClose, onSubmit, nasabahList, jenisSampahList, initialData }) {
  const isEditMode = Boolean(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      nasabah_id: "",
      jenis_sampah_id: "",
      tanggal: toInputDate(new Date()),
      berat_kg: "",
    },
  });

  // Teks yang sedang diketik pada isian pencarian nasabah
  const [nasabahSearch, setNasabahSearch] = useState("");

  // Menentukan daftar saran nasabah sedang ditampilkan atau tidak
  const [showNasabahOptions, setShowNasabahOptions] = useState(false);

  const nasabahFieldRef = useRef(null);

  // Isi ulang form setiap kali modal dibuka, agar isian dari pembukaan
  // sebelumnya tidak tertinggal
  useEffect(() => {
    if (!show) return;
    if (initialData) {
      // Data transaksi menyimpan nama, bukan id, sehingga nasabah dan jenis
      // sampahnya perlu dicari kembali untuk mengisi form
      const matchedNasabah = nasabahList.find((item) => item.nama === initialData.nama_nasabah);
      reset({
        nasabah_id: matchedNasabah?.id || "",
        jenis_sampah_id: jenisSampahList.find((item) => item.nama === initialData.jenis_sampah)?.id || "",
        tanggal: toInputDate(initialData.tanggal) || toInputDate(new Date()),
        berat_kg: initialData.berat_kg ?? "",
      });
      setNasabahSearch(matchedNasabah?.nama || "");
    } else {
      reset({
        nasabah_id: "",
        jenis_sampah_id: "",
        tanggal: toInputDate(new Date()),
        berat_kg: "",
      });
      setNasabahSearch("");
    }
    setShowNasabahOptions(false);
  }, [show, initialData, nasabahList, jenisSampahList, reset]);

  // Menutup daftar saran ketika pengguna menekan di luar area isian nasabah
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nasabahFieldRef.current && !nasabahFieldRef.current.contains(event.target)) {
        setShowNasabahOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedNasabahId = watch("nasabah_id");
  const selectedJenisSampahId = watch("jenis_sampah_id");
  const beratValue = watch("berat_kg");

  const selectedNasabah = useMemo(
    () => nasabahList.find((item) => String(item.id) === String(selectedNasabahId)),
    [nasabahList, selectedNasabahId]
  );

  // Saran nasabah sesuai kata kunci yang diketik. Bila kolom masih kosong,
  // seluruh nasabah ditampilkan.
  const filteredNasabahList = useMemo(() => {
    const term = nasabahSearch.trim().toLowerCase();
    if (!term) return nasabahList;
    return nasabahList.filter((item) => item.nama.toLowerCase().includes(term));
  }, [nasabahList, nasabahSearch]);

  /**
   * Menangani ketikan pada isian pencarian nasabah.
   *
   * Bila pengguna kembali mengetik setelah sebelumnya memilih seseorang,
   * pilihan lama dikosongkan. Tanpa langkah ini, nama yang tertulis di layar
   * bisa berbeda dengan nasabah yang sebenarnya tersimpan.
   */
  const handleNasabahSearchChange = (event) => {
    const value = event.target.value;
    setNasabahSearch(value);
    setShowNasabahOptions(true);
    if (selectedNasabahId) {
      setValue("nasabah_id", "", { shouldValidate: false });
    }
  };

  /** Menetapkan nasabah yang dipilih dari daftar saran. */
  const handleNasabahSelect = (nasabah) => {
    setValue("nasabah_id", nasabah.id, { shouldValidate: true });
    setNasabahSearch(nasabah.nama);
    setShowNasabahOptions(false);
  };

  /**
   * Pintasan papan ketik pada isian nasabah.
   *
   * Enter memilih saran bila tersisa tepat satu, sehingga pengguna tidak perlu
   * beralih ke tetikus. Perilaku bawaan Enter dicegah agar form tidak ikut
   * terkirim. Escape menutup daftar saran.
   */
  const handleNasabahSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (filteredNasabahList.length === 1) {
        handleNasabahSelect(filteredNasabahList[0]);
      }
    } else if (event.key === "Escape") {
      setShowNasabahOptions(false);
    }
  };

  const selectedJenisSampah = useMemo(
    () => jenisSampahList.find((item) => String(item.id) === String(selectedJenisSampahId)),
    [jenisSampahList, selectedJenisSampahId]
  );

  // Perkiraan total: harga per kilogram dikali berat yang diisi. Angka ini
  // hanya untuk ditampilkan; nilai yang tersimpan dihitung ulang oleh backend.
  const hargaPerKg = selectedJenisSampah?.harga_per_kg || 0;
  const total = hargaPerKg * (Number(beratValue) || 0);

  if (!show) return null;

  /**
   * Menyimpan isi form.
   *
   * Backend menerima nama nasabah dan nama jenis sampah, bukan id-nya,
   * sehingga keduanya diambil dari data yang terpilih. Harga dan total tidak
   * ikut dikirim karena dihitung sendiri oleh backend.
   */
  const submit = async (values) => {
    await onSubmit({
      nama_nasabah: selectedNasabah?.nama,
      jenis_sampah: selectedJenisSampah?.nama,
      tanggal: values.tanggal,
      berat_kg: Number(values.berat_kg),
    });
    onClose();
  };

  return (
    <Modal isOpen={show} onClose={onClose} title={isEditMode ? "Edit Setoran" : "Tambah Setoran"}>
      <form onSubmit={handleSubmit(submit)}>
        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="setoran-nasabah">Nasabah</label>
          <div className="shared-autocomplete" ref={nasabahFieldRef}>
            <input
              id="setoran-nasabah"
              type="text"
              className="shared-form-input"
              autoComplete="off"
              placeholder="Cari nama nasabah..."
              value={nasabahSearch}
              onChange={handleNasabahSearchChange}
              onFocus={() => setShowNasabahOptions(true)}
              onKeyDown={handleNasabahSearchKeyDown}
            />
            {/* Isian tersembunyi yang menyimpan id nasabah terpilih. Isian
                inilah yang divalidasi, bukan teks pencariannya, sehingga nama
                yang diketik sembarangan tidak dianggap sah */}
            <input type="hidden" {...register("nasabah_id", requiredRule("Nasabah"))} />
            {showNasabahOptions && (
              <ul className="shared-autocomplete-list">
                {filteredNasabahList.length > 0 ? (
                  filteredNasabahList.map((nasabah) => (
                    <li key={nasabah.id}>
                      <button
                        type="button"
                        className="shared-autocomplete-option"
                        onClick={() => handleNasabahSelect(nasabah)}
                      >
                        {nasabah.nama}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="shared-autocomplete-empty">Nasabah tidak ditemukan</li>
                )}
              </ul>
            )}
          </div>
          {errors.nasabah_id && <span className="shared-form-error">{errors.nasabah_id.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="setoran-tanggal">Tanggal Setoran</label>
          <input
            id="setoran-tanggal"
            type="date"
            className="shared-form-input"
            {...register("tanggal", requiredRule("Tanggal"))}
          />
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="setoran-jenis">Jenis Sampah</label>
          <select
            id="setoran-jenis"
            className="shared-form-select"
            {...register("jenis_sampah_id", requiredRule("Jenis sampah"))}
          >
            <option value="">Pilih Jenis Sampah</option>
            {jenisSampahList.map((jenis) => (
              <option key={jenis.id} value={jenis.id}>{jenis.nama}</option>
            ))}
          </select>
          {errors.jenis_sampah_id && <span className="shared-form-error">{errors.jenis_sampah_id.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label" htmlFor="setoran-berat">Berat Total (Kg)</label>
          <input
            id="setoran-berat"
            type="number"
            step="0.01"
            className="shared-form-input"
            {...register("berat_kg", positiveNumberRule("Berat"))}
          />
          {errors.berat_kg && <span className="shared-form-error">{errors.berat_kg.message}</span>}
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label">Harga per Kg (Rp)</label>
          <input className="shared-form-input readonly" readOnly value={formatCurrency(hargaPerKg)} />
        </div>

        <div className="shared-form-field">
          <label className="shared-form-label">Total (Rp)</label>
          <input className="shared-form-input readonly" readOnly value={formatCurrency(total)} />
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
