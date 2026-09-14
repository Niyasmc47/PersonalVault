import React from 'react';
import type { SkillFilterParams, SkillCategory, ProficiencyLevel } from '../types';
import { Search, X, Filter } from 'lucide-react';

interface SkillFiltersProps {
  filters: SkillFilterParams;
  onChange: (filters: SkillFilterParams) => void;
}

export default function SkillFilters({ filters, onChange }: SkillFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SkillCategory | '';
    onChange({ ...filters, category: val });
  };

  const handleProficiencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as ProficiencyLevel | '';
    onChange({ ...filters, proficiency: val });
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
    filters.proficiency ||
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
          placeholder="Search skills by name or notes..."
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
          <option value="PROGRAMMING_LANGUAGE">Programming Language</option>
          <option value="FRAMEWORK">Framework</option>
          <option value="DATABASE">Database</option>
          <option value="CLOUD">Cloud</option>
          <option value="DEVOPS">DevOps</option>
          <option value="TOOLS">Tools</option>
          <option value="SOFT_SKILLS">Soft Skills</option>
          <option value="OTHER">Other</option>
        </select>

        <select
          className="pv-select"
          value={filters.proficiency || ''}
          onChange={handleProficiencyChange}
          aria-label="Filter by proficiency"
        >
          <option value="">All Levels</option>
          <option value="EXPERT">Expert</option>
          <option value="ADVANCED">Advanced</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="BEGINNER">Beginner</option>
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

