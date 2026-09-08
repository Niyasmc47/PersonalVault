import { useState, useEffect } from 'react';
import type { CredentialCategory, CredentialItem, CredentialPayload } from '../types';
import { X, Loader2, KeyRound } from 'lucide-react';

interface CredentialFormModalProps {
  isOpen: boolean;
  credential: CredentialItem | null;
  onSave: (payload: CredentialPayload) => Promise<void>;
  onClose: () => void;
}

export default function CredentialFormModal({
  isOpen,
  credential,
  onSave,
  onClose,
}: CredentialFormModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CredentialCategory>('LOGIN');
  const [notes, setNotes] = useState('');
  const [apiKeys, setApiKeys] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (credential) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(credential.name);
      setUsername(credential.username);
      setPassword(''); // Password left blank when editing unless changing
      setUrl(credential.url || '');
      setCategory(credential.category);
      setNotes('');
      setApiKeys('');
      setRecoveryCodes('');
    } else {
      setName('');
      setUsername('');
      setPassword('');
      setUrl('');
      setCategory('LOGIN');
      setNotes('');
      setApiKeys('');
      setRecoveryCodes('');
    }
    setError(null);
  }, [credential, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      setError('Name and username are required.');
      return;
    }
    if (!credential && !password.trim()) {
      setError('Password is required for new credentials.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        name: name.trim(),
        username: username.trim(),
        password: password.trim() || undefined,
        url: url.trim() || undefined,
        category,
        notes: notes.trim() || undefined,
        apiKeys: apiKeys.trim() || undefined,
        recoveryCodes: recoveryCodes.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Failed to save credential.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: CredentialCategory[] = [
    'LOGIN',
    'EMAIL',
    'SOCIAL',
    'FINANCIAL',
    'WORK',
    'STREAMING',
    'OTHER',
  ];

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal"
        style={{ maxWidth: '600px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="pv-sticker-badge" style={{ background: 'var(--color-sunburst)' }}>
              <KeyRound size={16} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {credential ? 'Edit Credential' : 'Add New Credential'}
            </h2>
          </div>
          <button type="button" className="pv-modal__close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: '#ffebee', color: 'var(--color-ember)', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Service or Website Name *
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder="e.g. GitHub, Google, Netflix"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Username or Email *
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder="e.g. john@example.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Password {credential ? '(Leave blank to keep existing)' : '*'}
              </label>
              <input
                type="password"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder={credential ? '••••••••' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!credential}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Website URL (Optional)
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder="https://github.com/login"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Category
              </label>
              <select
                className="pv-input"
                style={{ width: '100%' }}
                value={category}
                onChange={(e) => setCategory(e.target.value as CredentialCategory)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              API Keys or Tokens (Encrypted, Optional)
            </label>
            <textarea
              className="pv-input"
              style={{ width: '100%', minHeight: '60px', fontFamily: 'monospace' }}
              placeholder="sk-proj-..."
              value={apiKeys}
              onChange={(e) => setApiKeys(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Recovery Codes / Backup Codes (Encrypted, Optional)
            </label>
            <textarea
              className="pv-input"
              style={{ width: '100%', minHeight: '60px', fontFamily: 'monospace' }}
              placeholder="One code per line or comma-separated"
              value={recoveryCodes}
              onChange={(e) => setRecoveryCodes(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Sensitive Notes (Encrypted, Optional)
            </label>
            <textarea
              className="pv-input"
              style={{ width: '100%', minHeight: '60px' }}
              placeholder="Security questions, PINs, or confidential reminders"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="pv-btn pv-btn--light" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="pv-btn pv-btn--dark" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="pv-spin" />
                  <span>Encrypting & Saving...</span>
                </>
              ) : (
                <span>{credential ? 'Update Credential' : 'Save Encrypted'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
