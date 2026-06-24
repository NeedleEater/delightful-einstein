import { useState, useMemo } from 'react';
import { caseStudyData } from './data/caseStudyData';
import { KpiCard } from './components/KpiCard';
import { ComboTrendChart } from './components/ComboTrendChart';
import { VisibilityLineChart } from './components/VisibilityLineChart';
import { ChannelStackedChart } from './components/ChannelStackedChart';
import { QualityComparisonChart } from './components/QualityComparisonChart';
import { Timeline } from './components/Timeline';
import { Takeaway } from './components/Takeaway';

import {
  TrendingUp,
  Award,
  MousePointerClick,
  ArrowRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

interface KpiData {
  label: string;
  value: number;
  isPercent?: boolean;
  prefix?: string;
  suffix?: string;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description: string;
  icon: React.ReactNode;
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    metadata,
    ga4_monthly_channel,
    organic_monthly_summary,
    visibility_monthly_wide,
    visibility_benchmarks,
    key_callouts
  } = caseStudyData;

  // Hero KPI cards focusing on overall growth and comparisons
  const kpis = useMemo<KpiData[]>(() => {
    return [
      {
        label: 'Search Visibility Growth',
        value: 98,
        isPercent: false,
        prefix: '+',
        suffix: '%',
        changeText: 'Top-Tier Growth',
        changeType: 'positive',
        description: 'Latest 12 Month Avg vs. Pre-Client Benchmark (792 vs. 400 visits/mo)',
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        label: 'Year 1 Traffic Growth',
        value: 54,
        isPercent: false,
        prefix: '+',
        suffix: '%',
        changeText: 'Steady Ramp',
        changeType: 'positive',
        description: 'DentalQore Year 1 Avg vs. Pre-Client Benchmark (615 vs. 400 visits/mo)',
        icon: <Award className="w-5 h-5" />
      },
      {
        label: 'Organic Lead Share',
        value: 42.56,
        isPercent: true,
        changeText: 'Primary Traffic Channel',
        changeType: 'positive',
        description: 'Organic search share of all tracked patient inquiries',
        icon: <MousePointerClick className="w-5 h-5" />
      },
      {
        label: 'Peak Conversion Rate',
        value: 11.22,
        isPercent: true,
        changeText: '2.4x Baseline Rate',
        changeType: 'positive',
        description: 'Peak organic session key event rate (May 2026)',
        icon: <Sparkles className="w-5 h-5" />
      }
    ];
  }, []);

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
            {/* Top Left: Real Logo on black box background */}
            <div className="px-3.5 py-2 bg-slate-950 rounded-xl flex items-center justify-center shadow-sm select-none border border-slate-800/40">
              <img src="/dentalqore-logo.png" alt="DentalQore" className="h-4 w-auto object-contain" />
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1">
                {(['Overview', 'Visibility', 'Trends', 'Channel-Mix', 'Takeaway'] as const).map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-dq-dark transition-colors duration-200"
                  >
                    {link.replace('-', ' ')}
                  </button>
                ))}
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
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 flex flex-col gap-2 shadow-inner">
            {(['Overview', 'Visibility', 'Trends', 'Channel-Mix', 'Takeaway'] as const).map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase())}
                className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50"
              >
                {link.replace('-', ' ')}
              </button>
            ))}
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
                  onClick={() => scrollToSection('visibility')}
                  className="px-6 py-3.5 bg-dq-dark hover:bg-slate-700 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Explore Performance Data
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right side KPI Cards */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kpis.map((kpi, index) => (
                <KpiCard
                  key={index}
                  label={kpi.label}
                  value={kpi.value}
                  isPercent={kpi.isPercent}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  changeText={kpi.changeText}
                  changeType={kpi.changeType}
                  animate={true}
                  icon={kpi.icon}
                  description={kpi.description}
                />
              ))}
              <div className="sm:col-span-2 text-center mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400">
                  ⚡ Hero KPIs reflect the overall impact of the DentalQore SEO program. Scroll down to explore trends.
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full pt-12">
        {/* Visibility Chart Section */}
        <section id="visibility" className="mb-12 scroll-mt-20">
          <VisibilityLineChart
            chartData={visibility_monthly_wide}
            benchmarks={visibility_benchmarks}
          />
        </section>

        {/* Monthly SEO Trend Section */}
        <section id="trends" className="mb-12 scroll-mt-20">
          <ComboTrendChart data={organic_monthly_summary} />
        </section>

        {/* Channel Mix Section */}
        <section id="channel-mix" className="mb-12 scroll-mt-20">
          <ChannelStackedChart channelData={ga4_monthly_channel} />
        </section>

        {/* Quality Comparison Section */}
        <section className="mb-12">
          <QualityComparisonChart channelData={ga4_monthly_channel} />
        </section>

        {/* SEO Growth Timeline */}
        <section className="mb-12">
          <Timeline milestones={key_callouts} />
        </section>

        {/* Specialty Practice Takeaway Visual Flow */}
        <section id="takeaway" className="mb-12 scroll-mt-20">
          <Takeaway />
        </section>

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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-4">
              {/* Footer: Real Logo on black box background */}
              <div className="px-3.5 py-2 bg-slate-950 rounded-xl flex items-center justify-center shadow-sm select-none border border-slate-800/40 w-fit mb-3">
                <img src="/dentalqore-logo.png" alt="DentalQore" className="h-4 w-auto object-contain" />
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
