import { useState, useEffect } from 'react';
import type { FinancialAccountItem, FinancialAccountPayload, FinancialAccountType } from '../types';
import { X, Loader2, Building2, Upload } from 'lucide-react';

interface FinancialFormModalProps {
  isOpen: boolean;
  account: FinancialAccountItem | null;
  onSave: (payload: FinancialAccountPayload) => Promise<void>;
  onClose: () => void;
}

export default function FinancialFormModal({
  isOpen,
  account,
  onSave,
  onClose,
}: FinancialFormModalProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [branch, setBranch] = useState('');
  const [accountType, setAccountType] = useState<FinancialAccountType>('SAVINGS');
  const [upiId, setUpiId] = useState('');
  const [taxInfo, setTaxInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBankName(account.bankName);
      setAccountNumber(''); // Left blank when editing unless changing
      setIfsc(account.ifsc || '');
      setBranch(account.branch || '');
      setAccountType(account.accountType);
      setUpiId(account.upiId || '');
      setTaxInfo('');
      setNotes('');
      setFile(null);
    } else {
      setBankName('');
      setAccountNumber('');
      setIfsc('');
      setBranch('');
      setAccountType('SAVINGS');
      setUpiId('');
      setTaxInfo('');
      setNotes('');
      setFile(null);
    }
    setError(null);
  }, [account, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim()) {
      setError('Bank name is required.');
      return;
    }
    if (!account && !accountNumber.trim()) {
      setError('Account number is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim() || undefined,
        ifsc: ifsc.trim() || undefined,
        branch: branch.trim() || undefined,
        accountType,
        upiId: upiId.trim() || undefined,
        taxInfo: taxInfo.trim() || undefined,
        notes: notes.trim() || undefined,
        file,
      });
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Failed to save financial account.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const accountTypes: { label: string; value: FinancialAccountType }[] = [
    { label: 'Savings Account', value: 'SAVINGS' },
    { label: 'Current Account', value: 'CURRENT' },
    { label: 'Salary Account', value: 'SALARY' },
    { label: 'Fixed Deposit / Recurring', value: 'FIXED_DEPOSIT' },
    { label: 'Demat / Trading Account', value: 'DEMAT' },
    { label: 'Other Financial Account', value: 'OTHER' },
  ];

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal"
        style={{ maxWidth: '640px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="pv-sticker-badge" style={{ background: 'var(--color-mint-pop)' }}>
              <Building2 size={16} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {account ? 'Edit Financial Account' : 'Add Financial Account'}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Bank / Financial Institution *
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder="e.g. HDFC Bank, ICICI, Zerodha"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Account Type *
              </label>
              <select
                className="pv-input"
                style={{ width: '100%' }}
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as FinancialAccountType)}
              >
                {accountTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Account Number {account ? '(Leave blank to keep existing)' : '*'}
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder={account ? account.maskedAccountNumber : 'Enter full account number'}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required={!account}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                IFSC Code (Optional)
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder="HDFC0001234"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Branch Name (Optional)
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder="Indiranagar, Bangalore"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              UPI ID (Optional)
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder="username@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Tax Information (Encrypted, Optional)
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder="e.g. GSTIN, Tax ID, or filing notes"
              value={taxInfo}
              onChange={(e) => setTaxInfo(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Statement / Passbook / Cancelled Cheque (PDF, PNG, JPG)
            </label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="pv-input"
              style={{ width: '100%', fontSize: '12px' }}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {account?.hasDocument && !file && (
              <span style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '4px' }}>
                Current attachment: {account.fileName}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Confidential Notes (Encrypted, Optional)
            </label>
            <textarea
              className="pv-input"
              style={{ width: '100%', minHeight: '60px' }}
              placeholder="Nominee details, customer ID, or related instructions (Do NOT enter CVV)"
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
                <>
                  <Upload size={14} />
                  <span>{account ? 'Update Account' : 'Save Encrypted'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
