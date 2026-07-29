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

// Generic single- or dual-series line chart used by Dashboard and Prediksi.
// `lines` = [{ dataKey, name, color, dashed }]
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
