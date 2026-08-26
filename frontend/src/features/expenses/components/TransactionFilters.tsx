import type { TransactionFilters as FilterParams, TransactionType, TransactionCategory } from '../types';

interface TransactionFiltersProps {
  filters: FilterParams;
  onChange: (filters: FilterParams) => void;
}

const ALL_CATEGORIES: TransactionCategory[] = [
  'SALARY', 'FREELANCE', 'BUSINESS', 'SCHOLARSHIP', 'GIFT',
  'FOOD', 'TRANSPORT', 'EDUCATION', 'SHOPPING', 'BILLS', 
  'ENTERTAINMENT', 'HEALTHCARE', 'TRAVEL', 'OTHER', 'INCOME_OTHER'
];

export default function TransactionFilters({ filters, onChange }: TransactionFiltersProps) {
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      type: val ? (val as TransactionType) : undefined,
      category: undefined // Reset category when type changes
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      category: val ? (val as TransactionCategory) : undefined
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({
      ...filters,
      [field]: val || undefined
    });
  };

  const getFilteredCategories = () => {
    if (filters.type === 'INCOME') {
      return ['SALARY', 'FREELANCE', 'BUSINESS', 'SCHOLARSHIP', 'GIFT', 'INCOME_OTHER'];
    } else if (filters.type === 'EXPENSE') {
      return ['FOOD', 'TRANSPORT', 'EDUCATION', 'SHOPPING', 'BILLS', 'ENTERTAINMENT', 'HEALTHCARE', 'TRAVEL', 'OTHER'];
    }
    return ALL_CATEGORIES;
  };

  const inputStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--color-carbon)',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 'var(--font-weight-bold)',
    background: 'var(--surface-paper-white)'
  };

  return (
    <div className="pv-card" style={{ padding: '16px 24px', marginBottom: '24px', background: 'var(--color-soft-mist)' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Type</label>
          <select value={filters.type || ''} onChange={handleTypeChange} style={inputStyle}>
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Category</label>
          <select value={filters.category || ''} onChange={handleCategoryChange} style={inputStyle}>
            <option value="">All Categories</option>
            {getFilteredCategories().map(cat => (
              <option key={cat} value={cat}>{cat === 'INCOME_OTHER' ? 'OTHER' : cat}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>From</label>
          <input 
            type="date" 
            value={filters.startDate || ''} 
            onChange={handleDateChange('startDate')}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>To</label>
          <input 
            type="date" 
            value={filters.endDate || ''} 
            onChange={handleDateChange('endDate')}
            style={inputStyle}
          />
        </div>

      </div>
    </div>
  );
}
