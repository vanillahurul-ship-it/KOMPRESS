import apiClient from "./apiClient";

export const runPrediksi = (horizon) =>
  apiClient.post("/prediksi", { horizon }).then((res) => res.data.data);
