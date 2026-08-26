import type { TransactionSummary } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface FinanceSummaryProps {
  summary?: TransactionSummary;
  isLoading: boolean;
}

export default function FinanceSummary({ summary, isLoading }: FinanceSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading || !summary) {
    return (
      <div className="pv-features-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="pv-card" style={{ height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 0.5 }}>
            <div style={{ height: '16px', background: 'var(--color-concrete-gray)', width: '40%', marginBottom: '12px', borderRadius: '4px' }}></div>
            <div style={{ height: '32px', background: 'var(--color-concrete-gray)', width: '70%', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pv-features-grid">
      <div className="pv-card" style={{ background: 'var(--color-paper-white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--color-mint-pop)', padding: '8px', borderRadius: '50%' }}>
            <ArrowUpCircle size={20} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '15px', color: 'var(--color-carbon)', margin: 0 }}>Total Income</h3>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)' }}>
          {formatCurrency(summary.totalIncome)}
        </div>
      </div>

      <div className="pv-card" style={{ background: 'var(--color-paper-white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--color-sunburst)', padding: '8px', borderRadius: '50%' }}>
            <ArrowDownCircle size={20} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '15px', color: 'var(--color-carbon)', margin: 0 }}>Total Expenses</h3>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)' }}>
          {formatCurrency(summary.totalExpenses)}
        </div>
      </div>

      <div className="pv-card" style={{ background: 'var(--color-carbon)', color: 'var(--color-paper-white)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ background: 'var(--color-paper-white)', padding: '8px', borderRadius: '50%' }}>
            <Wallet size={20} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '15px', color: 'var(--color-paper-white)', margin: 0 }}>Current Balance</h3>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)' }}>
          {formatCurrency(summary.balance)}
        </div>
      </div>
    </div>
  );
}
