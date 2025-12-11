// src/services/processService.ts
import { apiClientDotNet } from "@/config/apiClientDotNet";

// Base interface
interface BaseProcessData {
  Id?: string;
  Date?: string;
  No: number;
  Process: string;
  [key: string]: any;
}

// Process
export interface Process extends BaseProcessData {
  "Process Description"?: string;
  "Process Objectives"?: string;
  "Process Severity Levels"?: string;
}

// Control Activity
export interface ControlActivity extends BaseProcessData {
  "Control Objectives"?: string;
  "Control Ref"?: string;
  "Control Definition"?: string;
  "Control Description"?: string;
  "Control Responsibility"?: string;
  "Key Control"?: string;
  "Zero Tolerance"?: string;
}

// Control Assessment
export interface ControlAssessment extends BaseProcessData {
  "Risk Description"?: string;
  Probability?: string;
  Severity?: string;
  Classification?: string;
  "Level of Responsibility-Operating Level (Entity / Activity)"?: string;
  "COSO Principle #"?: string;
  "Operational Approach (Automated / Manual)"?: string;
  "Operational Frequency"?: string;
  "Control Classification (Preventive / Detective / Corrective)"?: string;
}

// COSO Control Environment
export interface CosoControlEnvironment extends BaseProcessData {
  "Integrity & Ethical Values"?: string;
  "Board Oversight"?: string;
  "Organizational Structure"?: string;
  "Commitment to Competence"?: string;
  "Management Philosophy"?: string;
}

// Financial Statement Assertions
export interface FinancialStatementAssertion extends BaseProcessData {
  "Internal Control Over Financial Reporting?"?: string;
  Occurrence?: string;
  Completeness?: string;
  Accuracy?: string;
  Authorization?: string;
  Cutoff?: string;
  "Classification and Understandability"?: string;
  Existence?: string;
  "Rights and Obligations"?: string;
  "Valuation and Allocation"?: string;
  "Presentation / Disclosure"?: string;
  Assertion?: string;
  Description?: string;
  Relevant?: string;
}

// GRC Exception Log
export interface GrcExceptionLog extends BaseProcessData {
  "GRC Adequacy"?: string;
  "GRC Effectiveness"?: string;
  Explanation?: string;
}

// Internal Audit Test
export interface InternalAuditTest extends BaseProcessData {
  Check?: string;
  "Internal Audit Test"?: string;
  "Sample Size"?: string;
  "Test Procedure"?: string;
  Results?: string;
}

// INTOSAI IFAC Control Environment
export interface IntosaiIfacControlEnvironment extends BaseProcessData {
  "Integrity and Ethical Values"?: string;
  "Commitment to Competence"?: string;
  "Management's Philosophy and Operating Style"?: string;
  "Organizational Structure"?: string;
  "Assignment of Authority and Responsibility"?: string;
  "Human Resource Policies and Practices"?: string;
  "Board of Directors' or Audit Committee's Participation"?: string;
  "Management Control Methods"?: string;
  "External Influences"?: string;
  "Management's Commitment to Internal Control"?: string;
  "Communication and Enforcement of Integrity and Ethical Values"?: string;
  "Employee Awareness and Understanding"?: string;
  "Accountability and Performance Measurement"?: string;
  "Commitment to Transparency and Openness"?: string;
}

// Other Control Environment
export interface OtherControlEnvironment extends BaseProcessData {
  "Responsibility Delegation Matrix"?: string;
  "Segregation of duties"?: string;
  "Reporting Lines"?: string;
  Mission?: string;
  "Vision and Values"?: string;
  "Goals and Objectives"?: string;
  "Structures & Systems"?: string;
  "Policies and Procedures"?: string;
  Processes?: string;
  "Integrity and Ethical Values"?: string;
  "Oversight structure"?: string;
  Standards?: string;
  Methodologies?: string;
  "Rules and Regulations"?: string;
}

// Ownership
export interface Ownership extends BaseProcessData {
  "Main Process"?: string;
  Activity?: string;
  "Process Stage"?: string;
  Functions?: string;
  "Client Segment and/or Functional Segment"?: string;
  "Operational Unit"?: string;
  Division?: string;
  Entity?: string;
  "Unit / Department"?: string;
  "Product Class"?: string;
  "Product Name"?: string;
  Owner?: string;
  Department?: string;
  Role?: string;
}

// Risk Assessment
export interface RiskAssessment extends BaseProcessData {
  "Risk Type"?: string;
  "Risk Description"?: string;
  "Severity/ Impact"?: string;
  "Probability/ Likelihood"?: string;
  Classification?: string;
  "Inherent Risk"?: string;
  "Residual Risk"?: string;
}

// Risk Response
export interface RiskResponse extends BaseProcessData {
  "Type of Risk Response"?: string;
  "Risk Response"?: string;
  "Risk Response Description"?: string;
  "Risk Response Type"?: string;
}

// SOX
export interface Sox extends BaseProcessData {
  "SOX Control Activity"?: string;
}

// Assessment of Adequacy
export interface AssessmentOfAdequacy extends BaseProcessData {
  DesignAdequacyScore?: number;
  SustainabilityScore?: number;
  ScalabilityScore?: number;
  AdequacyScore?: number;
  TotalScore?: string;
  Scale?: number;
  Rating?: string;
}

// Assessment of Effectiveness
export interface AssessmentOfEffectiveness extends BaseProcessData {
  DesignScore?: number;
  OperatingScore?: number;
  SustainabilityScore?: number;
  EffectivenessScore?: number;
  TotalScore?: string;
  Scale?: number;
  Rating?: string;
}

// Assessment of Efficiency
export interface AssessmentOfEfficiency extends BaseProcessData {
  ObjectiveAchievementScore?: number;
  TimelinessThroughputScore?: number;
  ResourceConsumptionScore?: number;
  EfficiencyScore?: number;
  TotalScore?: string;
  Scale?: number;
  Rating?: string;
}

// Process Severity
export interface ProcessSeverity extends BaseProcessData {
  Scale?: number;
  Rating?: string;
}

// API Service Functions
export const processService = {
  // Create a new record
  async create(tabKey: string, data: any) {
    const endpoint = this.getEndpoint(tabKey);
    return apiClientDotNet.post(`/${endpoint}`, data);
  },

  // Update an existing record
  async update(tabKey: string, data: any) {
    const endpoint = this.getEndpoint(tabKey);
    return apiClientDotNet.put(`/${endpoint}/${data.Id}`, data);
  },

  // Delete a record
  async delete(tabKey: string, id: string) {
    const endpoint = this.getEndpoint(tabKey);
    return apiClientDotNet.delete(`/${endpoint}/${id}`);
  },

  // Get all records for a tab
  async getAll(tabKey: string) {
    const endpoint = this.getEndpoint(tabKey);
    return apiClientDotNet.get(`/${endpoint}`);
  },

  // Get a single record by ID
  async getById(tabKey: string, id: string) {
    const endpoint = this.getEndpoint(tabKey);
    return apiClientDotNet.get(`/${endpoint}/${id}`);
  },

  // Helper to get the correct endpoint based on tab key
  getEndpoint(tabKey: string): string {
    const endpoints: { [key: string]: string } = {
      processes: "Processes",
      "control-activities": "ControlActivities",
      "control-assessments": "ControlAssessments",
      "coso-control-environments": "CosoControlEnvironments",
      "financial-statement-assertions": "FinancialStatementAssertions",
      "grc-exception-logs": "GrcExceptionLogs",
      "internal-audit-tests": "InternalAuditTests",
      "intosai-ifac-control-environments": "IntosaiIfacControlEnvironments",
      "other-control-environments": "OtherControlEnvironments",
      ownerships: "Ownerships",
      "risk-assessment-inherent-risks": "RiskAssessmentInherentRisks",
      "risk-assessment-residual-risks": "RiskAssessmentResidualRisks",
      "risk-responses": "RiskResponses",
      sox: "Sox",
      "assessment-adequacies": "AssessmentOfAdequacy",
      "assessment-effectivenesses": "AssessmentOfEffectiveness",
      "assessment-efficiencies": "AssessmentOfEfficiency",
      "process-severities": "ProcessSeverity",
    };
    return endpoints[tabKey] || "";
  },

  // Original individual create functions (kept for backward compatibility)
  createProcess: async (data: Omit<Process, "Id" | "Date">) => {
    const response = await apiClientDotNet.post("/Processes", data);
    return response.data;
  },

  createControlActivity: async (data: Omit<ControlActivity, "Id" | "Date">) => {
    const response = await apiClientDotNet.post("/ControlActivities", data);
    return response.data;
  },

  createControlAssessment: async (
    data: Omit<ControlAssessment, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post("/ControlAssessments", data);
    return response.data;
  },

  createCosoControlEnvironment: async (
    data: Omit<CosoControlEnvironment, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post(
      "/CosoControlEnvironments",
      data
    );
    return response.data;
  },

  createFinancialStatementAssertion: async (
    data: Omit<FinancialStatementAssertion, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post(
      "/FinancialStatementAssertions",
      data
    );
    return response.data;
  },

  createGrcExceptionLog: async (data: Omit<GrcExceptionLog, "Id" | "Date">) => {
    const response = await apiClientDotNet.post("/GrcExceptionLogs", data);
    return response.data;
  },

  createInternalAuditTest: async (
    data: Omit<InternalAuditTest, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post("/InternalAuditTests", data);
    return response.data;
  },

  createIntosaiIfacControlEnvironment: async (
    data: Omit<IntosaiIfacControlEnvironment, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post(
      "/IntosaiIfacControlEnvironments",
      data
    );
    return response.data;
  },

  createOtherControlEnvironment: async (
    data: Omit<OtherControlEnvironment, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post(
      "/OtherControlEnvironments",
      data
    );
    return response.data;
  },

  createOwnership: async (data: Omit<Ownership, "Id" | "Date">) => {
    const response = await apiClientDotNet.post("/Ownerships", data);
    return response.data;
  },

  createRiskAssessmentInherentRisk: async (
    data: Omit<RiskAssessment, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post(
      "/RiskAssessmentInherentRisks",
      data
    );
    return response.data;
  },

  createRiskAssessmentResidualRisk: async (
    data: Omit<RiskAssessment, "Id" | "Date">
  ) => {
    const response = await apiClientDotNet.post(
      "/RiskAssessmentResidualRisks",
      data
    );
    return response.data;
  },

  createRiskResponse: async (data: Omit<RiskResponse, "Id" | "Date">) => {
    const response = await apiClientDotNet.post("/RiskResponses", data);
    return response.data;
  },

  createSox: async (data: Omit<Sox, "Id" | "Date">) => {
    const response = await apiClientDotNet.post("/Sox", data);
    return response.data;
  },
};

// Helper function to get the appropriate service function based on the tab
// (Kept for backward compatibility)
export const getServiceForTab = (tabKey: string) => {
  const serviceMap: { [key: string]: any } = {
    processes: processService.createProcess,
    "control-activities": processService.createControlActivity,
    "control-assessments": processService.createControlAssessment,
    "coso-control-environments": processService.createCosoControlEnvironment,
    "financial-statement-assertions":
      processService.createFinancialStatementAssertion,
    "grc-exception-logs": processService.createGrcExceptionLog,
    "internal-audit-tests": processService.createInternalAuditTest,
    "intosai-ifac-control-environments":
      processService.createIntosaiIfacControlEnvironment,
    "other-control-environments": processService.createOtherControlEnvironment,
    ownerships: processService.createOwnership,
    "risk-assessment-inherent-risks":
      processService.createRiskAssessmentInherentRisk,
    "risk-assessment-residual-risks":
      processService.createRiskAssessmentResidualRisk,
    "risk-responses": processService.createRiskResponse,
    sox: processService.createSox,
  };

  return serviceMap[tabKey] || null;
};
