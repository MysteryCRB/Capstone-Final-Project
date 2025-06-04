export interface User {
  id: number
  username: string
  password_hash: string
  role: "analyst" | "admin"
  created_at: string
}

export interface TIReport {
  id: number
  title: string
  content: string
  summary: string
  source_url: string
  created_at: string
}

export interface IOC {
  id: number
  type: "IP" | "URL" | "hash" | "domain"
  value: string
  source: string
  risk_level: "low" | "medium" | "high"
  checked_at: string
  linked_case_id?: number
}

export interface WazuhAlert {
  id: number
  timestamp: string
  agent: string
  rule_id: number
  description: string
  severity: "low" | "medium" | "high" | "critical"
  raw_log: string
}

export interface Case {
  id: number
  title: string
  description: string
  status: "New" | "Triage" | "In Progress" | "Escalated" | "Closed" | "False Positive"
  severity: "Low" | "Medium" | "High" | "Critical"
  priority: "P4" | "P3" | "P2" | "P1"
  category: IncidentCategory
  subcategory: string
  source: "SIEM" | "Email" | "Phone" | "Manual" | "Other"
  sla_status: "Within SLA" | "At Risk" | "Breached"
  sla_due_date: string
  assigned_to?: number
  created_by: number
  created_at: string
  triage_notes?: string
  false_positive_reason?: string
  escalation_reason?: string
}

export type IncidentCategory =
  | "Malware"
  | "Phishing"
  | "Unauthorized Access"
  | "Data Leakage"
  | "Suspicious Activity"
  | "Policy Violation"
  | "System Compromise"
  | "Other"

export interface CaseNote {
  id: number
  case_id: number
  author_id: number
  content: string
  timestamp: string
  note_type: "Triage" | "Investigation" | "Escalation" | "Resolution" | "General"
}

export interface SLAPolicy {
  id: number
  priority: "P1" | "P2" | "P3" | "P4"
  response_time: number // in minutes
  resolution_time: number // in minutes
}
