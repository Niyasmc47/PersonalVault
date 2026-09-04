import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { certificateService } from '../services/certificateService';
import type {
  Certificate,
  CertificateFilterParams,
  CreateCertificatePayload,
  UpdateCertificatePayload,
} from '../types';

import CertificateCard from '../components/CertificateCard';
import CertificateFormModal from '../components/CertificateFormModal';
import CertificateViewerModal from '../components/CertificateViewerModal';
import DeleteCertificateDialog from '../components/DeleteCertificateDialog';
import GoogleDriveBanner from '../components/GoogleDriveBanner';
import CertificateStats from '../components/CertificateStats';
import CertificateFilters from '../components/CertificateFilters';

import {
  GraduationCap,
  Plus,
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export default function CertificatesPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
  const [filters, setFilters] = useState<CertificateFilterParams>({});

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);

  // Status message for Drive OAuth callback
  const [callbackNotice, setCallbackNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    const driveConnected = searchParams.get('drive_connected');
    const driveError = searchParams.get('drive_error');

    if (driveConnected === 'true') {
      setCallbackNotice({
        type: 'success',
        message: 'Google Drive connected successfully! You can now upload and manage certificates in your Drive.',
      });
      // Clear query params from URL
      searchParams.delete('drive_connected');
      setSearchParams(searchParams, { replace: true });
      queryClient.invalidateQueries({ queryKey: ['googleDriveStatus'] });
    } else if (driveError) {
      setCallbackNotice({
        type: 'error',
        message: `Google Drive connection error: ${decodeURIComponent(driveError)}`,
      });
      searchParams.delete('drive_error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, queryClient]);

  // Queries
  const {
    data: driveStatus,
    isLoading: isLoadingDrive,
    refetch: refetchDrive,
  } = useQuery({
    queryKey: ['googleDriveStatus'],
    queryFn: certificateService.getDriveStatus,
  });

  const {
    data: summary,
    isLoading: isLoadingSummary,
  } = useQuery({
    queryKey: ['certificateSummary'],
    queryFn: certificateService.getCertificateSummary,
  });

  const {
    data: certificates,
    isLoading: isLoadingCertificates,
    isError: isErrorCertificates,
    error: certificatesError,
  } = useQuery({
    queryKey: ['certificates', filters],
    queryFn: () => certificateService.getCertificates(filters),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateCertificatePayload) =>
      certificateService.uploadCertificate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificateSummary'] });
      queryClient.invalidateQueries({ queryKey: ['googleDriveStatus'] });
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to upload certificate. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCertificatePayload }) =>
      certificateService.updateCertificate(id, data),
    onSuccess: (updatedCert) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificateSummary'] });
      setIsFormOpen(false);
      setEditingCertificate(null);
      if (viewingCertificate && viewingCertificate.id === updatedCert.id) {
        setViewingCertificate(updatedCert);
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to update certificate. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => certificateService.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificateSummary'] });
      queryClient.invalidateQueries({ queryKey: ['googleDriveStatus'] });
      setIsDeleteDialogOpen(false);
      setCertificateToDelete(null);
      if (viewingCertificate) {
        setIsViewerOpen(false);
        setViewingCertificate(null);
      }
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || 'Failed to delete certificate. Please try again.');
    },
  });

  // Actions
  const handleOpenAddModal = () => {
    if (!driveStatus?.connected) {
      alert('Please connect your Google Drive account first to store certificates.');
      return;
    }
    setEditingCertificate(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (cert: Certificate) => {
    setEditingCertificate(cert);
    setIsFormOpen(true);
  };

  const handleOpenViewer = (cert: Certificate) => {
    setViewingCertificate(cert);
    setIsViewerOpen(true);
  };

  const handleOpenDelete = (cert: Certificate) => {
    setCertificateToDelete(cert);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (
    data: CreateCertificatePayload | { id: number; data: UpdateCertificatePayload }
  ) => {
    if ('id' in data) {
      updateMutation.mutate({ id: data.id, data: data.data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (certificateToDelete) {
      deleteMutation.mutate(certificateToDelete.id);
    }
  };

  const handleDownload = async (cert: Certificate) => {
    try {
      await certificateService.downloadCertificate(cert.id, cert.originalFileName);
    } catch (err: any) {
      console.error('Download failed:', err);
      alert('Failed to download certificate from Google Drive.');
    }
  };

  return (
    <div className="pv-container pv-cert-page">
      {/* ── Callback Toast/Notice ─────────────────────────────── */}
      {callbackNotice && (
        <div
          className={`pv-alert-banner ${
            callbackNotice.type === 'success'
              ? 'pv-alert-banner--success'
              : 'pv-alert-banner--error'
          }`}
          style={{ marginTop: 'var(--sp-24)' }}
        >
          <div className="pv-alert-banner__content">
            {callbackNotice.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{callbackNotice.message}</span>
          </div>
          <button
            className="pv-alert-banner__close"
            onClick={() => setCallbackNotice(null)}
            aria-label="Dismiss notice"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Header Section ───────────────────────────────────── */}
      <div className="pv-cert-header">
        <div className="pv-cert-header__left">
          <div className="pv-cert-header__icon-wrapper">
            <GraduationCap size={32} color="var(--color-carbon)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="pv-cert-header__title">Certificates</h1>
            <p className="pv-cert-header__subtitle">
              Store and showcase your achievements and certifications in your private Google Drive.
            </p>
          </div>
        </div>

        <div className="pv-cert-header__right">
          <button
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleOpenAddModal}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Certificate</span>
          </button>
        </div>
      </div>

      {/* ── Google Drive Connection Banner ───────────────────── */}
      <section className="pv-cert-section">
        <GoogleDriveBanner
          status={driveStatus}
          isLoading={isLoadingDrive}
          onRefresh={refetchDrive}
        />
      </section>

      {/* ── Summary Statistics Cards ─────────────────────────── */}
      <section className="pv-cert-section">
        <CertificateStats
          summary={summary}
          isLoading={isLoadingSummary}
        />
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section className="pv-cert-section">
        <CertificateFilters
          filters={filters}
          onChange={setFilters}
        />
      </section>

      {/* ── Certificates Grid / Content Area ─────────────────── */}
      <section className="pv-cert-section" style={{ minHeight: '300px' }}>
        {isLoadingCertificates ? (
          <div className="pv-cert-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pv-cert-card pv-cert-card--skeleton">
                <div className="pv-cert-card__preview-skeleton" />
                <div className="pv-cert-card__body">
                  <div className="pv-skeleton-line" style={{ width: '80%', height: 20 }} />
                  <div className="pv-skeleton-line" style={{ width: '50%', height: 16 }} />
                  <div className="pv-skeleton-line" style={{ width: '60%', height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        ) : isErrorCertificates ? (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon pv-cert-empty-state__icon--error">
              <AlertCircle size={36} color="var(--color-ember)" />
            </div>
            <h2>Unable to Load Certificates</h2>
            <p>
              {certificatesError instanceof Error
                ? certificatesError.message
                : 'An unexpected error occurred while fetching your certificates.'}
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['certificates'] })}
            >
              Retry
            </button>
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="pv-cert-grid">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={handleOpenViewer}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <Sparkles size={36} color="var(--color-carbon)" />
            </div>
            <h2>No certificates yet</h2>
            <p>
              Upload your certificates and keep your achievements organized in one place, stored directly in your own Google Drive.
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={handleOpenAddModal}
            >
              <Plus size={16} />
              <span>Add Certificate</span>
            </button>
          </div>
        )}
      </section>

      {/* ── Modals & Dialogs ─────────────────────────────────── */}
      <CertificateFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCertificate(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCertificate}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <CertificateViewerModal
        isOpen={isViewerOpen}
        certificate={viewingCertificate}
        onClose={() => {
          setIsViewerOpen(false);
          setViewingCertificate(null);
        }}
        onEdit={(cert) => {
          setIsViewerOpen(false);
          handleOpenEditModal(cert);
        }}
        onDelete={(cert) => {
          setIsViewerOpen(false);
          handleOpenDelete(cert);
        }}
        onDownload={handleDownload}
      />

      <DeleteCertificateDialog
        isOpen={isDeleteDialogOpen}
        certificate={certificateToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setCertificateToDelete(null);
        }}
      />
    </div>
  );
}
