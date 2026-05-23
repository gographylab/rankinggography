import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: LucideIcon;
}

export function AdminStatCard({ title, value, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="flex flex-col border border-neutral-200 bg-white p-5 hover:border-neutral-900 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{title}</span>
        <Icon className="h-4 w-4 text-neutral-400" />
      </div>
      <div className="text-3xl font-light tracking-tight">{value}</div>
      <div className="mt-2 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{trend}</div>
    </div>
  );
}
