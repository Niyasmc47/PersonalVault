import React, { useState, useEffect } from 'react';
import type {
  Project,
  ProjectCategory,
  ProjectStatus,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../types';
import { X, Plus, AlertCircle, Loader2, Star } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateProjectPayload | { id: number; data: UpdateProjectPayload }
  ) => void;
  initialData?: Project | null;
  isSubmitting: boolean;
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ProjectFormModalProps) {
  const isEdit = !!initialData;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('PERSONAL');
  const [status, setStatus] = useState<ProjectStatus>('IN_PROGRESS');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'PERSONAL');
      setStatus(initialData.status || 'IN_PROGRESS');
      setStartDate(initialData.startDate || '');
      setEndDate(initialData.endDate || '');
      setTechnologies(initialData.technologies ? [...initialData.technologies] : []);
      setGithubUrl(initialData.githubUrl || '');
      setLiveUrl(initialData.liveUrl || '');
      setDemoUrl(initialData.demoUrl || '');
      setFeatured(!!initialData.featured);
      setErrors({});
    } else {
      setTitle('');
      setDescription('');
      setCategory('PERSONAL');
      setStatus('IN_PROGRESS');
      setStartDate('');
      setEndDate('');
      setTechnologies([]);
      setTechInput('');
      setGithubUrl('');
      setLiveUrl('');
      setDemoUrl('');
      setFeatured(false);
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Add technology tag
  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    if (!technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
    }
    setTechInput('');
  };

  const handleKeyDownTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech();
    }
  };

  const handleRemoveTech = (indexToRemove: number) => {
    setTechnologies(technologies.filter((_, idx) => idx !== indexToRemove));
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (title.trim().length > 150) {
      newErrors.title = 'Title cannot exceed 150 characters';
    }

    if (description && description.length > 5000) {
      newErrors.description = 'Description cannot exceed 5000 characters';
    }

    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = 'End date cannot be earlier than start date';
    }

    if (githubUrl.trim() && !validateUrl(githubUrl.trim())) {
      newErrors.githubUrl = 'Must be a valid URL starting with http:// or https://';
    }

    if (liveUrl.trim() && !validateUrl(liveUrl.trim())) {
      newErrors.liveUrl = 'Must be a valid URL starting with http:// or https://';
    }

    if (demoUrl.trim() && !validateUrl(demoUrl.trim())) {
      newErrors.demoUrl = 'Must be a valid URL starting with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Include any remaining text in techInput
    const finalTechs = [...technologies];
    if (techInput.trim() && !finalTechs.includes(techInput.trim())) {
      finalTechs.push(techInput.trim());
    }

    const payload: CreateProjectPayload = {
      title: title.trim(),
      description: description.trim() || null,
      category,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      technologies: finalTechs,
      githubUrl: githubUrl.trim() || null,
      liveUrl: liveUrl.trim() || null,
      demoUrl: demoUrl.trim() || null,
      featured,
    };

    if (isEdit && initialData) {
      onSubmit({ id: initialData.id, data: payload });
    } else {
      onSubmit(payload);
    }
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-project-form-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="pv-modal-header">
          <h2 className="pv-modal-title">
            {isEdit ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            type="button"
            className="pv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="pv-project-form">
          <div className="pv-modal-scroll-content">
            {/* Title */}
            <div className="pv-form-group">
              <label className="pv-form-label" htmlFor="project-title">
                Project Title <span className="pv-required">*</span>
              </label>
              <input
                id="project-title"
                type="text"
                className={`pv-input pv-form-input ${errors.title ? 'pv-input--error' : ''}`}
                placeholder="e.g. PersonalVault Web App"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                maxLength={150}
              />
              {errors.title && (
                <div className="pv-form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Category & Status */}
            <div className="pv-form-row">
              <div className="pv-form-group">
                <label className="pv-form-label" htmlFor="project-category">
                  Category <span className="pv-required">*</span>
                </label>
                <select
                  id="project-category"
                  className="pv-select pv-form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pv-form-group">
                <label className="pv-form-label" htmlFor="project-status">
                  Status <span className="pv-required">*</span>
                </label>
                <select
                  id="project-status"
                  className="pv-select pv-form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                >
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start Date & End Date */}
            <div className="pv-form-row">
              <div className="pv-form-group">
                <label className="pv-form-label" htmlFor="project-start-date">
                  Start Date
                </label>
                <input
                  id="project-start-date"
                  type="date"
                  className="pv-input pv-form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="pv-form-group">
                <label className="pv-form-label" htmlFor="project-end-date">
                  End Date
                </label>
                <input
                  id="project-end-date"
                  type="date"
                  className={`pv-input pv-form-input ${errors.endDate ? 'pv-input--error' : ''}`}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' }));
                  }}
                />
                {errors.endDate && (
                  <div className="pv-form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.endDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pv-form-group">
              <label className="pv-form-label" htmlFor="project-desc">
                Description
              </label>
              <textarea
                id="project-desc"
                className={`pv-textarea pv-form-textarea ${errors.description ? 'pv-input--error' : ''}`}
                rows={3}
                placeholder="Briefly describe what this project does, key features, and your role..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                maxLength={5000}
              />
              {errors.description && (
                <div className="pv-form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            {/* Technologies Tag Input */}
            <div className="pv-form-group">
              <label className="pv-form-label" htmlFor="project-tech">
                Technologies & Tools
              </label>
              <div className="pv-tech-input-group">
                <input
                  id="project-tech"
                  type="text"
                  className="pv-input pv-form-input"
                  placeholder="Type a technology (e.g. React, Spring Boot) and press Enter"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleKeyDownTech}
                />
                <button
                  type="button"
                  className="pv-btn pv-btn--light pv-btn--sm"
                  onClick={handleAddTech}
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>

              {technologies.length > 0 && (
                <div className="pv-tech-tags-container">
                  {technologies.map((tech, idx) => (
                    <span key={idx} className="pv-tech-tag pv-tech-tag--removable">
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(idx)}
                        className="pv-tech-tag__remove"
                        aria-label={`Remove ${tech}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Links Section */}
            <div className="pv-form-group">
              <label className="pv-form-label" htmlFor="project-github">
                GitHub Repository URL
              </label>
              <input
                id="project-github"
                type="url"
                className={`pv-input pv-form-input ${errors.githubUrl ? 'pv-input--error' : ''}`}
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  if (errors.githubUrl) setErrors((prev) => ({ ...prev, githubUrl: '' }));
                }}
              />
              {errors.githubUrl && (
                <div className="pv-form-error-msg">
                  <AlertCircle size={14} />
                  <span>{errors.githubUrl}</span>
                </div>
              )}
            </div>

            <div className="pv-form-row">
              <div className="pv-form-group">
                <label className="pv-form-label" htmlFor="project-live">
                  Live Application URL
                </label>
                <input
                  id="project-live"
                  type="url"
                  className={`pv-input pv-form-input ${errors.liveUrl ? 'pv-input--error' : ''}`}
                  placeholder="https://myproject.com"
                  value={liveUrl}
                  onChange={(e) => {
                    setLiveUrl(e.target.value);
                    if (errors.liveUrl) setErrors((prev) => ({ ...prev, liveUrl: '' }));
                  }}
                />
                {errors.liveUrl && (
                  <div className="pv-form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.liveUrl}</span>
                  </div>
                )}
              </div>

              <div className="pv-form-group">
                <label className="pv-form-label" htmlFor="project-demo">
                  Demo URL / Video
                </label>
                <input
                  id="project-demo"
                  type="url"
                  className={`pv-input pv-form-input ${errors.demoUrl ? 'pv-input--error' : ''}`}
                  placeholder="https://youtube.com/watch?v=..."
                  value={demoUrl}
                  onChange={(e) => {
                    setDemoUrl(e.target.value);
                    if (errors.demoUrl) setErrors((prev) => ({ ...prev, demoUrl: '' }));
                  }}
                />
                {errors.demoUrl && (
                  <div className="pv-form-error-msg">
                    <AlertCircle size={14} />
                    <span>{errors.demoUrl}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Checkbox Toggle */}
            <div className="pv-form-group pv-featured-toggle-wrapper">
              <label className="pv-featured-toggle-label">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="pv-checkbox"
                />
                <div className="pv-featured-toggle-content">
                  <div className="pv-featured-toggle-title">
                    <Star size={16} fill={featured ? 'var(--color-sunburst)' : 'none'} color="var(--color-carbon)" />
                    <span>Mark as Featured Project</span>
                  </div>
                  <span className="pv-featured-toggle-desc">
                    Highlight this project at the top of your portfolio and showcase.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pv-modal-actions">
            <button
              type="button"
              className="pv-btn pv-btn--light"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pv-btn pv-btn--dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="pv-spin" />
                  <span>{isEdit ? 'Saving Changes...' : 'Creating Project...'}</span>
                </>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Create Project'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
