import React from 'react';
import { KeyCallout } from '../data/caseStudyData';
import { Calendar, Award, Star, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react';

interface TimelineProps {
  milestones: KeyCallout[];
}

export const Timeline: React.FC<TimelineProps> = ({ milestones }) => {
  // Sort milestones by sort_order
  const sortedMilestones = [...milestones].sort((a, b) => a.sort_order - b.sort_order);

  const getMilestoneIcon = (sortOrder: number) => {
    switch (sortOrder) {
      case 1: return <Star className="w-5 h-5 text-amber-500" />;
      case 2: return <ArrowUpRight className="w-5 h-5 text-dq-blue" />;
      case 3: return <Award className="w-5 h-5 text-indigo-500" />;
      case 4: return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 5: return <CheckCircle className="w-5 h-5 text-dq-accent bg-dq-dark rounded-full" />;
      default: return <Calendar className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800">SEO Growth Timeline</h2>
        <p className="text-sm text-slate-400 mt-0.5">Key performance milestones achieved by North Texas Endodontic Associates</p>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-4 md:ml-8 pl-6 md:pl-10 pb-4 flex flex-col gap-8">
        {sortedMilestones.map((m, index) => {
          return (
            <div key={m.sort_order} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[45px] md:-left-[59px] top-0 w-9 h-9 rounded-xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm group-hover:border-dq-accent group-hover:scale-105 transition-all duration-300">
                {getMilestoneIcon(m.sort_order)}
              </div>

              {/* Milestone Content Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 group-hover:bg-white group-hover:shadow-md group-hover:border-dq-accent/35 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-dq-blue bg-dq-accent/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {m.month}
                    </span>
                    <h3 className="text-base font-bold text-slate-800">{m.title}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {m.metric}
                  </span>
                </div>
                
                <p className="text-sm text-slate-700 font-medium mb-3">
                  {m.value}
                </p>
                
                <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200/50 italic leading-relaxed">
                  &ldquo;{m.recommended_annotation}&rdquo;
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
