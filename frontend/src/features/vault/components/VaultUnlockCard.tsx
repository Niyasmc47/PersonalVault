import { useState } from 'react';
import { useVaultLock } from '../contexts/VaultLockContext';
import { Lock, KeyRound, Eye, EyeOff, Loader2, ShieldAlert, Sparkles } from 'lucide-react';

export default function VaultUnlockCard() {
  const { isConfigured, passwordHint, unlockVault, setupVault } = useVaultLock();

  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hint, setHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!isConfigured) {
        if (!masterPassword || masterPassword.length < 6) {
          setError('Master password must be at least 6 characters long.');
          setIsSubmitting(false);
          return;
        }
        if (masterPassword !== confirmPassword) {
          setError('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }
        await setupVault(masterPassword, confirmPassword, hint || undefined);
      } else {
        if (!masterPassword) {
          setError('Please enter your master password.');
          setIsSubmitting(false);
          return;
        }
        await unlockVault(masterPassword);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Authentication failed. Please check your password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '48px auto', width: '100%', padding: '0 16px' }}>
      <div className="pv-card" style={{ padding: '36px', borderRadius: '32px', textAlign: 'center' }}>
        {/* Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: isConfigured ? 'var(--color-sky-wash)' : 'var(--color-lavender)',
            border: '1px solid var(--color-carbon)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          {isConfigured ? (
            <Lock size={28} color="var(--color-carbon)" strokeWidth={2.5} />
          ) : (
            <Sparkles size={28} color="var(--color-carbon)" strokeWidth={2.5} />
          )}
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
          {isConfigured ? 'SECURE VAULT LOCKED' : 'INITIALIZE SECURE VAULT'}
        </h2>

        <p style={{ fontSize: '14px', color: '#444', marginBottom: '24px', lineHeight: 1.5 }}>
          {isConfigured
            ? 'Your vault is encrypted with AES-256-GCM. Enter your Master Vault Password to unlock access to your credentials, identity documents, and financial records.'
            : 'Create a Master Vault Password. This key is used to protect your private credentials and identity cards. It is never stored in plaintext.'}
        </p>

        {error && (
          <div
            style={{
              background: '#ffebee',
              border: '1px solid var(--color-ember)',
              color: 'var(--color-ember)',
              padding: '12px 16px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Master Vault Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="pv-input"
                style={{ width: '100%', paddingRight: '42px' }}
                placeholder="Enter master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-carbon)',
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isConfigured && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Confirm Master Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="pv-input"
                  style={{ width: '100%' }}
                  placeholder="Repeat master password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Password Hint (Optional)
                </label>
                <input
                  type="text"
                  className="pv-input"
                  style={{ width: '100%' }}
                  placeholder="e.g. Favorite childhood pet name"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                />
              </div>
            </>
          )}

          {isConfigured && passwordHint && (
            <div style={{ fontSize: '12px', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: '#555', fontWeight: 600 }}
              >
                {showHint ? `Hint: ${passwordHint}` : 'Forgot? View password hint'}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="pv-btn pv-btn--dark"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '14px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="pv-spin" />
                <span>{isConfigured ? 'Verifying...' : 'Setting up Vault...'}</span>
              </>
            ) : (
              <>
                <KeyRound size={18} />
                <span>{isConfigured ? 'Unlock Vault' : 'Create & Unlock Vault'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
