"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RefreshCw, ExternalLink, Sparkles } from "lucide-react"
import { apiService } from "../services/api"
import type { TIReport } from "../types/database"

export function ThreatIntelligence() {
  const [reports, setReports] = useState<TIReport[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<string>("")
  const [aiSummary, setAiSummary] = useState<string>("")
  const [generatingSummary, setGeneratingSummary] = useState(false)

  const fetchThreatIntelligence = async () => {
    setLoading(true)
    try {
      const newsData = await apiService.fetchNewsArticles()
      // Transform news data to TI reports format
      const transformedReports: TIReport[] = newsData.map((article, index) => ({
        id: index + 1,
        title: article.title || `Threat Report ${index + 1}`,
        content: article.content || article.description || "",
        summary: "",
        source_url: article.url || "",
        created_at: new Date().toISOString(),
      }))
      setReports(transformedReports)
    } catch (error) {
      console.error("Failed to fetch threat intelligence:", error)
      // Fallback to empty array - ready for real data
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const generateAISummary = async () => {
    if (!selectedArticle) return

    setGeneratingSummary(true)
    try {
      const summary = await apiService.generateAISummary(selectedArticle)
      setAiSummary(summary)
    } catch (error) {
      console.error("Failed to generate AI summary:", error)
      setAiSummary("Failed to generate summary")
    } finally {
      setGeneratingSummary(false)
    }
  }

  useEffect(() => {
    fetchThreatIntelligence()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Threat Intelligence</h2>
          <p className="text-muted-foreground">Latest cybersecurity threats and AI-generated analysis</p>
        </div>
        <Button onClick={fetchThreatIntelligence} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Threat Reports</CardTitle>
            <CardDescription>Latest cybersecurity news and threat intelligence</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reports.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No threat reports available. Check API connection.
                </p>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedArticle(report.content)}
                  >
                    <h4 className="font-semibold mb-2">{report.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{report.content.substring(0, 150)}...</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{new Date(report.created_at).toLocaleDateString()}</Badge>
                      {report.source_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={report.source_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>Generate AI-powered summaries and insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Select an article or paste content for AI analysis..."
              value={selectedArticle}
              onChange={(e) => setSelectedArticle(e.target.value)}
              className="min-h-32"
            />
            <Button onClick={generateAISummary} disabled={!selectedArticle || generatingSummary} className="w-full">
              <Sparkles className={`h-4 w-4 mr-2 ${generatingSummary ? "animate-pulse" : ""}`} />
              {generatingSummary ? "Generating..." : "Generate AI Summary"}
            </Button>
            {aiSummary && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-semibold mb-2">AI Summary:</h4>
                <p className="text-sm">{aiSummary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
