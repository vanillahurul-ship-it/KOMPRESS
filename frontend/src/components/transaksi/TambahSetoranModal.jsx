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

  const [nasabahSearch, setNasabahSearch] = useState("");
  const [showNasabahOptions, setShowNasabahOptions] = useState(false);
  const nasabahFieldRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    if (initialData) {
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

  const filteredNasabahList = useMemo(() => {
    const term = nasabahSearch.trim().toLowerCase();
    if (!term) return nasabahList;
    return nasabahList.filter((item) => item.nama.toLowerCase().includes(term));
  }, [nasabahList, nasabahSearch]);

  const handleNasabahSearchChange = (event) => {
    const value = event.target.value;
    setNasabahSearch(value);
    setShowNasabahOptions(true);
    if (selectedNasabahId) {
      setValue("nasabah_id", "", { shouldValidate: false });
    }
  };

  const handleNasabahSelect = (nasabah) => {
    setValue("nasabah_id", nasabah.id, { shouldValidate: true });
    setNasabahSearch(nasabah.nama);
    setShowNasabahOptions(false);
  };

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

  const hargaPerKg = selectedJenisSampah?.harga_per_kg || 0;
  const total = hargaPerKg * (Number(beratValue) || 0);

  if (!show) return null;

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
