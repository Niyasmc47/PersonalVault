import { useState, useMemo } from 'react';
import type { CredentialCategory, CredentialItem } from '../types';
import CredentialCard from './CredentialCard';
import { KeyRound } from 'lucide-react';

interface CredentialSectionProps {
  credentials: CredentialItem[];
  searchTerm: string;
  onEdit: (item: CredentialItem) => void;
  onDelete: (item: CredentialItem) => void;
  onAddNew: () => void;
}

export default function CredentialSection({
  credentials,
  searchTerm,
  onEdit,
  onDelete,
  onAddNew,
}: CredentialSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CredentialCategory | 'ALL'>('ALL');

  const categories: { label: string; value: CredentialCategory | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Login', value: 'LOGIN' },
    { label: 'Email', value: 'EMAIL' },
    { label: 'Social', value: 'SOCIAL' },
    { label: 'Financial', value: 'FINANCIAL' },
    { label: 'Work', value: 'WORK' },
    { label: 'Streaming', value: 'STREAMING' },
    { label: 'Other', value: 'OTHER' },
  ];

  const filtered = useMemo(() => {
    return credentials.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [credentials, selectedCategory, searchTerm]);

  return (
    <div>
      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`pv-btn pv-btn--sm ${selectedCategory === cat.value ? 'pv-btn--dark' : 'pv-btn--light'}`}
            style={{ borderRadius: '1600px', fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((cred) => (
            <CredentialCard key={cred.id} credential={cred} onEdit={onEdit} onDelete={onDelete} />
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
              background: 'var(--color-sky-wash)',
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <KeyRound size={24} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>No credentials found</h3>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
            {searchTerm
              ? `No credentials matching "${searchTerm}".`
              : 'Keep your web logins, passwords, recovery codes, and API keys safe here.'}
          </p>
          <button type="button" className="pv-btn pv-btn--dark" onClick={onAddNew}>
            Add First Credential
          </button>
        </div>
      )}
    </div>
  );
}
