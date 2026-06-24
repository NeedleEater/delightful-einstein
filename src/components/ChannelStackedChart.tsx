import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Ga4MonthlyChannel } from '../data/caseStudyData';
import { Info } from 'lucide-react';

interface ChannelStackedChartProps {
  channelData: Ga4MonthlyChannel[];
}

type MetricType = 'sessions' | 'engaged_sessions' | 'lead_actions';

export const ChannelStackedChart: React.FC<ChannelStackedChartProps> = ({ channelData }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('sessions');

  const metrics: { id: MetricType; label: string }[] = [
    { id: 'sessions', label: 'Sessions' },
    { id: 'engaged_sessions', label: 'Engaged Sessions' },
    { id: 'lead_actions', label: 'Lead Actions (Conversion)' }
  ];

  // List of channels to display in the stack
  const channels = useMemo(() => {
    const list = new Set<string>();
    channelData.forEach((d) => list.add(d.channel));
    return Array.from(list);
  }, [channelData]);

  // Color mapping for channels
  const channelColors: Record<string, string> = {
    'Organic Search': '#4c5a70', // Primary Dark
    'Paid Search': '#8cd4ff',    // Accent Ice Blue
    'Direct': '#94a3b8',         // Slate Gray
    'Organic Social': '#f43f5e', // Rose
    'Referral': '#10b981',       // Emerald
    'Cross-network': '#8b5cf6',   // Violet
    'Unassigned': '#cbd5e1',     // Light Gray
    'Organic Video': '#f59e0b'   // Amber
  };

  // Convert long format (many entries per month) to wide format (one entry per month)
  const transformedData = useMemo(() => {
    const grouped: Record<string, any> = {};

    channelData.forEach((row) => {
      const { month, month_label, channel, year } = row;
      const value = row[activeMetric] || 0;

      if (!grouped[month]) {
        grouped[month] = {
          month,
          month_label,
          year,
          total: 0
        };
        // Initialize all channels to 0
        channels.forEach((ch) => {
          grouped[month][ch] = 0;
        });
      }

      grouped[month][channel] = value;
      grouped[month].total += value;
    });

    // Sort by month ascending
    return Object.values(grouped).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }, [channelData, activeMetric, channels]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Organic Search Became a More Valuable Part of the Traffic Mix</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare monthly acquisition channels and see how Organic Search driving high intent leads is sustained
          </p>
        </div>

        {/* Metric toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-start lg:self-center">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeMetric === m.id
                  ? 'bg-dq-dark text-white shadow-sm'
                  : 'text-slate-600 hover:text-dq-dark'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[360px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month_label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(val) => val.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
              }}
              labelStyle={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px', fontSize: '12px' }}
              itemStyle={{ fontSize: '11px', padding: '2px 0' }}
              formatter={(value: any, name: any) => [Math.round(value).toLocaleString(), name]}
            />
            <Legend verticalAlign="top" height={40} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            
            {channels.map((channel) => (
              <Bar
                key={channel}
                dataKey={channel}
                stackId="a"
                fill={channelColors[channel] || '#94a3b8'}
                barSize={24}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Caption info callout */}
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-dq-dark flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Key Insight:</strong> Some months saw heavy Paid Search campaigns driving high volume (for example, in <strong>May 2025</strong> when Paid Search generated <strong>1,949</strong> sessions). However, Organic Search remained a remarkably steady and reliable engine, producing <strong>348 sessions</strong>, <strong>238 engaged sessions</strong>, <strong>8 appointment requests</strong>, and <strong>17 calls</strong>. Even as paid budgets fluctuated, organic traffic maintained high conversion efficiency.
        </p>
      </div>
    </div>
  );
};
