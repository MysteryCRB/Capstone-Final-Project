export interface Alert {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  status: 'new' | 'investigating' | 'resolved';
}

export interface IOCData {
  value: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  threatScore: number;
  confidence: number;
  lastSeen: string;
  sources: string[];
}

export interface ThreatIntelligence {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  aiAnalysis?: string;
}