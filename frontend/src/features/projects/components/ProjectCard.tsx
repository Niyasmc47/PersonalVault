import type { Project } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../types';
import {
  Star,
  Calendar,
  ExternalLink,
  GitBranch,
  Eye,
  Edit2,
  Trash2,
  Globe,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({
  project,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const statusStyle = STATUS_COLORS[project.status] || {
    bg: 'var(--color-soft-mist)',
    text: 'var(--color-carbon)',
    border: 'var(--color-carbon)',
  };

  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start && !end) return null;
    const format = (dateStr: string) => {
      try {
        const [year, month] = dateStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
      } catch {
        return dateStr;
      }
    };

    if (start && end) {
      return `${format(start)} – ${format(end)}`;
    }
    if (start && !end) {
      return `${format(start)} – Present`;
    }
    if (!start && end) {
      return `Completed ${format(end)}`;
    }
    return null;
  };

  const dateText = formatDateRange(project.startDate, project.endDate);

  return (
    <article className={`pv-card pv-project-card ${project.featured ? 'pv-project-card--featured' : ''}`}>
      {/* ── Card Header ── */}
      <div className="pv-project-card__top">
        <div className="pv-project-card__badges">
          {project.featured && (
            <span className="pv-project-badge pv-project-badge--featured">
              <Star size={12} fill="currentColor" />
              <span>Featured</span>
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
      </div>

      {/* ── Title & Description ── */}
      <div className="pv-project-card__main" onClick={() => onView(project)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onView(project); }}>
        <h3 className="pv-project-card__title" title={project.title}>
          {project.title}
        </h3>

        {project.description ? (
          <p className="pv-project-card__desc">
            {project.description}
          </p>
        ) : (
          <p className="pv-project-card__desc pv-project-card__desc--empty">
            No description provided.
          </p>
        )}
      </div>

      {/* ── Technologies ── */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="pv-project-card__tech-list">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="pv-tech-tag">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="pv-tech-tag pv-tech-tag--more" title={project.technologies.slice(4).join(', ')}>
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* ── Date Meta ── */}
      {dateText && (
        <div className="pv-project-card__date">
          <Calendar size={13} />
          <span>{dateText}</span>
        </div>
      )}

      {/* ── Card Footer ── */}
      <div className="pv-project-card__footer">
        <div className="pv-project-card__links">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-project-icon-btn"
              title="GitHub Repository"
              aria-label="GitHub Repository"
              onClick={(e) => e.stopPropagation()}
            >
              <GitBranch size={15} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-project-icon-btn"
              title="Live Application"
              aria-label="Live Application"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe size={15} />
            </a>
          )}
          {project.demoUrl && !project.liveUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-project-icon-btn"
              title="Demo Video / Preview"
              aria-label="Demo Video / Preview"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>

        <div className="pv-project-card__actions">
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            onClick={() => onView(project)}
            title="View Details"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            onClick={() => onEdit(project)}
            title="Edit Project"
            aria-label="Edit Project"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm pv-btn--danger-text"
            onClick={() => onDelete(project)}
            title="Delete Project"
            aria-label="Delete Project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
