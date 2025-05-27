"use client"

import { Shield, AlertTriangle, Search, FileText, Users, Settings, Home } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Threat Intelligence",
    url: "/threat-intelligence",
    icon: Shield,
  },
  {
    title: "IOC Scanner",
    url: "/ioc-scanner",
    icon: Search,
  },
  {
    title: "WAZUH Alerts",
    url: "/wazuh-alerts",
    icon: AlertTriangle,
  },
  {
    title: "Case Management",
    url: "/cases",
    icon: FileText,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  onNavigate?: (view: string) => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const handleNavigation = (url: string) => {
    const view = url.replace("/", "") || "dashboard"
    onNavigate?.(view)
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">WardenX</span>
          <Badge variant="outline" className="ml-auto text-xs">
            SOC
          </Badge>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => handleNavigation(item.url)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-muted-foreground">WardenX SOC v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}
