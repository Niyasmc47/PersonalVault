import type { Certificate } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS, EXPIRY_COLORS, EXPIRY_LABELS } from '../types';
import CertificatePreview from './CertificatePreview';
import { X, Download, Edit3, Trash2, ExternalLink, Calendar, Award, ShieldCheck, FileCheck, Info } from 'lucide-react';

interface CertificateViewerModalProps {
  isOpen: boolean;
  certificate: Certificate | null;
  onClose: () => void;
  onEdit: (certificate: Certificate) => void;
  onDelete: (certificate: Certificate) => void;
  onDownload: (certificate: Certificate) => void;
}

export default function CertificateViewerModal({
  isOpen,
  certificate,
  onClose,
  onEdit,
  onDelete,
  onDownload,
}: CertificateViewerModalProps) {
  if (!isOpen || !certificate) return null;

  const categoryColor = CATEGORY_COLORS[certificate.category] || {
    bg: '#e9e9e9',
    color: '#000000',
    border: '#000000',
  };

  const expiryColor = EXPIRY_COLORS[certificate.expiryStatus] || {
    bg: '#e9e9e9',
    color: '#000000',
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-cert-viewer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="pv-modal-header">
          <div className="pv-cert-viewer__title-wrapper">
            <h2 className="pv-modal-title">{certificate.title}</h2>
            <div className="pv-cert-viewer__badges">
              <span
                className="pv-cert-pill"
                style={{
                  background: categoryColor.bg,
                  color: categoryColor.color,
                  border: `1px solid ${categoryColor.border}`,
                }}
              >
                {CATEGORY_LABELS[certificate.category] || certificate.category}
              </span>
              <span
                className="pv-cert-pill"
                style={{
                  background: expiryColor.bg,
                  color: expiryColor.color,
                  border: '1px solid var(--color-carbon)',
                }}
              >
                {EXPIRY_LABELS[certificate.expiryStatus] || certificate.expiryStatus}
              </span>
            </div>
          </div>
          <button
            className="pv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Split view (Preview on left, Details on right) */}
        <div className="pv-cert-viewer__body">
          {/* Main Visual Display */}
          <div className="pv-cert-viewer__preview-container">
            <CertificatePreview
              id={certificate.id}
              title={certificate.title}
              mimeType={certificate.mimeType}
              interactive={true}
            />
          </div>

          {/* Details Sidebar */}
          <div className="pv-cert-viewer__details">
            <div className="pv-cert-viewer__detail-group">
              <span className="pv-cert-viewer__label">Issuer</span>
              <div className="pv-cert-viewer__value">
                <Award size={16} />
                <span>{certificate.issuer}</span>
              </div>
            </div>

            <div className="pv-cert-viewer__detail-group">
              <span className="pv-cert-viewer__label">Dates</span>
              <div className="pv-cert-viewer__value">
                <Calendar size={16} />
                <span>Issued: {certificate.issueDate}</span>
              </div>
              {certificate.expiryDate && (
                <div className="pv-cert-viewer__value" style={{ marginTop: 4 }}>
                  <Calendar size={16} />
                  <span>Expires: {certificate.expiryDate}</span>
                </div>
              )}
            </div>

            {certificate.credentialId && (
              <div className="pv-cert-viewer__detail-group">
                <span className="pv-cert-viewer__label">Credential ID</span>
                <div className="pv-cert-viewer__value pv-code-font">
                  <ShieldCheck size={16} />
                  <span>{certificate.credentialId}</span>
                </div>
              </div>
            )}

            {certificate.credentialUrl && (
              <div className="pv-cert-viewer__detail-group">
                <span className="pv-cert-viewer__label">Verification Link</span>
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pv-cert-viewer__verify-btn"
                >
                  <ExternalLink size={14} />
                  <span>Verify Authenticity</span>
                </a>
              </div>
            )}

            {certificate.description && (
              <div className="pv-cert-viewer__detail-group">
                <span className="pv-cert-viewer__label">Description</span>
                <p className="pv-cert-viewer__description">{certificate.description}</p>
              </div>
            )}

            <div className="pv-cert-viewer__detail-group pv-cert-viewer__meta-info">
              <span className="pv-cert-viewer__label">File Information</span>
              <div className="pv-cert-viewer__meta-text">
                <FileCheck size={14} />
                <span>{certificate.originalFileName}</span>
                {certificate.fileSize && <span>({formatFileSize(certificate.fileSize)})</span>}
              </div>
              <div className="pv-cert-viewer__drive-note">
                <Info size={13} />
                <span>Stored securely in your Google Drive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="pv-modal-footer">
          <div className="pv-cert-viewer__footer-left">
            <button
              className="pv-btn pv-btn--light"
              onClick={() => onEdit(certificate)}
            >
              <Edit3 size={16} />
              <span>Edit Details</span>
            </button>
            <button
              className="pv-btn pv-btn--ghost pv-btn--danger"
              onClick={() => onDelete(certificate)}
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>

          <div className="pv-cert-viewer__footer-right">
            <button
              className="pv-btn pv-btn--dark"
              onClick={() => onDownload(certificate)}
            >
              <Download size={16} />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
