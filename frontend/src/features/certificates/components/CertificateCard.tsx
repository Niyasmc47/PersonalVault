import type { Certificate } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS, EXPIRY_COLORS, EXPIRY_LABELS } from '../types';
import CertificatePreview from './CertificatePreview';
import { Eye, Download, Edit3, Trash2, Calendar, Award, ExternalLink, ShieldCheck } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
  onEdit: (certificate: Certificate) => void;
  onDelete: (certificate: Certificate) => void;
  onDownload: (certificate: Certificate) => void;
}

export default function CertificateCard({
  certificate,
  onView,
  onEdit,
  onDelete,
  onDownload,
}: CertificateCardProps) {
  const categoryColor = CATEGORY_COLORS[certificate.category] || {
    bg: '#e9e9e9',
    color: '#000000',
    border: '#000000',
  };

  const expiryColor = EXPIRY_COLORS[certificate.expiryStatus] || {
    bg: '#e9e9e9',
    color: '#000000',
  };

  return (
    <div className="pv-cert-card">
      {/* ── Visual Preview Area ── */}
      <div
        className="pv-cert-card__preview-wrapper"
        onClick={() => onView(certificate)}
        role="button"
        tabIndex={0}
        aria-label={`View full certificate: ${certificate.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onView(certificate);
          }
        }}
      >
        <CertificatePreview
          id={certificate.id}
          title={certificate.title}
          mimeType={certificate.mimeType}
          interactive={false}
        />
        
        {/* Hover quick overlay */}
        <div className="pv-cert-card__preview-hover-hint">
          <Eye size={18} />
          <span>Click to View</span>
        </div>

        {/* Category Pill on top of preview */}
        <div
          className="pv-cert-card__category-badge"
          style={{
            background: categoryColor.bg,
            color: categoryColor.color,
            borderColor: categoryColor.border,
          }}
        >
          {CATEGORY_LABELS[certificate.category] || certificate.category}
        </div>

        {/* Expiry Pill on top of preview */}
        <div
          className="pv-cert-card__expiry-badge"
          style={{
            background: expiryColor.bg,
            color: expiryColor.color,
          }}
        >
          {EXPIRY_LABELS[certificate.expiryStatus] || certificate.expiryStatus}
        </div>
      </div>

      {/* ── Metadata & Details ── */}
      <div className="pv-cert-card__body">
        <h3 className="pv-cert-card__title" title={certificate.title}>
          {certificate.title}
        </h3>

        <div className="pv-cert-card__meta-item pv-cert-card__issuer">
          <Award size={15} color="var(--color-carbon)" />
          <span className="pv-cert-card__issuer-text">{certificate.issuer}</span>
        </div>

        <div className="pv-cert-card__dates">
          <div className="pv-cert-card__meta-item">
            <Calendar size={13} color="var(--color-carbon)" />
            <span>Issued: {certificate.issueDate}</span>
          </div>
          {certificate.expiryDate && (
            <div className="pv-cert-card__meta-item">
              <span className="pv-cert-card__dot">·</span>
              <span>Expires: {certificate.expiryDate}</span>
            </div>
          )}
        </div>

        {/* Credential ID / Link if available */}
        {(certificate.credentialId || certificate.credentialUrl) && (
          <div className="pv-cert-card__credential">
            {certificate.credentialId && (
              <div className="pv-cert-card__cred-id" title={`Credential ID: ${certificate.credentialId}`}>
                <ShieldCheck size={13} />
                <span>ID: {certificate.credentialId}</span>
              </div>
            )}
            {certificate.credentialUrl && (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pv-cert-card__verify-link"
                title="Verify Certificate"
                onClick={(e) => e.stopPropagation()}
              >
                <span>Verify</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div className="pv-cert-card__actions">
        <button
          className="pv-cert-action-btn pv-cert-action-btn--primary"
          onClick={() => onView(certificate)}
          title="View full certificate"
        >
          <Eye size={15} />
          <span>View</span>
        </button>

        <button
          className="pv-cert-action-btn"
          onClick={() => onDownload(certificate)}
          title="Download certificate file"
        >
          <Download size={15} />
          <span>Download</span>
        </button>

        <button
          className="pv-cert-action-btn"
          onClick={() => onEdit(certificate)}
          title="Edit certificate details"
        >
          <Edit3 size={15} />
          <span>Edit</span>
        </button>

        <button
          className="pv-cert-action-btn pv-cert-action-btn--danger"
          onClick={() => onDelete(certificate)}
          title="Delete certificate"
        >
          <Trash2 size={15} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
