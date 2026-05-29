'use client';

import {
  LayoutGrid,
  Network,
  MessageSquare,
  Search,
  KeyRound,
  Settings,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { logout } from '@/lib/auth/client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/adapters', label: 'Adapters', icon: Network },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/credentials', label: 'Credentials', icon: KeyRound },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="p-3">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Logo size={32} />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Nyrvana</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Personal OS
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={label}
                      className="h-9 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link href={href}>
                        <Icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={() => logout()}
              className="h-9 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs">Connected</span>
            <span className="text-[10px] font-mono text-muted-foreground">api.nyrvana.org</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
