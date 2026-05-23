'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { AdminPopupRow } from '@/components/admin/AdminPopupRow';

// Mock Data
const mockPopups = [
  {
    id: 1,
    name: "Summer Contest 2026",
    status: "Active",
    views: "45.2K",
    clicks: "3.1K",
    ctr: "6.8%",
    startDate: "Jun 01, 2026",
    endDate: "Aug 31, 2026",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
  },
  {
    id: 2,
    name: "New Pro Subscription",
    status: "Draft",
    views: "-",
    clicks: "-",
    ctr: "-",
    startDate: "Sep 15, 2026",
    endDate: "No end date",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
  },
  {
    id: 3,
    name: "Welcome Onboarding",
    status: "Paused",
    views: "128K",
    clicks: "12K",
    ctr: "9.3%",
    startDate: "Jan 01, 2026",
    endDate: "No end date",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80"
  }
];

export default function AdminPopupsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2">Popup Campaigns</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
            Manage promotional popups, banners, and advertisements
          </p>
        </div>
        
        {/* Create Campaign Dialog */}
        <Dialog>
          <DialogTrigger render={
            <Button className="font-mono text-xs uppercase tracking-widest rounded-none bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
              <Plus className="h-3.5 w-3.5" /> Create Campaign
            </Button>
          } />
          <DialogContent className="sm:max-w-[600px] rounded-none p-0 overflow-hidden">
            <div className="bg-neutral-900 p-6 text-white">
              <DialogTitle className="font-light text-2xl tracking-tight">New Popup Campaign</DialogTitle>
              <DialogDescription className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 mt-2">
                Configure your advertisement banner and targeting rules
              </DialogDescription>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-6">
                
                {/* General */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-900 border-b pb-2">General Info</h3>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-neutral-500">Campaign Name</Label>
                    <Input id="name" placeholder="e.g. Summer Photo Contest 2026" className="rounded-none border-neutral-300" />
                  </div>
                </div>

                {/* Creative */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-900 border-b pb-2">Creative (Image)</h3>
                  
                  <div className="border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-neutral-100 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                      <ImageIcon className="h-5 w-5 text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium mb-1">Click to upload banner image</p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Recommended: 800x600px (JPG/PNG)</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-xs font-mono uppercase tracking-widest text-neutral-500">Target URL (On Click)</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input id="url" placeholder="https://gography.net/contest" className="rounded-none pl-10 border-neutral-300" />
                    </div>
                  </div>
                </div>

                {/* Display Rules */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest font-bold text-neutral-900 border-b pb-2">Display Rules</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="audience" className="text-xs font-mono uppercase tracking-widest text-neutral-500">Target Audience</Label>
                      <select id="audience" className="flex h-10 w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-none">
                        <option>All Visitors</option>
                        <option>Only Logged-in Users</option>
                        <option>Only Guest Users (Not Logged in)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-xs font-mono uppercase tracking-widest text-neutral-500">Frequency</Label>
                      <select id="frequency" className="flex h-10 w-full border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 rounded-none">
                        <option>Once per session</option>
                        <option>Every time (Aggressive)</option>
                        <option>Once per day</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border p-4 bg-neutral-50">
                    <div>
                      <Label className="text-sm font-medium">Activate Campaign</Label>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mt-1">Set live immediately upon saving</p>
                    </div>
                    <Switch />
                  </div>

                </div>

              </div>
            </div>
            
            <DialogFooter className="p-4 bg-neutral-50 border-t">
              <Button variant="outline" className="rounded-none font-mono text-xs uppercase tracking-widest">Cancel</Button>
              <Button type="submit" className="rounded-none font-mono text-xs uppercase tracking-widest bg-neutral-900">Save Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-2">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
          <Input 
            type="text" 
            placeholder="Search campaigns..." 
            className="pl-9 rounded-none border-neutral-300 h-9 font-mono text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-mono text-[10px] uppercase tracking-widest rounded-none border-neutral-300 h-9">
            Filter: All Status
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 bg-white">
        <div className="grid grid-cols-[80px_1fr_100px_120px_120px_180px_60px] gap-4 p-4 border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
          <div className="text-center">Preview</div>
          <div>Campaign Name</div>
          <div className="text-center">Status</div>
          <div className="text-right">Impressions</div>
          <div className="text-right">Clicks (CTR)</div>
          <div className="text-center">Schedule</div>
          <div className="text-right">Action</div>
        </div>

        <div className="flex flex-col divide-y divide-neutral-100">
          {mockPopups.map((popup) => (
            <AdminPopupRow key={popup.id} popup={popup} />
          ))}
        </div>
      </div>
    </div>
  );
}
