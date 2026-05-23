'use client';

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ImageIcon,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function AdminCommandMenu({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setOpen])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." className="font-mono text-sm" />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm font-mono text-neutral-500">No results found.</CommandEmpty>
        
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/photos"))} className="font-mono text-xs uppercase tracking-widest cursor-pointer py-3">
            <ImageIcon className="mr-2 h-4 w-4" />
            <span>Review Photos</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/users"))} className="font-mono text-xs uppercase tracking-widest cursor-pointer py-3">
            <Users className="mr-2 h-4 w-4" />
            <span>Manage Users</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin"))} className="font-mono text-xs uppercase tracking-widest cursor-pointer py-3">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/admins"))} className="font-mono text-xs uppercase tracking-widest cursor-pointer py-3">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Admin Team</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/rewards"))} className="font-mono text-xs uppercase tracking-widest cursor-pointer py-3">
            <Trophy className="mr-2 h-4 w-4" />
            <span>Points & Rewards</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))} className="font-mono text-xs uppercase tracking-widest cursor-pointer py-3">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
