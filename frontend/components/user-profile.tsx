// components/user-profile.tsx
'use client';

import React from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Key, Trash2 } from 'lucide-react';

export function UserProfile() {
  // Replace with actual user data from your authentication system
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: '/avatars/jane-doe.jpg',
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="w-full">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-2 text-left">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-48">
            <DropdownMenuItem onSelect={() => console.log('Log Out')}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log('Change Password')}>
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log('Delete Account')}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}