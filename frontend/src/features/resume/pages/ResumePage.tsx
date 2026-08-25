import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="pv-container">
      <div className="pv-card pv-placeholder" style={{ marginTop: 'var(--sp-48)' }}>
        <div className="pv-placeholder__icon">
          <FileText size={28} color="var(--color-ink-black)" />
        </div>
        <h1>Resume</h1>
        <p>This feature is currently under development. Resume data management and document generation will be available here soon.</p>
        <Link to="/home" className="pv-btn pv-btn--dark">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
