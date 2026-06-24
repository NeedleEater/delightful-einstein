import React from 'react';
import { UserPlus, Search, PhoneCall, ArrowRight } from 'lucide-react';

export const Takeaway: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-dq-dark to-slate-800 text-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-700/30 mb-8 relative overflow-hidden print-break-inside-avoid">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-dq-accent/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-dq-accent/5 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-3xl mx-auto text-center mb-10 relative z-10">
        <span className="text-xs font-bold text-dq-accent uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">
          The Specialty Patient Journey
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4">
          Why Search Visibility Matters for Specialty Practices
        </h2>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          For specialized medical and dental practices, being visible at the exact moment a patient needs treatment is key.
          When patients search for specialized services in their area, high search visibility ensures your practice surfaces first.
        </p>
      </div>

      {/* 3-Step Visual Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 relative z-10 mb-8 max-w-5xl mx-auto">
        
        {/* Step 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/15">
            <UserPlus className="w-6 h-6 text-dq-accent" />
          </div>
          <span className="text-xs font-bold text-dq-accent uppercase tracking-wider mb-1">Step 1</span>
          <h3 className="text-base font-bold text-white mb-2">Patient Needs Specialized Care</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            A patient experiences symptoms requiring endodontic treatment (such as tooth pain) or needs to find a highly rated specialist in their area.
          </p>
          <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 text-white/35 z-20">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/15">
            <Search className="w-6 h-6 text-dq-accent" />
          </div>
          <span className="text-xs font-bold text-dq-accent uppercase tracking-wider mb-1">Step 2</span>
          <h3 className="text-base font-bold text-white mb-2">High-Intent Service Search</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instead of relying on brand recognition alone, the practice surfaces at the top of Google when patients search for local services (e.g., "root canal Plano" or "endodontist near me").
          </p>
          <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 text-white/35 z-20">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white/10 border border-dq-accent/30 rounded-2xl p-6 relative flex flex-col items-center text-center shadow-md">
          <div className="w-12 h-12 rounded-xl bg-dq-accent/20 flex items-center justify-center mb-4 border border-dq-accent/35">
            <PhoneCall className="w-6 h-6 text-dq-accent" />
          </div>
          <span className="text-xs font-bold text-dq-accent uppercase tracking-wider mb-1">Step 3</span>
          <h3 className="text-base font-bold text-white mb-2">Direct Patient Inquiry</h3>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            Impressed by the practice's prominent search visibility and authoritative website content, the patient clicks to call or requests an appointment directly, converting into a lead.
          </p>
        </div>

      </div>

      <div className="max-w-3xl mx-auto text-center border-t border-white/10 pt-6 relative z-10 text-xs md:text-sm text-slate-300 leading-relaxed">
        <strong>DentalQore</strong> helped North Texas Endodontic Associates maximize search visibility, capturing high-intent traffic directly from search engines and driving more direct patient inquiries.
      </div>
    </div>
  );
};
