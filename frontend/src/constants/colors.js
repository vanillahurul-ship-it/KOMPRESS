// Mirrors the CSS custom properties defined in src/index.css (--admin-*) so
// chart libraries (Recharts) that need raw color values in JS stay in sync
// with the same palette used by CSS across the admin panel.
export const COLORS = {
  background: "#F6F4E8",
  sidebar: "#E1EAD3",
  sidebarActive: "#FDFAF6",
  sidebarStroke: "#000000",
  header: "#2C3947",
  headerText: "#E1EAD3",
  brand: "#39701A",
  adminBox: "rgba(131, 147, 113, 0.8)",
  adminText: "#FFFFFF",
  adminName: "#000000",
  iconCircle: "#2C3947",
  card: "#FDFAF6",
  tableHeader: "rgba(168, 178, 152, 0.91)",
  search: "rgba(90, 136, 65, 0.75)",
  button: "#AFC99C",
  primary: "#546B41",
  text: "#2C3947",
  rupiah: "#5A8841",
};

export const CHART_PALETTE = [COLORS.primary, COLORS.rupiah, COLORS.brand, COLORS.button];
