import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as nasabahApi from "../services/nasabahApi";

export default function useNasabah() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await nasabahApi.getAllNasabah();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data nasabah");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (payload) => {
    try {
      await nasabahApi.createNasabah(payload);
      toast.success("Nasabah berhasil ditambahkan");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan nasabah");
      throw error;
    }
  };

  const update = async (id, payload) => {
    try {
      await nasabahApi.updateNasabah(id, payload);
      toast.success("Nasabah berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan nasabah");
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      await nasabahApi.deleteNasabah(id);
      toast.success("Nasabah berhasil dihapus");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus nasabah");
      throw error;
    }
  };

  return { data, loading, create, update, remove, refetch };
}
