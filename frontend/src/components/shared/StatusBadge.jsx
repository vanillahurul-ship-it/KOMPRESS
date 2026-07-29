import { STATUS_BADGE_STYLE } from "../../constants/statusOptions";

export default function StatusBadge({ status }) {
  const style = STATUS_BADGE_STYLE[status] || { bg: "#E5E7EB", text: "#374151" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: style.bg,
        color: style.text,
      }}
    >
      {status}
    </span>
  );
}
