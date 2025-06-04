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
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, Timer, User, Tag } from "lucide-react"
import { apiService } from "../services/api"
import type { Case, CaseNote, IncidentCategory, SLAPolicy } from "../types/database"

export function CaseManagement() {
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [slaPolicies, setSlaPolicies] = useState<SLAPolicy[]>([])

  // Form states
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    severity: "Medium" as const,
    priority: "P3" as const,
    category: "Suspicious Activity" as IncidentCategory,
    subcategory: "",
    source: "SIEM" as const,
  })
  const [newNote, setNewNote] = useState("")
  const [noteType, setNoteType] = useState<CaseNote["note_type"]>("General")

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

  const calculateSLADueDate = (priority: Case["priority"]) => {
    const policy = slaPolicies.find(p => p.priority === priority)
    if (!policy) return new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24h

    const dueDate = new Date(Date.now() + policy.response_time * 60 * 1000)
    return dueDate.toISOString()
  }

  const createCase = async () => {
    try {
      const caseData = {
        ...newCase,
        status: "New" as const,
        created_by: 1, // Current user ID
        created_at: new Date().toISOString(),
        sla_status: "Within SLA" as const,
        sla_due_date: calculateSLADueDate(newCase.priority),
      }

      const createdCase = await apiService.createCase(caseData)
      if (createdCase) {
        await fetchCases()
        setNewCase({
          title: "",
          description: "",
          severity: "Medium",
          priority: "P3",
          category: "Suspicious Activity",
          subcategory: "",
          source: "SIEM",
        })
        setIsCreateDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to create case:", error)
    }
  }

  const updateCaseStatus = async (caseId: number, status: Case["status"], reason?: string) => {
    try {
      const updateData: Partial<Case> = { status }
      if (reason) {
        if (status === "False Positive") {
          updateData.false_positive_reason = reason
        } else if (status === "Escalated") {
          updateData.escalation_reason = reason
        }
      }

      const updatedCase = await apiService.updateCase(caseId, updateData)
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
      const note: CaseNote = {
        id: Date.now(),
        case_id: selectedCase.id,
        author_id: 1, // Current user ID
        content: newNote,
        timestamp: new Date().toISOString(),
        note_type: noteType,
      }

      setCaseNotes((prev) => [note, ...prev])
      setNewNote("")
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }

  useEffect(() => {
    fetchCases()
    // Fetch SLA policies
    const fetchSLAPolicies = async () => {
      try {
        const policies = await apiService.fetchSLAPolicies()
        setSlaPolicies(policies)
      } catch (error) {
        console.error("Failed to fetch SLA policies:", error)
      }
    }
    fetchSLAPolicies()
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
      case "New":
        return (
          <Badge variant="destructive">
            <Clock className="h-3 w-3 mr-1" />
            New
          </Badge>
        )
      case "Triage":
        return (
          <Badge variant="default">
            <FileText className="h-3 w-3 mr-1" />
            Triage
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="default">
            <FileText className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Escalated":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Escalated
          </Badge>
        )
      case "Closed":
        return (
          <Badge variant="secondary">
            <CheckCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        )
      case "False Positive":
        return (
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" />
            False Positive
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSLABadge = (status: string) => {
    switch (status) {
      case "Within SLA":
        return <Badge variant="secondary">Within SLA</Badge>
      case "At Risk":
        return <Badge variant="default">At Risk</Badge>
      case "Breached":
        return <Badge variant="destructive">Breached</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SOC L1 Case Management</h2>
          <p className="text-muted-foreground">Track and manage security incident cases</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newCase.priority}
                    onValueChange={(value) => setNewCase((prev) => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P4">P4 - Low</SelectItem>
                      <SelectItem value="P3">P3 - Medium</SelectItem>
                      <SelectItem value="P2">P2 - High</SelectItem>
                      <SelectItem value="P1">P1 - Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newCase.category}
                    onValueChange={(value) => setNewCase((prev) => ({ ...prev, category: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Malware">Malware</SelectItem>
                      <SelectItem value="Phishing">Phishing</SelectItem>
                      <SelectItem value="Unauthorized Access">Unauthorized Access</SelectItem>
                      <SelectItem value="Data Leakage">Data Leakage</SelectItem>
                      <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                      <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                      <SelectItem value="System Compromise">System Compromise</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Source</label>
                  <Select
                    value={newCase.source}
                    onValueChange={(value) => setNewCase((prev) => ({ ...prev, source: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIEM">SIEM</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Subcategory</label>
                <Input
                  value={newCase.subcategory}
                  onChange={(e) => setNewCase((prev) => ({ ...prev, subcategory: e.target.value }))}
                  placeholder="Specific incident type..."
                />
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
                    <TableHead>Priority</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Category</TableHead>
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
                      <TableCell>{case_.priority}</TableCell>
                      <TableCell>{getSLABadge(case_.sla_status)}</TableCell>
                      <TableCell>{case_.category}</TableCell>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status:</label>
                    <div className="mt-1">{getStatusBadge(selectedCase.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority:</label>
                    <div className="mt-1">{selectedCase.priority}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category:</label>
                    <div className="mt-1">{selectedCase.category}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">SLA Status:</label>
                    <div className="mt-1">{getSLABadge(selectedCase.sla_status)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Update Status:</label>
                  <Select
                    value={selectedCase.status}
                    onValueChange={(value) => updateCaseStatus(selectedCase.id, value as Case["status"])}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Triage">Triage</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Escalated">Escalated</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="False Positive">False Positive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Add Note:</label>
                  <div className="space-y-2">
                    <Select
                      value={noteType}
                      onValueChange={(value) => setNoteType(value as CaseNote["note_type"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Triage">Triage Note</SelectItem>
                        <SelectItem value="Investigation">Investigation Note</SelectItem>
                        <SelectItem value="Escalation">Escalation Note</SelectItem>
                        <SelectItem value="Resolution">Resolution Note</SelectItem>
                        <SelectItem value="General">General Note</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
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
                </div>

                <div>
                  <label className="text-sm font-medium">Case Notes:</label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {caseNotes
                      .filter((note) => note.case_id === selectedCase.id)
                      .map((note) => (
                        <div key={note.id} className="border rounded p-3 text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{note.note_type}</Badge>
                              <span className="font-medium">Analyst #{note.author_id}</span>
                            </div>
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
