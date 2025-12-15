// src/utils/sectionMappings.ts
export const SECTION_TO_BASE_ENDPOINT: Record<string, string> = {
  Process: "Processes",
  Ownership: "Ownerships",
  "COSO-Control Environment": "CosoControlEnvironments",
  "INTOSAI, IFAC, and Government Audit Standards - Control Environment":
    "IntosaiIfacControlEnvironments",
  "Other- - Control Environment": "OtherControlEnvironments",
  "Risk Assessment (Inherent Risk)": "RiskAssessmentInherentRisks",
  "Risk Assessment  (Inherent Risk)": "RiskAssessmentInherentRisks",
  "Risk Responses": "RiskResponses",
  "Control Activities": "ControlActivities",
  "Control Assessment": "ControlAssessments",
  "Risk Assessment (Residual Risk)": "RiskAssessmentResidualRisks",
  SOX: "Sox",
  "Financial Statement Assertions": "FinancialStatementAssertions",
  "Internal Audit Test": "InternalAuditTests",
  "GRC Exception Log": "GrcExceptionLogs",
  "Assessment of Adequacy": "AssessmentOfAdequacy",
  "Assessment of Effectiveness": "AssessmentOfEffectiveness",
  "Assessment of Efficiency": "AssessmentOfEfficiency",
  "Process Severity": "ProcessSeverity",
};

export const normalizeSectionName = (section: string): string => {
  return String(section ?? "")
    .replace(/\s+/g, " ")
    .trim();
};

export const getEndpointForSection = (section: string): string | undefined => {
  const direct = SECTION_TO_BASE_ENDPOINT[section];
  if (direct) return direct;

  const normalized = normalizeSectionName(section);
  const matchedKey = Object.keys(SECTION_TO_BASE_ENDPOINT).find(
    (k) => normalizeSectionName(k) === normalized
  );
  if (matchedKey) return SECTION_TO_BASE_ENDPOINT[matchedKey];

  return undefined;
};
