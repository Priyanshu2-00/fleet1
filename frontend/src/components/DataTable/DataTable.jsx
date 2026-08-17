import React from 'react';

const DataTable = ({ columns, data, onRowClick, loading, emptyMessage = 'No data available' }) => {
  if (loading) {
    return <div className="p-4 text-center text-tertiary animate-pulse">Loading data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="card p-8 text-center text-tertiary">{emptyMessage}</div>;
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: 'var(--spacing-3) var(--spacing-4)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr 
              key={i} 
              onClick={() => onRowClick && onRowClick(row)}
              style={{ 
                borderBottom: i < data.length - 1 ? '1px solid var(--color-border)' : 'none',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => onRowClick && (e.currentTarget.style.backgroundColor = 'var(--color-bg-card-hover)')}
              onMouseLeave={(e) => onRowClick && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {columns.map((col, j) => (
                <td key={j} style={{ padding: 'var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
