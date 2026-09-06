import { useState, useEffect } from 'react';
import type {
  VaultDocumentCategory,
  VaultDocumentItem,
  VaultDocumentPayload,
  VaultDocumentSection,
} from '../types';
import { X, Loader2, Upload, GraduationCap, FolderLock } from 'lucide-react';

interface DocumentFormModalProps {
  isOpen: boolean;
  document: VaultDocumentItem | null;
  section: VaultDocumentSection;
  onSave: (payload: VaultDocumentPayload) => Promise<void>;
  onClose: () => void;
}

const educationCategories: { label: string; value: VaultDocumentCategory }[] = [
  { label: 'Degree', value: 'DEGREE' },
  { label: 'Mark Sheet', value: 'MARK_SHEET' },
  { label: 'Transcript', value: 'TRANSCRIPT' },
  { label: 'Student ID', value: 'STUDENT_ID' },
  { label: 'Internship Certificate', value: 'INTERNSHIP_CERTIFICATE' },
  { label: 'Offer Letter', value: 'OFFER_LETTER' },
  { label: 'Experience Certificate', value: 'EXPERIENCE_CERTIFICATE' },
  { label: 'Professional Certification', value: 'PROFESSIONAL_CERTIFICATION' },
];

const otherCategories: { label: string; value: VaultDocumentCategory }[] = [
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Insurance', value: 'INSURANCE' },
  { label: 'Property', value: 'PROPERTY' },
  { label: 'Tax Document', value: 'TAX_DOCUMENT' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Vehicle', value: 'VEHICLE' },
  { label: 'Other', value: 'OTHER' },
];

export default function DocumentFormModal({
  isOpen,
  document,
  section,
  onSave,
  onClose,
}: DocumentFormModalProps) {
  const categories = section === 'EDUCATION' ? educationCategories : otherCategories;
  const defaultCategory = categories[0].value;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultDocumentCategory>(defaultCategory);
  const [issuerOrInstitution, setIssuerOrInstitution] = useState('');
  const [documentIdentifier, setDocumentIdentifier] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setCategory(document.category);
      setIssuerOrInstitution(document.issuerOrInstitution || '');
      setDocumentIdentifier(document.documentIdentifier || '');
      setIssueDate(document.issueDate || '');
      setExpiryDate(document.expiryDate || '');
      setNotes('');
      setFile(null);
    } else {
      setTitle('');
      setCategory(defaultCategory);
      setIssuerOrInstitution('');
      setDocumentIdentifier('');
      setIssueDate('');
      setExpiryDate('');
      setNotes('');
      setFile(null);
    }
    setError(null);
  }, [document, isOpen, defaultCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!document && !file) {
      setError('Please upload a document file.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        section,
        category,
        title: title.trim(),
        issuerOrInstitution: issuerOrInstitution.trim() || undefined,
        documentIdentifier: documentIdentifier.trim() || undefined,
        issueDate: issueDate || undefined,
        expiryDate: expiryDate || undefined,
        notes: notes.trim() || undefined,
        file,
      });
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        setError(axiosErr.response?.data?.error || 'Failed to save document.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionIcon = section === 'EDUCATION' ? GraduationCap : FolderLock;
  const sectionBadgeColor = section === 'EDUCATION' ? 'var(--color-electric-blue)' : 'var(--color-lavender)';

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal"
        style={{ maxWidth: '640px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="pv-sticker-badge" style={{ background: sectionBadgeColor }}>
              <SectionIcon size={16} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              {document ? 'Edit Document' : section === 'EDUCATION' ? 'Add Education Document' : 'Add Document'}
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
              Document Title *
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder="e.g. B.Tech Degree, Life Insurance Policy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Category *
              </label>
              <select
                className="pv-input"
                style={{ width: '100%' }}
                value={category}
                onChange={(e) => setCategory(e.target.value as VaultDocumentCategory)}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                {section === 'EDUCATION' ? 'Institution / University' : 'Issuing Organization'} (Optional)
              </label>
              <input
                type="text"
                className="pv-input"
                style={{ width: '100%' }}
                placeholder={section === 'EDUCATION' ? 'e.g. IIT Delhi' : 'e.g. LIC of India'}
                value={issuerOrInstitution}
                onChange={(e) => setIssuerOrInstitution(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Document ID / Reference Number (Optional)
            </label>
            <input
              type="text"
              className="pv-input"
              style={{ width: '100%' }}
              placeholder="e.g. Roll No, Policy Number, Registration Number"
              value={documentIdentifier}
              onChange={(e) => setDocumentIdentifier(e.target.value)}
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

          {/* File Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
              Upload Document (PDF, PNG, JPG) {document ? '' : '*'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="pv-input"
                style={{ width: '100%', fontSize: '12px' }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required={!document}
              />
            </div>
            {document && !file && (
              <span style={{ fontSize: '11px', color: '#666', display: 'block', marginTop: '4px' }}>
                Current: {document.originalFileName}
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
              placeholder="e.g. Verification details, important terms, or renewal information"
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
