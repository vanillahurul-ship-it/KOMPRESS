import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as transaksiApi from "../services/transaksiApi";

export default function useTransaksi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await transaksiApi.getAllTransaksi();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = async (payload) => {
    try {
      await transaksiApi.createTransaksi(payload);
      toast.success("Setoran berhasil ditambahkan");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan setoran");
      throw error;
    }
  };

  const update = async (id, payload) => {
    try {
      await transaksiApi.updateTransaksi(id, payload);
      toast.success("Setoran berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan setoran");
      throw error;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await transaksiApi.updateTransaksiStatus(id, status);
      toast.success("Status setoran berhasil diperbarui");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui status");
      throw error;
    }
  };

  const remove = async (id) => {
    try {
      await transaksiApi.deleteTransaksi(id);
      toast.success("Setoran berhasil dihapus");
      await refetch();
    } catch (error) {
      toast.error(error.message || "Gagal menghapus setoran");
      throw error;
    }
  };

  return { data, loading, create, update, updateStatus, remove, refetch };
}
