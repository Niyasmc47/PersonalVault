import { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Loader2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { smartdropService } from '../../services/smartdropService';
import type {
  SmartDropAnalysisItem,
  SmartDropDestination,
  SmartDropConfirmPayload,
} from '../../types/smartdrop';

interface SmartDropModalProps {
  isOpen: boolean;
  items: SmartDropAnalysisItem[];
  onClose: () => void;
}

export default function SmartDropModal({ isOpen, items: initialItems, onClose }: SmartDropModalProps) {
  const [items, setItems] = useState<SmartDropAnalysisItem[]>(initialItems);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Editable state for active item
  const [selectedDestinations, setSelectedDestinations] = useState<Record<string, SmartDropDestination>>(() => {
    const map: Record<string, SmartDropDestination> = {};
    for (const it of initialItems) {
      map[it.tempFileId] = it.suggestedDestination;
    }
    return map;
  });

  const [editedMetadata, setEditedMetadata] = useState<Record<string, Record<string, string | number | boolean | string[]>>>(() => {
    const map: Record<string, Record<string, string | number | boolean | string[]>> = {};
    for (const it of initialItems) {
      map[it.tempFileId] = { ...(it.extractedMetadata || {}) };
    }
    return map;
  });

  if (!isOpen || items.length === 0) return null;

  const activeItem = items[activeIndex] || items[0];
  const activeDest = selectedDestinations[activeItem.tempFileId] || activeItem.suggestedDestination;
  const activeMeta = editedMetadata[activeItem.tempFileId] || {};

  const handleDestinationChange = (tempId: string, dest: SmartDropDestination) => {
    setSelectedDestinations((prev) => ({ ...prev, [tempId]: dest }));
  };

  const handleMetaFieldChange = (tempId: string, field: string, value: string | number | boolean | string[]) => {
    setEditedMetadata((prev) => ({
      ...prev,
      [tempId]: {
        ...(prev[tempId] || {}),
        [field]: value,
      },
    }));
  };

  const handleConfirmCurrent = () => {
    if (!activeItem) return;
    setIsProcessing(true);
    setStatusMessage(null);

    const payload: SmartDropConfirmPayload = {
      tempFileId: activeItem.tempFileId,
      destination: activeDest,
      metadata: activeMeta,
      resumeData: activeItem.resumeData,
      populateProfileSkills: true,
      populateProfileProjects: true,
      populateProfileAchievements: true,
    };

    smartdropService
      .confirmItem(payload)
      .then((res) => {
        setIsProcessing(false);
        if (res.success) {
          setProcessedIds((prev) => new Set([...prev, activeItem.tempFileId]));
          setStatusMessage({ text: res.message || 'Item organized successfully!' });

          // Advance to next unprocessed item if available
          const nextIndex = items.findIndex(
            (it, idx) => idx > activeIndex && !processedIds.has(it.tempFileId) && it.tempFileId !== activeItem.tempFileId
          );
          if (nextIndex !== -1) {
            setActiveIndex(nextIndex);
          }
        } else {
          setStatusMessage({ text: res.message || 'Failed to organize item.', isError: true });
        }
      })
      .catch((err: unknown) => {
        setIsProcessing(false);
        const msg =
          err && typeof err === 'object' && 'response' in err
            ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Error organizing item.')
            : 'Error saving item.';
        setStatusMessage({ text: msg, isError: true });
      });
  };

  const handleConfirmAllHighConfidence = () => {
    setIsProcessing(true);
    setStatusMessage(null);

    const highConfidenceItems = items.filter(
      (it) => !processedIds.has(it.tempFileId) && it.confidence >= 0.80 && it.suggestedDestination !== 'UNKNOWN'
    );

    if (highConfidenceItems.length === 0) {
      setIsProcessing(false);
      setStatusMessage({ text: 'No high-confidence items remaining to confirm.', isError: true });
      return;
    }

    const payloads: SmartDropConfirmPayload[] = highConfidenceItems.map((it) => ({
      tempFileId: it.tempFileId,
      destination: selectedDestinations[it.tempFileId] || it.suggestedDestination,
      metadata: editedMetadata[it.tempFileId] || it.extractedMetadata,
      resumeData: it.resumeData,
      populateProfileSkills: true,
      populateProfileProjects: true,
      populateProfileAchievements: true,
    }));

    smartdropService
      .confirmBatch(payloads)
      .then((res) => {
        setIsProcessing(false);
        const newlyProcessed = new Set(processedIds);
        for (const item of highConfidenceItems) {
          newlyProcessed.add(item.tempFileId);
        }
        setProcessedIds(newlyProcessed);
        setStatusMessage({
          text: `Organized ${res.successCount} of ${res.totalProcessed} files successfully!`,
        });
      })
      .catch(() => {
        setIsProcessing(false);
        setStatusMessage({ text: 'Batch confirmation failed.', isError: true });
      });
  };

  const handleDiscardCurrent = () => {
    if (!activeItem) return;
    smartdropService.discardTempFile(activeItem.tempFileId).catch(() => {});
    const remaining = items.filter((it) => it.tempFileId !== activeItem.tempFileId);
    setItems(remaining);
    if (remaining.length > 0) {
      setActiveIndex(Math.max(0, activeIndex - 1));
    } else {
      onClose();
    }
  };

  const allProcessed = items.length > 0 && items.every((it) => processedIds.has(it.tempFileId));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'var(--color-paper-white, #fff)',
          borderRadius: 'var(--r-card, 24px)',
          border: '2px solid var(--color-carbon, #000)',
          width: '100%',
          maxWidth: '1050px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '8px 8px 0px var(--color-carbon, #000)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '2px solid var(--color-carbon, #000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-sunburst, #ffd731)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="var(--color-carbon)" />
            <h2
              style={{
                fontFamily: 'var(--font-lateral)',
                fontSize: '20px',
                margin: 0,
                color: 'var(--color-carbon)',
              }}
            >
              SMARTDROP ANALYSIS &amp; REVIEW
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="var(--color-carbon)" />
          </button>
        </div>

        {/* Body Split */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar: File List */}
          <div
            style={{
              width: '320px',
              borderRight: '2px solid var(--color-carbon, #000)',
              background: 'var(--color-soft-mist, #e9e9e9)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '16px 16px 8px 16px', fontWeight: 700, fontSize: '13px', color: '#555' }}>
              ANALYZED FILES ({items.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 16px 16px 16px' }}>
              {items.map((it, idx) => {
                const isItemProcessed = processedIds.has(it.tempFileId);
                const isActive = idx === activeIndex;

                return (
                  <div
                    key={it.tempFileId}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-carbon)',
                      background: isActive ? 'var(--color-paper-white)' : isItemProcessed ? '#f0fdf4' : '#fff',
                      cursor: 'pointer',
                      transform: isActive ? 'translateX(4px)' : 'none',
                      boxShadow: isActive ? '3px 3px 0px var(--color-carbon)' : 'none',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <FileText size={15} color="var(--color-carbon)" />
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px',
                          }}
                        >
                          {it.fileName}
                        </span>
                      </div>
                      {isItemProcessed ? (
                        <CheckCircle2 size={16} color="#16a34a" />
                      ) : (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '999px',
                            background:
                              it.confidence >= 0.8
                                ? '#dcfce7'
                                : it.confidence >= 0.6
                                ? '#fef9c3'
                                : '#fee2e2',
                            color:
                              it.confidence >= 0.8
                                ? '#166534'
                                : it.confidence >= 0.6
                                ? '#854d0e'
                                : '#991b1b',
                          }}
                        >
                          {Math.round(it.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>→</span>
                      <span style={{ fontWeight: 600 }}>{it.classification}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {items.some((it) => it.confidence >= 0.8 && !processedIds.has(it.tempFileId)) && (
              <div style={{ padding: '16px', borderTop: '1px solid #ccc', marginTop: 'auto' }}>
                <button
                  type="button"
                  className="pv-btn"
                  onClick={handleConfirmAllHighConfidence}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    background: 'var(--color-mint-pop, #55db9c)',
                    fontSize: '12px',
                    padding: '10px',
                  }}
                >
                  Confirm All High Confidence
                </button>
              </div>
            )}
          </div>

          {/* Right Main Review Pane */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {allProcessed ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <CheckCircle2 size={64} color="#16a34a" style={{ margin: '0 auto 16px auto' }} />
                <h3 style={{ fontFamily: 'var(--font-lateral)', fontSize: '24px', marginBottom: '8px' }}>
                  ALL FILES ORGANIZED!
                </h3>
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '24px' }}>
                  Your documents and data have been safely routed to their respective modules.
                </p>
                <button type="button" className="pv-btn pv-btn--dark" onClick={onClose}>
                  Done &amp; Close
                </button>
              </div>
            ) : (
              <>
                {/* Status banner */}
                {statusMessage && (
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: statusMessage.isError ? '#fee2e2' : '#dcfce7',
                      color: statusMessage.isError ? '#dc2626' : '#166534',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {statusMessage.isError ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                    {statusMessage.text}
                  </div>
                )}

                {/* Duplicate Warning */}
                {activeItem.duplicateWarning && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'var(--color-sunburst, #ffd731)',
                      border: '1.5px solid var(--color-carbon)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <AlertTriangle size={18} color="var(--color-carbon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '13px' }}>
                      <span style={{ fontWeight: 700 }}>Potential Duplicate Detected: </span>
                      {activeItem.duplicateMessage}
                    </div>
                  </div>
                )}

                {/* Classification Summary Card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--color-carbon)',
                    background: 'var(--color-sky-wash, #dceeff)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>
                        Detected Category
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-aeonik-pro)' }}>
                        {activeItem.classification}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#555' }}>
                        Confidence: {Math.round(activeItem.confidence * 100)}% ({activeItem.confidenceLevel})
                      </div>
                      <div
                        style={{
                          width: '120px',
                          height: '8px',
                          background: '#ccc',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginTop: '4px',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.round(activeItem.confidence * 100)}%`,
                            height: '100%',
                            background:
                              activeItem.confidence >= 0.8
                                ? '#16a34a'
                                : activeItem.confidence >= 0.6
                                ? '#eab308'
                                : '#dc2626',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <p style={{ margin: 0, fontSize: '13px', color: '#333', lineHeight: 1.4 }}>
                    {activeItem.explanation}
                  </p>
                </div>

                {/* Target Destination Selector */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
                    Destination Module
                  </label>
                  <select
                    className="pv-input"
                    value={activeDest}
                    onChange={(e) => handleDestinationChange(activeItem.tempFileId, e.target.value as SmartDropDestination)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--color-carbon)',
                      fontWeight: 600,
                      background: '#fff',
                    }}
                  >
                    <option value="CERTIFICATES">Certificates</option>
                    <option value="PROJECTS">Projects Portfolio</option>
                    <option value="ACHIEVEMENTS">Achievements</option>
                    <option value="SECURE_VAULT_IDENTITY">Secure Vault → Identity Documents</option>
                    <option value="SECURE_VAULT_FINANCIAL">Secure Vault → Financial Accounts</option>
                    <option value="SECURE_VAULT_EDUCATION">Secure Vault → Education &amp; Professional</option>
                    <option value="SECURE_VAULT_OTHER">Secure Vault → Other Documents</option>
                    <option value="RESUME_BUILDER">Resume Builder</option>
                    <option value="UNKNOWN">Unknown / Unassigned</option>
                  </select>
                </div>

                {/* Metadata Review Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                    Extracted Information Review
                  </div>

                  {/* Title / Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                      {activeDest === 'SECURE_VAULT_FINANCIAL' ? 'Bank / Institution Name' : activeDest === 'SECURE_VAULT_IDENTITY' ? 'Holder Full Name' : 'Title / Name'}
                    </label>
                    <input
                      type="text"
                      className="pv-input"
                      value={String(activeMeta.title || activeMeta.bankName || activeMeta.holderName || activeMeta.name || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (activeDest === 'SECURE_VAULT_FINANCIAL') handleMetaFieldChange(activeItem.tempFileId, 'bankName', val);
                        else if (activeDest === 'SECURE_VAULT_IDENTITY') handleMetaFieldChange(activeItem.tempFileId, 'holderName', val);
                        else handleMetaFieldChange(activeItem.tempFileId, 'title', val);
                      }}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                  </div>

                  {/* Organization / Issuer / Institution */}
                  {(activeDest === 'CERTIFICATES' || activeDest === 'ACHIEVEMENTS' || activeDest === 'SECURE_VAULT_EDUCATION' || activeDest === 'SECURE_VAULT_OTHER') && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                        {activeDest === 'SECURE_VAULT_EDUCATION' ? 'University / Institution' : 'Issuing Organization / Authority'}
                      </label>
                      <input
                        type="text"
                        className="pv-input"
                        value={String(activeMeta.issuer || activeMeta.organization || activeMeta.institution || '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (activeDest === 'ACHIEVEMENTS') handleMetaFieldChange(activeItem.tempFileId, 'organization', val);
                          else if (activeDest === 'SECURE_VAULT_EDUCATION') handleMetaFieldChange(activeItem.tempFileId, 'institution', val);
                          else handleMetaFieldChange(activeItem.tempFileId, 'issuer', val);
                        }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
                      />
                    </div>
                  )}

                  {/* Document Number / Account Number */}
                  {activeDest === 'SECURE_VAULT_IDENTITY' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                        Document Number (Masked)
                      </label>
                      <input
                        type="text"
                        className="pv-input"
                        value={String(activeMeta.documentNumber || '')}
                        onChange={(e) => handleMetaFieldChange(activeItem.tempFileId, 'documentNumber', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
                      />
                    </div>
                  )}

                  {/* Tech stack for projects */}
                  {activeDest === 'PROJECTS' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                        Technologies Used (comma-separated)
                      </label>
                      <input
                        type="text"
                        className="pv-input"
                        value={Array.isArray(activeMeta.technologies) ? (activeMeta.technologies as string[]).join(', ') : String(activeMeta.technologies || '')}
                        onChange={(e) => handleMetaFieldChange(activeItem.tempFileId, 'technologies', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}
                      />
                    </div>
                  )}

                  {/* Text snippet preview */}
                  {activeItem.textSnippet && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '4px' }}>
                        Extracted Content Snippet
                      </label>
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          color: '#475569',
                          maxHeight: '80px',
                          overflowY: 'auto',
                        }}
                      >
                        {activeItem.textSnippet}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1.5px solid #eee',
                    marginTop: 'auto',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleDiscardCurrent}
                    disabled={isProcessing}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={16} /> Discard File
                  </button>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="pv-btn pv-btn--light"
                      onClick={onClose}
                      disabled={isProcessing}
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      className="pv-btn pv-btn--dark"
                      onClick={handleConfirmCurrent}
                      disabled={isProcessing || activeDest === 'UNKNOWN'}
                      style={{ padding: '10px 20px' }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Organizing...
                        </>
                      ) : (
                        <>
                          Confirm &amp; Organize <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
