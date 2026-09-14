import type { Achievement } from '../types';
import { Star, FileText, Calendar, Building, ExternalLink, Edit2, Trash2 } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  onView: (achievement: Achievement) => void;
  onEdit: (achievement: Achievement) => void;
  onDelete: (achievement: Achievement) => void;
  onToggleResume?: (achievement: Achievement) => void;
  onToggleFeatured?: (achievement: Achievement) => void;
}

export default function AchievementCard({
  achievement,
  onView,
  onEdit,
  onDelete,
  onToggleResume,
  onToggleFeatured,
}: AchievementCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMPETITION':
      case 'HACKATHON':
        return 'var(--color-sunburst)';
      case 'AWARD':
        return 'var(--color-mint-pop)';
      case 'ACADEMIC':
      case 'RESEARCH':
      case 'PUBLICATION':
        return 'var(--color-electric-blue)';
      case 'LEADERSHIP':
        return 'var(--color-lavender)';
      case 'VOLUNTEER':
      case 'SPORTS':
        return 'var(--color-ember)';
      default:
        return 'var(--color-soft-mist)';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pv-card pv-project-card pv-achievement-card">
      <div className="pv-project-card__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            className="pv-skill-card__category"
            style={{
              backgroundColor: getCategoryColor(achievement.category),
              color: 'var(--color-carbon)',
            }}
          >
            {achievement.categoryDisplayName}
          </span>
          {achievement.featured && (
            <button
              type="button"
              className="pv-skill-card__featured-badge"
              title="Featured"
              onClick={() => onToggleFeatured && onToggleFeatured(achievement)}
            >
              <Star size={13} fill="var(--color-carbon)" color="var(--color-carbon)" />
              <span>Featured</span>
            </button>
          )}
          {achievement.includeInResume && (
            <button
              type="button"
              className="pv-skill-card__resume-badge"
              title="In Resume"
              onClick={() => onToggleResume && onToggleResume(achievement)}
            >
              <FileText size={12} />
              <span>In Resume</span>
            </button>
          )}
        </div>

        <div className="pv-project-card__meta" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={13} />
          <span>{formatDate(achievement.achievementDate)}</span>
        </div>
      </div>

      <h3
        className="pv-project-card__title"
        onClick={() => onView(achievement)}
        style={{ cursor: 'pointer', marginTop: '12px' }}
      >
        {achievement.title}
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, margin: '6px 0 10px 0' }}>
        <Building size={14} />
        <span>{achievement.organization}</span>
      </div>

      {achievement.description && (
        <p className="pv-project-card__desc">{achievement.description}</p>
      )}

      {achievement.url && (
        <div style={{ margin: '10px 0' }}>
          <a
            href={achievement.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pv-project-card__link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-carbon)', fontWeight: 600 }}
          >
            <ExternalLink size={13} />
            <span>View Proof / Link</span>
          </a>
        </div>
      )}

      <div className="pv-project-card__footer" style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onView(achievement)}
        >
          Details
        </button>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="pv-btn pv-btn--ghost pv-btn--sm"
            onClick={() => onEdit(achievement)}
            aria-label="Edit achievement"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
            onClick={() => onDelete(achievement)}
            aria-label="Delete achievement"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
