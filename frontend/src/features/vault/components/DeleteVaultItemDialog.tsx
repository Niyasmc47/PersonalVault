import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteVaultItemDialogProps {
  isOpen: boolean;
  title: string;
  itemDescription: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteVaultItemDialog({
  isOpen,
  title,
  itemDescription,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteVaultItemDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="pv-modal-overlay" onClick={onCancel}>
      <div
        className="pv-modal pv-delete-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pv-delete-dialog__icon-wrapper">
          <AlertTriangle size={32} color="var(--color-ember)" />
        </div>

        <h2 className="pv-delete-dialog__title">{title}</h2>

        <p className="pv-delete-dialog__message">
          Are you sure you want to delete <strong>"{itemDescription}"</strong>?
          This action will permanently remove this record from your vault and cannot be undone.
        </p>

        <div className="pv-delete-dialog__actions">
          <button
            type="button"
            className="pv-btn pv-btn--light"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="pv-btn pv-btn--dark pv-btn--danger-bg"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="pv-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Permanently</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
