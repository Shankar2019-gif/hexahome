import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

// ============================================================================
// Admin Filter Bar Component
// Standardized search, select filters, reset, and action buttons toolbar
// ============================================================================

export default function AdminFilterBar({
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [],
  onReset,
  actions = null,
}) {
  return (
    <div className="admin-filter-bar">
      <div className="admin-filter-group">
        {onSearchChange && (
          <div className="admin-search-wrapper">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              className="admin-search-input"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {filters.map((filter) => (
          <select
            key={filter.id}
            className="admin-select-input"
            value={filter.value || ''}
            onChange={(e) => filter.onChange(e.target.value)}
            aria-label={filter.label}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {onReset && (
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onReset}
            title="Reset Filters"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {actions && <div className="admin-filter-actions">{actions}</div>}
    </div>
  );
}
