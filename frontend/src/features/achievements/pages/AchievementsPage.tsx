import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { achievementService } from '../services/achievementService';
import type {
  Achievement,
  AchievementFilterParams,
  CreateAchievementPayload,
  UpdateAchievementPayload,
} from '../types';

import AchievementCard from '../components/AchievementCard';
import AchievementFormModal from '../components/AchievementFormModal';
import AchievementDetailsModal from '../components/AchievementDetailsModal';
import DeleteAchievementDialog from '../components/DeleteAchievementDialog';
import AchievementStats from '../components/AchievementStats';
import AchievementFilters from '../components/AchievementFilters';

import { Trophy, Plus, AlertCircle, FolderOpen, FilterX } from 'lucide-react';

export default function AchievementsPage() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<AchievementFilterParams>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingAchievement, setViewingAchievement] = useState<Achievement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  const {
    data: achievements,
    isLoading: isLoadingAchievements,
    isError: isErrorAchievements,
    error: achievementsError,
    refetch: refetchAchievements,
  } = useQuery({
    queryKey: [
      'achievements',
      filters.category,
      filters.featured,
      filters.includeInResume,
      filters.search,
    ],
    queryFn: () => achievementService.getAchievements(filters),
  });

  const sortedAchievements = useMemo(() => {
    if (!achievements) return [];
    return [...achievements];
  }, [achievements]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateAchievementPayload) =>
      achievementService.createAchievement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      setIsFormOpen(false);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to add achievement.';
      alert(errorMsg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAchievementPayload }) =>
      achievementService.updateAchievement(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      setIsFormOpen(false);
      setEditingAchievement(null);
      if (viewingAchievement && viewingAchievement.id === updated.id) {
        setViewingAchievement(updated);
      }
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to update achievement.';
      alert(errorMsg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => achievementService.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      setIsDeleteDialogOpen(false);
      setAchievementToDelete(null);
      if (viewingAchievement) {
        setIsDetailsOpen(false);
        setViewingAchievement(null);
      }
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to delete achievement.';
      alert(errorMsg);
    },
  });

  const handleOpenAdd = () => {
    setEditingAchievement(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (achievement: Achievement) => {
    setViewingAchievement(achievement);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleResume = (achievement: Achievement) => {
    updateMutation.mutate({
      id: achievement.id,
      data: { includeInResume: !achievement.includeInResume },
    });
  };

  const handleToggleFeatured = (achievement: Achievement) => {
    updateMutation.mutate({
      id: achievement.id,
      data: { featured: !achievement.featured },
    });
  };

  const handleFormSubmit = (
    data: CreateAchievementPayload | { id: number; data: UpdateAchievementPayload }
  ) => {
    if ('id' in data) {
      updateMutation.mutate({ id: data.id, data: data.data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (achievementToDelete) {
      deleteMutation.mutate(achievementToDelete.id);
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.featured ||
    filters.includeInResume
  );

  return (
    <div className="pv-container pv-cert-page">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="pv-cert-header">
        <div className="pv-cert-header__left">
          <div className="pv-cert-header__icon-wrapper" style={{ background: 'var(--color-sunburst)' }}>
            <Trophy size={32} color="var(--color-carbon)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="pv-cert-header__title">Achievements</h1>
            <p className="pv-cert-header__subtitle">
              Record competitions, hackathons, awards, and career milestones.
            </p>
          </div>
        </div>

        <div className="pv-cert-header__right">
          <button
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleOpenAdd}
            id="add-achievement-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Achievement</span>
          </button>
        </div>
      </div>

      {/* ── Stats Overview ──────────────────────────────────── */}
      <section className="pv-cert-section">
        <AchievementStats
          achievements={achievements}
          isLoading={isLoadingAchievements}
        />
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section className="pv-cert-section">
        <AchievementFilters filters={filters} onChange={setFilters} />
      </section>

      {/* ── Achievements Grid ─────────────────────────────────── */}
      <section className="pv-cert-section" style={{ minHeight: '350px' }}>
        {isLoadingAchievements ? (
          <div className="pv-project-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pv-card pv-project-card pv-project-card--skeleton">
                <div className="pv-skeleton-line" style={{ width: '40%', height: 18, marginBottom: 12 }} />
                <div className="pv-skeleton-line" style={{ width: '80%', height: 24, marginBottom: 12 }} />
                <div className="pv-skeleton-line" style={{ width: '95%', height: 16, marginBottom: 8 }} />
              </div>
            ))}
          </div>
        ) : isErrorAchievements ? (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon pv-cert-empty-state__icon--error">
              <AlertCircle size={36} color="var(--color-ember)" />
            </div>
            <h2>Unable to load achievements</h2>
            <p>
              {achievementsError instanceof Error
                ? achievementsError.message
                : 'An error occurred while fetching your achievements.'}
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={() => refetchAchievements()}
            >
              Retry
            </button>
          </div>
        ) : sortedAchievements.length > 0 ? (
          <div className="pv-project-grid">
            {sortedAchievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                onView={handleOpenDetails}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onToggleResume={handleToggleResume}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>
        ) : hasActiveFilters ? (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <FilterX size={36} color="var(--color-carbon)" />
            </div>
            <h2>No achievements match your filters</h2>
            <p>Try adjusting your search query or category filter.</p>
            <button className="pv-btn pv-btn--dark" onClick={() => setFilters({})}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <FolderOpen size={36} color="var(--color-carbon)" />
            </div>
            <h2>No achievements recorded yet</h2>
            <p>Document hackathon triumphs, academic awards, and leadership milestones.</p>
            <button className="pv-btn pv-btn--dark" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Your First Achievement</span>
            </button>
          </div>
        )}
      </section>

      {/* ── Modals & Dialogs ─────────────────────────────────── */}
      <AchievementFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAchievement(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingAchievement}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <AchievementDetailsModal
        isOpen={isDetailsOpen}
        achievement={viewingAchievement}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingAchievement(null);
        }}
        onEdit={(ach) => {
          setIsDetailsOpen(false);
          handleOpenEdit(ach);
        }}
        onDelete={(ach) => {
          setIsDetailsOpen(false);
          handleOpenDelete(ach);
        }}
      />

      <DeleteAchievementDialog
        isOpen={isDeleteDialogOpen}
        achievement={achievementToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setAchievementToDelete(null);
        }}
      />
    </div>
  );
}
