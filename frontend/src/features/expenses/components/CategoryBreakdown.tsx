import type { CategorySummary } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryBreakdownProps {
  data: CategorySummary[];
  title: string;
}

// Pastel Slush colors
const COLORS = ['#4da2ff', '#55db9c', '#ffd731', '#e9ccff', '#fb4903', '#cccccc'];

export default function CategoryBreakdown({ data, title }: CategoryBreakdownProps) {
  if (!data || data.length === 0) {
    return (
      <div className="pv-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>{title}</h3>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
          No data available
        </div>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map(item => ({
    name: item.category,
    value: item.amount
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="pv-card" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>{title}</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--color-carbon)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => formatCurrency(Number(value))}
              contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-carbon)', fontWeight: 'bold' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
