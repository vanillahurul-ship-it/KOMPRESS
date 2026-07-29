import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as laporanApi from "../services/laporanApi";

export default function useLaporan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tahun, setTahun] = useState(null);

  const refetch = useCallback(async (targetTahun) => {
    setLoading(true);
    try {
      const result = await laporanApi.getLaporan(targetTahun);
      setData(result);
      setTahun(result.tahun);
    } catch (error) {
      toast.error(error.message || "Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const changeTahun = (targetTahun) => refetch(targetTahun);

  return { data, loading, tahun, changeTahun };
}
