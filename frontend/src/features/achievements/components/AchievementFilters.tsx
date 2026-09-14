import React from 'react';
import type { AchievementFilterParams, AchievementCategory } from '../types';
import { Search, X, Filter } from 'lucide-react';

interface AchievementFiltersProps {
  filters: AchievementFilterParams;
  onChange: (filters: AchievementFilterParams) => void;
}

export default function AchievementFilters({ filters, onChange }: AchievementFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as AchievementCategory | '';
    onChange({ ...filters, category: val });
  };

  const handleFeaturedToggle = () => {
    onChange({
      ...filters,
      featured: filters.featured ? undefined : true,
    });
  };

  const handleResumeToggle = () => {
    onChange({
      ...filters,
      includeInResume: filters.includeInResume ? undefined : true,
    });
  };

  const handleClearSearch = () => {
    onChange({ ...filters, search: '' });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.category ||
    filters.featured ||
    filters.includeInResume
  );

  return (
    <div className="pv-cert-filters">
      <div className="pv-cert-filters__search-wrapper">
        <Search className="pv-cert-filters__search-icon" size={18} />
        <input
          type="text"
          className="pv-input pv-cert-filters__search-input"
          placeholder="Search achievements by title, host, or notes..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
        {filters.search && (
          <button
            type="button"
            className="pv-cert-filters__clear-search"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="pv-cert-filters__controls">
        <select
          className="pv-select"
          value={filters.category || ''}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="COMPETITION">Competition</option>
          <option value="HACKATHON">Hackathon</option>
          <option value="AWARD">Award</option>
          <option value="ACADEMIC">Academic</option>
          <option value="LEADERSHIP">Leadership</option>
          <option value="RESEARCH">Research</option>
          <option value="PUBLICATION">Publication</option>
          <option value="VOLUNTEER">Volunteer</option>
          <option value="SPORTS">Sports</option>
          <option value="OTHER">Other</option>
        </select>

        <button
          type="button"
          className={`pv-btn pv-btn--sm ${filters.featured ? 'pv-btn--dark' : 'pv-btn--light'}`}
          onClick={handleFeaturedToggle}
        >
          Featured
        </button>

        <button
          type="button"
          className={`pv-btn pv-btn--sm ${filters.includeInResume ? 'pv-btn--dark' : 'pv-btn--light'}`}
          onClick={handleResumeToggle}
        >
          In Resume
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className="pv-btn pv-btn--ghost pv-btn--sm"
            onClick={() => onChange({})}
          >
            <Filter size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

