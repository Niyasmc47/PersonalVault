import { useState } from 'react';
import type { VaultDocumentItem, VaultDocumentReveal } from '../types';
import { useVaultLock } from '../contexts/VaultLockContext';
import { vaultService } from '../services/vaultService';
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
    <div className="pv-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: getCategoryColor(document.category),
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {document.section === 'EDUCATION' ? (
              <GraduationCap size={18} color="var(--color-carbon)" />
            ) : (
              <FolderLock size={18} color="var(--color-carbon)" />
            )}
          </div>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '1600px',
                border: '1px solid var(--color-carbon)',
                background: getCategoryColor(document.category),
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              {formatCategory(document.category)}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{document.title}</h3>
          </div>
        </div>
      </div>

      {/* Issuer & Identifier */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#444' }}>
        {document.issuerOrInstitution && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={14} color="#666" />
            <span>{document.issuerOrInstitution}</span>
          </div>
        )}
        {document.documentIdentifier && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Hash size={14} color="#666" />
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{document.documentIdentifier}</span>
          </div>
        )}
      </div>

      {/* Dates */}
      {(document.issueDate || document.expiryDate) && (
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#555' }}>
          {document.issueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              <span>Issued: {document.issueDate}</span>
            </div>
          )}
          {document.expiryDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              <span>Expires: {document.expiryDate}</span>
            </div>
          )}
        </div>
      )}

      {/* Document File Preview Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ borderRadius: '1600px', fontSize: '12px' }}
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
          <span>View Document ({document.originalFileName})</span>
        </button>

        {document.hasNotes && (
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ borderRadius: '1600px', padding: '4px 8px' }}
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
        <div style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', border: '1px dashed var(--color-carbon)', fontSize: '12px' }}>
          <strong>Notes:</strong>
          <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{revealed.notes}</p>
        </div>
      )}

      {/* Card Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ padding: '6px 12px', borderRadius: '1600px' }}
          onClick={() => onEdit(document)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ padding: '6px 12px', borderRadius: '1600px' }}
          onClick={() => onDelete(document)}
        >
          <Trash2 size={14} color="var(--color-ember)" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
