import React, { useEffect, useState } from 'react';

interface KpiCardProps {
  label: string;
  value: number;
  isPercent?: boolean;
  prefix?: string;
  suffix?: string;
  changeText?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  animate?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  isPercent = false,
  prefix = '',
  suffix = '',
  changeText,
  changeType = 'neutral',
  animate = false,
  description,
  icon
}) => {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1000; // 1 second animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      const current = easeProgress * value;
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, animate]);

  const formatNumber = (num: number) => {
    if (isPercent) {
      return `${prefix}${num.toFixed(1)}%${suffix}`;
    }
    return `${prefix}${Math.round(num).toLocaleString()}${suffix}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-dq-accent/50 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Decorative accent bar on hover */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200 group-hover:bg-dq-accent transition-colors duration-300" />
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
          {icon && (
            <div className="p-2.5 rounded-xl bg-slate-50 text-dq-dark group-hover:bg-dq-accent/15 group-hover:text-dq-blue transition-colors duration-300">
              {icon}
            </div>
          )}
        </div>
        
        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">
          {formatNumber(displayValue)}
        </h3>
        
        {description && (
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
        )}
      </div>

      {changeText && (
        <div className="mt-4 flex items-center">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              changeType === 'positive'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : changeType === 'negative'
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-slate-50 text-slate-600 border border-slate-100'
            }`}
          >
            {changeText}
          </span>
        </div>
      )}
    </div>
  );
};
