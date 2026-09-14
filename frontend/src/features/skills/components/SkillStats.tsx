import type { Skill } from '../types';
import { Award, Star, FileText, Zap } from 'lucide-react';

interface SkillStatsProps {
  skills?: Skill[];
  isLoading?: boolean;
}

export default function SkillStats({ skills, isLoading }: SkillStatsProps) {
  if (isLoading) {
    return (
      <div className="pv-stats-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="pv-card pv-stat-card pv-stat-card--loading" />
        ))}
      </div>
    );
  }

  const total = skills?.length ?? 0;
  const expertCount = skills?.filter((s) => s.proficiency === 'EXPERT' || s.proficiency === 'ADVANCED').length ?? 0;
  const featuredCount = skills?.filter((s) => s.featured).length ?? 0;
  const resumeCount = skills?.filter((s) => s.includeInResume).length ?? 0;

  return (
    <div className="pv-stats-grid">
      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-mint-pop)' }}
        >
          <Award size={20} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Total Skills</span>
          <span className="pv-stat-card__value">{total}</span>
        </div>
      </div>

      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-voltage-violet)' }}
        >
          <Zap size={20} color="#fff" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Advanced / Expert</span>
          <span className="pv-stat-card__value">{expertCount}</span>
        </div>
      </div>

      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-sunburst)' }}
        >
          <Star size={20} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Featured</span>
          <span className="pv-stat-card__value">{featuredCount}</span>
        </div>
      </div>

      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-electric-blue)' }}
        >
          <FileText size={20} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">In Resume</span>
          <span className="pv-stat-card__value">{resumeCount}</span>
        </div>
      </div>
    </div>
  );
}
