import Modal from "./Modal";
import "./ConfirmDialog.css";

// Reusable Yes/No confirmation, used for delete confirmations and the logout prompt.
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  confirmLabel = "Ya",
  cancelLabel = "Tidak",
  danger = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="380px">
      <p className="confirm-dialog-message">{message}</p>
      <div className="confirm-dialog-actions">
        <button type="button" className="confirm-dialog-cancel" onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`confirm-dialog-confirm ${danger ? "danger" : ""}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
