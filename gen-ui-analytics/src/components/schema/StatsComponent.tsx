import React from 'react';
import type { Stat } from '../../types/schema';

interface StatsComponentProps {
  stats: Stat[];
  className?: string;
}

const StatsComponent: React.FC<StatsComponentProps> = ({ stats, className = '' }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className={`stats-container p-4 bg-white rounded-2xl shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-item p-3 rounded-xl bg-gray-50 border border-gray-100"
          >
            <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsComponent;
