import { useState } from 'react';
import type { VaultDocumentItem, VaultDocumentReveal } from '../../types/vault';
import { useVaultLock } from '../../contexts/VaultLockContext';
import { vaultService } from '../../services/vaultService';
import {
  GraduationCap,
  FolderLock,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Calendar,
  FileText,
  Building,
  Hash,
} from 'lucide-react';

interface DocumentCardProps {
  document: VaultDocumentItem;
  onEdit: (doc: VaultDocumentItem) => void;
  onDelete: (doc: VaultDocumentItem) => void;
  onPreview: (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => void;
}

export default function DocumentCard({ document, onEdit, onDelete, onPreview }: DocumentCardProps) {
  const { vaultToken } = useVaultLock();
  const [revealed, setRevealed] = useState<VaultDocumentReveal | null>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  const handleToggleReveal = async () => {
    if (revealed) {
      setRevealed(null);
      return;
    }

    if (!vaultToken) return;

    try {
      setIsRevealing(true);
      const data = await vaultService.revealDocument(document.id, vaultToken);
      setRevealed(data);
    } catch (err) {
      console.error('Failed to reveal document notes:', err);
    } finally {
      setIsRevealing(false);
    }
  };

  const formatCategory = (cat: string) => {
    return cat.replace(/_/g, ' ');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'DEGREE':
      case 'CONTRACT':
        return 'var(--color-electric-blue)';
      case 'MARK_SHEET':
      case 'INSURANCE':
        return 'var(--color-mint-pop)';
      case 'OFFER_LETTER':
      case 'PROPERTY':
        return 'var(--color-sunburst)';
      case 'INTERNSHIP_CERTIFICATE':
      case 'TAX_DOCUMENT':
        return 'var(--color-lavender)';
      default:
        return 'var(--color-soft-mist)';
    }
  };

  return (
    <div className="pv-vault-card">
      {/* Header */}
      <div className="pv-vault-card__top">
        <div className="pv-vault-card__header-main">
          <div
            className="pv-vault-card__icon"
            style={{ background: getCategoryColor(document.category) }}
          >
            {document.section === 'EDUCATION' ? (
              <GraduationCap size={20} color="var(--color-carbon)" />
            ) : (
              <FolderLock size={20} color="var(--color-carbon)" />
            )}
          </div>
          <div className="pv-vault-card__titles">
            <h3 className="pv-vault-card__title" title={document.title}>
              {document.title}
            </h3>
            <span className="pv-vault-card__subtitle">
              {formatCategory(document.category)}
            </span>
          </div>
        </div>

        <span
          className="pv-vault-card__badge"
          style={{ background: getCategoryColor(document.category) }}
        >
          {formatCategory(document.category)}
        </span>
      </div>

      {/* Issuer & Identifier */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#444' }}>
        {document.issuerOrInstitution && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={15} color="#666" style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{document.issuerOrInstitution}</span>
          </div>
        )}
        {document.documentIdentifier && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Hash size={15} color="#666" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.5px' }}>
              {document.documentIdentifier}
            </span>
          </div>
        )}
      </div>

      {/* Dates */}
      {(document.issueDate || document.expiryDate) && (
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#444' }}>
          {document.issueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              <span>Issued: {document.issueDate}</span>
            </div>
          )}
          {document.expiryDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} />
              <span>Expires: {document.expiryDate}</span>
            </div>
          )}
        </div>
      )}

      {/* Document File Preview Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ fontSize: '12px' }}
          onClick={() => {
            if (!vaultToken) return;
            onPreview(
              document.title,
              document.mimeType,
              document.originalFileName,
              () => vaultService.getDocumentBlob(document.id, vaultToken)
            );
          }}
        >
          <FileText size={13} />
          <span>Attachment: {document.originalFileName}</span>
        </button>

        {document.hasNotes && (
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px' }}
            onClick={handleToggleReveal}
            disabled={isRevealing}
            title={revealed ? 'Hide notes' : 'View notes'}
          >
            {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
        )}
      </div>

      {/* Revealed Notes */}
      {revealed?.notes && (
        <div className="pv-vault-card__revealed-box">
          <strong style={{ display: 'block', marginBottom: '4px' }}>Notes:</strong>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333' }}>{revealed.notes}</p>
        </div>
      )}

      {/* Card Actions */}
      <div className="pv-vault-card__footer">
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onEdit(document)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
          onClick={() => onDelete(document)}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
