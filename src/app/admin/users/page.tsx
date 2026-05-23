'use client';

import { useState } from 'react';
import { getPhotographers } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, UserCheck, Shield, Ban, ExternalLink, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { AdminUserRow } from '@/components/admin/AdminUserRow';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allUsers = getPhotographers();
  
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayUsers = activeTab === 'photographers' ? filteredUsers.filter(u => !u.isCustomer) :
                       activeTab === 'voyageurs' ? filteredUsers.filter(u => u.isCustomer) :
                       filteredUsers;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2">Network Directory</h1>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
            Manage Photographers, Voyageurs, and Admin Team
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-mono text-xs uppercase tracking-widest rounded-none border-neutral-300">
            Export CSV
          </Button>

          {/* Add / Invite User Dialog */}
          <Dialog>
            <DialogTrigger render={
              <Button className="font-mono text-xs uppercase tracking-widest rounded-none bg-neutral-900 text-white hover:bg-neutral-800 gap-2">
                <Plus className="h-3.5 w-3.5" /> Invite User
              </Button>
            } />
            <DialogContent className="sm:max-w-[425px] rounded-none">
              <DialogHeader>
                <DialogTitle className="font-light text-2xl tracking-tight">Invite User</DialogTitle>
                <DialogDescription className="font-mono text-[10px] uppercase tracking-widest">
                  Invite a new photographer or voyageur.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 mt-2">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-neutral-500">Email address</Label>
                  <Input id="email" type="email" placeholder="user@example.com" className="rounded-none border-neutral-300" />
                </div>
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="role" className="font-mono text-xs uppercase tracking-widest text-neutral-500">Assign Role</Label>
                  <select id="role" className="flex h-10 w-full border border-neutral-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none">
                    <option value="photographer">Photographer</option>
                    <option value="voyageur">Voyageur (Customer)</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="rounded-none w-full font-mono text-xs uppercase tracking-widest bg-neutral-900">Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <TabsList className="rounded-none bg-neutral-100 p-1 h-auto">
            <TabsTrigger value="all" className="rounded-none font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">All Users</TabsTrigger>
            <TabsTrigger value="photographers" className="rounded-none font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">Photographers</TabsTrigger>
            <TabsTrigger value="voyageurs" className="rounded-none font-mono text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2">Voyageurs</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input 
              type="text" 
              placeholder="Search users..." 
              className="pl-9 rounded-none border-neutral-300 h-9 font-mono text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          <div className="border border-neutral-200 bg-white">
            {/* Custom Table Header */}
            <div className="grid grid-cols-[auto_1fr_1fr_120px_120px_60px] gap-4 p-4 border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
              <div className="w-12 text-center">Avatar</div>
              <div>User Profile</div>
              <div>Role / Status</div>
              <div className="text-center">Joined</div>
              <div className="text-center">Photos</div>
              <div className="text-right">Actions</div>
            </div>

            {/* User Rows */}
            <div className="flex flex-col divide-y divide-neutral-100">
              {displayUsers.length === 0 ? (
                <div className="p-8 text-center font-mono text-xs uppercase tracking-widest text-neutral-400">
                  No users found
                </div>
              ) : displayUsers.map((user) => (
                <AdminUserRow key={user.username} user={user} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
