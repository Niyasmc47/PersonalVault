import React, { useState, useEffect, useRef } from 'react';
import type {
  Certificate,
  CertificateCategory,
  CreateCertificatePayload,
  UpdateCertificatePayload,
} from '../types';
import { CATEGORY_LABELS } from '../types';
import { X, Upload, FileText, Image as ImageIcon, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface CertificateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCertificatePayload | { id: number; data: UpdateCertificatePayload }) => void;
  initialData?: Certificate | null;
  isSubmitting: boolean;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'webp'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

export default function CertificateFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: CertificateFormModalProps) {
  const isEdit = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [category, setCategory] = useState<CertificateCategory>('COURSE');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setIssuer(initialData.issuer || '');
      setCategory(initialData.category || 'COURSE');
      setIssueDate(initialData.issueDate || '');
      setExpiryDate(initialData.expiryDate || '');
      setDescription(initialData.description || '');
      setCredentialId(initialData.credentialId || '');
      setCredentialUrl(initialData.credentialUrl || '');
      setFile(null);
      setFileError(null);
    } else {
      setTitle('');
      setIssuer('');
      setCategory('COURSE');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setExpiryDate('');
      setDescription('');
      setCredentialId('');
      setCredentialUrl('');
      setFile(null);
      setFileError(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validateAndSetFile = (selectedFile: File) => {
    setFileError(null);

    // Size check
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`File size (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB) exceeds 20 MB limit.`);
      return;
    }

    // Extension check
    const parts = selectedFile.name.split('.');
    const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError('Invalid file type. Please upload a PDF, PNG, JPG, JPEG, or WEBP file.');
      return;
    }

    // MIME type check
    if (selectedFile.type && !ALLOWED_MIME_TYPES.includes(selectedFile.type.toLowerCase())) {
      setFileError('Invalid file MIME type. Only PDF and image files are supported.');
      return;
    }

    setFile(selectedFile);
    // Auto-fill title from filename if title is empty
    if (!title && !isEdit) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !issuer.trim() || !category || !issueDate) {
      return;
    }

    if (!isEdit && !file) {
      setFileError('Please select a certificate file to upload.');
      return;
    }

    if (isEdit && initialData) {
      onSubmit({
        id: initialData.id,
        data: {
          title: title.trim(),
          issuer: issuer.trim(),
          category,
          issueDate,
          expiryDate: expiryDate ? expiryDate : undefined,
          description: description.trim() ? description.trim() : undefined,
          credentialId: credentialId.trim() ? credentialId.trim() : undefined,
          credentialUrl: credentialUrl.trim() ? credentialUrl.trim() : undefined,
        },
      });
    } else if (file) {
      onSubmit({
        title: title.trim(),
        issuer: issuer.trim(),
        category,
        issueDate,
        expiryDate: expiryDate ? expiryDate : undefined,
        description: description.trim() ? description.trim() : undefined,
        credentialId: credentialId.trim() ? credentialId.trim() : undefined,
        credentialUrl: credentialUrl.trim() ? credentialUrl.trim() : undefined,
        file,
      });
    }
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-cert-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pv-modal-header">
          <h2 className="pv-modal-title">
            {isEdit ? 'Edit Certificate' : 'Add New Certificate'}
          </h2>
          <button
            className="pv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pv-cert-form">
          <div className="pv-modal-scroll-content">
            {/* ── File Upload Section (Only for Add mode) ── */}
            {!isEdit && (
              <div className="pv-form-group">
                <label className="pv-form-label">
                  Certificate File <span className="pv-required">*</span>
                </label>
                <div
                  className={`pv-dropzone ${isDragging ? 'pv-dropzone--active' : ''} ${file ? 'pv-dropzone--has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
                    style={{ display: 'none' }}
                  />

                  {file ? (
                    <div className="pv-dropzone__file-info">
                      {file.type.includes('pdf') ? (
                        <FileText size={32} color="var(--color-carbon)" />
                      ) : (
                        <ImageIcon size={32} color="var(--color-carbon)" />
                      )}
                      <div className="pv-dropzone__file-details">
                        <span className="pv-dropzone__filename">{file.name}</span>
                        <span className="pv-dropzone__filesize">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="pv-dropzone__success-icon">
                        <CheckCircle2 size={20} color="var(--color-mint-pop)" />
                      </div>
                    </div>
                  ) : (
                    <div className="pv-dropzone__prompt">
                      <div className="pv-dropzone__icon-circle">
                        <Upload size={24} color="var(--color-carbon)" />
                      </div>
                      <p className="pv-dropzone__main-text">
                        <strong>Click to upload</strong> or drag and drop
                      </p>
                      <p className="pv-dropzone__sub-text">
                        PDF, PNG, JPG, or WEBP (Max 20 MB)
                      </p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <div className="pv-form-error-msg">
                    <AlertCircle size={14} />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Title & Issuer ── */}
            <div className="pv-form-row">
              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-title" className="pv-form-label">
                  Certificate Title <span className="pv-required">*</span>
                </label>
                <input
                  id="cert-title"
                  type="text"
                  className="pv-input"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-issuer" className="pv-form-label">
                  Issuing Organization <span className="pv-required">*</span>
                </label>
                <input
                  id="cert-issuer"
                  type="text"
                  className="pv-input"
                  placeholder="e.g. Amazon Web Services, Coursera, NPTEL"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ── Category & Dates ── */}
            <div className="pv-form-row">
              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-category" className="pv-form-label">
                  Category <span className="pv-required">*</span>
                </label>
                <select
                  id="cert-category"
                  className="pv-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CertificateCategory)}
                  required
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-issue-date" className="pv-form-label">
                  Issue Date <span className="pv-required">*</span>
                </label>
                <input
                  id="cert-issue-date"
                  type="date"
                  className="pv-input"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                />
              </div>

              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-expiry-date" className="pv-form-label">
                  Expiry Date <span className="pv-form-label-sub">(Optional)</span>
                </label>
                <input
                  id="cert-expiry-date"
                  type="date"
                  className="pv-input"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>

            {/* ── Credential ID & URL ── */}
            <div className="pv-form-row">
              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-cred-id" className="pv-form-label">
                  Credential ID <span className="pv-form-label-sub">(Optional)</span>
                </label>
                <input
                  id="cert-cred-id"
                  type="text"
                  className="pv-input"
                  placeholder="e.g. AWS-PSA-12345"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                />
              </div>

              <div className="pv-form-group" style={{ flex: 1 }}>
                <label htmlFor="cert-cred-url" className="pv-form-label">
                  Verification URL <span className="pv-form-label-sub">(Optional)</span>
                </label>
                <input
                  id="cert-cred-url"
                  type="url"
                  className="pv-input"
                  placeholder="https://www.credly.com/badges/..."
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                />
              </div>
            </div>

            {/* ── Description ── */}
            <div className="pv-form-group">
              <label htmlFor="cert-desc" className="pv-form-label">
                Description <span className="pv-form-label-sub">(Optional)</span>
              </label>
              <textarea
                id="cert-desc"
                className="pv-textarea"
                rows={3}
                placeholder="Add notes about skills learned, topics covered, or score achieved..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pv-modal-footer">
            <button
              type="button"
              className="pv-btn pv-btn--light"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pv-btn pv-btn--dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="pv-spin" />
                  <span>{isEdit ? 'Saving...' : 'Uploading to Google Drive...'}</span>
                </>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Upload Certificate'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
