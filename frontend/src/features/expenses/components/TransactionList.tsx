import type { Transaction } from '../types';
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
      currency: 'INR'
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
      <div className="pv-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Transaction History</h3>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '48px', background: 'var(--color-soft-mist)', marginBottom: '12px', borderRadius: '8px' }}></div>
        ))}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="pv-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ opacity: 0.5 }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>No transactions yet</div>
          <p>Start tracking your income and expenses to see your financial overview here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pv-card" style={{ padding: '24px', overflowX: 'auto' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Transaction History</h3>
      
      <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-carbon)', fontSize: '13px', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px 8px' }}>Date</th>
            <th style={{ padding: '12px 8px' }}>Type</th>
            <th style={{ padding: '12px 8px' }}>Category</th>
            <th style={{ padding: '12px 8px' }}>Description</th>
            <th style={{ padding: '12px 8px' }}>Method</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>Amount</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid var(--color-concrete-gray)' }}>
              <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 'bold' }}>{formatDate(t.transactionDate)}</td>
              <td style={{ padding: '16px 8px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: t.type === 'INCOME' ? 'var(--color-mint-pop)' : 'var(--color-ember)',
                  color: t.type === 'INCOME' ? 'var(--color-carbon)' : 'var(--color-paper-white)'
                }}>
                  {t.type}
                </span>
              </td>
              <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: 'bold' }}>{t.category === 'INCOME_OTHER' ? 'OTHER' : t.category}</td>
              <td style={{ padding: '16px 8px', fontSize: '14px' }}>{t.description || '-'}</td>
              <td style={{ padding: '16px 8px', fontSize: '14px' }}>{t.paymentMethod.replace('_', ' ')}</td>
              <td style={{ 
                padding: '16px 8px', 
                textAlign: 'right', 
                fontSize: '16px',
                fontWeight: 'bold',
                color: t.type === 'INCOME' ? 'var(--color-mint-pop)' : 'var(--color-ember)' 
              }}>
                {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
              </td>
              <td style={{ padding: '16px 8px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={() => onEdit(t)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Edit2 size={18} color="var(--color-electric-blue)" />
                </button>
                <button onClick={() => onDelete(t)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} color="var(--color-ember)" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
