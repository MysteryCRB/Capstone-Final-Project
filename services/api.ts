// API Service Layer - Frontend-only version with mock data

export class APIService {
  private baseUrl: string
  private lastCaseId: number = 1

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  // Mock data for demonstration
  private mockUsers = [
    {
      id: 1,
      email: "wardenx.business@gmail.com",
      role: "admin",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      email: "analyst@wardenx.com",
      role: "user",
      created_at: "2024-01-01T00:00:00Z",
    },
  ]

  private mockCases = [
    {
      id: 1,
      title: "Suspicious Network Activity",
      description: "Unusual traffic patterns detected from internal network",
      status: "New",
      severity: "High",
      priority: "P2",
      category: "Suspicious Activity",
      subcategory: "Network Scan",
      source: "SIEM",
      sla_status: "Within SLA",
      sla_due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      created_by: 1,
      created_at: "2024-01-15T10:30:00Z",
    },
  ]

  private mockSLAPolicies = [
    {
      id: 1,
      priority: "P1",
      response_time: 30, // 30 minutes
      resolution_time: 240, // 4 hours
    },
    {
      id: 2,
      priority: "P2",
      response_time: 120, // 2 hours
      resolution_time: 480, // 8 hours
    },
    {
      id: 3,
      priority: "P3",
      response_time: 240, // 4 hours
      resolution_time: 1440, // 24 hours
    },
    {
      id: 4,
      priority: "P4",
      response_time: 480, // 8 hours
      resolution_time: 2880, // 48 hours
    },
  ]

  // Real VirusTotal API integration (when backend is available)
  async scanIOCVirusTotal(ioc: string, type: string): Promise<any> {
    try {
      // For now, return mock data - replace with real API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      return {
        scan_id: `vt_${Date.now()}`,
        resource: ioc,
        response_code: 1,
        verbose_msg: "Scan finished, information embedded",
        malicious: Math.random() > 0.7 ? 1 : 0,
        suspicious: Math.random() > 0.8 ? 1 : 0,
        harmless: Math.random() > 0.5 ? 1 : 0,
        total: 70,
        permalink: `https://www.virustotal.com/gui/search/${ioc}`,
      }
    } catch (error) {
      console.error("VirusTotal Error:", error)
      return null
    }
  }

  // Real AbuseIPDB API integration (when backend is available)
  async scanIOCAbuseIPDB(ip: string): Promise<any> {
    try {
      // For now, return mock data - replace with real API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 800)) // Simulate API delay

      return {
        ipAddress: ip,
        isPublic: true,
        ipVersion: 4,
        isWhitelisted: false,
        abuseConfidencePercentage: Math.floor(Math.random() * 100),
        countryCode: "US",
        usageType: "Data Center/Web Hosting/Transit",
        isp: "Example ISP",
        domain: "example.com",
        totalReports: Math.floor(Math.random() * 50),
        numDistinctUsers: Math.floor(Math.random() * 20),
      }
    } catch (error) {
      console.error("AbuseIPDB Error:", error)
      return null
    }
  }

  // ThreatFox API integration (ready for key)
  async scanIOCThreatFox(ioc: string): Promise<any> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)) // Simulate API delay

      return {
        query_status: "ok",
        data: [
          {
            id: `tf_${Date.now()}`,
            ioc: ioc,
            threat_type: Math.random() > 0.6 ? "malware" : null,
            threat_type_desc: "Malicious payload",
            malware: "Generic.Trojan",
            confidence_level: Math.floor(Math.random() * 100),
            first_seen: new Date().toISOString(),
            last_seen: new Date().toISOString(),
          },
        ],
      }
    } catch (error) {
      console.error("ThreatFox Error:", error)
      return null
    }
  }

  // User Management
  async login(email: string, password: string): Promise<any> {
    try {
      // Mock login - in production, this should be handled by the backend
      const user = this.mockUsers.find(u => u.email === email)
      if (!user) return null
      
      // Mock password check - in production, this should be handled by the backend
      if (password !== "password123") return null

      return user
    } catch (error) {
      console.error("Login Error:", error)
      return null
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      // Mock user creation - in production, this should be handled by the backend
      const newUser = {
        id: this.mockUsers.length + 1,
        email: userData.email,
        role: userData.role,
        created_at: new Date().toISOString()
      }
      this.mockUsers.push(newUser)
      return newUser
    } catch (error) {
      console.error("Create User Error:", error)
      return null
    }
  }

  async fetchUsers(): Promise<any[]> {
    try {
      // Return mock users - in production, this should fetch from the backend
      return this.mockUsers
    } catch (error) {
      console.error("Fetch Users Error:", error)
      return []
    }
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const index = this.mockUsers.findIndex((u) => u.id === userId)
      if (index > -1) {
        this.mockUsers.splice(index, 1)
        return true
      }
      return false
    } catch (error) {
      console.error("Delete User Error:", error)
      return false
    }
  }

  // Settings APIs (mock implementation)
  async updateApiKeys(keys: any): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem("wardenx_api_keys", JSON.stringify(keys))
      return true
    } catch (error) {
      console.error("Update API Keys Error:", error)
      return false
    }
  }

  async testApiKey(service: string, key: string): Promise<boolean> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Mock test - return success for valid-looking keys
      return key.length > 10
    } catch (error) {
      console.error("Test API Key Error:", error)
      return false
    }
  }

  // Threat Intelligence APIs (mock implementation)
  async fetchNewsArticles(): Promise<any[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      return [
        {
          title: "New Ransomware Campaign Targets Healthcare Sector",
          content:
            "Security researchers have identified a new ransomware campaign specifically targeting healthcare organizations...",
          url: "https://example.com/news/1",
          publishedAt: new Date().toISOString(),
        },
        {
          title: "Critical Vulnerability Discovered in Popular Web Framework",
          content:
            "A critical remote code execution vulnerability has been discovered in a widely-used web framework...",
          url: "https://example.com/news/2",
          publishedAt: new Date().toISOString(),
        },
      ]
    } catch (error) {
      console.error("News API Error:", error)
      return []
    }
  }

  async generateAISummary(content: string): Promise<string> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return "AI-generated summary: This appears to be a significant security threat that requires immediate attention. The indicators suggest potential malicious activity that should be investigated further."
    } catch (error) {
      console.error("AI Summary Error:", error)
      return "Summary generation failed"
    }
  }

  // WAZUH APIs (mock implementation)
  async fetchWazuhAlerts(): Promise<any[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return [
        {
          id: 1,
          rule_id: "100001",
          level: 7,
          description: "Multiple failed login attempts",
          timestamp: new Date().toISOString(),
          agent: {
            id: "001",
            name: "Windows-Server-01"
          }
        },
        {
          id: 2,
          rule_id: "100002",
          level: 12,
          description: "Suspicious process execution",
          timestamp: new Date().toISOString(),
          agent: {
            id: "002",
            name: "Linux-Server-01"
          }
        }
      ]
    } catch (error) {
      console.error("Wazuh Alerts Error:", error)
      return []
    }
  }

  async fetchWazuhLogs(): Promise<any[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          level: "info",
          message: "System startup completed successfully",
          agent: {
            id: "001",
            name: "Windows-Server-01"
          }
        }
      ]
    } catch (error) {
      console.error("Wazuh Logs Error:", error)
      return []
    }
  }

  // Case Management
  async createCase(caseData: any): Promise<any> {
    try {
      const newCase = {
        id: ++this.lastCaseId,
        ...caseData,
        created_at: new Date().toISOString()
      }
      this.mockCases.push(newCase)
      return newCase
    } catch (error) {
      console.error("Create Case Error:", error)
      return null
    }
  }

  async updateCase(caseId: number, updateData: any): Promise<any> {
    try {
      const index = this.mockCases.findIndex(c => c.id === caseId)
      if (index === -1) return null

      const updatedCase = {
        ...this.mockCases[index],
        ...updateData,
        updated_at: new Date().toISOString()
      }
      this.mockCases[index] = updatedCase
      return updatedCase
    } catch (error) {
      console.error("Update Case Error:", error)
      return null
    }
  }

  async fetchCases(): Promise<any[]> {
    try {
      return this.mockCases
    } catch (error) {
      console.error("Fetch Cases Error:", error)
      return []
    }
  }

  // IOC Management
  async createIOC(iocData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...iocData,
        checked_at: new Date().toISOString()
      }
    } catch (error) {
      console.error("Create IOC Error:", error)
      return null
    }
  }

  async fetchIOCs(): Promise<any[]> {
    try {
      // Mock implementation
      return []
    } catch (error) {
      console.error("Fetch IOCs Error:", error)
      return []
    }
  }

  // Case Notes
  async createCaseNote(noteData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...noteData,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error("Create Case Note Error:", error)
      return null
    }
  }

  async fetchCaseNotes(caseId: number): Promise<any[]> {
    try {
      // Mock implementation
      return []
    } catch (error) {
      console.error("Fetch Case Notes Error:", error)
      return []
    }
  }

  // Threat Intelligence
  async createTIReport(reportData: any): Promise<any> {
    try {
      // Mock implementation
      return {
        id: Date.now(),
        ...reportData,
        created_at: new Date().toISOString()
      }
    } catch (error) {
      console.error("Create TI Report Error:", error)
      return null
    }
  }

  async fetchTIReports(): Promise<any[]> {
    try {
      // Mock implementation
      return []
    } catch (error) {
      console.error("Fetch TI Reports Error:", error)
      return []
    }
  }

  // Wazuh Alerts
  async createWazuhAlert(alertData: any): Promise<any> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        id: Date.now(),
        ...alertData,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error("Create Wazuh Alert Error:", error)
      return null
    }
  }

  // SLA Management
  async fetchSLAPolicies(): Promise<any[]> {
    try {
      return this.mockSLAPolicies
    } catch (error) {
      console.error("Fetch SLA Policies Error:", error)
      return []
    }
  }

  async updateSLAPolicy(policyId: number, updateData: any): Promise<any> {
    try {
      const index = this.mockSLAPolicies.findIndex(p => p.id === policyId)
      if (index === -1) return null

      const updatedPolicy = {
        ...this.mockSLAPolicies[index],
        ...updateData,
      }
      this.mockSLAPolicies[index] = updatedPolicy
      return updatedPolicy
    } catch (error) {
      console.error("Update SLA Policy Error:", error)
      return null
    }
  }
}

export const apiService = new APIService()
