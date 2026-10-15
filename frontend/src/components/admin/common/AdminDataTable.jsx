import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

// ============================================================================
// Admin Data Table Component
// Reusable enterprise data table with sortable columns, loading state,
// empty state illustration, and full Spring Data Page pagination controls
// ============================================================================

export default function AdminDataTable({
  columns = [],
  data = [],
  loading = false,
  totalItems = 0,
  page = 0,
  pageSize = 20,
  onPageChange,
  onPageSizeChange,
  sortBy = '',
  sortDirection = 'desc',
  onSort,
  emptyMessage = 'No records found',
  rowKey = (row) => row.id,
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startEntry = totalItems === 0 ? 0 : page * pageSize + 1;
  const endEntry = Math.min((page + 1) * pageSize, totalItems);

  const handleHeaderClick = (col) => {
    if (!col.sortable || !onSort) return;
    onSort(col.sortField || col.key);
  };

  const getSortIcon = (col) => {
    if (!col.sortable) return null;
    const field = col.sortField || col.key;
    if (sortBy === field) {
      return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    }
    return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
  };

  return (
    <div className="admin-table-wrapper">
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  style={col.width ? { width: col.width } : undefined}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={() => handleHeaderClick(col)}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{col.header}</span>
                    {getSortIcon(col)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: '#64748b' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #cbd5e1',
                        borderTopColor: '#033487',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="admin-table-empty">
                  <Inbox size={42} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                  <div>{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => {
                const key = typeof rowKey === 'function' ? rowKey(row) : row[rowKey] || rowIdx;
                return (
                  <tr key={key}>
                    {columns.map((col, colIdx) => (
                      <td key={col.key || colIdx}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && onPageChange && (
        <div className="admin-pagination">
          <div>
            Showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong> of <strong>{totalItems}</strong> entries
          </div>

          <div className="admin-pagination-controls">
            {onPageSizeChange && (
              <select
                className="admin-select-input admin-btn-sm"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                style={{ marginRight: '0.75rem' }}
                aria-label="Items per page"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            )}

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              disabled={page <= 0 || loading}
              onClick={() => onPageChange(page - 1)}
              title="Previous Page"
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>
              Page {page + 1} of {totalPages}
            </span>

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => onPageChange(page + 1)}
              title="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
