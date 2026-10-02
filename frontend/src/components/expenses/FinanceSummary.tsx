import type { TransactionSummary } from '../../types/expense';
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
          <div key={i} className="pv-card" style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 0.5 }}>
            <div style={{ height: '18px', background: 'var(--color-concrete-gray)', width: '40%', marginBottom: '16px', borderRadius: '6px' }}></div>
            <div style={{ height: '36px', background: 'var(--color-concrete-gray)', width: '70%', borderRadius: '8px' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pv-features-grid">
      <div className="pv-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              background: 'var(--color-mint-pop)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1.5px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowUpCircle size={22} color="var(--color-carbon)" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#555' }}>
            Total Income
          </span>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-carbon)', letterSpacing: '-0.5px' }}>
          {formatCurrency(summary.totalIncome)}
        </div>
      </div>

      <div className="pv-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              background: 'var(--color-sunburst)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1.5px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ArrowDownCircle size={22} color="var(--color-carbon)" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#555' }}>
            Total Expenses
          </span>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-carbon)', letterSpacing: '-0.5px' }}>
          {formatCurrency(summary.totalExpenses)}
        </div>
      </div>

      <div className="pv-card" style={{ background: 'var(--color-carbon)', color: 'var(--color-paper-white)', borderColor: 'var(--color-carbon)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div
            style={{
              background: 'var(--color-paper-white)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1.5px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Wallet size={22} color="var(--color-carbon)" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(255, 255, 255, 0.75)' }}>
            Net Balance
          </span>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-paper-white)', letterSpacing: '-0.5px' }}>
          {formatCurrency(summary.balance)}
        </div>
      </div>
    </div>
  );
}
