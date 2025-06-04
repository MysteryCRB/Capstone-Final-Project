"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { apiService } from "../services/api"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ScanResult {
  source: string
  result: any
  risk_level: "low" | "medium" | "high"
  timestamp: string
}

const availableSources = [
  { id: "virustotal", name: "VirusTotal", description: "Comprehensive threat intelligence" },
  { id: "abuseipdb", name: "AbuseIPDB", description: "IP reputation database" },
  { id: "threatfox", name: "ThreatFox", description: "Malware and threat intelligence" },
]

export function IOCScanner() {
  const [iocValue, setIocValue] = useState("")
  const [iocType, setIocType] = useState<string>("")
  const [scanning, setScanning] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>(["virustotal"])

  const scanIOC = async () => {
    if (!iocValue || !iocType) return

    setScanning(true)
    const results: ScanResult[] = []

    try {
      // Scan with selected sources
      if (selectedSources.includes("virustotal")) {
        const vtResult = await apiService.scanIOCVirusTotal(iocValue, iocType)
        if (vtResult) {
          results.push({
            source: "VirusTotal",
            result: vtResult,
            risk_level: vtResult.malicious > 0 ? "high" : "low",
            timestamp: new Date().toISOString(),
          })
        }
      }

      if (selectedSources.includes("abuseipdb") && iocType === "IP") {
        const abuseResult = await apiService.scanIOCAbuseIPDB(iocValue)
        if (abuseResult) {
          results.push({
            source: "AbuseIPDB",
            result: abuseResult,
            risk_level: abuseResult.abuseConfidencePercentage > 50 ? "high" : "low",
            timestamp: new Date().toISOString(),
          })
        }
      }

      if (selectedSources.includes("threatfox")) {
        const threatFoxResult = await apiService.scanIOCThreatFox(iocValue)
        if (threatFoxResult) {
          results.push({
            source: "ThreatFox",
            result: threatFoxResult,
            risk_level: threatFoxResult.threat_type ? "medium" : "low",
            timestamp: new Date().toISOString(),
          })
        }
      }

      setScanResults(results)
    } catch (error) {
      console.error("IOC scanning failed:", error)
    } finally {
      setScanning(false)
    }
  }

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Shield className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">IOC Scanner</h2>
        <p className="text-muted-foreground">
          Scan and validate indicators of compromise using multiple threat intelligence sources
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scan IOC</CardTitle>
          <CardDescription>
            Enter an IP address, URL, domain, or hash to scan across multiple threat intelligence APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select value={iocType} onValueChange={setIocType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IP">IP Address</SelectItem>
                <SelectItem value="URL">URL</SelectItem>
                <SelectItem value="domain">Domain</SelectItem>
                <SelectItem value="hash">Hash</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter IOC value..."
              value={iocValue}
              onChange={(e) => setIocValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={scanIOC} disabled={!iocValue || !iocType || scanning || selectedSources.length === 0}>
              <Search className={`h-4 w-4 mr-2 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning..." : "Scan"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Select Sources</Label>
            <div className="grid gap-2">
              {availableSources.map((source) => (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={source.id}
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                    disabled={source.id === "abuseipdb" && iocType !== "IP"}
                  />
                  <Label htmlFor={source.id} className="flex flex-col">
                    <span className="font-medium">{source.name}</span>
                    <span className="text-xs text-muted-foreground">{source.description}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {scanResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>Results from multiple threat intelligence sources</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {scanResults.map((result, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{result.source}</CardTitle>
                          <Badge variant={getRiskBadgeColor(result.risk_level)}>
                            {getRiskIcon(result.risk_level)}
                            <span className="ml-1 capitalize">{result.risk_level}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          Scanned: {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                {scanResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{result.source}</CardTitle>
                        <Badge variant={getRiskBadgeColor(result.risk_level)}>
                          {getRiskIcon(result.risk_level)}
                          <span className="ml-1 capitalize">{result.risk_level}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
