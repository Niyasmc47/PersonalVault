import type { Skill } from '../types';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteSkillDialogProps {
  isOpen: boolean;
  skill: Skill | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteSkillDialog({
  isOpen,
  skill,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteSkillDialogProps) {
  if (!isOpen || !skill) return null;

  return (
    <div className="pv-modal-overlay" onClick={onCancel}>
      <div
        className="pv-modal pv-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-ember)' }}
            >
              <AlertTriangle size={18} color="#fff" />
            </div>
            <h2 className="pv-modal__title">Delete Skill</h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onCancel} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ margin: '16px 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>
          <p>
            Are you sure you want to delete <strong>{skill.name}</strong>?
          </p>
          <p style={{ marginTop: '8px', color: 'var(--color-carbon)', opacity: 0.75 }}>
            This action cannot be undone. It will remove this skill from your catalog.
          </p>
        </div>

        <div className="pv-modal__actions">
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
            className="pv-btn pv-btn--dark pv-btn--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
