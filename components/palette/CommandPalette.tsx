'use client';

import * as React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth/client';
import { 
  HomeIcon, 
  PlugIcon, 
  MessageSquareIcon, 
  SearchIcon, 
  KeyIcon, 
  SettingsIcon, 
  LogOutIcon 
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleNavigation('/dashboard')}>
            <HomeIcon className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/adapters')}>
            <PlugIcon className="mr-2 h-4 w-4" />
            <span>Adapters</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/chat')}>
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            <span>Chat</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/search')}>
            <SearchIcon className="mr-2 h-4 w-4" />
            <span>Search</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/credentials')}>
            <KeyIcon className="mr-2 h-4 w-4" />
            <span>Credentials</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigation('/settings')}>
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleLogout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}