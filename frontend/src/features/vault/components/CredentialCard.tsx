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
    <div className="pv-vault-card">
      {/* Top Header */}
      <div className="pv-vault-card__top">
        <div className="pv-vault-card__header-main">
          <div
            className="pv-vault-card__icon"
            style={{ background: getCategoryColor(credential.category) }}
          >
            <KeyRound size={20} color="var(--color-carbon)" />
          </div>
          <div className="pv-vault-card__titles">
            <h3 className="pv-vault-card__title" title={credential.name}>
              {credential.name}
            </h3>
            <span className="pv-vault-card__subtitle" title={credential.username}>
              {credential.username}
            </span>
          </div>
        </div>

        <span
          className="pv-vault-card__badge"
          style={{ background: getCategoryColor(credential.category) }}
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
          className="pv-vault-card__link"
        >
          <span>{credential.url}</span>
          <ExternalLink size={12} />
        </a>
      )}

      {/* Password Masked / Revealed Row */}
      <div className="pv-vault-card__secret-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <Lock size={15} color="#555" style={{ flexShrink: 0 }} />
          <span className="pv-vault-card__secret-text">
            {revealed?.password ? revealed.password : '••••••••••••'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            style={{ padding: '4px 8px' }}
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
              style={{ padding: '4px 8px' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          {revealed.notes && (
            <div className="pv-vault-card__revealed-box">
              <strong style={{ display: 'block', marginBottom: '4px' }}>Notes:</strong>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#333' }}>{revealed.notes}</p>
            </div>
          )}

          {revealed.apiKeys && (
            <div className="pv-vault-card__revealed-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <FileCode size={14} /> API Key:
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => handleCopy(revealed.apiKeys!, 'apiKey')}
                  title="Copy API Key"
                >
                  {copied === 'apiKey' ? <Check size={14} color="green" /> : <Copy size={14} />}
                </button>
              </div>
              <code style={{ display: 'block', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '12px' }}>
                {revealed.apiKeys}
              </code>
            </div>
          )}

          {revealed.recoveryCodes && (
            <div className="pv-vault-card__revealed-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldAlert size={14} /> Recovery Codes:
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => handleCopy(revealed.recoveryCodes!, 'recCodes')}
                  title="Copy Recovery Codes"
                >
                  {copied === 'recCodes' ? <Check size={14} color="green" /> : <Copy size={14} />}
                </button>
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
                {revealed.recoveryCodes}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="pv-vault-card__footer">
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onEdit(credential)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
          onClick={() => onDelete(credential)}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
