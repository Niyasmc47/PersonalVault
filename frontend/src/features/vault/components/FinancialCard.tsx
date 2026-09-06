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
  CreditCard,
  QrCode,
  Landmark,
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
    <div className="pv-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: getTypeBadgeColor(account.accountType),
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Building2 size={18} color="var(--color-carbon)" />
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
                background: getTypeBadgeColor(account.accountType),
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              {account.accountType}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{account.bankName}</h3>
          </div>
        </div>
      </div>

      {/* Masked / Revealed Account Number */}
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
            Account Number
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px' }}>
            {revealed ? revealed.accountNumber : account.maskedAccountNumber}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px', borderRadius: '1200px' }}
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
              style={{ padding: '4px 8px', borderRadius: '1200px' }}
              onClick={() => handleCopy(revealed.accountNumber, 'acc')}
              title="Copy account number"
            >
              {copiedField === 'acc' ? <Check size={14} color="green" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Details Grid: IFSC, Branch, UPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '12px' }}>
        {account.ifsc && (
          <div style={{ background: '#fafafa', padding: '8px 12px', borderRadius: '12px', border: '1px solid #eee' }}>
            <span style={{ color: '#666', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>IFSC</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontFamily: 'monospace' }}>{account.ifsc}</strong>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => handleCopy(account.ifsc!, 'ifsc')}
              >
                {copiedField === 'ifsc' ? <Check size={12} color="green" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        )}

        {account.branch && (
          <div style={{ background: '#fafafa', padding: '8px 12px', borderRadius: '12px', border: '1px solid #eee' }}>
            <span style={{ color: '#666', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Branch</span>
            <span style={{ fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {account.branch}
            </span>
          </div>
        )}

        {account.upiId && (
          <div style={{ background: '#fafafa', padding: '8px 12px', borderRadius: '12px', border: '1px solid #eee' }}>
            <span style={{ color: '#666', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>UPI ID</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.upiId}</strong>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => handleCopy(account.upiId!, 'upi')}
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
            style={{ borderRadius: '1600px', fontSize: '12px' }}
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
            <span>View Attachment ({account.fileName})</span>
          </button>
        </div>
      )}

      {/* Revealed Tax Information & Notes */}
      {revealed && (revealed.taxInfo || revealed.notes) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {revealed.taxInfo && (
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', border: '1px dashed var(--color-carbon)' }}>
              <strong>Tax Information:</strong>
              <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{revealed.taxInfo}</p>
            </div>
          )}
          {revealed.notes && (
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', border: '1px dashed var(--color-carbon)' }}>
              <strong>Notes:</strong>
              <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{revealed.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Card Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ padding: '6px 12px', borderRadius: '1600px' }}
          onClick={() => onEdit(account)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ padding: '6px 12px', borderRadius: '1600px' }}
          onClick={() => onDelete(account)}
        >
          <Trash2 size={14} color="var(--color-ember)" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
