export interface DataType {
  key: string;
  no: string | number;
  process: string;
  id?: string;
  isActive?: boolean;
  // Assessment of Adequacy fields
  date?: string;
  designAdequacyScore?: number;
  sustainabilityScore?: number;
  scalabilityScore?: number;
  adequacyScore?: number;
  designScore?: number;
  operatingScore?: number;
  effectivenessScore?: number;
  efficiencyScore?: number;
  totalScore?: number;
  scale?: number;
  rating?: string;
  severityLevel?: string;
  impact?: string;
  likelihood?: string;
  // Existing fields
  processDescription?: string;
  processObjective?: string;
  processSeverityLevels?: string;
  activity?: string;
  process2?: string;
  stage?: string;
  functions?: string;
  clientSegment?: string;
  operationalUnit?: string;
  division?: string;
  entity?: string;
  unitDepartment?: string;
  productClass?: string;
  productName?: string;
  integrityEthical?: boolean;
  boardOversight?: boolean;
  orgStructure?: boolean;
  commitmentCompetence?: boolean;
  managementPhilosophy?: boolean;
  riskResponseType?: string;
  controlObjectives?: string;
  controlRef?: string;
  controlDefinition?: string;
  controlDescription?: string;
  controlResponsibility?: string;
  keyControl?: string;
  zeroTolerance?: string;
  levelResponsibility?: string;
  cosoPrinciple?: string;
  operationalApproach?: string;
  operationalFrequency?: string;
  controlClassification?: string;
  riskType?: string;
  riskDescription?: string;
  severityImpact?: string;
  probabilityLikelihood?: string;
  classification?: string;
  soxControlActivity?: string;
  internalAuditTest?: string;
  sampleSize?: string;
  assignmentAuthority?: boolean;
  hrPolicies?: boolean;
  boardAudit?: boolean;
  managementControl?: boolean;
  externalInfluences?: boolean;
  commitmentInternal?: boolean;
  enforcementIntegrity?: boolean;
  employeeAwareness?: boolean;
  accountability?: boolean;
  commitmentTransparency?: boolean;
  [key: string]: any; // flexible for dynamic columns
}
// Add this to your types.ts file
export interface ProcessData {
  No: number;
  "Main Process": string;
  "Process Description": string;
  "Process Objectives": string;
  "Process Severity Levels": string;
  key?: string;
}

export interface ImportedData {
  Process: ProcessData[];
}
// Add to your types.ts
export interface MultipleTablesData {
  [key: string]: ProcessData[];
}
