import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/**
 * Komponen Grafik Garis
 *
 * Grafik garis serbaguna yang dapat menampilkan satu atau beberapa seri data.
 * Dipakai oleh halaman Beranda dan Prediksi, sehingga tampilan seluruh grafik
 * dalam aplikasi ini tetap seragam.
 *
 * @param {object} props
 * @param {Array<object>} props.data - Data yang akan digambar.
 * @param {string} props.xKey - Nama field untuk sumbu mendatar, misalnya "bulan".
 * @param {Array<{dataKey: string, name: string, color: string, dashed?: boolean}>} props.lines
 *        Daftar garis yang ingin digambar. Pilihan dashed membuat garis
 *        bergaris putus-putus, dipakai untuk membedakan garis prediksi dari
 *        garis data sebenarnya.
 * @param {number} [props.height=260] - Tinggi grafik dalam piksel.
 * @param {Function} [props.valueFormatter] - Pengubah tampilan nilai pada
 *        sumbu tegak dan keterangan melayang, misalnya menjadi format rupiah.
 */

export default function LineTrendChart({ data, xKey, lines, height = 260, valueFormatter }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D0" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={{ stroke: "#E5E1D0" }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={valueFormatter}
          width={70}
        />
        <Tooltip formatter={(value) => (valueFormatter ? valueFormatter(value) : value)} />

        {/* Keterangan warna hanya ditampilkan bila garisnya lebih dari satu,
            sebab pada garis tunggal keterangan tersebut tidak diperlukan */}
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            strokeDasharray={line.dashed ? "6 4" : undefined}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
