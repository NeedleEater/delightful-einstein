import React from 'react';
import { Calendar, Filter, BarChart3, Clock } from 'lucide-react';

export type ViewMode = 'Monthly' | 'Yearly' | 'Overall';
export type MetricFamily = 'Traffic' | 'Engagement' | 'Lead Actions' | 'Organic Visibility' | 'Channel Comparison';
export type YearFilter = 'All' | '2024' | '2025' | '2026';

interface TimeframeControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  metricFamily: MetricFamily;
  setMetricFamily: (family: MetricFamily) => void;
  yearFilter: YearFilter;
  setYearFilter: (year: YearFilter) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: { value: string; label: string }[];
}

export const TimeframeControls: React.FC<TimeframeControlsProps> = ({
  viewMode,
  setViewMode,
  metricFamily,
  setMetricFamily,
  yearFilter,
  setYearFilter,
  selectedMonth,
  setSelectedMonth,
  availableMonths
}) => {
  const metricFamilies: { value: MetricFamily; label: string }[] = [
    { value: 'Traffic', label: 'Traffic & Sessions' },
    { value: 'Engagement', label: 'User Engagement' },
    { value: 'Lead Actions', label: 'Lead Actions (Calls/Form)' },
    { value: 'Organic Visibility', label: 'Organic Visibility' },
    { value: 'Channel Comparison', label: 'Traffic Mix (GA4)' }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-8 sticky top-16 z-30 glassmorphism no-print">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Timeframe
          </span>
          <div className="bg-slate-100 p-1 rounded-xl flex w-full sm:w-auto">
            {(['Monthly', 'Yearly', 'Overall'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  viewMode === mode
                    ? 'bg-dq-dark text-white shadow-sm'
                    : 'text-slate-600 hover:text-dq-dark'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Family Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Analysis Focus
          </span>
          <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl w-full">
            {metricFamilies.map((family) => (
              <button
                key={family.value}
                onClick={() => setMetricFamily(family.value)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  metricFamily === family.value
                    ? 'bg-white text-dq-dark shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {family.label}
              </button>
            ))}
          </div>
        </div>

        {/* Year Filter & Month Selector */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Year Filter (Hide if Overall view is selected or visibility metric family is selected, which is long-term) */}
          {viewMode !== 'Overall' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Year
              </span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value as YearFilter)}
                className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-dq-accent focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">All Years</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          )}

          {/* Month Selector (Only visible in Monthly view) */}
          {viewMode === 'Monthly' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Month
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-dq-accent focus:bg-white transition-all cursor-pointer max-w-[150px]"
              >
                <option value="All">All Months</option>
                {availableMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
