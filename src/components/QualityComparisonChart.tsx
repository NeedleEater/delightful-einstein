import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import type { Ga4MonthlyChannel } from '../data/caseStudyData';
import { Sparkles, Info } from 'lucide-react';

interface QualityComparisonChartProps {
  channelData: Ga4MonthlyChannel[];
}

type QualityMetric = 'engagement_rate_pct' | 'avg_engagement_seconds' | 'session_key_event_rate_pct' | 'lead_actions';

export const QualityComparisonChart: React.FC<QualityComparisonChartProps> = ({ channelData }) => {
  const [activeMetric, setActiveMetric] = useState<QualityMetric>('engagement_rate_pct');

  const metrics: { id: QualityMetric; label: string; suffix: string }[] = [
    { id: 'engagement_rate_pct', label: 'Engagement Rate', suffix: '%' },
    { id: 'avg_engagement_seconds', label: 'Avg. Engagement Time', suffix: 's' },
    { id: 'session_key_event_rate_pct', label: 'Session Key Event Rate', suffix: '%' },
    { id: 'lead_actions', label: 'Total Lead Actions', suffix: '' }
  ];

  const targetChannels = ['Organic Search', 'Paid Search', 'Direct'];

  const channelColors: Record<string, string> = {
    'Organic Search': '#4c5a70', // Primary Dark
    'Paid Search': '#8cd4ff',    // Accent Ice Blue
    'Direct': '#94a3b8'          // Slate Gray
  };

  // Aggregate metrics for target channels based on whatever subset of data is passed in
  const aggregatedData = useMemo(() => {
    const channelStats: Record<string, {
      sessions: number;
      engaged_sessions: number;
      lead_actions: number;
      engagement_seconds_weighted_sum: number;
    }> = {};

    targetChannels.forEach((ch) => {
      channelStats[ch] = {
        sessions: 0,
        engaged_sessions: 0,
        lead_actions: 0,
        engagement_seconds_weighted_sum: 0
      };
    });

    // Populate sums
    channelData.forEach((row) => {
      if (targetChannels.includes(row.channel)) {
        const stats = channelStats[row.channel];
        stats.sessions += row.sessions || 0;
        stats.engaged_sessions += row.engaged_sessions || 0;
        stats.lead_actions += row.lead_actions || 0;
        stats.engagement_seconds_weighted_sum += (row.avg_engagement_seconds || 0) * (row.sessions || 0);
      }
    });

    // Calculate rates
    return targetChannels.map((ch) => {
      const stats = channelStats[ch];
      const sessions = stats.sessions || 1; // avoid divide by zero
      
      const engagement_rate_pct = (stats.engaged_sessions / sessions) * 100;
      const session_key_event_rate_pct = (stats.lead_actions / sessions) * 100;
      const avg_engagement_seconds = stats.engagement_seconds_weighted_sum / sessions;
      const lead_actions = stats.lead_actions;

      return {
        channel: ch,
        engagement_rate_pct,
        session_key_event_rate_pct,
        avg_engagement_seconds,
        lead_actions,
        sessions: stats.sessions
      };
    });
  }, [channelData]);

  const activeMetricConfig = metrics.find((m) => m.id === activeMetric)!;

  const formatValue = (val: number) => {
    if (activeMetric === 'lead_actions') return Math.round(val).toLocaleString();
    if (activeMetric === 'avg_engagement_seconds') return `${Math.round(val)}s`;
    return `${val.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Organic Traffic Was Not Just Traffic. It Was High Intent Traffic.</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare traffic quality metrics between Organic Search, Paid Search, and Direct
          </p>
        </div>

        {/* Quality Metric Selector */}
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl w-fit">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeMetric === m.id
                  ? 'bg-white text-dq-dark shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-dq-dark'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metric Comparison Chart */}
        <div className="lg:col-span-2 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aggregatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="channel"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(val) => `${val}${activeMetricConfig.suffix}`}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }}
                formatter={(value: any) => [formatValue(value), activeMetricConfig.label]}
              />
              <Bar dataKey={activeMetric} barSize={40} radius={[6, 6, 0, 0]}>
                {aggregatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={channelColors[entry.channel]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown insights */}
        <div className="flex flex-col justify-center gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-dq-dark" /> Quality Breakdown
          </h4>
          
          <div className="flex flex-col gap-3">
            {aggregatedData.map((d) => (
              <div key={d.channel} className="flex justify-between items-center py-2 border-b border-slate-200/50 last:border-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: channelColors[d.channel] }}
                  />
                  <span className="text-xs font-semibold text-slate-700">{d.channel}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">{formatValue(d[activeMetric])}</span>
                  <div className="text-[9px] text-slate-400">
                    {d.sessions.toLocaleString()} sessions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50/50 p-3 rounded-xl">
        <Info className="w-4 h-4 text-dq-dark flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>For a specialty practice, quality matters more than raw website volume.</strong> Organic Search repeatedly produced strong engagement rates and conversion activity because users searching for endodontic specialties are typically in immediate need of treatment or looking to validate a doctor referral.
        </p>
      </div>
    </div>
  );
};
