import { Link } from 'react-router-dom';
import { Award, ArrowLeft } from 'lucide-react';

export default function SkillsPage() {
  return (
    <div className="pv-container">
      <div className="pv-card pv-placeholder" style={{ marginTop: 'var(--sp-48)' }}>
        <div className="pv-placeholder__icon">
          <Award size={28} color="var(--color-ink-black)" />
        </div>
        <h1>Skills</h1>
        <p>This feature is currently under development. Skill cataloging and proficiency tracking will be available here soon.</p>
        <Link to="/home" className="pv-btn pv-btn--dark">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
