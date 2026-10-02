import type { Achievement } from '../../types/achievement';
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
    <div className="pv-achievement-card">
      <div>
        {/* Top Header */}
        <div className="pv-achievement-card__top">
          <div className="pv-achievement-card__badges">
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
                <Star size={12} fill="var(--color-carbon)" color="var(--color-carbon)" />
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

          <div className="pv-achievement-card__date">
            <Calendar size={13} color="#666" />
            <span>{formatDate(achievement.achievementDate)}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="pv-achievement-card__title"
          onClick={() => onView(achievement)}
          title={achievement.title}
        >
          {achievement.title}
        </h3>

        {/* Organization */}
        <div className="pv-achievement-card__org" style={{ margin: '6px 0 10px 0' }}>
          <Building size={14} color="#666" />
          <span>{achievement.organization}</span>
        </div>

        {/* Description */}
        {achievement.description && (
          <p className="pv-achievement-card__desc">{achievement.description}</p>
        )}

        {/* Proof URL Link */}
        {achievement.url && (
          <div style={{ marginTop: '10px' }}>
            <a
              href={achievement.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-achievement-card__link"
            >
              <ExternalLink size={13} />
              <span>View Proof / Credential</span>
            </a>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pv-achievement-card__footer">
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onView(achievement)}
        >
          View Details
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="pv-btn pv-btn--light pv-btn--sm"
            onClick={() => onEdit(achievement)}
            aria-label="Edit achievement"
          >
            <Edit2 size={13} />
            <span>Edit</span>
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
