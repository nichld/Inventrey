// components/app-sidebar.tsx
'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Home, Box, CreditCard, Users } from 'lucide-react';
import { UserProfile } from '@/components/user-profile';
import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"

const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Box,
  },
  {
    title: "Loans",
    url: "/loans",
    icon: CreditCard,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* Header with logo and blue background */}
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      {/* Sidebar content with navigation links */}
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      {/* Footer with user profile */}
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}