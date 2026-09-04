import { useEffect, useState } from 'react';
import { certificateService } from '../services/certificateService';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

interface CertificatePreviewProps {
  id: number;
  title: string;
  mimeType: string;
  interactive?: boolean;
}

export default function CertificatePreview({
  id,
  title,
  mimeType,
  interactive = false,
}: CertificatePreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const isPdf = mimeType.toLowerCase().includes('pdf');
  const isImage = mimeType.toLowerCase().startsWith('image/');

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    setLoading(true);
    setError(false);

    certificateService
      .getCertificateBlob(id)
      .then((blob) => {
        if (!active) return;
        createdUrl = window.URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error fetching certificate preview:', err);
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
      if (createdUrl) {
        window.URL.revokeObjectURL(createdUrl);
      }
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pv-cert-preview-placeholder">
        <Loader2 size={24} className="pv-spin" color="var(--color-carbon)" />
        <span>Loading preview...</span>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div className="pv-cert-preview-placeholder pv-cert-preview-placeholder--error">
        <AlertCircle size={24} color="var(--color-ember)" />
        <span>Preview unavailable</span>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="pv-cert-preview-media-container">
        <img
          src={blobUrl}
          alt={title}
          className="pv-cert-preview-image"
          loading="lazy"
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className={`pv-cert-preview-media-container ${!interactive ? 'pv-cert-preview--card-mode' : ''}`}>
        <iframe
          src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=${interactive ? '1' : '0'}&view=FitH`}
          title={`Preview of ${title}`}
          className="pv-cert-preview-pdf"
          scrolling={interactive ? 'yes' : 'no'}
        />
        {!interactive && <div className="pv-cert-preview-overlay" aria-hidden="true" />}
      </div>
    );
  }

  return (
    <div className="pv-cert-preview-placeholder">
      <FileText size={28} color="var(--color-carbon)" />
      <span>{title}</span>
    </div>
  );
}
