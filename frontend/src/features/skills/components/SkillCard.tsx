import type { Skill } from '../types';
import { Star, FileText, Edit2, Trash2, Clock } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  onToggleResume?: (skill: Skill) => void;
  onToggleFeatured?: (skill: Skill) => void;
}

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
  onToggleResume,
  onToggleFeatured,
}: SkillCardProps) {
  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'EXPERT':
        return 'var(--color-voltage-violet)';
      case 'ADVANCED':
        return 'var(--color-electric-blue)';
      case 'INTERMEDIATE':
        return 'var(--color-mint-pop)';
      case 'BEGINNER':
      default:
        return 'var(--color-sunburst)';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'PROGRAMMING_LANGUAGE':
        return 'var(--color-electric-blue)';
      case 'FRAMEWORK':
        return 'var(--color-mint-pop)';
      case 'DATABASE':
        return 'var(--color-sunburst)';
      case 'CLOUD':
      case 'DEVOPS':
        return 'var(--color-lavender)';
      case 'SOFT_SKILLS':
        return 'var(--color-ember)';
      default:
        return 'var(--color-soft-mist)';
    }
  };

  return (
    <div className="pv-card pv-skill-card">
      <div className="pv-skill-card__header">
        <div className="pv-skill-card__title-row">
          <h3 className="pv-skill-card__name">{skill.name}</h3>
          <div className="pv-skill-card__badges">
            {skill.featured && (
              <button
                type="button"
                className="pv-skill-card__featured-badge"
                title="Featured skill"
                onClick={() => onToggleFeatured && onToggleFeatured(skill)}
              >
                <Star size={14} fill="var(--color-carbon)" color="var(--color-carbon)" />
                <span>Featured</span>
              </button>
            )}
            {skill.includeInResume && (
              <button
                type="button"
                className="pv-skill-card__resume-badge"
                title="Included in Resume Builder"
                onClick={() => onToggleResume && onToggleResume(skill)}
              >
                <FileText size={12} />
                <span>In Resume</span>
              </button>
            )}
          </div>
        </div>

        <div className="pv-skill-card__tags">
          <span
            className="pv-skill-card__category"
            style={{
              backgroundColor: getCategoryBadgeColor(skill.category),
              color: 'var(--color-carbon)',
            }}
          >
            {skill.categoryDisplayName}
          </span>
          <span
            className="pv-skill-card__proficiency"
            style={{
              backgroundColor: getProficiencyColor(skill.proficiency),
              color: skill.proficiency === 'EXPERT' ? '#fff' : 'var(--color-carbon)',
            }}
          >
            {skill.proficiencyDisplayName}
          </span>
        </div>
      </div>

      {skill.yearsOfExperience !== null && skill.yearsOfExperience !== undefined && skill.yearsOfExperience > 0 && (
        <div className="pv-skill-card__meta">
          <Clock size={14} />
          <span>{skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience</span>
        </div>
      )}

      {skill.description && (
        <p className="pv-skill-card__description">{skill.description}</p>
      )}

      <div className="pv-skill-card__actions">
        <button
          type="button"
          className="pv-btn pv-btn--light pv-btn--sm"
          onClick={() => onEdit(skill)}
          aria-label={`Edit ${skill.name}`}
        >
          <Edit2 size={13} />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
          onClick={() => onDelete(skill)}
          aria-label={`Delete ${skill.name}`}
        >
          <Trash2 size={13} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
