import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Check, X, Eye } from 'lucide-react';
import Link from 'next/link';

interface PhotoProps {
  id: string;
  src: string;
  title: string;
  date: string;
  by: string;
  cat: string;
  exif: { camera: string };
  status: string;
}

export function AdminPhotoCard({ photo }: { photo: PhotoProps }) {
  return (
    <div className="group flex flex-col border border-neutral-200 bg-white transition-all hover:border-neutral-900">
      {/* Image Thumbnail */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        <img 
          src={photo.src} 
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={
            photo.status === 'Approved' ? 'default' : 
            photo.status === 'Rejected' ? 'destructive' : 'secondary'
          } className={`rounded-none px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${
            photo.status === 'Approved' ? 'bg-neutral-900 text-white' :
            photo.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''
          }`}>
            {photo.status}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="secondary" size="icon" className="h-7 w-7 rounded-none bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            } />
            <DropdownMenuContent align="end" className="rounded-none font-mono text-xs uppercase tracking-wider">
              <DropdownMenuItem className="cursor-pointer" render={
                <Link href={`/photo/${photo.id}`}>
                  <Eye className="mr-2 h-3.5 w-3.5" /> View Photo
                </Link>
              } />
              <DropdownMenuItem className="cursor-pointer text-green-600"><Check className="mr-2 h-3.5 w-3.5" /> Approve</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600"><X className="mr-2 h-3.5 w-3.5" /> Reject</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-medium text-lg leading-tight truncate pr-4">"{photo.title}"</h3>
          <span className="font-mono text-[10px] text-neutral-400 shrink-0">{photo.date}</span>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              BY @{photo.by}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              {photo.cat} · {photo.exif.camera}
            </span>
          </div>
          
          {photo.status === 'Pending' && (
            <div className="flex gap-1">
              <Button size="icon" variant="outline" className="h-7 w-7 rounded-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="outline" className="h-7 w-7 rounded-none border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700">
                <Check className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
