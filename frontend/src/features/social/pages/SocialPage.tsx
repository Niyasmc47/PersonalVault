import { Link } from 'react-router-dom';
import { Link as LinkIcon, ArrowLeft } from 'lucide-react';

export default function SocialPage() {
  return (
    <div className="pv-container">
      <div className="pv-card pv-placeholder" style={{ marginTop: 'var(--sp-48)' }}>
        <div className="pv-placeholder__icon">
          <LinkIcon size={28} color="var(--color-ink-black)" />
        </div>
        <h1>Social Links</h1>
        <p>This feature is currently under development. Managing your professional and social profile links will be available here soon.</p>
        <Link to="/home" className="pv-btn pv-btn--dark">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
