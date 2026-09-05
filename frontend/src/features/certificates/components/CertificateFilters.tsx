import React from 'react';
import type { CertificateCategory, CertificateFilterParams, ExpiryStatus } from '../types';
import { CATEGORY_LABELS, EXPIRY_LABELS } from '../types';
import { Search, Filter, X } from 'lucide-react';

interface CertificateFiltersProps {
  filters: CertificateFilterParams;
  onChange: (filters: CertificateFilterParams) => void;
}

export default function CertificateFilters({
  filters,
  onChange,
}: CertificateFiltersProps) {
  const hasActiveFilters = !!(filters.search || filters.category || filters.expiryStatus);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      category: val ? (val as CertificateCategory) : undefined,
    });
  };

  const handleExpiryStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      expiryStatus: val ? (val as ExpiryStatus) : undefined,
    });
  };

  const handleClearFilters = () => {
    onChange({});
  };

  return (
    <div className="pv-cert-filters">
      <div className="pv-cert-filters__search-wrapper">
        <Search size={18} className="pv-cert-filters__search-icon" />
        <input
          type="text"
          className="pv-input pv-cert-filters__search-input"
          placeholder="Search by certificate title, issuer, or keyword..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
        {filters.search && (
          <button
            type="button"
            className="pv-cert-filters__clear-search"
            onClick={() => onChange({ ...filters, search: undefined })}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="pv-cert-filters__controls">
        <div className="pv-cert-filters__select-group">
          <Filter size={15} color="var(--color-carbon)" />
          <select
            className="pv-select pv-cert-filters__select"
            value={filters.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="pv-cert-filters__select-group">
          <select
            className="pv-select pv-cert-filters__select"
            value={filters.expiryStatus || ''}
            onChange={handleExpiryStatusChange}
          >
            <option value="">All Expiry Statuses</option>
            {Object.entries(EXPIRY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="pv-btn pv-btn--ghost pv-btn--sm"
            onClick={handleClearFilters}
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
