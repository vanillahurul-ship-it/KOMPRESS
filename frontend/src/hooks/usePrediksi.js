import { useState } from "react";
import toast from "react-hot-toast";
import * as prediksiApi from "../services/prediksiApi";

export default function usePrediksi() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (horizon) => {
    setLoading(true);
    try {
      const data = await prediksiApi.runPrediksi(horizon);
      setResult(data);
      toast.success("Prediksi berhasil dijalankan");
      return data;
    } catch (error) {
      toast.error(error.message || "Gagal menjalankan prediksi");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, run };
}
