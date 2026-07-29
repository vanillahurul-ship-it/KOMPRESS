import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as jenisSampahApi from "../services/jenisSampahApi";

export default function useJenisSampah() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await jenisSampahApi.getAllJenisSampah();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data jenis sampah");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (payload) => {
    try {
      await jenisSampahApi.createJenisSampah(payload);
      toast.success("Jenis sampah berhasil ditambahkan");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan jenis sampah");
      throw error;
    }
  };

  const update = async (id, payload) => {
    try {
      await jenisSampahApi.updateJenisSampah(id, payload);
      toast.success("Jenis sampah berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan jenis sampah");
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      await jenisSampahApi.deleteJenisSampah(id);
      toast.success("Jenis sampah berhasil dihapus");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus jenis sampah");
      throw error;
    }
  };

  return { data, loading, create, update, remove, refetch };
}
