import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialService } from '../services/socialService';
import type {
  SocialLink,
  CreateSocialLinkPayload,
  UpdateSocialLinkPayload,
} from '../types';

import SocialLinkCard from '../components/SocialLinkCard';
import SocialLinkFormModal from '../components/SocialLinkFormModal';
import DeleteSocialLinkDialog from '../components/DeleteSocialLinkDialog';

import { Link as LinkIcon, Plus, AlertCircle, FolderOpen, Globe } from 'lucide-react';

export default function SocialPage() {
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<SocialLink | null>(null);

  const {
    data: socialLinks,
    isLoading: isLoadingLinks,
    isError: isErrorLinks,
    error: linksError,
    refetch: refetchLinks,
  } = useQuery({
    queryKey: ['social-links'],
    queryFn: () => socialService.getSocialLinks(),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateSocialLinkPayload) =>
      socialService.createSocialLink(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      setIsFormOpen(false);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to add social link.';
      alert(errorMsg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSocialLinkPayload }) =>
      socialService.updateSocialLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      setIsFormOpen(false);
      setEditingLink(null);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to update social link.';
      alert(errorMsg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => socialService.deleteSocialLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      setIsDeleteDialogOpen(false);
      setLinkToDelete(null);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to delete social link.';
      alert(errorMsg);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: number[]) => socialService.reorderSocialLinks(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
    },
  });

  const handleOpenAdd = () => {
    setEditingLink(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (link: SocialLink) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (link: SocialLink) => {
    setLinkToDelete(link);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleResume = (link: SocialLink) => {
    updateMutation.mutate({
      id: link.id,
      data: { includeInResume: !link.includeInResume },
    });
  };

  const handleMoveUp = (index: number) => {
    if (!socialLinks || index <= 0) return;
    const reordered = [...socialLinks];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(index - 1, 0, moved);
    reorderMutation.mutate(reordered.map((item) => item.id));
  };

  const handleMoveDown = (index: number) => {
    if (!socialLinks || index >= socialLinks.length - 1) return;
    const reordered = [...socialLinks];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(index + 1, 0, moved);
    reorderMutation.mutate(reordered.map((item) => item.id));
  };

  const handleFormSubmit = (
    data: CreateSocialLinkPayload | { id: number; data: UpdateSocialLinkPayload }
  ) => {
    if ('id' in data) {
      updateMutation.mutate({ id: data.id, data: data.data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (linkToDelete) {
      deleteMutation.mutate(linkToDelete.id);
    }
  };

  return (
    <div className="pv-container pv-cert-page">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="pv-cert-header">
        <div className="pv-cert-header__left">
          <div className="pv-cert-header__icon-wrapper" style={{ background: 'var(--color-electric-blue)' }}>
            <LinkIcon size={32} color="var(--color-paper-white)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="pv-cert-header__title">Social Links</h1>
            <p className="pv-cert-header__subtitle">
              Manage GitHub, LinkedIn, Portfolio, and online profiles.
            </p>
          </div>
        </div>

        <div className="pv-cert-header__right">
          <button
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleOpenAdd}
            id="add-social-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* ── Summary Card ────────────────────────────────────── */}
      <section className="pv-cert-section">
        <div className="pv-drive-banner pv-drive-banner--connected" style={{ borderLeftColor: 'var(--color-electric-blue)' }}>
          <div className="pv-drive-banner__left">
            <div className="pv-drive-banner__icon" style={{ background: 'var(--color-electric-blue)' }}>
              <Globe size={22} color="var(--color-paper-white)" />
            </div>
            <div className="pv-drive-banner__text">
              <div className="pv-drive-banner__title">Centralized Identity & Profile Links</div>
              <div className="pv-drive-banner__description">
                Links marked with <strong>In Resume</strong> are automatically populated in the contact header of any resume you create in Resume Builder.
              </div>
            </div>
          </div>
          <div className="pv-drive-banner__right">
            <span style={{ fontSize: '14px', fontWeight: 700 }}>
              {socialLinks?.length || 0} {(socialLinks?.length === 1) ? 'Profile Linked' : 'Profiles Linked'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Links List / Content Area ─────────────────────────── */}
      <section className="pv-cert-section" style={{ minHeight: '350px' }}>
        {isLoadingLinks ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="pv-card pv-project-card pv-project-card--skeleton" style={{ height: '70px' }} />
            ))}
          </div>
        ) : isErrorLinks ? (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon pv-cert-empty-state__icon--error">
              <AlertCircle size={36} color="var(--color-ember)" />
            </div>
            <h2>Unable to load social links</h2>
            <p>
              {linksError instanceof Error
                ? linksError.message
                : 'An error occurred while fetching your social links.'}
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={() => refetchLinks()}
            >
              Retry
            </button>
          </div>
        ) : socialLinks && socialLinks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {socialLinks.map((link, idx) => (
              <SocialLinkCard
                key={link.id}
                link={link}
                index={idx}
                total={socialLinks.length}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onToggleResume={handleToggleResume}
              />
            ))}
          </div>
        ) : (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <FolderOpen size={36} color="var(--color-carbon)" />
            </div>
            <h2>No social links added yet</h2>
            <p>Connect your GitHub, LinkedIn, portfolio, and coding profile links.</p>
            <button className="pv-btn pv-btn--dark" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Your First Link</span>
            </button>
          </div>
        )}
      </section>

      {/* ── Modals & Dialogs ─────────────────────────────────── */}
      <SocialLinkFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingLink(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingLink}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteSocialLinkDialog
        isOpen={isDeleteDialogOpen}
        link={linkToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setLinkToDelete(null);
        }}
      />
    </div>
  );
}
