const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => formatter.format(Number(value) || 0);

export const formatNumber = (value, fractionDigits = 2) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: fractionDigits }).format(Number(value) || 0);
