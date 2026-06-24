import { useState, useMemo } from 'react';
import { caseStudyData } from './data/caseStudyData';
import { KpiCard } from './components/KpiCard';
import { TimeframeControls } from './components/TimeframeControls';
import type { ViewMode, MetricFamily, YearFilter } from './components/TimeframeControls';
import { ComboTrendChart } from './components/ComboTrendChart';
import { VisibilityLineChart } from './components/VisibilityLineChart';
import { ChannelStackedChart } from './components/ChannelStackedChart';
import { QualityComparisonChart } from './components/QualityComparisonChart';
import { MonthlyDataTable } from './components/MonthlyDataTable';
import { Timeline } from './components/Timeline';
import { Takeaway } from './components/Takeaway';

import {
  TrendingUp,
  Award,
  Users,
  MousePointerClick,
  CheckCircle,
  FileBarChart,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';

function App() {
  // Global Filter States
  const [viewMode, setViewMode] = useState<ViewMode>('Overall');
  const [metricFamily, setMetricFamily] = useState<MetricFamily>('Traffic');
  const [yearFilter, setYearFilter] = useState<YearFilter>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    metadata,
    ga4_monthly_channel,
    organic_monthly_summary,
    visibility_monthly_wide,
    visibility_benchmarks,
    ga4_period_summary,
    key_callouts
  } = caseStudyData;

  // Available months for selector based on current year filter
  const availableMonths = useMemo(() => {
    return organic_monthly_summary
      .filter((d) => yearFilter === 'All' || d.year.toString() === yearFilter)
      .map((d) => ({
        value: d.month,
        label: d.month_label
      }));
  }, [organic_monthly_summary, yearFilter]);

  // If year filter changes, ensure selectedMonth is still valid
  const handleYearChange = (newYear: YearFilter) => {
    setYearFilter(newYear);
    setSelectedMonth('All');
  };

  // Filter ga4_monthly_channel data based on year/month
  const filteredChannelData = useMemo(() => {
    let result = ga4_monthly_channel;

    if (viewMode === 'Overall') {
      return result;
    }

    if (yearFilter !== 'All') {
      result = result.filter((d) => d.year.toString() === yearFilter);
    }

    if (viewMode === 'Monthly' && selectedMonth !== 'All') {
      result = result.filter((d) => d.month === selectedMonth);
    }

    return result;
  }, [ga4_monthly_channel, viewMode, yearFilter, selectedMonth]);

  // Filter organic_monthly_summary data based on year
  const filteredOrganicSummary = useMemo(() => {
    let result = organic_monthly_summary;

    if (viewMode === 'Overall') {
      return result;
    }

    if (yearFilter !== 'All') {
      result = result.filter((d) => d.year.toString() === yearFilter);
    }

    return result;
  }, [organic_monthly_summary, viewMode, yearFilter]);

  // Filter visibility_monthly_wide data based on year
  const filteredVisibilityData = useMemo(() => {
    let result = visibility_monthly_wide;

    if (viewMode === 'Overall') {
      return result;
    }

    if (yearFilter !== 'All') {
      result = result.filter((d) => {
        // e.g. "2024-09" starts with "2024"
        return d.month.startsWith(yearFilter);
      });
    }

    return result;
  }, [visibility_monthly_wide, viewMode, yearFilter]);

  // Dynamic KPI calculations based on selected timeframe
  const currentKpis = useMemo(() => {
    // Default to overall period summary
    if (viewMode === 'Overall') {
      const overall = ga4_period_summary.find((p) => p.period === 'Overall GA4 Period');
      return {
        sessions: overall?.organic_sessions || 7096,
        engagedSessions: overall?.organic_engaged_sessions || 4600,
        leadActions: overall?.organic_lead_actions || 412,
        share: overall?.organic_share_of_lead_actions_pct || 42.56,
        engagementRate: overall?.organic_weighted_engagement_rate_pct || 64.83
      };
    }

    // Dynamic calculations for filtered datasets
    let targetSummary = filteredChannelData.filter((d) => d.channel === 'Organic Search');
    
    // Sum stats
    const sessions = targetSummary.reduce((sum, d) => sum + d.sessions, 0);
    const engagedSessions = targetSummary.reduce((sum, d) => sum + d.engaged_sessions, 0);
    const leadActions = targetSummary.reduce((sum, d) => sum + d.lead_actions, 0);
    
    // Get total lead actions for share calculation
    const totalLeadActions = filteredChannelData.reduce((sum, d) => sum + d.lead_actions, 0);
    const share = totalLeadActions > 0 ? (leadActions / totalLeadActions) * 100 : 0;
    const engagementRate = sessions > 0 ? (engagedSessions / sessions) * 100 : 0;

    return {
      sessions,
      engagedSessions,
      leadActions,
      share,
      engagementRate
    };
  }, [filteredChannelData, viewMode, ga4_period_summary]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-dq-accent/35">
      {/* Sticky top navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dq-dark text-white font-extrabold text-lg select-none">
                Q
              </div>
              <span className="text-sm font-extrabold tracking-tight text-slate-800 uppercase">
                Dental<span className="text-dq-blue">Qore</span>
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {(['Overview', 'Trends', 'Channel-Mix', 'Data-Table', 'Takeaway'] as const).map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-dq-dark transition-colors duration-200"
                >
                  {link.replace('-', ' ')}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('cta')}
                className="ml-3 px-4 py-2 bg-dq-dark text-white hover:bg-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
              >
                Request Review
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-dq-dark p-2"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 flex flex-col gap-2 shadow-inner">
            {(['Overview', 'Trends', 'Channel-Mix', 'Data-Table', 'Takeaway'] as const).map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50"
              >
                {link.replace('-', ' ')}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('cta')}
              className="w-full text-center mt-2 py-2.5 bg-dq-dark text-white hover:bg-slate-700 rounded-xl text-xs font-semibold"
            >
              Request Review
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative bg-white pt-12 pb-16 border-b border-slate-100 overflow-hidden">
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-5">
                <Sparkles className="w-3.5 h-3.5 text-dq-dark" /> Organic Growth Case Study
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                How DentalQore Helped North Texas Endodontic Associates Build Search Visibility Over Time
              </h1>
              
              <p className="text-sm md:text-base text-slate-500 mt-5 leading-relaxed max-w-2xl">
                A data-driven look at how a Plano, TX endodontic practice strengthened organic visibility, 
                improved website engagement, and converted high-intent search traffic into calls and appointment requests.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => scrollToSection('cta')}
                  className="px-6 py-3.5 bg-dq-dark hover:bg-slate-700 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Request a Growth Review
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('trends')}
                  className="px-6 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl text-xs font-bold shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Performance Data
                </button>
              </div>
            </div>

            {/* Right side KPI Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KpiCard
                label="Organic Sessions"
                value={currentKpis.sessions}
                animate={viewMode === 'Overall'}
                icon={<Users className="w-5 h-5" />}
                description="Total organic search traffic sessions"
              />
              <KpiCard
                label="Engaged Sessions"
                value={currentKpis.engagedSessions}
                animate={viewMode === 'Overall'}
                icon={<TrendingUp className="w-5 h-5" />}
                description="Organic sessions with high engagement"
              />
              <KpiCard
                label="Lead Actions"
                value={currentKpis.leadActions}
                animate={viewMode === 'Overall'}
                icon={<PhoneCall className="w-5 h-5" />}
                description="Appointment requests + Click-to-calls"
              />
              <KpiCard
                label="Organic Lead Share"
                value={currentKpis.share}
                isPercent={true}
                animate={viewMode === 'Overall'}
                icon={<MousePointerClick className="w-5 h-5" />}
                description="Share of total website lead actions"
              />
              <div className="sm:col-span-2 text-center mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400">
                  ⚡ Hero KPIs represent the <strong className="text-slate-600">{viewMode}</strong> view. Use the dashboard controls below to filter.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Dashboard Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-6">
        <TimeframeControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          metricFamily={metricFamily}
          setMetricFamily={setMetricFamily}
          yearFilter={yearFilter}
          setYearFilter={handleYearChange}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          availableMonths={availableMonths}
        />
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        {/* Dynamic Sections Based on Focus Toggle */}
        
        {/* Focus: Traffic / Trends */}
        {metricFamily === 'Traffic' && (
          <div id="trends" className="animate-fadeIn">
            <ComboTrendChart data={filteredOrganicSummary} />
          </div>
        )}

        {/* Focus: Engagement */}
        {metricFamily === 'Engagement' && (
          <div id="engagement" className="animate-fadeIn">
            {/* Show quality comparisons focusing on engagement */}
            <QualityComparisonChart channelData={filteredChannelData} />
            <ComboTrendChart data={filteredOrganicSummary} />
          </div>
        )}

        {/* Focus: Lead Actions */}
        {metricFamily === 'Lead Actions' && (
          <div id="leads" className="animate-fadeIn">
            <ComboTrendChart data={filteredOrganicSummary} />
            <Takeaway />
          </div>
        )}

        {/* Focus: Organic Visibility */}
        {metricFamily === 'Organic Visibility' && (
          <div id="visibility" className="animate-fadeIn">
            <VisibilityLineChart
              chartData={filteredVisibilityData}
              benchmarks={visibility_benchmarks}
            />
          </div>
        )}

        {/* Focus: Channel Comparison */}
        {metricFamily === 'Channel Comparison' && (
          <div id="channel-mix" className="animate-fadeIn">
            <ChannelStackedChart channelData={filteredChannelData} />
            <QualityComparisonChart channelData={filteredChannelData} />
          </div>
        )}

        {/* Section divider and additional components shown in secondary layers */}
        
        {/* SEO Growth Timeline */}
        <div className="mt-8">
          <Timeline milestones={key_callouts} />
        </div>

        {/* Specialty Practice Takeaway Visual Flow */}
        <div id="takeaway" className="mt-8">
          <Takeaway />
        </div>

        {/* Interactive Monthly Data Table */}
        <div id="data-table" className="mt-8">
          <MonthlyDataTable data={organic_monthly_summary} />
        </div>

        {/* Overall Impact Summary Section (emphasizing overall trends at the end) */}
        <section id="impact" className="mt-16 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm print-break-inside-avoid">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Overall Program Impact</h2>
            <p className="text-sm text-slate-400 mt-2">
              Sustained organic performance summary across the entire GA4 and third-party visibility reporting period
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
              <span className="text-2xl font-extrabold text-dq-dark block">7,096</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Organic Sessions</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
              <span className="text-2xl font-extrabold text-dq-dark block">4,600</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Engaged Sessions</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
              <span className="text-2xl font-extrabold text-dq-dark block">412</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Lead Actions</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
              <span className="text-2xl font-extrabold text-dq-dark block">~43%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Lead Share</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center sm:col-span-2 lg:col-span-1">
              <span className="text-2xl font-extrabold text-emerald-600 block">+98%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Traffic vs. Pre-Client</span>
            </div>
          </div>
        </section>

        {/* Final CTA section */}
        <section id="cta" className="mt-12 bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden print-break-inside-avoid">
          {/* Accent decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-dq-accent" />
          
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Want to See What Organic Growth Could Look Like for Your Practice?
            </h2>
            <p className="text-sm text-slate-300 mt-4 leading-relaxed">
              DentalQore helps dental and specialty practices build stronger websites, improve search visibility, 
              and turn high-intent visitors into measurable patient opportunities.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="w-full sm:w-auto px-6 py-3.5 bg-dq-accent hover:bg-sky-200 text-dq-dark rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                Request a Growth Review
              </button>
              <button className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer">
                View More Case Studies
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-dq-dark text-white font-extrabold text-lg select-none">
                  Q
                </div>
                <span className="text-sm font-extrabold tracking-tight text-slate-800 uppercase">
                  Dental<span className="text-dq-blue">Qore</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering dental and specialty practices with state-of-the-art websites, SEO visibility, and patient acquisition growth tools.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Our Services</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
                <li><a href="#" className="hover:text-dq-dark">Custom Website Design</a></li>
                <li><a href="#" className="hover:text-dq-dark">Search Engine Optimization</a></li>
                <li><a href="#" className="hover:text-dq-dark">Patient Acquisition Tools</a></li>
                <li><a href="#" className="hover:text-dq-dark">Analytics &amp; ROI Dashboards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Case Studies</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
                <li><a href="#" className="hover:text-dq-dark">NTEA Plano Case Study</a></li>
                <li><a href="#" className="hover:text-dq-dark">General Dentistry Growth</a></li>
                <li><a href="#" className="hover:text-dq-dark">Pediatric Dental Visibility</a></li>
                <li><a href="#" className="hover:text-dq-dark">Orthodontic Conversion Stats</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Practice Details</h4>
              <div className="text-xs text-slate-400 flex flex-col gap-2">
                <div><strong>Practice:</strong> {metadata.practice}</div>
                <div><strong>Location:</strong> {metadata.location}</div>
                <div><strong>Specialty:</strong> {metadata.specialty}</div>
                <div><strong>Domain:</strong> <a href={`https://${metadata.domain}`} target="_blank" rel="noopener noreferrer" className="text-dq-blue hover:underline">{metadata.domain}</a></div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <span className="text-[10px] text-slate-400">
              &copy; {new Date().getFullYear()} DentalQore. All rights reserved.
            </span>
            <p className="text-[9px] text-slate-400 max-w-3xl leading-relaxed lg:text-right">
              <strong>Disclaimer:</strong> Results are based on available GA4 reporting and third-party organic visibility estimates. Performance may vary by market, competition, budget, and practice goals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
