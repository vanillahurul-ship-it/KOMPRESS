import { createContext, useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as profilApi from "../services/profilApi";

const ProfilContext = createContext(null);

export function ProfilProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await profilApi.getProfil();
      setData(result);
    } catch (error) {
      console.error("[ProfilContext] refetch error:", error);
      toast.error(error.message || "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const update = async (payload) => {
    try {
      const result = await profilApi.updateProfil(payload);
      toast.success("Perubahan berhasil disimpan.");
      await refetch();
      return result;
    } catch (error) {
      console.error("[ProfilContext] update error:", error);
      toast.error(error.message || "Gagal menyimpan profil");
      throw error;
    }
  };

  const remove = async () => {
    try {
      await profilApi.deleteProfil();
      toast.success("Data berhasil dihapus.");
      await refetch();
    } catch (error) {
      console.error("[ProfilContext] remove error:", error);
      toast.error(error.message || "Gagal menghapus data profil");
      throw error;
    }
  };

  const value = { data, loading, update, remove, refetch };

  return <ProfilContext.Provider value={value}>{children}</ProfilContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + its hook are intentionally co-located
export const useProfilContext = () => {
  const ctx = useContext(ProfilContext);
  if (!ctx) throw new Error("useProfilContext must be used within a ProfilProvider");
  return ctx;
};
