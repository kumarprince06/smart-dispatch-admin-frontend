import React from 'react';

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
  subtitle?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, value, icon, bgClass, textClass, subtitle 
}) => {
  return (
    <div className="bg-bg-secondary border border-border-color rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500 ease-out ${bgClass.split('/')[0]}`}></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
          {subtitle && <p className="text-xs text-text-muted mt-2 flex items-center gap-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bgClass} ${textClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
