import React from 'react';
import type { ProjectCategory, ProjectStatus, ProjectFilterParams } from '../types';
import { CATEGORY_LABELS, STATUS_LABELS } from '../types';
import { Search, Filter, X, Star, ArrowUpDown } from 'lucide-react';

interface ProjectFiltersProps {
  filters: ProjectFilterParams;
  onChange: (filters: ProjectFilterParams) => void;
}

export default function ProjectFilters({
  filters,
  onChange,
}: ProjectFiltersProps) {
  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.status ||
    filters.featured ||
    filters.sortBy
  );

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
      category: val ? (val as ProjectCategory) : undefined,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      status: val ? (val as ProjectStatus) : undefined,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      sortBy: val ? (val as ProjectFilterParams['sortBy']) : undefined,
    });
  };

  const handleToggleFeatured = () => {
    onChange({
      ...filters,
      featured: filters.featured ? undefined : true,
    });
  };

  const handleClearFilters = () => {
    onChange({});
  };

  return (
    <div className="pv-project-filters">
      {/* ── Search Bar ── */}
      <div className="pv-project-filters__search-wrapper">
        <Search size={18} className="pv-project-filters__search-icon" />
        <input
          type="text"
          className="pv-input pv-project-filters__search-input"
          placeholder="Search projects by title, description, or technology..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
        {filters.search && (
          <button
            type="button"
            className="pv-project-filters__clear-search"
            onClick={() => onChange({ ...filters, search: undefined })}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Filter Controls ── */}
      <div className="pv-project-filters__controls">
        {/* Status */}
        <div className="pv-project-filters__select-group">
          <Filter size={15} color="var(--color-carbon)" />
          <select
            className="pv-select pv-project-filters__select"
            value={filters.status || ''}
            onChange={handleStatusChange}
            aria-label="Filter by Status"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="pv-project-filters__select-group">
          <select
            className="pv-select pv-project-filters__select"
            value={filters.category || ''}
            onChange={handleCategoryChange}
            aria-label="Filter by Category"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="pv-project-filters__select-group">
          <ArrowUpDown size={15} color="var(--color-carbon)" />
          <select
            className="pv-select pv-project-filters__select"
            value={filters.sortBy || ''}
            onChange={handleSortChange}
            aria-label="Sort projects"
          >
            <option value="">Sort by: Default</option>
            <option value="recent_updated">Recently Updated</option>
            <option value="recent_created">Recently Created</option>
            <option value="newest_start">Newest Start Date</option>
            <option value="oldest_start">Oldest Start Date</option>
            <option value="alpha_asc">Alphabetical (A - Z)</option>
            <option value="alpha_desc">Alphabetical (Z - A)</option>
          </select>
        </div>

        {/* Featured Toggle Button */}
        <button
          type="button"
          className={`pv-btn pv-btn--sm ${filters.featured ? 'pv-btn--dark' : 'pv-btn--light'}`}
          onClick={handleToggleFeatured}
          title="Toggle featured projects filter"
        >
          <Star size={14} fill={filters.featured ? 'currentColor' : 'none'} />
          <span>Featured Only</span>
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="pv-btn pv-btn--ghost pv-btn--sm pv-project-filters__reset-btn"
            onClick={handleClearFilters}
          >
            <X size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
