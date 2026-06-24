import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Label
} from 'recharts';
import type { VisibilityMonthlyWide, VisibilityBenchmark } from '../data/caseStudyData';
import { ShieldCheck, HelpCircle } from 'lucide-react';

interface VisibilityLineChartProps {
  chartData: VisibilityMonthlyWide[];
  benchmarks: VisibilityBenchmark[];
}

type TabType = 'traffic' | 'keywords' | 'value';

export const VisibilityLineChart: React.FC<VisibilityLineChartProps> = ({ chartData, benchmarks }) => {
  const [activeTab, setActiveTab] = useState<TabType>('traffic');

  const tabs: { id: TabType; label: string; field: keyof VisibilityMonthlyWide; color: string }[] = [
    { id: 'traffic', label: 'Estimated Organic Traffic', field: 'organic_traffic', color: '#0090e3' },
    { id: 'keywords', label: 'Organic Keywords', field: 'organic_keywords', color: '#10b981' },
    { id: 'value', label: 'Estimated Organic Traffic Value', field: 'organic_traffic_cost', color: '#8b5cf6' }
  ];

  const activeTabConfig = tabs.find((t) => t.id === activeTab)!;

  const formatYAxis = (val: number) => {
    if (activeTab === 'value') return `$${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  const formatTooltip = (val: number) => {
    if (activeTab === 'value') return [`$${val.toLocaleString()}`, 'Estimated Value'];
    if (activeTab === 'traffic') return [val.toLocaleString(), 'Estimated Organic Visits'];
    return [val.toLocaleString(), 'Organic Keywords'];
  };

  // Get benchmark averages depending on the active tab
  const getBenchmarkAvg = (index: number) => {
    const b = benchmarks[index];
    if (!b) return 0;
    if (activeTab === 'traffic') return b.avg_estimated_organic_traffic;
    if (activeTab === 'keywords') return b.avg_organic_keywords;
    return b.avg_estimated_organic_traffic_value;
  };

  const getBenchmarkChange = (index: number) => {
    const b = benchmarks[index];
    if (!b) return 0;
    if (activeTab === 'traffic') return b.traffic_change_vs_pre_client_pct;
    if (activeTab === 'keywords') return b.keywords_change_vs_pre_client_pct;
    return b.traffic_value_change_vs_pre_client_pct;
  };

  const avgPreClient = getBenchmarkAvg(0);
  const avgFirst12 = getBenchmarkAvg(1);
  const avgLatest12 = getBenchmarkAvg(2);

  const changeFirst12 = getBenchmarkChange(1);
  const changeLatest12 = getBenchmarkChange(2);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Organic Visibility Increased After Partnering With DentalQore</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Long-term visibility estimates based on third-party organic search index data
          </p>
        </div>
        
        {/* Metric tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-start xl:self-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-dq-dark shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-dq-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Pre-Client Card */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative overflow-hidden flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pre-Client 12M Benchmark</div>
          <div>
            <span className="text-2xl font-extrabold text-slate-700">
              {activeTab === 'value' ? '$' : ''}
              {Math.round(avgPreClient).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ month avg</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 italic">Historical baseline before partnering with DentalQore</p>
        </div>

        {/* First 12 Months Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-dq-accent/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200 group-hover:bg-dq-accent transition-colors" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">First 12 Months with DentalQore</div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-slate-800">
                {activeTab === 'value' ? '$' : ''}
                {Math.round(avgFirst12).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ month avg</span>
            </div>
            {changeFirst12 !== 0 && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                changeFirst12 > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {changeFirst12 > 0 ? '+' : ''}{changeFirst12}%
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Initial growth period following website launch and SEO initialization</p>
        </div>

        {/* Latest 12 Months Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-dq-accent/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-dq-accent" />
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Latest 12 Month View</div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-extrabold text-slate-800">
                {activeTab === 'value' ? '$' : ''}
                {Math.round(avgLatest12).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ month avg</span>
            </div>
            {changeLatest12 !== 0 && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                changeLatest12 > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {changeLatest12 > 0 ? '+' : ''}{changeLatest12}%
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 font-semibold text-dq-blue flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> High sustained growth over baseline
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[360px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
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
              tickFormatter={formatYAxis}
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
              formatter={(value: any) => formatTooltip(value)}
            />
            
            {/* Benchmark horizontal lines */}
            <ReferenceLine
              y={avgPreClient}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            >
              <Label
                value="Pre-Client Avg"
                position="top"
                fill="#64748b"
                fontSize={9}
                fontWeight={600}
                offset={4}
              />
            </ReferenceLine>

            <ReferenceLine
              y={avgLatest12}
              stroke="#0090e3"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            >
              <Label
                value="Latest 12M Avg"
                position="top"
                fill="#0090e3"
                fontSize={9}
                fontWeight={600}
                offset={4}
              />
            </ReferenceLine>

            <Line
              type="monotone"
              dataKey={activeTabConfig.field}
              name={activeTabConfig.label}
              stroke={activeTabConfig.color}
              strokeWidth={3.5}
              dot={{ r: 3, strokeWidth: 1, fill: 'white' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>The historical organic visibility trend shows the long-term SEO story.</strong> Before the DentalQore period, the domain averaged roughly <strong>{Math.round(benchmarks[0]?.avg_estimated_organic_traffic || 400)}</strong> estimated organic visits per month. During the first 12 months with DentalQore, that average increased to roughly <strong>{Math.round(benchmarks[1]?.avg_estimated_organic_traffic || 615)}</strong> per month. In the latest 12 month view, the average reached roughly <strong>{Math.round(benchmarks[2]?.avg_estimated_organic_traffic || 792)}</strong> per month, nearly <strong>98% higher</strong> than the pre-client benchmark.
        </p>
      </div>
    </div>
  );
};
