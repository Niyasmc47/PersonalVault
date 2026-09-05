import type { Project } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../types';
import {
  X,
  Star,
  Calendar,
  GitBranch,
  Globe,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
} from 'lucide-react';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectDetailsModal({
  isOpen,
  project,
  onClose,
  onEdit,
  onDelete,
}: ProjectDetailsModalProps) {
  if (!isOpen || !project) return null;

  const statusStyle = STATUS_COLORS[project.status] || {
    bg: 'var(--color-soft-mist)',
    text: 'var(--color-carbon)',
    border: 'var(--color-carbon)',
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    try {
      const [year, month, day] = dateStr.split('-');
      if (day) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTimestamp = (ts?: string | null) => {
    if (!ts) return null;
    try {
      return new Date(ts).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-project-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="pv-modal-header">
          <div className="pv-project-details-modal__title-section">
            <div className="pv-project-card__badges" style={{ marginBottom: 8 }}>
              {project.featured && (
                <span className="pv-project-badge pv-project-badge--featured">
                  <Star size={12} fill="currentColor" />
                  <span>Featured Project</span>
                </span>
              )}
              <span className="pv-project-badge pv-project-badge--category">
                {CATEGORY_LABELS[project.category] || project.category}
              </span>
              <span
                className="pv-project-badge pv-project-badge--status"
                style={{
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                  borderColor: statusStyle.border,
                }}
              >
                {STATUS_LABELS[project.status] || project.status}
              </span>
            </div>
            <h2 className="pv-modal-title" style={{ fontSize: '24px' }}>
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            className="pv-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="pv-modal-scroll-content">
          {/* Dates & Timeline */}
          {(project.startDate || project.endDate) && (
            <div className="pv-project-detail-meta">
              <Calendar size={16} color="var(--color-carbon)" />
              <span>
                <strong>Duration:</strong>{' '}
                {project.startDate ? formatDate(project.startDate) : 'Not specified'}
                {' → '}
                {project.endDate ? formatDate(project.endDate) : 'Present / In Progress'}
              </span>
            </div>
          )}

          {/* Description */}
          <div className="pv-project-detail-section">
            <h4 className="pv-project-detail-heading">About the Project</h4>
            {project.description ? (
              <p className="pv-project-detail-description">{project.description}</p>
            ) : (
              <p className="pv-project-card__desc--empty">No description provided for this project.</p>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="pv-project-detail-section">
              <h4 className="pv-project-detail-heading">Technologies & Frameworks</h4>
              <div className="pv-tech-tags-container">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="pv-tech-tag pv-tech-tag--lg">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {(project.githubUrl || project.liveUrl || project.demoUrl) && (
            <div className="pv-project-detail-section">
              <h4 className="pv-project-detail-heading">Project Links</h4>
              <div className="pv-project-detail-links">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pv-btn pv-btn--light pv-btn--sm"
                  >
                    <GitBranch size={16} />
                    <span>View GitHub Repository</span>
                    <ExternalLink size={13} style={{ opacity: 0.6 }} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pv-btn pv-btn--dark pv-btn--sm"
                  >
                    <Globe size={16} />
                    <span>Open Live Application</span>
                    <ExternalLink size={13} style={{ opacity: 0.6 }} />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pv-btn pv-btn--light pv-btn--sm"
                  >
                    <ExternalLink size={16} />
                    <span>View Demo Preview</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pv-project-detail-timestamps">
            <div className="pv-project-detail-time-item">
              <Clock size={13} />
              <span>Created: {formatTimestamp(project.createdAt)}</span>
            </div>
            <div className="pv-project-detail-time-item">
              <Clock size={13} />
              <span>Updated: {formatTimestamp(project.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="pv-modal-actions pv-project-details-actions">
          <div className="pv-project-details-actions__left">
            <button
              type="button"
              className="pv-btn pv-btn--light pv-btn--sm pv-btn--danger-text"
              onClick={() => onDelete(project)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
          <div className="pv-project-details-actions__right">
            <button
              type="button"
              className="pv-btn pv-btn--light pv-btn--sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="pv-btn pv-btn--dark pv-btn--sm"
              onClick={() => onEdit(project)}
            >
              <Edit2 size={15} />
              <span>Edit Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
