import { useState, useMemo } from 'react';
import type { FinancialAccountItem, FinancialAccountType } from '../types';
import FinancialCard from './FinancialCard';
import GoogleDriveVaultBanner from './GoogleDriveVaultBanner';
import { Building2 } from 'lucide-react';

interface FinancialSectionProps {
  accounts: FinancialAccountItem[];
  searchTerm: string;
  onEdit: (item: FinancialAccountItem) => void;
  onDelete: (item: FinancialAccountItem) => void;
  onAddNew: () => void;
  onPreview: (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => void;
}

export default function FinancialSection({
  accounts,
  searchTerm,
  onEdit,
  onDelete,
  onAddNew,
  onPreview,
}: FinancialSectionProps) {
  const [selectedType, setSelectedType] = useState<FinancialAccountType | 'ALL'>('ALL');

  const types: { label: string; value: FinancialAccountType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Savings', value: 'SAVINGS' },
    { label: 'Current', value: 'CURRENT' },
    { label: 'Salary', value: 'SALARY' },
    { label: 'Fixed Deposit', value: 'FIXED_DEPOSIT' },
    { label: 'Demat', value: 'DEMAT' },
    { label: 'Other', value: 'OTHER' },
  ];

  const filtered = useMemo(() => {
    return accounts.filter((item) => {
      const matchType = selectedType === 'ALL' || item.accountType === selectedType;
      const matchSearch =
        !searchTerm ||
        item.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maskedAccountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.ifsc && item.ifsc.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.upiId && item.upiId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.branch && item.branch.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [accounts, selectedType, searchTerm]);

  return (
    <div>
      <GoogleDriveVaultBanner />

      {/* Account Type Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`pv-btn pv-btn--sm ${selectedType === t.value ? 'pv-btn--dark' : 'pv-btn--light'}`}
            style={{ borderRadius: '1600px', fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setSelectedType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((acc) => (
            <FinancialCard
              key={acc.id}
              account={acc}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          ))}
        </div>
      ) : (
        <div
          className="pv-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '24px',
            background: 'var(--color-paper-white)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--color-mint-pop)',
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Building2 size={24} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>No financial accounts found</h3>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
            {searchTerm
              ? `No accounts matching "${searchTerm}".`
              : 'Safely store bank account numbers, IFSC codes, UPI IDs, and passbook scans. (CVV is never stored)'}
          </p>
          <button type="button" className="pv-btn pv-btn--dark" onClick={onAddNew}>
            Add First Account
          </button>
        </div>
      )}
    </div>
  );
}
