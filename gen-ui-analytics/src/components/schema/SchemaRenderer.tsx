import React from 'react';
import type { UserProfileData } from '../../types/schema';
import MapComponent from './MapComponent';
import ChartComponent from './ChartComponent';
import StatsComponent from './StatsComponent';

interface SchemaRendererProps {
  data: UserProfileData;
  className?: string;
}

const SchemaRenderer: React.FC<SchemaRendererProps> = ({ data, className = '' }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }
  console.log('20');
  return (
    <div className={`schema-renderer space-y-6 ${className}`}>
      {/* Display message if present */}
      {data.message && (
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <p className="text-gray-700">{data.message}</p>
        </div>
      )}

      {/* Display map if present */}
      {data.map && (
        <MapComponent
          key={`map-${JSON.stringify(data.map.data)}`}
          mapData={data.map}
        />
      )}

      {/* Display stats if present */}
      {data.stats && data.stats.length > 0 && (
        <StatsComponent stats={data.stats} />
      )}

      {/* Display charts if present */}
      {data.charts && data.charts.length > 0 && (
        <div className="charts-container space-y-6">
          {data.charts.map((chart, index) => (
            <ChartComponent key={index} chart={chart} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemaRenderer;
