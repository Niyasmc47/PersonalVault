import type { SocialLink } from '../types';
import {
  Globe,
  ExternalLink,
  Edit2,
  Trash2,
  FileText,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface SocialLinkCardProps {
  link: SocialLink;
  index: number;
  total: number;
  onEdit: (link: SocialLink) => void;
  onDelete: (link: SocialLink) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onToggleResume?: (link: SocialLink) => void;
}

export default function SocialLinkCard({
  link,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleResume,
}: SocialLinkCardProps) {
  const getPlatformIconColor = (platform: string) => {
    switch (platform) {
      case 'GITHUB':
        return 'var(--color-carbon)';
      case 'LINKEDIN':
        return 'var(--color-electric-blue)';
      case 'PORTFOLIO':
      case 'PERSONAL_WEBSITE':
        return 'var(--color-mint-pop)';
      case 'LEETCODE':
      case 'CODECHEF':
      case 'HACKERRANK':
        return 'var(--color-sunburst)';
      case 'BEHANCE':
      case 'DRIBBBLE':
        return 'var(--color-lavender)';
      case 'X':
        return 'var(--color-carbon)';
      case 'YOUTUBE':
        return 'var(--color-ember)';
      default:
        return 'var(--color-soft-mist)';
    }
  };

  const getPlatformInitial = (platform: string) => {
    switch (platform) {
      case 'GITHUB':
        return 'GH';
      case 'LINKEDIN':
        return 'in';
      case 'LEETCODE':
        return 'LC';
      case 'CODECHEF':
        return 'CC';
      case 'HACKERRANK':
        return 'HR';
      case 'KAGGLE':
        return 'K';
      case 'BEHANCE':
        return 'Be';
      case 'DRIBBBLE':
        return 'Dr';
      case 'X':
        return '𝕏';
      case 'YOUTUBE':
        return 'YT';
      case 'PORTFOLIO':
      case 'PERSONAL_WEBSITE':
        return '🌐';
      default:
        return '🔗';
    }
  };

  return (
    <div className="pv-card pv-social-card">
      <div className="pv-social-card__left">
        <div
          className="pv-social-card__icon"
          style={{
            backgroundColor: getPlatformIconColor(link.platform),
            color: ['GITHUB', 'X'].includes(link.platform) ? '#fff' : 'var(--color-carbon)',
          }}
        >
          {['PORTFOLIO', 'PERSONAL_WEBSITE', 'OTHER'].includes(link.platform) ? (
            <Globe size={18} />
          ) : (
            <span style={{ fontWeight: 800, fontSize: '14px' }}>
              {getPlatformInitial(link.platform)}
            </span>
          )}
        </div>

        <div className="pv-social-card__info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 className="pv-social-card__label">{link.label}</h3>
            <span className="pv-skill-card__category" style={{ fontSize: '11px', padding: '2px 8px' }}>
              {link.platformDisplayName}
            </span>
            {link.includeInResume && (
              <button
                type="button"
                className="pv-skill-card__resume-badge"
                title="In Resume"
                onClick={() => onToggleResume && onToggleResume(link)}
                style={{ fontSize: '11px', padding: '2px 8px' }}
              >
                <FileText size={11} />
                <span>In Resume</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            {link.username && (
              <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8 }}>
                @{link.username}
              </span>
            )}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pv-social-card__url"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-carbon)', opacity: 0.7 }}
            >
              <span style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {link.url}
              </span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="pv-social-card__actions">
        {onMoveUp && onMoveDown && (
          <div className="pv-social-card__reorder" style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              type="button"
              className="pv-btn pv-btn--ghost pv-btn--sm"
              style={{ padding: '2px 6px', height: '22px' }}
              disabled={index === 0}
              onClick={() => onMoveUp(index)}
              aria-label="Move up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              className="pv-btn pv-btn--ghost pv-btn--sm"
              style={{ padding: '2px 6px', height: '22px' }}
              disabled={index === total - 1}
              onClick={() => onMoveDown(index)}
              aria-label="Move down"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        )}

        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onEdit(link)}
          aria-label="Edit link"
        >
          <Edit2 size={13} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
          onClick={() => onDelete(link)}
          aria-label="Delete link"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
