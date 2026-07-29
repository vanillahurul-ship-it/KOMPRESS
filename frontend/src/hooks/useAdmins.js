import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as profilApi from "../services/profilApi";

export default function useAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profilApi
      .listAdmins()
      .then(setAdmins)
      .catch((error) => toast.error(error.message || "Gagal memuat daftar admin"))
      .finally(() => setLoading(false));
  }, []);

  const resetPassword = async (id, password) => {
    try {
      await profilApi.resetAdminPassword(id, password);
      toast.success("Password admin berhasil diperbarui");
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui password admin");
      throw error;
    }
  };

  const updateName = async (id, name) => {
    try {
      await profilApi.updateAdminName(id, name);
      setAdmins((current) => current.map((admin) => (admin.id === id ? { ...admin, nama: name } : admin)));
      toast.success("Nama admin berhasil diperbarui");
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui nama admin");
      throw error;
    }
  };

  return { admins, loading, resetPassword, updateName };
}
