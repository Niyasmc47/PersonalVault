import type { Transaction } from '../../types/expense';
import { Edit2, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions?: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, isLoading, onEdit, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="pv-card">
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Transaction History</h3>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '52px', background: 'var(--color-soft-mist)', marginBottom: '12px', borderRadius: '12px' }}></div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="pv-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ opacity: 0.7 }}>
          <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>No transactions recorded yet</div>
          <p style={{ fontSize: '14px', color: '#666' }}>Start tracking your income and expenses to see your complete financial breakdown here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pv-card" style={{ padding: '24px 28px', overflowX: 'auto' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>Transaction History</h3>
      
      <table style={{ width: '100%', minWidth: '640px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid var(--color-carbon)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#666' }}>
            <th style={{ padding: '14px 12px' }}>Date</th>
            <th style={{ padding: '14px 12px' }}>Type</th>
            <th style={{ padding: '14px 12px' }}>Category</th>
            <th style={{ padding: '14px 12px' }}>Description</th>
            <th style={{ padding: '14px 12px' }}>Method</th>
            <th style={{ padding: '14px 12px', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '14px 12px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid var(--color-soft-mist)' }}>
              <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: 700 }}>{formatDate(t.transactionDate)}</td>
              <td style={{ padding: '16px 12px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '1600px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-carbon)',
                  background: t.type === 'INCOME' ? 'var(--color-mint-pop)' : 'var(--color-ember)',
                  color: t.type === 'INCOME' ? 'var(--color-carbon)' : 'var(--color-paper-white)',
                  display: 'inline-block'
                }}>
                  {t.type}
                </span>
              </td>
              <td style={{ padding: '16px 12px', fontSize: '13.5px', fontWeight: 700 }}>
                {t.category === 'INCOME_OTHER' ? 'OTHER' : t.category.replace(/_/g, ' ')}
              </td>
              <td style={{ padding: '16px 12px', fontSize: '13.5px', color: '#444' }}>{t.description || '—'}</td>
              <td style={{ padding: '16px 12px', fontSize: '13px', color: '#666' }}>{t.paymentMethod.replace(/_/g, ' ')}</td>
              <td style={{ 
                padding: '16px 12px', 
                textAlign: 'right', 
                fontSize: '16px',
                fontWeight: 800,
                color: t.type === 'INCOME' ? '#059669' : '#dc2626'
              }}>
                {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
              </td>
              <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="pv-btn pv-btn--light pv-btn--sm"
                    style={{ padding: '4px 8px' }}
                    onClick={() => onEdit(t)}
                    title="Edit transaction"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    className="pv-btn pv-btn--ghost pv-btn--sm pv-btn--danger"
                    style={{ padding: '4px 8px' }}
                    onClick={() => onDelete(t)}
                    title="Delete transaction"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
