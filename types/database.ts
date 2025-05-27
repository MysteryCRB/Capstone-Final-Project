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
  status: "Open" | "In Progress" | "Closed"
  severity: "Low" | "Medium" | "High" | "Critical"
  created_by: number
  created_at: string
}

export interface CaseNote {
  id: number
  case_id: number
  author_id: number
  content: string
  timestamp: string
}
