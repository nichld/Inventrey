  "use client"

  import * as React from "react"
  import { Package2 } from "lucide-react"

  import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar"

  export function TeamSwitcher({
  }) {
    const { isMobile } = useSidebar()

    return (
      <SidebarMenu>
        <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Inventrey
                  </span>
                  <span className="truncate text-xs">BETA</span>
                </div>
              </SidebarMenuButton>  </SidebarMenuItem>
      </SidebarMenu>
    )
  }
