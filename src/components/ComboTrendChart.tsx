import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot
} from 'recharts';
import type { OrganicMonthlySummary } from '../data/caseStudyData';
import { ArrowUpRight, TrendingUp, Info } from 'lucide-react';

interface ComboTrendChartProps {
  data: OrganicMonthlySummary[];
}

type ChartMetric =
  | 'organic_sessions'
  | 'organic_engaged_sessions'
  | 'organic_appointment_requests'
  | 'organic_click_to_call'
  | 'organic_lead_actions'
  | 'organic_engagement_rate_pct'
  | 'organic_session_key_event_rate_pct';

export const ComboTrendChart: React.FC<ComboTrendChartProps> = ({ data }) => {
  const [primaryMetric, setPrimaryMetric] = useState<ChartMetric>('organic_sessions');
  const [secondaryMetric, setSecondaryMetric] = useState<ChartMetric>('organic_lead_actions');

  const metricLabels: Record<ChartMetric, string> = {
    organic_sessions: 'Sessions',
    organic_engaged_sessions: 'Engaged Sessions',
    organic_appointment_requests: 'Appointment Requests',
    organic_click_to_call: 'Click-to-Call Actions',
    organic_lead_actions: 'Total Lead Actions',
    organic_engagement_rate_pct: 'Engagement Rate (%)',
    organic_session_key_event_rate_pct: 'Key Event Rate (%)'
  };

  const metricColors: Record<ChartMetric, string> = {
    organic_sessions: '#4c5a70',
    organic_engaged_sessions: '#6b7280',
    organic_appointment_requests: '#10b981',
    organic_click_to_call: '#f59e0b',
    organic_lead_actions: '#8cd4ff',
    organic_engagement_rate_pct: '#3b82f6',
    organic_session_key_event_rate_pct: '#8b5cf6'
  };

  const isPercent = (metric: ChartMetric) => {
    return metric.endsWith('_pct');
  };

  const formatYAxis = (value: number, metric: ChartMetric) => {
    if (isPercent(metric)) return `${value}%`;
    return value.toLocaleString();
  };

  const formatTooltipValue = (value: number, metric: ChartMetric) => {
    if (isPercent(metric)) return [`${value.toFixed(2)}%`, metricLabels[metric]];
    return [Math.round(value).toLocaleString(), metricLabels[metric]];
  };

  // Find data points for annotations
  const baselinePoint = data.find((d) => d.month === '2024-09');
  const feb2026Point = data.find((d) => d.month === '2026-02');
  const may2026Point = data.find((d) => d.month === '2026-05');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Organic Search Performance Month by Month</h2>
          <p className="text-sm text-slate-400 mt-0.5">Explore baseline metrics, growth, and conversion efficiency over time</p>
        </div>
        
        {/* Metric selection controls */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bars (Primary):</span>
            <select
              value={primaryMetric}
              onChange={(e) => setPrimaryMetric(e.target.value as ChartMetric)}
              className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-dq-accent focus:bg-white transition-all cursor-pointer"
            >
              {Object.keys(metricLabels).map((key) => (
                <option key={key} value={key}>
                  {metricLabels[key as ChartMetric]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Line (Secondary):</span>
            <select
              value={secondaryMetric}
              onChange={(e) => setSecondaryMetric(e.target.value as ChartMetric)}
              className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-dq-accent focus:bg-white transition-all cursor-pointer"
            >
              {Object.keys(metricLabels).map((key) => (
                <option key={key} value={key}>
                  {metricLabels[key as ChartMetric]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart View */}
        <div className="lg:col-span-3 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                tickFormatter={(val) => formatYAxis(val, primaryMetric)}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(val) => formatYAxis(val, secondaryMetric)}
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
                formatter={(value: any, name: any, props: any) => {
                  const metric = props.dataKey as ChartMetric;
                  return formatTooltipValue(value, metric);
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              
              <Bar
                yAxisId="left"
                dataKey={primaryMetric}
                name={metricLabels[primaryMetric]}
                fill={metricColors[primaryMetric]}
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey={secondaryMetric}
                name={metricLabels[secondaryMetric]}
                stroke={metricColors[secondaryMetric]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: 'white' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Milestone Callout Panel */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-dq-dark" /> Performance Callouts
            </h4>

            {/* Callout 1 */}
            {baselinePoint && (
              <div className="p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sep 2024 (Baseline)</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-600">Start</span>
                </div>
                <div className="text-xs font-bold text-slate-700">297 Sessions</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  14 lead actions ({baselinePoint.organic_appointment_requests} requests, {baselinePoint.organic_click_to_call} calls) • {baselinePoint.organic_engagement_rate_pct}% engagement
                </div>
              </div>
            )}

            {/* Callout 2 */}
            {feb2026Point && (
              <div className="p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Feb 2026</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-dq-accent/20 text-dq-blue rounded flex items-center gap-0.5">
                    Growth <ArrowUpRight className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700">369 Sessions</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  30 lead actions (4 requests, 26 calls) • 8.67% conversion efficiency
                </div>
              </div>
            )}

            {/* Callout 3 */}
            {may2026Point && (
              <div className="p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">May 2026</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded flex items-center gap-0.5">
                    Peak Efficiency
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700">303 Sessions</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  18 lead actions • 11.22% session key event (conversion) rate
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50/50 p-3 rounded-xl">
        <Info className="w-4 h-4 text-dq-dark flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Organic performance is best understood over time.</strong> For North Texas Endodontic Associates, Organic Search consistently generated engaged visitors and meaningful patient actions across the reporting period.
        </p>
      </div>
    </div>
  );
};
