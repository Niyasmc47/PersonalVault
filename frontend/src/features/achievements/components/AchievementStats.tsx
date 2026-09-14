import type { Achievement } from '../types';
import { Trophy, Award, Star, FileText } from 'lucide-react';

interface AchievementStatsProps {
  achievements?: Achievement[];
  isLoading?: boolean;
}

export default function AchievementStats({ achievements, isLoading }: AchievementStatsProps) {
  if (isLoading) {
    return (
      <div className="pv-stats-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="pv-card pv-stat-card pv-stat-card--loading" />
        ))}
      </div>
    );
  }

  const total = achievements?.length ?? 0;
  const hackathonCount = achievements?.filter((a) => a.category === 'HACKATHON' || a.category === 'COMPETITION').length ?? 0;
  const featuredCount = achievements?.filter((a) => a.featured).length ?? 0;
  const resumeCount = achievements?.filter((a) => a.includeInResume).length ?? 0;

  return (
    <div className="pv-stats-grid">
      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-sunburst)' }}
        >
          <Trophy size={20} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Total Achievements</span>
          <span className="pv-stat-card__value">{total}</span>
        </div>
      </div>

      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-mint-pop)' }}
        >
          <Award size={20} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Hackathons / Competitions</span>
          <span className="pv-stat-card__value">{hackathonCount}</span>
        </div>
      </div>

      <div className="pv-card pv-stat-card">
        <div
          className="pv-stat-card__icon"
          style={{ background: 'var(--color-lavender)' }}
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
