import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as dashboardApi from "../services/dashboardApi";

export default function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await dashboardApi.getDashboard();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, refetch };
}
