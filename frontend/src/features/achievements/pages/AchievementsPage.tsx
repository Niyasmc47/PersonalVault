import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div className="pv-container">
      <div className="pv-card pv-placeholder" style={{ marginTop: 'var(--sp-48)' }}>
        <div className="pv-placeholder__icon">
          <Trophy size={28} color="var(--color-ink-black)" />
        </div>
        <h1>Achievements</h1>
        <p>This feature is currently under development. Achievement tracking and milestone management will be available here soon.</p>
        <Link to="/home" className="pv-btn pv-btn--dark">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
