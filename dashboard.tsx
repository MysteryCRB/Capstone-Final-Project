"use client"

import { useState } from "react"
import { AppSidebar } from "./components/app-sidebar"
import { ThreatIntelligence } from "./components/threat-intelligence"
import { IOCScanner } from "./components/ioc-scanner"
import { CaseManagement } from "./components/case-management"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Search, FileText, Target, Eye, Filter } from "lucide-react"
import { LoginForm } from "./components/auth/login-form"
import { AuthProvider, useAuth } from "./contexts/auth-context"
import { UserManagement } from "./components/user-management"
import { Settings } from "./components/settings"
import { WazuhPlaceholder } from "./components/wazuh-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

function SOCDashboardContent() {
  const { user, logout } = useAuth()
  const [currentView, setCurrentView] = useState("dashboard")

  if (!user) {
    return null // Will be handled by the auth wrapper
  }

  const renderContent = () => {
    switch (currentView) {
      case "threat-intelligence":
        return <ThreatIntelligence />
      case "ioc-scanner":
        return <IOCScanner />
      case "wazuh-alerts":
        return <WazuhPlaceholder />
      case "cases":
        return <CaseManagement />
      case "users":
        return <UserManagement />
      case "settings":
        return <Settings />
      default:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight mb-2">WardenX SOC</h1>
              <p className="text-xl text-muted-foreground mb-6">Advanced Security Operations Center</p>

              {/* Core Goals Section */}
              <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader className="text-center pb-2">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Optimized Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      AI-powered threat correlation and intelligent analysis workflows
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Analysis Efficiency</span>
                        <span>94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="text-center pb-2">
                    <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Automated L1 Monitoring</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      24/7 automated monitoring with intelligent alert prioritization
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Automation Rate</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader className="text-center pb-2">
                    <Filter className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Minimize False Positives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Advanced filtering and ML-based threat validation</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Accuracy Rate</span>
                        <span>96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Status Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setCurrentView("threat-intelligence")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Threat Intelligence</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">AI-powered analysis ready</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Optimized
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setCurrentView("wazuh-alerts")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">L1 Monitoring</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Automated alerts pending</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      WAZUH Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setCurrentView("ioc-scanner")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">IOC Validation</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Ready</div>
                  <p className="text-xs text-muted-foreground">Multi-source validation</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Low FP
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setCurrentView("cases")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Incident management</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Automated
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced System Status */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Real-time SOC efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analysis Optimization</span>
                      <div className="flex items-center gap-2">
                        <Progress value={94} className="w-20 h-2" />
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">L1 Automation Rate</span>
                      <div className="flex items-center gap-2">
                        <Progress value={87} className="w-20 h-2" />
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">False Positive Reduction</span>
                      <div className="flex items-center gap-2">
                        <Progress value={96} className="w-20 h-2" />
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Threat Detection Accuracy</span>
                      <div className="flex items-center gap-2">
                        <Progress value={98} className="w-20 h-2" />
                        <span className="text-sm font-medium">98%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Optimized SOC operations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => setCurrentView("ioc-scanner")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="h-4 w-4" />
                      <div className="font-medium">Validate IOC</div>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Low FP
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Multi-source threat validation</div>
                  </button>
                  <button
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => setCurrentView("cases")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4" />
                      <div className="font-medium">Create Case</div>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Automated
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Intelligent incident tracking</div>
                  </button>
                  <button
                    className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    onClick={() => setCurrentView("threat-intelligence")}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4" />
                      <div className="font-medium">Analyze Threats</div>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Optimized
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">AI-powered threat analysis</div>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  const getBreadcrumbTitle = () => {
    switch (currentView) {
      case "threat-intelligence":
        return "Threat Intelligence"
      case "ioc-scanner":
        return "IOC Scanner"
      case "wazuh-alerts":
        return "L1 Monitoring"
      case "cases":
        return "Case Management"
      case "users":
        return "User Management"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  const handleNavigation = (view: string) => {
    setCurrentView(view)
  }

  return (
    <SidebarProvider>
      <AppSidebar onNavigate={handleNavigation} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" onClick={() => setCurrentView("dashboard")} className="cursor-pointer">
                  WardenX SOC
                </BreadcrumbLink>
              </BreadcrumbItem>
              {currentView !== "dashboard" && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getBreadcrumbTitle()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline">{user.role}</Badge>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AuthWrapper() {
  const { user, login, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p>Loading WardenX SOC...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={login} />
  }

  return <SOCDashboardContent />
}

export default function SOCDashboard() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}
