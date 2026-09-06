import { useState } from 'react';
import type { IdentityDocumentItem, IdentityDocumentReveal } from '../types';
import { useVaultLock } from '../contexts/VaultLockContext';
import { vaultService } from '../services/vaultService';
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
  User,
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
    <div className="pv-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: getTypeColor(document.type),
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileCheck2 size={18} color="var(--color-carbon)" />
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
                background: getTypeColor(document.type),
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              {formatTypeName(document.type)}
            </span>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#666" />
              <span>{document.holderName}</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Masked / Revealed Document Number */}
      <div
        style={{
          background: 'var(--color-soft-mist)',
          padding: '10px 16px',
          borderRadius: '16px',
          border: '1px solid var(--color-carbon)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#666', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
            Document Number
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px' }}>
            {revealed ? revealed.documentNumber : document.maskedNumber}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px', borderRadius: '1200px' }}
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
              style={{ padding: '4px 8px', borderRadius: '1200px' }}
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

      {/* Document Attachments (Front / Back) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {document.hasFrontFile && (
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ borderRadius: '1600px', fontSize: '12px' }}
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
            <span>View Front</span>
          </button>
        )}

        {document.hasBackFile && (
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ borderRadius: '1600px', fontSize: '12px' }}
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
            <span>View Back</span>
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
