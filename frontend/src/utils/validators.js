// react-hook-form `rules` fragments — spread into `register("field", { ...rule })`.
export const requiredRule = (label) => ({
  required: `${label} wajib diisi`,
});

export const emailRule = {
  required: "Email wajib diisi",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Format email tidak valid",
  },
};

export const phoneRule = {
  required: "Nomor telepon wajib diisi",
  pattern: {
    value: /^[0-9+\-\s()]{8,20}$/,
    message: "Format nomor telepon tidak valid",
  },
};

export const passwordRule = {
  required: "Password wajib diisi",
  minLength: {
    value: 8,
    message: "Password minimal 8 karakter",
  },
};

export const nonNegativeNumberRule = (label) => ({
  required: `${label} wajib diisi`,
  min: { value: 0, message: `${label} tidak boleh negatif` },
});

export const positiveNumberRule = (label) => ({
  required: `${label} wajib diisi`,
  validate: (value) => Number(value) > 0 || `${label} harus lebih besar dari 0`,
});
