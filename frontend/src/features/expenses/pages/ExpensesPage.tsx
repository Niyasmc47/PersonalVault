import { Link } from 'react-router-dom';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function ExpensesPage() {
  return (
    <div className="pv-container">
      <div className="pv-card pv-placeholder" style={{ marginTop: 'var(--sp-48)' }}>
        <div className="pv-placeholder__icon">
          <Wallet size={28} color="var(--color-ink-black)" />
        </div>
        <h1>Expenses</h1>
        <p>This feature is currently under development. Expense tracking and budget management will be available here soon.</p>
        <Link to="/home" className="pv-btn pv-btn--dark">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
