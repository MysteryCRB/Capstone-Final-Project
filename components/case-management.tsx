"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { apiService } from "../services/api"
import type { Case, CaseNote } from "../types/database"

export function CaseManagement() {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Form states
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    severity: "Medium" as const,
  })
  const [newNote, setNewNote] = useState("")

  const fetchCases = async () => {
    setLoading(true)
    try {
      const casesData = await apiService.fetchCases()
      setCases(casesData)
    } catch (error) {
      console.error("Failed to fetch cases:", error)
      setCases([])
    } finally {
      setLoading(false)
    }
  }

  const createCase = async () => {
    try {
      const caseData = {
        ...newCase,
        status: "Open" as const,
        created_by: 1, // Current user ID
        created_at: new Date().toISOString(),
      }

      const createdCase = await apiService.createCase(caseData)
      if (createdCase) {
        await fetchCases()
        setNewCase({ title: "", description: "", severity: "Medium" })
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to create case:", error)
    }
  }

  const updateCaseStatus = async (caseId: number, status: string) => {
    try {
      const updatedCase = await apiService.updateCase(caseId, { status })
      if (updatedCase) {
        setCases((prev) => prev.map((c) => (c.id === caseId ? updatedCase : c)))
        if (selectedCase?.id === caseId) {
          setSelectedCase(updatedCase)
        }
      }
    } catch (error) {
      console.error("Failed to update case:", error)
    }
  }

  const addCaseNote = async () => {
    if (!selectedCase || !newNote.trim()) return

    try {
      // In real implementation, this would call an API
      const note: CaseNote = {
        id: Date.now(),
        case_id: selectedCase.id,
        author_id: 1, // Current user ID
        content: newNote,
        timestamp: new Date().toISOString(),
      }

      setCaseNotes((prev) => [note, ...prev])
      setNewNote("")
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        )
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge variant="default">Medium</Badge>
      case "Low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <Badge variant="destructive">
            <Clock className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="default">
            <FileText className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Closed":
        return (
          <Badge variant="secondary">
            <CheckCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Case Management</h2>
          <p className="text-muted-foreground">Track and manage security incident cases</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>Create a new incident case for investigation</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newCase.title}
                  onChange={(e) => setNewCase((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Case title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Case description..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Severity</label>
                <Select
                  value={newCase.severity}
                  onValueChange={(value) => setNewCase((prev) => ({ ...prev, severity: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createCase} className="w-full">
                Create Case
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cases</CardTitle>
            <CardDescription>All incident cases and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {cases.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No cases found. Create your first case to get started.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((case_) => (
                    <TableRow
                      key={case_.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedCase(case_)}
                    >
                      <TableCell className="font-medium">{case_.title}</TableCell>
                      <TableCell>{getStatusBadge(case_.status)}</TableCell>
                      <TableCell>{getSeverityBadge(case_.severity)}</TableCell>
                      <TableCell>{new Date(case_.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
            <CardDescription>
              {selectedCase ? `Case #${selectedCase.id}` : "Select a case to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCase ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedCase.title}</h3>
                  <p className="text-muted-foreground mt-1">{selectedCase.description}</p>
                </div>

                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium">Status:</label>
                    <div className="mt-1">{getStatusBadge(selectedCase.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Severity:</label>
                    <div className="mt-1">{getSeverityBadge(selectedCase.severity)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Update Status:</label>
                  <Select
                    value={selectedCase.status}
                    onValueChange={(value) => updateCaseStatus(selectedCase.id, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Add Note:</label>
                  <div className="flex gap-2 mt-1">
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add investigation note..."
                      className="flex-1"
                    />
                    <Button onClick={addCaseNote} disabled={!newNote.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Case Notes:</label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {caseNotes
                      .filter((note) => note.case_id === selectedCase.id)
                      .map((note) => (
                        <div key={note.id} className="border rounded p-3 text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">Analyst #{note.author_id}</span>
                            <span className="text-muted-foreground text-xs">
                              {new Date(note.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p>{note.content}</p>
                        </div>
                      ))}
                    {caseNotes.filter((note) => note.case_id === selectedCase.id).length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        No notes yet. Add the first investigation note.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a case from the list to view details and manage the investigation.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
