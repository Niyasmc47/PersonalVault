import { AlertTriangle, X, RefreshCw, Plus } from 'lucide-react';

interface RebuildConfirmDialogProps {
  isOpen: boolean;
  resumeName: string;
  isRebuilding: boolean;
  onClose: () => void;
  onConfirmRebuild: () => void;
  onCreateNewInstead: () => void;
}

export default function RebuildConfirmDialog({
  isOpen,
  resumeName,
  isRebuilding,
  onClose,
  onConfirmRebuild,
  onCreateNewInstead,
}: RebuildConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-sunburst)' }}
            >
              <AlertTriangle size={18} color="var(--color-carbon)" />
            </div>
            <h2 className="pv-modal__title">Sync from PersonalVault</h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ margin: '16px 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>
          <p>
            You are about to rebuild <strong>"{resumeName}"</strong> with the latest data from your PersonalVault.
          </p>
          <div
            style={{
              margin: '12px 0',
              padding: '12px 14px',
              background: 'var(--color-soft-mist)',
              borderRadius: '12px',
              fontSize: '13px',
            }}
          >
            <strong>Warning:</strong> Refreshing will re-synchronize your skills, projects, certificates, achievements, and contact links from your PersonalVault records. Any custom text edits made specifically inside this resume will be replaced.
          </div>
          <p style={{ marginTop: '10px' }}>
            Would you like to refresh this draft or create a fresh new resume instead?
          </p>
        </div>

        <div className="pv-modal__actions" style={{ flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="pv-btn pv-btn--dark"
            style={{ width: '100%' }}
            onClick={onCreateNewInstead}
          >
            <Plus size={16} />
            <span>Create As A New Resume (Recommended)</span>
          </button>

          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--danger"
            style={{ width: '100%' }}
            onClick={onConfirmRebuild}
            disabled={isRebuilding}
          >
            <RefreshCw size={16} className={isRebuilding ? 'pv-spin' : ''} />
            <span>{isRebuilding ? 'Refreshing...' : 'Overwrite & Sync Current Draft'}</span>
          </button>

          <button
            type="button"
            className="pv-btn pv-btn--ghost"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
