import { useProfilContext } from "../context/ProfilContext";

// Thin wrapper so both the Profil page and the Sidebar read/write the same
// shared state — a logo saved in the form shows up in the sidebar immediately.
export default function useProfil() {
  return useProfilContext();
}
