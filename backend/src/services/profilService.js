const supabase = require("../config/supabase");
const AppError = require("../utils/AppError");

const LOGO_BUCKET = "profil-assets";
const PROFIL_ID = 1;

const getProfil = async () => {
  console.log("[profilService] getProfil: querying profil_bank_sampah id =", PROFIL_ID);

  const { data, error } = await supabase
    .from("profil_bank_sampah")
    .select("*")
    .eq("id", PROFIL_ID)
    .maybeSingle();

  if (error) {
    console.error("[profilService] getProfil error:", error);
    throw new AppError(`Gagal mengambil data profil: ${error.message}`, 502);
  }

  console.log("[profilService] getProfil result:", data);
  return data;
};

// Public URLs look like ".../storage/v1/object/public/<bucket>/<path>" — pull the
// <path> back out so an old logo can be removed by its storage path, not its URL.
const extractStoragePath = (publicUrl) => {
  if (!publicUrl) return null;
  const marker = `/object/public/${LOGO_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
};

const uploadLogo = async (file) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;

  console.log(
    "[profilService] uploadLogo: uploading",
    fileName,
    "size:", file.size,
    "mimetype:", file.mimetype
  );

  const { error: uploadError } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });

  if (uploadError) {
    console.error("[profilService] uploadLogo error:", uploadError);
    throw new AppError(`Gagal mengunggah logo: ${uploadError.message}`, 502);
  }

  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(fileName);
  console.log("[profilService] uploadLogo success, publicUrl:", data.publicUrl);
  return data.publicUrl;
};

// Best-effort cleanup: the DB row is already the source of truth for the active
// logo by the time this runs, so a failure here just leaves an orphaned file
// instead of corrupting already-saved state — log it loudly and move on.
const deleteLogoFile = async (publicUrl) => {
  const path = extractStoragePath(publicUrl);
  if (!path) return;

  console.log("[profilService] deleteLogoFile: removing", path);
  const { error } = await supabase.storage.from(LOGO_BUCKET).remove([path]);
  if (error) {
    console.error("[profilService] deleteLogoFile error (non-fatal, file may be orphaned):", error);
  } else {
    console.log("[profilService] deleteLogoFile success:", path);
  }
};

const updateProfil = async (payload, file) => {
  console.log(
    "[profilService] updateProfil: payload =", payload,
    "file =", file ? { name: file.originalname, size: file.size, mimetype: file.mimetype } : null
  );

  const existing = await getProfil();
  const previousLogoUrl = existing?.logo_url || null;

  const updates = { ...payload, updated_at: new Date().toISOString() };

  if (file) {
    // Upload happens before the DB write. If it throws, we return here and the
    // DB is never touched — that's the rollback: nothing gets half-saved.
    updates.logo_url = await uploadLogo(file);
  }

  // upsert (not update): the row can be missing if it was deleted via
  // deleteProfil() — saving again should recreate it instead of failing.
  const { data, error } = await supabase
    .from("profil_bank_sampah")
    .upsert({ id: PROFIL_ID, ...updates }, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    console.error("[profilService] updateProfil DB error:", error);
    throw new AppError(`Gagal menyimpan profil: ${error.message}`, 502);
  }

  console.log("[profilService] updateProfil success:", data);

  if (file && previousLogoUrl && previousLogoUrl !== data.logo_url) {
    await deleteLogoFile(previousLogoUrl);
  }

  return data;
};

const deleteProfil = async () => {
  console.log("[profilService] deleteProfil: deleting row id =", PROFIL_ID);

  const existing = await getProfil();

  const { error } = await supabase
    .from("profil_bank_sampah")
    .delete()
    .eq("id", PROFIL_ID);

  if (error) {
    console.error("[profilService] deleteProfil error:", error);
    throw new AppError(`Gagal menghapus profil: ${error.message}`, 502);
  }

  if (existing?.logo_url) {
    await deleteLogoFile(existing.logo_url);
  }

  console.log("[profilService] deleteProfil success");
  return true;
};

// Supabase Auth hashes passwords and never exposes them via any API (not even the
// service-role key) — so this can only ever return name + email, never a password.
const listAdmins = async () => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw new Error(error.message);

  return data.users.map((user) => ({
    id: user.id,
    nama: user.user_metadata?.name || user.user_metadata?.full_name || user.email,
    email: user.email,
  }));
};

// Passwords can only be set going forward (Supabase Auth never returns the
// current one) — this is a reset, not a "view", by design.
const resetAdminPassword = async (userId, password) => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, { password });
  if (error) throw new Error(error.message);
  return { id: data.user.id };
};

const updateAdminName = async (userId, name) => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { name },
  });
  if (error) throw new Error(error.message);
  return { id: data.user.id, nama: data.user.user_metadata?.name || data.user.email };
};

module.exports = {
  getProfil,
  updateProfil,
  deleteProfil,
  listAdmins,
  resetAdminPassword,
  updateAdminName,
};
