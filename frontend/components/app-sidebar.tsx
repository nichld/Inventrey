// components/app-sidebar.tsx
'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Box, CreditCard, Users } from 'lucide-react';
import Link from 'next/link';
import { UserProfile } from '@/components/user-profile';
import { NavMain } from "@/components/nav-main"

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
      <SidebarHeader className="bg-blue-600">
        <div className="flex items-center justify-center h-16">
          {/* Replace '/logo.png' with the path to your actual logo */}
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>
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