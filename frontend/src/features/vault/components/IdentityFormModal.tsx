import { useState, useEffect } from 'react';
import type { IdentityDocumentItem, IdentityDocumentPayload, IdentityDocumentType } from '../types';
import { X, Loader2, FileCheck2, Upload } from 'lucide-react';

interface IdentityFormModalProps {
  isOpen: boolean;
  document: IdentityDocumentItem | null;
  onSave: (payload: IdentityDocumentPayload) => Promise<void>;
  onClose: () => void;
}

export default function IdentityFormModal({
  isOpen,
  document,
  onSave,
  onClose,
}: IdentityFormModalProps) {
  const [type, setType] = useState<IdentityDocumentType>('AADHAAR');
  const [holderName, setHolderName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setType(document.type);
      setHolderName(document.holderName);
      setDocumentNumber(''); // Left blank unless updating
      setIssueDate(document.issueDate || '');
      setExpiryDate(document.expiryDate || '');
      setNotes('');
      setFrontFile(null);
      setBackFile(null);
    } else {
      setType('AADHAAR');
      setHolderName('');
      setDocumentNumber('');
      setIssueDate('');
      setExpiryDate('');
      setNotes('');
      setFrontFile(null);
      setBackFile(null);
    }
    setError(null);
  }, [document, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim()) {
      setError('Holder name is required.');
      return;
    }
    if (!document && !documentNumber.trim()) {
      setError('Document number is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        type,
        holderName: holderName.trim(),
        documentNumber: documentNumber.trim() || undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        notes: notes.trim() || undefined,
        frontFile,
        backFile,
      });
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Failed to save identity document.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const types: { label: string; value: IdentityDocumentType }[] = [
    { label: 'Aadhaar Card', value: 'AADHAAR' },
    { label: 'PAN Card', value: 'PAN' },
    { label: 'Passport', value: 'PASSPORT' },
    { label: 'Driving Licence', value: 'DRIVING_LICENCE' },
    { label: 'Voter ID', value: 'VOTER_ID' },
    { label: 'Other Government ID', value: 'OTHER' },
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
            <div className="pv-sticker-badge" style={{ background: 'var(--color-electric-blue)' }}>
              <FileCheck2 size={16} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {document ? 'Edit Identity Document' : 'Add Identity Document'}
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
                Document Type *
              </label>
              <select
                className="pv-input"
                style={{ width: '100%' }}
                value={type}
                onChange={(e) => setType(e.target.value as IdentityDocumentType)}
              >
                {types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Full Name as on Document *
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder="e.g. John Doe"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Document Number {document ? '(Leave blank to keep existing)' : '*'}
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder={document ? document.maskedNumber : 'e.g. 1234 5678 9012 or ABCDE1234F'}
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required={!document}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Issue Date (Optional)
              </label>
              <input
                type="date"
                className="pv-input"
                style={{ width: '100%' }}
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                className="pv-input"
                style={{ width: '100%' }}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          {/* File Uploads */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Front Side Document (PDF, PNG, JPG)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="pv-input"
                  style={{ width: '100%', fontSize: '12px' }}
                  onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
                />
              </div>
              {document?.hasFrontFile && !frontFile && (
                <span style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '4px' }}>
                  Current: {document.fileNameFront}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Back Side Document (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="pv-input"
                  style={{ width: '100%', fontSize: '12px' }}
                  onChange={(e) => setBackFile(e.target.files?.[0] || null)}
                />
              </div>
              {document?.hasBackFile && !backFile && (
                <span style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '4px' }}>
                  Current: {document.fileNameBack}
                </span>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Confidential Notes (Encrypted, Optional)
            </label>
            <textarea
              className="pv-input"
              style={{ width: '100%', minHeight: '60px' }}
              placeholder="e.g. Registered address, issuance place, or renewal information"
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
                  <span>Encrypting & Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>{document ? 'Update Document' : 'Save Encrypted'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
