"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RefreshCw, AlertTriangle, Shield, Info } from "lucide-react"
import { apiService } from "../services/api"
import type { WazuhAlert } from "../types/database"

export function WazuhAlerts() {
  const [alerts, setAlerts] = useState<WazuhAlert[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<WazuhAlert | null>(null)

  const fetchWazuhData = async () => {
    setLoading(true)
    try {
      const [alertsData, logsData] = await Promise.all([apiService.fetchWazuhAlerts(), apiService.fetchWazuhLogs()])
      setAlerts(alertsData)
      setLogs(logsData)
    } catch (error) {
      console.error("Failed to fetch WAZUH data:", error)
      // Ready for real data integration
      setAlerts([])
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWazuhData()
    // Set up real-time polling for alerts
    const interval = setInterval(fetchWazuhData, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default">
            <Shield className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="secondary">
            <Info className="h-3 w-3 mr-1" />
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">WAZUH SIEM</h2>
          <p className="text-muted-foreground">Real-time security alerts and log monitoring</p>
        </div>
        <Button onClick={fetchWazuhData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
          <TabsTrigger value="logs">Logs ({logs.length})</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Latest security alerts from WAZUH agents</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No alerts available. Check WAZUH connection.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Rule ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow
                        key={alert.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{alert.agent}</TableCell>
                        <TableCell>{alert.rule_id}</TableCell>
                        <TableCell className="max-w-md truncate">{alert.description}</TableCell>
                        <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {selectedAlert && (
            <Card>
              <CardHeader>
                <CardTitle>Alert Details</CardTitle>
                <CardDescription>Detailed information for alert #{selectedAlert.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Agent:</label>
                      <p>{selectedAlert.agent}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rule ID:</label>
                      <p>{selectedAlert.rule_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Severity:</label>
                      <div>{getSeverityBadge(selectedAlert.severity)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Timestamp:</label>
                      <p>{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description:</label>
                    <p className="mt-1">{selectedAlert.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Raw Log:</label>
                    <pre className="mt-1 text-xs bg-muted p-4 rounded-lg overflow-auto">{selectedAlert.raw_log}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Raw log entries from WAZUH agents</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No logs available. Check WAZUH connection.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="border rounded p-3 text-sm font-mono">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-muted-foreground">{log.timestamp || new Date().toISOString()}</span>
                        <Badge variant="outline">{log.agent || "Unknown"}</Badge>
                      </div>
                      <p>{log.message || JSON.stringify(log)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.filter((a) => a.severity === "critical").length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(alerts.map((a) => a.agent)).size}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Log Entries</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logs.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
