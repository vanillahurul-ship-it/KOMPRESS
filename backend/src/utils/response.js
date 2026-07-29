const ok = (res, data, message = "OK", status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

const created = (res, data, message = "Berhasil dibuat") => {
  return ok(res, data, message, 201);
};

const fail = (res, message = "Terjadi kesalahan", status = 400) => {
  return res.status(status).json({ success: false, message });
};

module.exports = { ok, created, fail };
