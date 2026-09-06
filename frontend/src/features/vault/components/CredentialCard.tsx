import { useState } from 'react';
import type { CredentialItem, CredentialReveal } from '../types';
import { useVaultLock } from '../contexts/VaultLockContext';
import { vaultService } from '../services/vaultService';
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Edit3,
  Trash2,
  Lock,
  FileCode,
  ShieldAlert,
} from 'lucide-react';

interface CredentialCardProps {
  credential: CredentialItem;
  onEdit: (credential: CredentialItem) => void;
  onDelete: (credential: CredentialItem) => void;
}

export default function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const { vaultToken } = useVaultLock();
  const [revealed, setRevealed] = useState<CredentialReveal | null>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleToggleReveal = async () => {
    if (revealed) {
      setRevealed(null);
      return;
    }

    if (!vaultToken) return;

    try {
      setIsRevealing(true);
      const data = await vaultService.revealCredential(credential.id, vaultToken);
      setRevealed(data);
    } catch (err) {
      console.error('Failed to reveal credential:', err);
    } finally {
      setIsRevealing(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopied(fieldName);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'FINANCIAL':
        return 'var(--color-sunburst)';
      case 'WORK':
        return 'var(--color-electric-blue)';
      case 'SOCIAL':
        return 'var(--color-lavender)';
      case 'EMAIL':
        return 'var(--color-mint-pop)';
      default:
        return 'var(--color-soft-mist)';
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
              background: getCategoryColor(credential.category),
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <KeyRound size={18} color="var(--color-carbon)" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{credential.name}</h3>
            <span style={{ fontSize: '13px', color: '#555', wordBreak: 'break-all' }}>{credential.username}</span>
          </div>
        </div>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '1600px',
            border: '1px solid var(--color-carbon)',
            background: getCategoryColor(credential.category),
          }}
        >
          {credential.category}
        </span>
      </div>

      {/* URL Link if available */}
      {credential.url && (
        <a
          href={credential.url.startsWith('http') ? credential.url : `https://${credential.url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#333',
            textDecoration: 'underline',
            width: 'fit-content',
          }}
        >
          <span>{credential.url}</span>
          <ExternalLink size={12} />
        </a>
      )}

      {/* Password Masked / Revealed Row */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <Lock size={14} color="#666" />
          <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {revealed?.password ? revealed.password : '••••••••••••'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px', borderRadius: '1200px' }}
            onClick={handleToggleReveal}
            disabled={isRevealing}
            title={revealed ? 'Hide secret' : 'Reveal secret'}
          >
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>

          {revealed?.password && (
            <button
              type="button"
              className="pv-btn pv-btn--light pv-btn--sm"
              style={{ padding: '4px 8px', borderRadius: '1200px' }}
              onClick={() => handleCopy(revealed.password!, 'password')}
              title="Copy password"
            >
              {copied === 'password' ? <Check size={14} color="green" /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Revealed Extra Secrets (Notes, API Keys, Recovery Codes) */}
      {revealed && (revealed.notes || revealed.apiKeys || revealed.recoveryCodes) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', marginTop: '4px' }}>
          {revealed.notes && (
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', border: '1px dashed var(--color-carbon)' }}>
              <strong>Notes:</strong>
              <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{revealed.notes}</p>
            </div>
          )}

          {revealed.apiKeys && (
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', border: '1px dashed var(--color-carbon)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <FileCode size={13} /> API Key:
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => handleCopy(revealed.apiKeys!, 'apiKey')}
                >
                  {copied === 'apiKey' ? <Check size={13} color="green" /> : <Copy size={13} />}
                </button>
              </div>
              <code style={{ display: 'block', margin: '4px 0 0', wordBreak: 'break-all' }}>{revealed.apiKeys}</code>
            </div>
          )}

          {revealed.recoveryCodes && (
            <div style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', border: '1px dashed var(--color-carbon)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <ShieldAlert size={13} /> Recovery Codes:
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => handleCopy(revealed.recoveryCodes!, 'recCodes')}
                >
                  {copied === 'recCodes' ? <Check size={13} color="green" /> : <Copy size={13} />}
                </button>
              </div>
              <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{revealed.recoveryCodes}</pre>
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
          onClick={() => onEdit(credential)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          style={{ padding: '6px 12px', borderRadius: '1600px' }}
          onClick={() => onDelete(credential)}
        >
          <Trash2 size={14} color="var(--color-ember)" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
