import type { Achievement } from '../types';
import { Trophy, X, Calendar, Building, ExternalLink, Star, FileText, Edit2, Trash2 } from 'lucide-react';

interface AchievementDetailsModalProps {
  isOpen: boolean;
  achievement: Achievement | null;
  onClose: () => void;
  onEdit: (achievement: Achievement) => void;
  onDelete: (achievement: Achievement) => void;
}

export default function AchievementDetailsModal({
  isOpen,
  achievement,
  onClose,
  onEdit,
  onDelete,
}: AchievementDetailsModalProps) {
  if (!isOpen || !achievement) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pv-modal-overlay" onClick={onClose}>
      <div
        className="pv-modal pv-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        <div className="pv-modal__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="pv-feature-card__icon"
              style={{ width: '36px', height: '36px', background: 'var(--color-sunburst)' }}
            >
              <Trophy size={18} color="var(--color-carbon)" />
            </div>
            <h2 className="pv-modal__title">Achievement Details</h2>
          </div>
          <button type="button" className="pv-modal__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className="pv-skill-card__category" style={{ background: 'var(--color-sunburst)', color: 'var(--color-carbon)' }}>
              {achievement.categoryDisplayName}
            </span>
            {achievement.featured && (
              <span className="pv-skill-card__featured-badge">
                <Star size={12} fill="var(--color-carbon)" color="var(--color-carbon)" />
                <span>Featured</span>
              </span>
            )}
            {achievement.includeInResume && (
              <span className="pv-skill-card__resume-badge">
                <FileText size={12} />
                <span>In Resume</span>
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
            {achievement.title}
          </h1>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '16px 0', padding: '16px', background: 'var(--color-soft-mist)', borderRadius: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.7, fontWeight: 700, marginBottom: '4px' }}>
                Organization / Host
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Building size={16} />
                <span>{achievement.organization}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.7, fontWeight: 700, marginBottom: '4px' }}>
                Date Achieved
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Calendar size={16} />
                <span>{formatDate(achievement.achievementDate)}</span>
              </div>
            </div>
          </div>

          {achievement.description && (
            <div style={{ margin: '16px 0' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', opacity: 0.7, fontWeight: 700, marginBottom: '6px' }}>
                Description
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {achievement.description}
              </p>
            </div>
          )}

          {achievement.url && (
            <div style={{ margin: '16px 0' }}>
              <a
                href={achievement.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pv-btn pv-btn--light"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ExternalLink size={16} />
                <span>Open Link / Verification</span>
              </a>
            </div>
          )}
        </div>

        <div className="pv-modal__actions" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="pv-btn pv-btn--ghost pv-btn--danger"
            onClick={() => onDelete(achievement)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="pv-btn pv-btn--light" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="pv-btn pv-btn--dark"
              onClick={() => onEdit(achievement)}
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
