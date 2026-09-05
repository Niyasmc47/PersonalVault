import type { Project } from '../types';
import { Briefcase, Activity, CheckCircle2, Star } from 'lucide-react';

interface ProjectStatsProps {
  projects: Project[] | undefined;
  isLoading: boolean;
}

export default function ProjectStats({
  projects,
  isLoading,
}: ProjectStatsProps) {
  if (isLoading) {
    return (
      <div className="pv-stats-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="pv-stat-card pv-stat-card--loading">
            <div className="pv-stat-card__icon-placeholder" />
            <div className="pv-stat-card__text-placeholder" />
          </div>
        ))}
      </div>
    );
  }

  const allProjects = projects ?? [];
  const total = allProjects.length;
  const inProgress = allProjects.filter((p) => p.status === 'IN_PROGRESS').length;
  const completed = allProjects.filter((p) => p.status === 'COMPLETED').length;
  const featured = allProjects.filter((p) => p.featured).length;

  return (
    <div className="pv-stats-grid">
      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-sky-wash)' }}>
          <Briefcase size={22} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Total Projects</span>
          <span className="pv-stat-card__value">{total}</span>
        </div>
      </div>

      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-sunburst)' }}>
          <Activity size={22} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">In Progress</span>
          <span className="pv-stat-card__value">{inProgress}</span>
        </div>
      </div>

      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-mint-pop)' }}>
          <CheckCircle2 size={22} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Completed</span>
          <span className="pv-stat-card__value">{completed}</span>
        </div>
      </div>

      <div className="pv-stat-card">
        <div className="pv-stat-card__icon" style={{ background: 'var(--color-lavender)' }}>
          <Star size={22} color="var(--color-carbon)" strokeWidth={2.5} />
        </div>
        <div className="pv-stat-card__info">
          <span className="pv-stat-card__label">Featured</span>
          <span className="pv-stat-card__value">{featured}</span>
        </div>
      </div>
    </div>
  );
}
