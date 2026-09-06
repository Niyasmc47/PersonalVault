import { useEffect, useState } from 'react';
import { X, Download, Loader2, AlertCircle, FileText } from 'lucide-react';

interface VaultDocumentViewerModalProps {
  isOpen: boolean;
  title: string;
  mimeType?: string;
  fileName: string;
  loadBlob: () => Promise<Blob>;
  onClose: () => void;
}

export default function VaultDocumentViewerModal({
  isOpen,
  title,
  mimeType,
  fileName,
  loadBlob,
  onClose,
}: VaultDocumentViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setBlobUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    let url: string | null = null;
    setLoading(true);
    setError(null);

    loadBlob()
      .then((blob) => {
        if (!active) return;
        url = window.URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Error fetching vault document blob:', err);
        setError('Failed to decrypt and load document.');
        setLoading(false);
      });

    return () => {
      active = false;
      if (url) {
        window.URL.revokeObjectURL(url);
      }
    };
  }, [isOpen, loadBlob]);

  if (!isOpen) return null;

  const isPdf = mimeType?.toLowerCase().includes('pdf');
  const isImage = mimeType?.toLowerCase().startsWith('image/');

  const handleDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', fileName || 'document');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-viewer-modal"
        style={{ maxWidth: '900px', width: '95vw', height: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pv-modal__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-carbon)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div className="pv-sticker-badge" style={{ background: 'var(--color-electric-blue)', color: '#fff', flexShrink: 0 }}>
              <FileText size={16} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {blobUrl && (
              <button
                type="button"
                className="pv-btn pv-btn--light pv-btn--sm"
                onClick={handleDownload}
                title="Download document"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            )}
            <button
              type="button"
              className="pv-modal__close-btn"
              onClick={onClose}
              aria-label="Close viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Loader2 size={32} className="pv-spin" color="var(--color-carbon)" />
              <span style={{ fontWeight: 600 }}>Decrypting document from Google Drive...</span>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--color-ember)' }}>
              <AlertCircle size={36} />
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {!loading && !error && blobUrl && (
            <>
              {isImage && (
                <div style={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <img
                    src={blobUrl}
                    alt={title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid var(--color-carbon)', borderRadius: '12px' }}
                  />
                </div>
              )}

              {isPdf && (
                <iframe
                  src={`${blobUrl}#toolbar=1&navpanes=0`}
                  title={title}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              )}

              {!isImage && !isPdf && (
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <p style={{ marginBottom: '16px' }}>Preview is not directly embeddable for this file format ({mimeType}).</p>
                  <button className="pv-btn pv-btn--dark" onClick={handleDownload}>
                    <Download size={16} />
                    Download File
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
