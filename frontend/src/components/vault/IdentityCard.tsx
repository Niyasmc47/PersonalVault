import { useState } from 'react';
import type { IdentityDocumentItem, IdentityDocumentReveal } from '../../types/vault';
import { useVaultLock } from '../../contexts/VaultLockContext';
import { vaultService } from '../../services/vaultService';
import {
  FileCheck2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit3,
  Trash2,
  Calendar,
  FileText,
} from 'lucide-react';

interface IdentityCardProps {
  document: IdentityDocumentItem;
  onEdit: (doc: IdentityDocumentItem) => void;
  onDelete: (doc: IdentityDocumentItem) => void;
  onPreview: (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => void;
}

export default function IdentityCard({ document, onEdit, onDelete, onPreview }: IdentityCardProps) {
  const { vaultToken } = useVaultLock();
  const [revealed, setRevealed] = useState<IdentityDocumentReveal | null>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleToggleReveal = async () => {
    if (revealed) {
      setRevealed(null);
      return;
    }

    if (!vaultToken) return;

    try {
      setIsRevealing(true);
      const data = await vaultService.revealIdentityDocument(document.id, vaultToken);
      setRevealed(data);
    } catch (err) {
      console.error('Failed to reveal identity document:', err);
    } finally {
      setIsRevealing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'AADHAAR':
        return 'var(--color-sunburst)';
      case 'PAN':
        return 'var(--color-electric-blue)';
      case 'PASSPORT':
        return 'var(--color-lavender)';
      case 'DRIVING_LICENCE':
        return 'var(--color-mint-pop)';
      default:
        return 'var(--color-soft-mist)';
    }
  };

  const formatTypeName = (type: string) => {
    switch (type) {
      case 'DRIVING_LICENCE':
        return 'Driving Licence';
      case 'VOTER_ID':
        return 'Voter ID';
      default:
        return type;
    }
  };

  return (
    <div className="pv-vault-card">
      {/* Top Header */}
      <div className="pv-vault-card__top">
        <div className="pv-vault-card__header-main">
          <div
            className="pv-vault-card__icon"
            style={{ background: getTypeColor(document.type) }}
          >
            <FileCheck2 size={20} color="var(--color-carbon)" />
          </div>
          <div className="pv-vault-card__titles">
            <h3 className="pv-vault-card__title" title={document.holderName}>
              {document.holderName}
            </h3>
            <span className="pv-vault-card__subtitle">
              {formatTypeName(document.type)}
            </span>
          </div>
        </div>

        <span
          className="pv-vault-card__badge"
          style={{ background: getTypeColor(document.type) }}
        >
          {formatTypeName(document.type)}
        </span>
      </div>

      {/* Masked / Revealed Document Number */}
      <div className="pv-vault-card__secret-box">
        <div style={{ minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#666', display: 'block', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '2px' }}>
            Document Number
          </span>
          <span className="pv-vault-card__secret-text">
            {revealed ? revealed.documentNumber : document.maskedNumber}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px' }}
            onClick={handleToggleReveal}
            disabled={isRevealing}
            title={revealed ? 'Hide number' : 'Reveal full number'}
          >
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>

          {revealed && (
            <button
              type="button"
              className="pv-btn pv-btn--light pv-btn--sm"
              style={{ padding: '4px 8px' }}
              onClick={() => handleCopy(revealed.documentNumber)}
              title="Copy document number"
            >
              {copied ? <Check size={14} color="green" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Dates Metadata */}
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

      {/* Document Attachments (Front / Back) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {document.hasFrontFile && (
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ fontSize: '12px' }}
            onClick={() => {
              if (!vaultToken) return;
              onPreview(
                `${document.holderName} - ${document.type} (Front)`,
                document.mimeTypeFront,
                document.fileNameFront || 'front_doc',
                () => vaultService.getIdentityDocumentBlob(document.id, 'front', vaultToken)
              );
            }}
          >
            <FileText size={13} />
            <span>View Front Scan</span>
          </button>
        )}

        {document.hasBackFile && (
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ fontSize: '12px' }}
            onClick={() => {
              if (!vaultToken) return;
              onPreview(
                `${document.holderName} - ${document.type} (Back)`,
                document.mimeTypeBack,
                document.fileNameBack || 'back_doc',
                () => vaultService.getIdentityDocumentBlob(document.id, 'back', vaultToken)
              );
            }}
          >
            <FileText size={13} />
            <span>View Back Scan</span>
          </button>
        )}

        {!document.hasFrontFile && !document.hasBackFile && (
          <span style={{ fontSize: '12px', color: '#777', fontStyle: 'italic' }}>
            No document scans attached
          </span>
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
