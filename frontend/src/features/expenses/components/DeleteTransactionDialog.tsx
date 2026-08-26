import { AlertTriangle } from 'lucide-react';

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteTransactionDialog({ isOpen, isDeleting, onConfirm, onCancel }: DeleteTransactionDialogProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="pv-card" style={{ maxWidth: '400px', width: '100%', margin: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--color-sunburst)', padding: '12px', borderRadius: '50%', height: 'fit-content' }}>
            <AlertTriangle size={24} color="var(--color-carbon)" />
          </div>
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Delete Transaction?</h3>
            <p style={{ color: 'var(--color-carbon)', opacity: 0.8 }}>
              Are you sure you want to delete this transaction? This action cannot be undone and will update your overall balance.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onCancel} 
            disabled={isDeleting}
            className="pv-btn pv-btn--light"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isDeleting}
            className="pv-btn pv-btn--dark"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
