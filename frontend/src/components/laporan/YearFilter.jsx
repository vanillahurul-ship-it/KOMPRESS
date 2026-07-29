export default function YearFilter({ years, value, onChange, includeAll = false, allLabel = "Semua Tahun" }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
      className="shared-form-select"
      style={{ maxWidth: 160 }}
      aria-label="Filter Tahun"
    >
      {includeAll && <option value="">{allLabel}</option>}
      {years.map((year) => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  );
}
