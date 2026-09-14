import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillService } from '../services/skillService';
import type {
  Skill,
  SkillFilterParams,
  CreateSkillPayload,
  UpdateSkillPayload,
} from '../types';

import SkillCard from '../components/SkillCard';
import SkillFormModal from '../components/SkillFormModal';
import DeleteSkillDialog from '../components/DeleteSkillDialog';
import SkillStats from '../components/SkillStats';
import SkillFilters from '../components/SkillFilters';

import { Award, Plus, AlertCircle, FolderOpen, FilterX } from 'lucide-react';

export default function SkillsPage() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<SkillFilterParams>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const {
    data: skills,
    isLoading: isLoadingSkills,
    isError: isErrorSkills,
    error: skillsError,
    refetch: refetchSkills,
  } = useQuery({
    queryKey: [
      'skills',
      filters.category,
      filters.proficiency,
      filters.featured,
      filters.includeInResume,
      filters.search,
    ],
    queryFn: () => skillService.getSkills(filters),
  });

  const sortedSkills = useMemo(() => {
    if (!skills) return [];
    return [...skills];
  }, [skills]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateSkillPayload) => skillService.createSkill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsFormOpen(false);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to add skill. Please check your inputs.';
      alert(errorMsg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSkillPayload }) =>
      skillService.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsFormOpen(false);
      setEditingSkill(null);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to update skill.';
      alert(errorMsg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => skillService.deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsDeleteDialogOpen(false);
      setSkillToDelete(null);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to delete skill.';
      alert(errorMsg);
    },
  });

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (skill: Skill) => {
    setSkillToDelete(skill);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleResume = (skill: Skill) => {
    updateMutation.mutate({
      id: skill.id,
      data: { includeInResume: !skill.includeInResume },
    });
  };

  const handleToggleFeatured = (skill: Skill) => {
    updateMutation.mutate({
      id: skill.id,
      data: { featured: !skill.featured },
    });
  };

  const handleFormSubmit = (
    data: CreateSkillPayload | { id: number; data: UpdateSkillPayload }
  ) => {
    if ('id' in data) {
      updateMutation.mutate({ id: data.id, data: data.data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (skillToDelete) {
      deleteMutation.mutate(skillToDelete.id);
    }
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.proficiency ||
    filters.featured ||
    filters.includeInResume
  );

  return (
    <div className="pv-container pv-cert-page">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="pv-cert-header">
        <div className="pv-cert-header__left">
          <div className="pv-cert-header__icon-wrapper" style={{ background: 'var(--color-mint-pop)' }}>
            <Award size={32} color="var(--color-carbon)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="pv-cert-header__title">Skills</h1>
            <p className="pv-cert-header__subtitle">
              Catalog your technical abilities, tools, and proficiencies.
            </p>
          </div>
        </div>

        <div className="pv-cert-header__right">
          <button
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleOpenAdd}
            id="add-skill-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* ── Stats Overview ──────────────────────────────────── */}
      <section className="pv-cert-section">
        <SkillStats skills={skills} isLoading={isLoadingSkills} />
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section className="pv-cert-section">
        <SkillFilters filters={filters} onChange={setFilters} />
      </section>

      {/* ── Skills Grid / Content Area ───────────────────────── */}
      <section className="pv-cert-section" style={{ minHeight: '350px' }}>
        {isLoadingSkills ? (
          <div className="pv-cert-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pv-card pv-project-card pv-project-card--skeleton">
                <div className="pv-skeleton-line" style={{ width: '50%', height: 20, marginBottom: 12 }} />
                <div className="pv-skeleton-line" style={{ width: '80%', height: 16, marginBottom: 8 }} />
                <div className="pv-skeleton-line" style={{ width: '40%', height: 14 }} />
              </div>
            ))}
          </div>
        ) : isErrorSkills ? (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon pv-cert-empty-state__icon--error">
              <AlertCircle size={36} color="var(--color-ember)" />
            </div>
            <h2>Unable to load skills</h2>
            <p>
              {skillsError instanceof Error
                ? skillsError.message
                : 'An error occurred while fetching your skills.'}
            </p>
            <button className="pv-btn pv-btn--dark" onClick={() => refetchSkills()}>
              Retry
            </button>
          </div>
        ) : sortedSkills.length > 0 ? (
          <div className="pv-cert-grid">
            {sortedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
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
            <h2>No skills match your filters</h2>
            <p>Try adjusting your search query, category, or proficiency filter.</p>
            <button className="pv-btn pv-btn--dark" onClick={() => setFilters({})}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <FolderOpen size={36} color="var(--color-carbon)" />
            </div>
            <h2>No skills cataloged yet</h2>
            <p>Add your technical skills and competencies to start building your profile.</p>
            <button className="pv-btn pv-btn--dark" onClick={handleOpenAdd}>
              <Plus size={16} />
              <span>Add Your First Skill</span>
            </button>
          </div>
        )}
      </section>

      {/* ── Modals & Dialogs ─────────────────────────────────── */}
      <SkillFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSkill(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingSkill}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteSkillDialog
        isOpen={isDeleteDialogOpen}
        skill={skillToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSkillToDelete(null);
        }}
      />
    </div>
  );
}
