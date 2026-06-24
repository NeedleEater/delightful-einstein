import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import type { Ga4MonthlyChannel } from '../data/caseStudyData';
import { Info } from 'lucide-react';

const CPC_DATA: Record<string, number> = {
  '2024-09': 1.25,
  '2024-10': 1.97,
  '2024-11': 2.52,
  '2024-12': 1.94,
  '2025-01': 1.04,
  '2025-02': 0.75,
  '2025-03': 0.53,
  '2025-04': 0.57,
  '2025-05': 0.62,
  '2025-06': 1.13,
  '2025-07': 1.19,
  '2025-08': 1.49,
  '2025-09': 1.85,
  '2025-10': 2.27,
  '2025-11': 2.68,
  '2025-12': 3.00,
  '2026-01': 2.83,
  '2026-02': 3.03,
  '2026-03': 3.14,
  '2026-04': 3.15,
  '2026-05': 3.33,
  '2026-06': 3.45,
};

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
          total: 0,
          cpc: CPC_DATA[month] || null
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
          <ComposedChart data={transformedData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month_label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(val) => val.toLocaleString()}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#d97706' }}
              tickFormatter={(val) => `$${val.toFixed(2)}`}
              label={{ value: 'Avg. CPC (Paid Ads)', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#d97706', fontWeight: 600 } }}
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
              formatter={(value: any, name: any) => {
                if (name === 'Avg. CPC (Paid Search)') {
                  return [`$${parseFloat(value).toFixed(2)}`, name];
                }
                return [Math.round(value).toLocaleString(), name];
              }}
            />
            <Legend verticalAlign="top" height={40} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            
            {channels.map((channel) => (
              <Bar
                key={channel}
                yAxisId="left"
                dataKey={channel}
                stackId="a"
                fill={channelColors[channel] || '#94a3b8'}
                barSize={24}
              />
            ))}

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cpc"
              stroke="#d97706"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 1, fill: 'white' }}
              name="Avg. CPC (Paid Search)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Caption info callout */}
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-dq-dark flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Key Insight:</strong> The spikes in Paid Search traffic (e.g., early-to-mid 2025) were driven by temporarily low average Cost-Per-Click (CPC) rates, which dipped as low as <strong>$0.53 - $0.75</strong>. However, as Google Ads CPC rates surged over <strong>350%</strong> to peak at <strong>$3.33 - $3.45</strong> by mid-2026, paid traffic became significantly more expensive. In contrast, as the practice's SEO matured, Organic Search became the primary source of steady, high-intent leads and conversions at zero incremental cost—demonstrating superior long-term ROI.
        </p>
      </div>
    </div>
  );
};
