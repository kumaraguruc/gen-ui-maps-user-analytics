import React from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { Chart, ChartDataPoint } from '../../types/schema';

interface ChartComponentProps {
  chart: Chart;
  className?: string;
}

interface PieChartLabelProps {
  name: string;
  percent: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chart, className = '' }) => {
  // Apple-inspired colors for charts
  const COLORS = [
    '#0071e3', // Apple blue
    '#8f41e9', // Purple
    '#f54f7a', // Pink
    '#30d158', // Green
    '#5e5ce6', // Blue
    '#ff9f0a', // Orange
    '#64d2ff', // Light blue
    '#bf5af2', // Light purple
    '#ff2d55', // Red
  ];

  // Format data for Recharts
  const data = chart.data.map((item: ChartDataPoint) => ({
    name: item.label,
    value: item.value,
  }));

  // Render different chart types based on the chart.type property
  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#86868b' }}
                tickLine={{ stroke: '#e5e5ea' }}
                axisLine={{ stroke: '#e5e5ea' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fill: '#86868b' }}
                tickLine={{ stroke: '#e5e5ea' }}
                axisLine={{ stroke: '#e5e5ea' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#0071e3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#86868b' }}
                tickLine={{ stroke: '#e5e5ea' }}
                axisLine={{ stroke: '#e5e5ea' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fill: '#86868b' }}
                tickLine={{ stroke: '#e5e5ea' }}
                axisLine={{ stroke: '#e5e5ea' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0071e3" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#0071e3', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#0071e3', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }: PieChartLabelProps) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#86868b' }}
                tickLine={{ stroke: '#e5e5ea' }}
                axisLine={{ stroke: '#e5e5ea' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                tick={{ fill: '#86868b' }}
                tickLine={{ stroke: '#e5e5ea' }}
                axisLine={{ stroke: '#e5e5ea' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0071e3" 
                fill="url(#colorGradient)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071e3" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0071e3" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Unsupported chart type: {chart.type}</p>
          </div>
        );
    }
  };

  return (
    <div className={`chart-container p-4 bg-white rounded-2xl shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">{chart.title}</h3>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
