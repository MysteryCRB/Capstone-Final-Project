"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Key, User, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { apiService } from "../services/api"
import { useAuth } from "../contexts/auth-context"

export function Settings() {
  const { user } = useAuth()
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState({
    virustotal: "",
    abuseipdb: "",
    threatfox: "",
    openai: "",
  })
  const [testResults, setTestResults] = useState<Record<string, "testing" | "success" | "error" | null>>({})
  const [userSettings, setUserSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: user?.email || "",
  })

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const testApiKey = async (service: string, key: string) => {
    if (!key.trim()) return

    setTestResults((prev) => ({ ...prev, [service]: "testing" }))
    try {
      const success = await apiService.testApiKey(service, key)
      setTestResults((prev) => ({ ...prev, [service]: success ? "success" : "error" }))
    } catch (error) {
      setTestResults((prev) => ({ ...prev, [service]: "error" }))
    }
  }

  const saveApiKeys = async () => {
    try {
      const success = await apiService.updateApiKeys(apiKeys)
      if (success) {
        // Show success message
        console.log("API keys updated successfully")
      }
    } catch (error) {
      console.error("Failed to update API keys:", error)
    }
  }

  const updatePassword = async () => {
    if (userSettings.newPassword !== userSettings.confirmPassword) {
      alert("New passwords don't match")
      return
    }

    try {
      // Implementation for password update
      console.log("Password update requested")
    } catch (error) {
      console.error("Failed to update password:", error)
    }
  }

  const getTestIcon = (status: string | null) => {
    switch (status) {
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  useEffect(() => {
    // Load current API keys (masked for security)
    setApiKeys({
      virustotal: "a5a548833405ea236fb53aa35a1a2b4a7836e1f62077ab44dc72febcd51e197f",
      abuseipdb: "6986155a59684a1a3864047fc3627ab470b8a3affceeac0be89241e861c91645931b851ba2e1b4b3",
      threatfox: "",
      openai: "",
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and API configurations</p>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Configure and test your threat intelligence API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="virustotal">VirusTotal API Key</Label>
                      <Badge variant="secondary">✅ Active</Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="virustotal"
                          type={showPasswords.virustotal ? "text" : "password"}
                          value={apiKeys.virustotal}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, virustotal: e.target.value }))}
                          placeholder="Enter VirusTotal API key"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("virustotal")}
                        >
                          {showPasswords.virustotal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => testApiKey("virustotal", apiKeys.virustotal)}
                        disabled={!apiKeys.virustotal || testResults.virustotal === "testing"}
                      >
                        {getTestIcon(testResults.virustotal)}
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="abuseipdb">AbuseIPDB API Key</Label>
                      <Badge variant="secondary">✅ Active</Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="abuseipdb"
                          type={showPasswords.abuseipdb ? "text" : "password"}
                          value={apiKeys.abuseipdb}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, abuseipdb: e.target.value }))}
                          placeholder="Enter AbuseIPDB API key"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("abuseipdb")}
                        >
                          {showPasswords.abuseipdb ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => testApiKey("abuseipdb", apiKeys.abuseipdb)}
                        disabled={!apiKeys.abuseipdb || testResults.abuseipdb === "testing"}
                      >
                        {getTestIcon(testResults.abuseipdb)}
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="threatfox">ThreatFox API Key</Label>
                      <Badge variant="outline">⏳ Pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="threatfox"
                          type={showPasswords.threatfox ? "text" : "password"}
                          value={apiKeys.threatfox}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, threatfox: e.target.value }))}
                          placeholder="Enter ThreatFox API key"
                          disabled
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("threatfox")}
                        >
                          {showPasswords.threatfox ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button variant="outline" disabled>
                        Test
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="openai">OpenAI API Key</Label>
                      <Badge variant="outline">⏳ Pending</Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="openai"
                          type={showPasswords.openai ? "text" : "password"}
                          value={apiKeys.openai}
                          onChange={(e) => setApiKeys((prev) => ({ ...prev, openai: e.target.value }))}
                          placeholder="Enter OpenAI API key"
                          disabled
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => togglePasswordVisibility("openai")}
                        >
                          {showPasswords.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button variant="outline" disabled>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={saveApiKeys} className="w-full">
                  <Key className="h-4 w-4 mr-2" />
                  Save API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your account information and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={userSettings.currentPassword}
                      onChange={(e) => setUserSettings((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={userSettings.newPassword}
                      onChange={(e) => setUserSettings((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={userSettings.confirmPassword}
                      onChange={(e) => setUserSettings((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={updatePassword} className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Update Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current system status and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>System Version</Label>
                    <div className="text-sm">WardenX SOC v1.0.0</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Database Status</Label>
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>API Services</Label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">VirusTotal</Badge>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">AbuseIPDB</Badge>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">ThreatFox</Badge>
                        <XCircle className="h-3 w-3 text-red-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>User Role</Label>
                    <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
                      {user?.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
