import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import type {
  Project,
  ProjectFilterParams,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../types';

import ProjectCard from '../components/ProjectCard';
import ProjectFormModal from '../components/ProjectFormModal';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import DeleteProjectDialog from '../components/DeleteProjectDialog';
import ProjectStats from '../components/ProjectStats';
import ProjectFilters from '../components/ProjectFilters';

import {
  Briefcase,
  Plus,
  AlertCircle,
  FolderOpen,
  FilterX,
} from 'lucide-react';

export default function ProjectsPage() {
  const queryClient = useQueryClient();

  // Filters state
  const [filters, setFilters] = useState<ProjectFilterParams>({});

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Queries
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    error: projectsError,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ['projects', filters.category, filters.status, filters.featured, filters.search],
    queryFn: () => projectService.getProjects(filters),
  });

  // Client-side sorting (applied to fetched data)
  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    const list = [...projects];

    if (!filters.sortBy || filters.sortBy === 'recent_updated') {
      return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    if (filters.sortBy === 'recent_created') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (filters.sortBy === 'newest_start') {
      return list.sort((a, b) => {
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
    }
    if (filters.sortBy === 'oldest_start') {
      return list.sort((a, b) => {
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    }
    if (filters.sortBy === 'alpha_asc') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (filters.sortBy === 'alpha_desc') {
      return list.sort((a, b) => b.title.localeCompare(a.title));
    }
    return list;
  }, [projects, filters.sortBy]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectService.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string; [key: string]: unknown } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create project. Please check your input and try again.';
      alert(errorMsg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectPayload }) =>
      projectService.updateProject(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsFormOpen(false);
      setEditingProject(null);
      if (viewingProject && viewingProject.id === updated.id) {
        setViewingProject(updated);
      }
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string; [key: string]: unknown } } })
          ?.response?.data?.error ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update project. Please check your input and try again.';
      alert(errorMsg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
      if (viewingProject) {
        setIsDetailsOpen(false);
        setViewingProject(null);
      }
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to delete project. Please try again.';
      alert(errorMsg);
    },
  });

  // Action handlers
  const handleOpenAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (project: Project) => {
    setViewingProject(project);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (
    data: CreateProjectPayload | { id: number; data: UpdateProjectPayload }
  ) => {
    if ('id' in data) {
      updateMutation.mutate({ id: data.id, data: data.data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
    }
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.status ||
    filters.featured
  );

  return (
    <div className="pv-container pv-project-page">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="pv-cert-header pv-project-header">
        <div className="pv-cert-header__left">
          <div className="pv-cert-header__icon-wrapper">
            <Briefcase size={32} color="var(--color-carbon)" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="pv-cert-header__title">Projects</h1>
            <p className="pv-cert-header__subtitle">
              Manage and showcase the projects you've built.
            </p>
          </div>
        </div>

        <div className="pv-cert-header__right">
          <button
            className="pv-btn pv-btn--dark pv-btn--lg"
            onClick={handleOpenAdd}
            id="add-project-btn"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>+ Add Project</span>
          </button>
        </div>
      </div>

      {/* ── Summary Statistics ──────────────────────────────── */}
      <section className="pv-cert-section">
        <ProjectStats
          projects={projects}
          isLoading={isLoadingProjects}
        />
      </section>

      {/* ── Filter Bar ───────────────────────────────────────── */}
      <section className="pv-cert-section">
        <ProjectFilters
          filters={filters}
          onChange={setFilters}
        />
      </section>

      {/* ── Projects Grid / Content Area ─────────────────────── */}
      <section className="pv-cert-section" style={{ minHeight: '350px' }}>
        {isLoadingProjects ? (
          /* Loading State */
          <div className="pv-project-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="pv-card pv-project-card pv-project-card--skeleton">
                <div className="pv-skeleton-line" style={{ width: '40%', height: 18, marginBottom: 12 }} />
                <div className="pv-skeleton-line" style={{ width: '80%', height: 24, marginBottom: 12 }} />
                <div className="pv-skeleton-line" style={{ width: '95%', height: 16, marginBottom: 8 }} />
                <div className="pv-skeleton-line" style={{ width: '70%', height: 16, marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  <div className="pv-skeleton-line" style={{ width: 60, height: 22, borderRadius: 20 }} />
                  <div className="pv-skeleton-line" style={{ width: 75, height: 22, borderRadius: 20 }} />
                </div>
                <div className="pv-skeleton-line" style={{ width: '50%', height: 14 }} />
              </div>
            ))}
          </div>
        ) : isErrorProjects ? (
          /* Error State */
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon pv-cert-empty-state__icon--error">
              <AlertCircle size={36} color="var(--color-ember)" />
            </div>
            <h2>Unable to load projects</h2>
            <p>
              {projectsError instanceof Error
                ? projectsError.message
                : 'An error occurred while fetching your projects.'}
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={() => refetchProjects()}
            >
              Retry
            </button>
          </div>
        ) : sortedProjects.length > 0 ? (
          /* Projects Grid */
          <div className="pv-project-grid">
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleOpenDetails}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        ) : hasActiveFilters ? (
          /* Filter Empty State */
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <FilterX size={36} color="var(--color-carbon)" />
            </div>
            <h2>No projects match your filters</h2>
            <p>
              Try adjusting your search query, status, or category filter to find what you're looking for.
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={() => setFilters({})}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Empty State */
          <div className="pv-card pv-cert-empty-state">
            <div className="pv-cert-empty-state__icon">
              <FolderOpen size={36} color="var(--color-carbon)" />
            </div>
            <h2>No projects yet</h2>
            <p>
              Start adding your projects to keep your work organized.
            </p>
            <button
              className="pv-btn pv-btn--dark"
              onClick={handleOpenAdd}
            >
              <Plus size={16} />
              <span>Add Project</span>
            </button>
          </div>
        )}
      </section>

      {/* ── Modals & Dialogs ─────────────────────────────────── */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingProject}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        project={viewingProject}
        onClose={() => {
          setIsDetailsOpen(false);
          setViewingProject(null);
        }}
        onEdit={(proj) => {
          setIsDetailsOpen(false);
          handleOpenEdit(proj);
        }}
        onDelete={(proj) => {
          setIsDetailsOpen(false);
          handleOpenDelete(proj);
        }}
      />

      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        project={projectToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setProjectToDelete(null);
        }}
      />
    </div>
  );
}
