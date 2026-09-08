import { useState, useMemo } from 'react';
import type { IdentityDocumentItem, IdentityDocumentType } from '../types';
import IdentityCard from './IdentityCard';
import GoogleDriveVaultBanner from './GoogleDriveVaultBanner';
import { FileCheck2 } from 'lucide-react';

interface IdentitySectionProps {
  documents: IdentityDocumentItem[];
  searchTerm: string;
  onEdit: (item: IdentityDocumentItem) => void;
  onDelete: (item: IdentityDocumentItem) => void;
  onAddNew: () => void;
  onPreview: (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => void;
}

export default function IdentitySection({
  documents,
  searchTerm,
  onEdit,
  onDelete,
  onAddNew,
  onPreview,
}: IdentitySectionProps) {
  const [selectedType, setSelectedType] = useState<IdentityDocumentType | 'ALL'>('ALL');

  const types: { label: string; value: IdentityDocumentType | 'ALL' }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'Aadhaar', value: 'AADHAAR' },
    { label: 'PAN', value: 'PAN' },
    { label: 'Passport', value: 'PASSPORT' },
    { label: 'Driving Licence', value: 'DRIVING_LICENCE' },
    { label: 'Voter ID', value: 'VOTER_ID' },
    { label: 'Other', value: 'OTHER' },
  ];

  const filtered = useMemo(() => {
    return documents.filter((item) => {
      const matchType = selectedType === 'ALL' || item.type === selectedType;
      const matchSearch =
        !searchTerm ||
        item.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maskedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [documents, selectedType, searchTerm]);

  return (
    <div>
      <GoogleDriveVaultBanner />

      {/* Type Filter Pills */}
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
          {filtered.map((doc) => (
            <IdentityCard
              key={doc.id}
              document={doc}
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
              background: 'var(--color-lavender)',
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <FileCheck2 size={24} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>No identity documents found</h3>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
            {searchTerm
              ? `No documents matching "${searchTerm}".`
              : 'Safely store Aadhaar, PAN, Passport, Driving Licence, and Voter ID numbers with front and back document scans.'}
          </p>
          <button type="button" className="pv-btn pv-btn--dark" onClick={onAddNew}>
            Add First Document
          </button>
        </div>
      )}
    </div>
  );
}
