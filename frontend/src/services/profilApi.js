import apiClient from "./apiClient";

export const getProfil = () => apiClient.get("/profil").then((res) => res.data.data);

// payload may include a File under `logo` — sent as multipart/form-data when present.
export const updateProfil = (payload) => {
  const { logo, ...fields } = payload;
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, value);
  });
  if (logo instanceof File) form.append("logo", logo);

  return apiClient
    .put("/profil", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);
};

export const deleteProfil = () => apiClient.delete("/profil").then((res) => res.data);

export const listAdmins = () => apiClient.get("/profil/admins").then((res) => res.data.data);

export const resetAdminPassword = (id, password) =>
  apiClient.patch(`/profil/admins/${id}/password`, { password }).then((res) => res.data);

export const updateAdminName = (id, name) =>
  apiClient.patch(`/profil/admins/${id}/name`, { name }).then((res) => res.data);
