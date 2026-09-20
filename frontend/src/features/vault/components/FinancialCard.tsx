import { useState } from 'react';
import type { FinancialAccountItem, FinancialAccountReveal } from '../types';
import { useVaultLock } from '../contexts/VaultLockContext';
import { vaultService } from '../services/vaultService';
import {
  Building2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit3,
  Trash2,
  FileText,
} from 'lucide-react';

interface FinancialCardProps {
  account: FinancialAccountItem;
  onEdit: (account: FinancialAccountItem) => void;
  onDelete: (account: FinancialAccountItem) => void;
  onPreview: (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => void;
}

export default function FinancialCard({ account, onEdit, onDelete, onPreview }: FinancialCardProps) {
  const { vaultToken } = useVaultLock();
  const [revealed, setRevealed] = useState<FinancialAccountReveal | null>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleToggleReveal = async () => {
    if (revealed) {
      setRevealed(null);
      return;
    }

    if (!vaultToken) return;

    try {
      setIsRevealing(true);
      const data = await vaultService.revealFinancialAccount(account.id, vaultToken);
      setRevealed(data);
    } catch (err) {
      console.error('Failed to reveal financial account:', err);
    } finally {
      setIsRevealing(false);
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'SALARY':
        return 'var(--color-mint-pop)';
      case 'CURRENT':
        return 'var(--color-lavender)';
      case 'DEMAT':
        return 'var(--color-electric-blue)';
      case 'FIXED_DEPOSIT':
        return 'var(--color-sunburst)';
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
            style={{ background: getTypeBadgeColor(account.accountType) }}
          >
            <Building2 size={20} color="var(--color-carbon)" />
          </div>
          <div className="pv-vault-card__titles">
            <h3 className="pv-vault-card__title" title={account.bankName}>
              {account.bankName}
            </h3>
            <span className="pv-vault-card__subtitle">
              {account.accountType.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <span
          className="pv-vault-card__badge"
          style={{ background: getTypeBadgeColor(account.accountType) }}
        >
          {account.accountType}
        </span>
      </div>

      {/* Masked / Revealed Account Number */}
      <div className="pv-vault-card__secret-box">
        <div style={{ minWidth: 0, flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#666', display: 'block', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '2px' }}>
            Account Number
          </span>
          <span className="pv-vault-card__secret-text">
            {revealed ? revealed.accountNumber : account.maskedAccountNumber}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px' }}
            onClick={handleToggleReveal}
            disabled={isRevealing}
            title={revealed ? 'Hide account details' : 'Reveal account details'}
          >
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>

          {revealed && (
            <button
              type="button"
              className="pv-btn pv-btn--light pv-btn--sm"
              style={{ padding: '4px 8px' }}
              onClick={() => handleCopy(revealed.accountNumber, 'acc')}
              title="Copy account number"
            >
              {copiedField === 'acc' ? <Check size={14} color="green" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Details Grid: IFSC, Branch, UPI */}
      <div className="pv-vault-card__details-grid">
        {account.ifsc && (
          <div className="pv-vault-card__detail-item">
            <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>IFSC</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>{account.ifsc}</strong>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => handleCopy(account.ifsc!, 'ifsc')}
                title="Copy IFSC"
              >
                {copiedField === 'ifsc' ? <Check size={12} color="green" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        )}

        {account.branch && (
          <div className="pv-vault-card__detail-item">
            <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Branch</span>
            <span style={{ fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {account.branch}
            </span>
          </div>
        )}

        {account.upiId && (
          <div className="pv-vault-card__detail-item">
            <span style={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>UPI ID</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {account.upiId}
              </strong>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => handleCopy(account.upiId!, 'upi')}
                title="Copy UPI ID"
              >
                {copiedField === 'upi' ? <Check size={12} color="green" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document attachment if available */}
      {account.hasDocument && (
        <div>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ fontSize: '12px' }}
            onClick={() => {
              if (!vaultToken) return;
              onPreview(
                `${account.bankName} - Document`,
                account.mimeType,
                account.fileName || 'bank_doc',
                () => vaultService.getFinancialDocumentBlob(account.id, vaultToken)
              );
            }}
          >
            <FileText size={13} />
            <span>Attachment: {account.fileName || 'Document'}</span>
          </button>
        </div>
      )}

      {/* Revealed Tax Information & Notes */}
      {revealed && (revealed.taxInfo || revealed.notes) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {revealed.taxInfo && (
            <div className="pv-vault-card__revealed-box">
              <strong style={{ display: 'block', marginBottom: '4px' }}>Tax Information:</strong>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333' }}>{revealed.taxInfo}</p>
            </div>
          )}
          {revealed.notes && (
            <div className="pv-vault-card__revealed-box">
              <strong style={{ display: 'block', marginBottom: '4px' }}>Notes:</strong>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333' }}>{revealed.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="pv-vault-card__footer">
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onEdit(account)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
          onClick={() => onDelete(account)}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
