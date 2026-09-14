import { Download, Printer, X, CheckCircle2 } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  resumeName: string;
  onClose: () => void;
}

export function triggerPrintToPdf(resumeTitle: string) {
  // Store previous title to format the PDF download filename cleanly
  const prevTitle = document.title;
  document.title = `${resumeTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume`;

  // Trigger native high-fidelity print to PDF
  window.print();

  // Restore title
  setTimeout(() => {
    document.title = prevTitle;
  }, 1000);
}

export default function PdfExportModal({
  isOpen,
  resumeName,
  onClose,
}: PdfExportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      triggerPrintToPdf(resumeName || 'PersonalVault_Resume');
    }, 150);
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-electric-blue)' }}
            >
              <Printer size={18} color="var(--color-paper-white)" />
            </div>
            <h2 className="pv-modal__title">Download Vector PDF</h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ margin: '16px 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>
          <p>
            Your resume will be generated as a <strong>100% Vector PDF</strong> with selectable text, active hyperlinks, and clean page breaks.
          </p>

          <div
            style={{
              margin: '14px 0',
              padding: '14px',
              background: 'var(--color-sky-wash)',
              borderRadius: '14px',
              border: '1px solid var(--color-carbon)',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--color-carbon)" />
              <span>Recommended PDF Print Settings</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Destination:</strong> Save as PDF</li>
              <li><strong>Pages:</strong> All</li>
              <li><strong>Layout:</strong> Portrait</li>
              <li><strong>Paper size:</strong> A4 or Letter</li>
              <li><strong>Options:</strong> Check "Background graphics"</li>
            </ul>
          </div>
        </div>

        <div className="pv-modal__actions">
          <button type="button" className="pv-btn pv-btn--light" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="pv-btn pv-btn--dark"
            onClick={handlePrint}
          >
            <Download size={16} />
            <span>Open PDF Print Dialog</span>
          </button>
        </div>
      </div>
    </div>
  );
}

