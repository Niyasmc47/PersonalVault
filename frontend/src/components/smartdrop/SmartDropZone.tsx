import { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { smartdropService } from '../../services/smartdropService';
import type { SmartDropAnalysisItem } from '../../types/smartdrop';
import SmartDropModal from './SmartDropModal';

interface SmartDropZoneProps {
  onSuccess?: () => void;
}

export default function SmartDropZone({ onSuccess }: SmartDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<SmartDropAnalysisItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    if (files.length === 0) return;

    setErrorMsg(null);
    setIsAnalyzing(true);

    smartdropService
      .analyzeFiles(files)
      .then((results) => {
        setIsAnalyzing(false);
        setAnalysisResults(results);
        setIsModalOpen(true);
      })
      .catch((err: unknown) => {
        setIsAnalyzing(false);
        const message =
          err && typeof err === 'object' && 'response' in err
            ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to analyze files.')
            : 'Error connecting to SmartDrop service.';
        setErrorMsg(message);
      });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setAnalysisResults([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="pv-smartdrop-wrapper" style={{ width: '100%', margin: '0 auto 48px auto' }}>
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? '2px dashed var(--color-electric-blue)' : '2px dashed var(--color-carbon)',
          borderRadius: 'var(--r-card, 24px)',
          background: isDragging ? 'var(--color-sky-wash)' : 'var(--color-paper-white)',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: isAnalyzing ? 'wait' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isDragging ? '0 8px 30px rgba(77, 162, 255, 0.25)' : 'none',
          position: 'relative',
        }}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg,.webp"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />

        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isDragging ? 'var(--color-electric-blue)' : 'var(--color-mint-pop)',
              border: '2px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '2px 2px 0px var(--color-carbon)',
            }}
          >
            {isAnalyzing ? (
              <Loader2 size={32} color="var(--color-carbon)" className="animate-spin" />
            ) : (
              <UploadCloud size={32} color="var(--color-carbon)" strokeWidth={2.5} />
            )}
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-lateral)',
                fontSize: '28px',
                letterSpacing: '-0.02em',
                color: 'var(--color-carbon)',
                marginBottom: '6px',
              }}
            >
              SMARTDROP
            </div>
            <div
              style={{
                fontFamily: 'var(--font-aeonik-pro)',
                fontSize: '18px',
                fontWeight: 'var(--font-weight-bold, 700)',
                color: 'var(--color-carbon)',
                marginBottom: '8px',
              }}
            >
              &ldquo;Drop it. We&apos;ll understand it. We&apos;ll organize it.&rdquo;
            </div>
            <p
              style={{
                fontFamily: 'var(--font-aeonik-pro)',
                fontSize: '14px',
                color: '#666',
                margin: '0 0 16px 0',
              }}
            >
              Drag &amp; drop any certificate, project report, identity card, bank statement, or resume here.
              <br />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-carbon)' }}>
                Files are analyzed from their actual contents, not just their names.
              </span>
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid #f87171',
              }}
            >
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              className="pv-btn pv-btn--dark"
              disabled={isAnalyzing}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Choose Files
                </>
              )}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            {['PDF', 'DOCX', 'PNG', 'JPG / JPEG', 'WEBP', 'TXT'].map((ext) => (
              <span
                key={ext}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-aeonik-pro)',
                  padding: '3px 10px',
                  borderRadius: 'var(--r-full, 999px)',
                  background: 'var(--color-soft-mist)',
                  border: '1px solid #ddd',
                  color: 'var(--color-carbon)',
                }}
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && analysisResults.length > 0 && (
        <SmartDropModal
          isOpen={isModalOpen}
          items={analysisResults}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
