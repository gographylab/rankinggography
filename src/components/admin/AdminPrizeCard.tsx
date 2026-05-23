import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PrizeCardProps {
  rank: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant: 'grand' | 'runner';
}

export function AdminPrizeCard({ rank, title, description, icon: Icon, variant }: PrizeCardProps) {
  const isGrand = variant === 'grand';

  return (
    <div className={`p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border ${
      isGrand ? 'border-yellow-200 bg-yellow-50/30' : 'border-neutral-200'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 flex items-center justify-center rounded-full shrink-0 ${
          isGrand ? 'bg-yellow-100' : 'bg-neutral-100'
        }`}>
          <Icon className={`h-5 w-5 ${isGrand ? 'text-yellow-600' : 'text-neutral-600'}`} />
        </div>
        <div>
          <Badge variant="outline" className={`rounded-none text-[10px] uppercase tracking-widest mb-1 ${
            isGrand 
              ? 'border-yellow-600/30 text-yellow-700 bg-yellow-50' 
              : 'border-neutral-300 text-neutral-700 bg-neutral-50'
          }`}>
            {rank}
          </Badge>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
      </div>
      <Button variant="ghost" className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 rounded-none">Edit</Button>
    </div>
  );
}
