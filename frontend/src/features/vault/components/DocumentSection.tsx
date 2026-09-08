import { useState, useMemo } from 'react';
import type { VaultDocumentCategory, VaultDocumentItem, VaultDocumentSection as DocSection } from '../types';
import DocumentCard from './DocumentCard';
import GoogleDriveVaultBanner from './GoogleDriveVaultBanner';
import { GraduationCap, FolderLock } from 'lucide-react';

interface DocumentSectionProps {
  documents: VaultDocumentItem[];
  section: DocSection;
  searchTerm: string;
  onEdit: (item: VaultDocumentItem) => void;
  onDelete: (item: VaultDocumentItem) => void;
  onAddNew: () => void;
  onPreview: (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => void;
}

const educationCategories: { label: string; value: VaultDocumentCategory | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Degree', value: 'DEGREE' },
  { label: 'Mark Sheet', value: 'MARK_SHEET' },
  { label: 'Transcript', value: 'TRANSCRIPT' },
  { label: 'Student ID', value: 'STUDENT_ID' },
  { label: 'Internship Certificate', value: 'INTERNSHIP_CERTIFICATE' },
  { label: 'Offer Letter', value: 'OFFER_LETTER' },
  { label: 'Experience Certificate', value: 'EXPERIENCE_CERTIFICATE' },
  { label: 'Professional Cert', value: 'PROFESSIONAL_CERTIFICATION' },
];

const otherCategories: { label: string; value: VaultDocumentCategory | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Contract', value: 'CONTRACT' },
  { label: 'Insurance', value: 'INSURANCE' },
  { label: 'Property', value: 'PROPERTY' },
  { label: 'Tax Document', value: 'TAX_DOCUMENT' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Vehicle', value: 'VEHICLE' },
  { label: 'Other', value: 'OTHER' },
];

export default function DocumentSection({
  documents,
  section,
  searchTerm,
  onEdit,
  onDelete,
  onAddNew,
  onPreview,
}: DocumentSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<VaultDocumentCategory | 'ALL'>('ALL');

  const categories = section === 'EDUCATION' ? educationCategories : otherCategories;
  const SectionIcon = section === 'EDUCATION' ? GraduationCap : FolderLock;
  const sectionLabel = section === 'EDUCATION' ? 'education & career documents' : 'other important documents';

  const filtered = useMemo(() => {
    return documents.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.issuerOrInstitution && item.issuerOrInstitution.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.documentIdentifier && item.documentIdentifier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [documents, selectedCategory, searchTerm]);

  return (
    <div>
      <GoogleDriveVaultBanner />

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`pv-btn pv-btn--sm ${selectedCategory === cat.value ? 'pv-btn--dark' : 'pv-btn--light'}`}
            style={{ borderRadius: '1600px', fontSize: '12px', padding: '6px 14px', whiteSpace: 'nowrap' }}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((doc) => (
            <DocumentCard
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
              background: section === 'EDUCATION' ? 'var(--color-electric-blue)' : 'var(--color-soft-mist)',
              border: '1px solid var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <SectionIcon size={24} color="var(--color-carbon)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>No {sectionLabel} found</h3>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
            {searchTerm
              ? `No documents matching "${searchTerm}".`
              : section === 'EDUCATION'
                ? 'Safely store your degrees, transcripts, mark sheets, offer letters, and professional certifications.'
                : 'Store contracts, insurance policies, property documents, tax records, and other important files.'}
          </p>
          <button type="button" className="pv-btn pv-btn--dark" onClick={onAddNew}>
            Add First Document
          </button>
        </div>
      )}
    </div>
  );
}
