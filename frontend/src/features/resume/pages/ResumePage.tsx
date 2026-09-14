import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '../services/resumeService';
import type {
  ResumeContent,
  ResumeTemplate,
  CreateResumePayload,
  UpdateResumePayload,
} from '../types';

import ResumeEditorControls from '../components/ResumeEditorControls';
import ResumePreview from '../components/ResumePreview';
import ResumeListModal from '../components/ResumeListModal';
import RebuildConfirmDialog from '../components/RebuildConfirmDialog';
import PdfExportModal, { triggerPrintToPdf } from '../components/PdfExportModal';

import {
  FileText,
  Download,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function ResumePage() {
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);

  const [activeResumeId, setActiveResumeId] = useState<number | null>(null);
  const [localContent, setLocalContent] = useState<ResumeContent | null>(null);
  const [localTemplate, setLocalTemplate] = useState<ResumeTemplate>('PROFESSIONAL');
  const [scale, setScale] = useState<number>(0.9);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  // Modals
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [isRebuildDialogOpen, setIsRebuildDialogOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // 1. Fetch user's resumes
  const {
    data: resumes,
    isLoading: isLoadingResumes,
    isError: isErrorResumes,
    error: resumesError,
    refetch: refetchResumes,
  } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeService.getResumes(),
  });

  // 2. Select initial active resume or trigger creation if empty
  useEffect(() => {
    if (resumes && resumes.length > 0 && activeResumeId === null) {
      setActiveResumeId(resumes[0].id);
    }
  }, [resumes, activeResumeId]);

  // 3. Fetch active resume details
  const {
    data: currentResume,
    isLoading: isLoadingActiveResume,
  } = useQuery({
    queryKey: ['resume', activeResumeId],
    queryFn: () => (activeResumeId ? resumeService.getResumeById(activeResumeId) : null),
    enabled: !!activeResumeId,
  });

  // 4. Sync local editor state when currentResume changes
  useEffect(() => {
    if (currentResume) {
      setLocalContent(currentResume.content);
      setLocalTemplate(currentResume.template);
      setLastSavedTime(new Date(currentResume.updatedAt));
    }
  }, [currentResume]);

  // --- Mutations ---
  const createResumeMutation = useMutation({
    mutationFn: (payload: CreateResumePayload) => resumeService.createResume(payload),
    onSuccess: (newResume) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setActiveResumeId(newResume.id);
      setIsListModalOpen(false);
      setIsRebuildDialogOpen(false);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to create resume.';
      alert(errorMsg);
    },
  });

  const updateResumeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateResumePayload }) =>
      resumeService.updateResume(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.setQueryData(['resume', updated.id], updated);
      setIsSaving(false);
      setLastSavedTime(new Date());
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const deleteResumeMutation = useMutation({
    mutationFn: (id: number) => resumeService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setActiveResumeId(null);
    },
  });

  const rebuildResumeMutation = useMutation({
    mutationFn: (id: number) => resumeService.rebuildResume(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', updated.id] });
      setLocalContent(updated.content);
      setIsRebuildDialogOpen(false);
    },
    onError: () => {
      alert('Failed to rebuild resume from PersonalVault data.');
    },
  });

  // Debounced auto-save
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContentChange = useCallback(
    (newContent: ResumeContent) => {
      setLocalContent(newContent);
      setIsSaving(true);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (activeResumeId) {
          updateResumeMutation.mutate({
            id: activeResumeId,
            payload: {
              content: newContent,
              template: localTemplate,
            },
          });
        }
      }, 1000);
    },
    [activeResumeId, localTemplate, updateResumeMutation]
  );

  const handleTemplateChange = (newTemplate: ResumeTemplate) => {
    setLocalTemplate(newTemplate);
    if (activeResumeId && localContent) {
      setIsSaving(true);
      updateResumeMutation.mutate({
        id: activeResumeId,
        payload: {
          template: newTemplate,
          content: localContent,
        },
      });
    }
  };

  const handleCreateNewResume = () => {
    createResumeMutation.mutate({
      name: `Resume ${resumes ? resumes.length + 1 : 1}`,
      template: 'PROFESSIONAL',
      autoPopulate: true,
    });
  };

  const handleQuickDownload = () => {
    triggerPrintToPdf(currentResume?.name || 'PersonalVault_Resume');
  };

  return (
    <div className="pv-container pv-resume-page">
      {/* ── Top Resume Action Bar ────────────────────────────── */}
      <div className="pv-resume-topbar">
        <div className="pv-resume-topbar__left">
          <div className="pv-feature-card__icon" style={{ background: 'var(--color-electric-blue)', width: '42px', height: '42px' }}>
            <FileText size={22} color="var(--color-paper-white)" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="pv-resume-topbar__title">
                {currentResume?.name || 'Resume Builder'}
              </h1>
              <button
                type="button"
                className="pv-btn pv-btn--light pv-btn--sm"
                onClick={() => setIsListModalOpen(true)}
              >
                <Layers size={13} />
                <span>Switch ({resumes?.length || 0})</span>
              </button>
            </div>
            <div className="pv-resume-topbar__meta">
              {isSaving ? (
                <span style={{ color: 'var(--color-electric-blue)' }}>Saving draft...</span>
              ) : lastSavedTime ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a' }}>
                  <CheckCircle2 size={12} /> All changes saved
                </span>
              ) : (
                <span>Auto-saves in real time</span>
              )}
            </div>
          </div>
        </div>

        <div className="pv-resume-topbar__right">
          <button
            type="button"
            className="pv-btn pv-btn--light"
            onClick={() => setIsRebuildDialogOpen(true)}
            title="Refresh resume content with latest PersonalVault records"
          >
            <Sparkles size={15} color="var(--color-ember)" />
            <span>Auto-Build from Vault</span>
          </button>

          <button
            type="button"
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleQuickDownload}
            id="download-resume-pdf-btn"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* ── Main Content Area (Split Screen) ────────────────── */}
      {isLoadingResumes || isLoadingActiveResume ? (
        <div className="pv-card" style={{ padding: '60px 0', textAlign: 'center', margin: '40px 0' }}>
          <p>Loading your resume workspace...</p>
        </div>
      ) : isErrorResumes ? (
        <div className="pv-card pv-cert-empty-state">
          <div className="pv-cert-empty-state__icon pv-cert-empty-state__icon--error">
            <AlertCircle size={36} color="var(--color-ember)" />
          </div>
          <h2>Unable to load resumes</h2>
          <p>{resumesError instanceof Error ? resumesError.message : 'Error loading resumes'}</p>
          <button className="pv-btn pv-btn--dark" onClick={() => refetchResumes()}>
            Retry
          </button>
        </div>
      ) : !resumes || resumes.length === 0 ? (
        <div className="pv-card pv-cert-empty-state" style={{ margin: '40px 0', padding: '60px 24px' }}>
          <div className="pv-cert-empty-state__icon" style={{ background: 'var(--color-electric-blue)' }}>
            <Sparkles size={36} color="var(--color-paper-white)" />
          </div>
          <h2>Build Your Resume in Seconds</h2>
          <p style={{ maxWidth: '480px', margin: '12px auto 24px auto' }}>
            PersonalVault can automatically assemble your profile, technical skills, projects, certificates, and achievements into a live editable resume.
          </p>
          <button
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleCreateNewResume}
            disabled={createResumeMutation.isPending}
          >
            <Sparkles size={18} />
            <span>{createResumeMutation.isPending ? 'Generating...' : 'Build Resume Automatically'}</span>
          </button>
        </div>
      ) : (
        <div className="pv-resume-split-layout">
          {/* Left: Controls & Section Editor */}
          <div className="pv-resume-editor-panel">
            {localContent && (
              <ResumeEditorControls
                content={localContent}
                template={localTemplate}
                onChange={handleContentChange}
                onTemplateChange={handleTemplateChange}
              />
            )}
          </div>

          {/* Right: Live Resume Sheet Preview */}
          <div className="pv-resume-preview-panel">
            <div className="pv-resume-preview-toolbar">
              <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Preview ({localTemplate.replace('_', ' ').toLowerCase()})
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className="pv-btn pv-btn--ghost pv-btn--sm"
                  onClick={() => setScale((s) => Math.max(0.6, Number((s - 0.1).toFixed(1))))}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={15} />
                </button>
                <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  className="pv-btn pv-btn--ghost pv-btn--sm"
                  onClick={() => setScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(1))))}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={15} />
                </button>
              </div>
            </div>

            {localContent && (
              <ResumePreview
                ref={printRef}
                template={localTemplate}
                content={localContent}
                scale={scale}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Modals & Dialogs ─────────────────────────────────── */}
      {resumes && (
        <ResumeListModal
          isOpen={isListModalOpen}
          resumes={resumes}
          activeResumeId={activeResumeId}
          onClose={() => setIsListModalOpen(false)}
          onSelectResume={(id) => setActiveResumeId(id)}
          onCreateResume={(data) => createResumeMutation.mutate(data)}
          onDeleteResume={(id) => deleteResumeMutation.mutate(id)}
        />
      )}

      <RebuildConfirmDialog
        isOpen={isRebuildDialogOpen}
        resumeName={currentResume?.name || 'Current Resume'}
        isRebuilding={rebuildResumeMutation.isPending}
        onClose={() => setIsRebuildDialogOpen(false)}
        onConfirmRebuild={() => {
          if (activeResumeId) {
            rebuildResumeMutation.mutate(activeResumeId);
          }
        }}
        onCreateNewInstead={handleCreateNewResume}
      />

      {localContent && (
        <PdfExportModal
          isOpen={isPdfModalOpen}
          resumeName={currentResume?.name || 'PersonalVault_Resume'}
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
}
