// src/components/sections/AccountReceivable/usePreloadAllSections.ts

import { useEffect } from "react";
import { apiClientDotNet } from "@/config/apiClientDotNet";
import { SECTION_TO_BASE_ENDPOINT } from "@/utils/sectionMappings";
import { DataType } from "./types";

const allSections = [
  "Process",
  "Ownership",
  "COSO-Control Environment",
  "INTOSAI, IFAC, and Government Audit Standards - Control Environment",
  "Other- - Control Environment",
  "Risk Assessment (Inherent Risk)",
  "Risk Responses",
  "Control Activities",
  "Control Assessment",
  "Risk Assessment (Residual Risk)",
  "SOX",
  "Financial Statement Assertions",
  "Internal Audit Test",
  "GRC Exception Log",
] as const;

type SectionKey = (typeof allSections)[number];

export const usePreloadAllSections = (
  dataBySection: Record<string, DataType[]>,
  setDataBySection: React.Dispatch<
    React.SetStateAction<Record<string, DataType[]>>
  >
) => {
  useEffect(() => {
    const loadAllData = async () => {
      for (const section of allSections) {
        if (dataBySection[section]?.length > 0) continue;

        const endpoint = SECTION_TO_BASE_ENDPOINT[section];
        if (!endpoint) continue;

        try {
          const response = await apiClientDotNet.get(`/${endpoint}`, {
            params: {
              page: 1,
              pageSize: 10000,
              search: "",
              sortByNoAsc: true,
            },
          });

          const items: any[] = response.data.items || response.data.Items || [];

          const toCheckboxBool = (v: any) => v === "P";
          const toYesNo = (v: any) =>
            v === "P" ? "Yes" : v === "O" ? "No" : v;

          const mappedItems = items.map((item: any) => {
            const base: any = {
              key: item.Id ?? String(item.id ?? item.key ?? Date.now()),
              id: item.Id ?? item.id,
              no: item.No ?? item.no ?? "",
              process:
                item["Main Process"] ??
                item.MainProcess ??
                item.Process ??
                item.process ??
                "",
            };

            switch (section) {
              case "Process":
                return {
                  ...base,
                  processDescription:
                    item["Process Description"] ?? item.processDescription,
                  processObjective:
                    item["Process Objectives"] ?? item.processObjective,
                  processSeverityLevels:
                    item["Process Severity Levels"] ??
                    item.processSeverityLevels,
                };
              case "Ownership":
                return {
                  ...base,
                  activity: item.Activity ?? item.activity,
                  process2: item.Process ?? item.process2 ?? "",
                  stage: item["Process Stage"] ?? item.stage,
                  functions: item.Functions ?? item.functions,
                  clientSegment:
                    item["Client Segment and/or Functional Segment"] ??
                    item.clientSegment,
                  operationalUnit:
                    item["Operational Unit"] ?? item.operationalUnit,
                  division: item.Division ?? item.division,
                  entity: item.Entity ?? item.entity,
                  unitDepartment:
                    item["Unit / Department"] ?? item.unitDepartment,
                  productClass: item["Product Class"] ?? item.productClass,
                  productName: item["Product Name"] ?? item.productName,
                };
              case "COSO-Control Environment":
                return {
                  ...base,
                  integrityEthical: toCheckboxBool(
                    item["Integrity & Ethical Values"] ?? item.integrityEthical
                  ),
                  boardOversight: toCheckboxBool(
                    item["Board Oversight"] ?? item.boardOversight
                  ),
                  orgStructure: toCheckboxBool(
                    item["Organizational Structure"] ?? item.orgStructure
                  ),
                  commitmentCompetence: toCheckboxBool(
                    item["Commitment to Competence"] ??
                      item.commitmentCompetence
                  ),
                  managementPhilosophy: toCheckboxBool(
                    item["Management Philosophy"] ?? item.managementPhilosophy
                  ),
                };
              case "Risk Responses":
                return {
                  ...base,
                  riskResponseType:
                    item["Type of Risk Response"] ??
                    item.riskResponseType ??
                    "",
                };
              case "Control Activities":
                return {
                  ...base,
                  controlObjectives:
                    item["Control Objectives"] ?? item.controlObjectives ?? "",
                  controlRef: item["Control Ref"] ?? item.controlRef ?? "",
                  controlDefinition:
                    item["Control Definition"] ?? item.controlDefinition ?? "",
                  controlDescription:
                    item["Control Description"] ??
                    item.controlDescription ??
                    "",
                  controlResponsibility:
                    item["Control Responsibility"] ??
                    item.controlResponsibility ??
                    "",
                  keyControl: toYesNo(item["Key Control"] ?? item.keyControl),
                  zeroTolerance: toYesNo(
                    item["Zero Tolerance"] ?? item.zeroTolerance
                  ),
                };
              case "INTOSAI, IFAC, and Government Audit Standards - Control Environment":
                return {
                  ...base,
                  integrityEthical: toCheckboxBool(
                    item["Integrity and Ethical Values"] ??
                      item.integrityEthical
                  ),
                  commitmentCompetence: toCheckboxBool(
                    item["Commitment to Competence"] ??
                      item.commitmentCompetence
                  ),
                  managementPhilosophy: toCheckboxBool(
                    item["Management’s Philosophy and Operating Style"] ??
                      item.managementPhilosophy
                  ),
                  orgStructure: toCheckboxBool(
                    item["Organizational Structure"] ?? item.orgStructure
                  ),
                  assignmentAuthority: toCheckboxBool(
                    item["Assignment of Authority and Responsibility"] ??
                      item.assignmentAuthority
                  ),
                  hrPolicies: toCheckboxBool(
                    item["Human Resource Policies and Practices"] ??
                      item.hrPolicies
                  ),
                  boardAudit: toCheckboxBool(
                    item[
                      "Board of Directors’ or Audit Committee’s Participation"
                    ] ?? item.boardAudit
                  ),
                  managementControl: toCheckboxBool(
                    item["Management Control Methods"] ?? item.managementControl
                  ),
                  externalInfluences: toCheckboxBool(
                    item["External Influences"] ?? item.externalInfluences
                  ),
                  commitmentInternal: toCheckboxBool(
                    item["Management’s Commitment to Internal Control"] ??
                      item.commitmentInternal
                  ),
                  enforcementIntegrity: toCheckboxBool(
                    item[
                      "Communication and Enforcement of Integrity and Ethical Values"
                    ] ?? item.enforcementIntegrity
                  ),
                  employeeAwareness: toCheckboxBool(
                    item["Employee Awareness and Understanding"] ??
                      item.employeeAwareness
                  ),
                  accountability: toCheckboxBool(
                    item["Accountability and Performance Measurement"] ??
                      item.accountability
                  ),
                  commitmentTransparency: toCheckboxBool(
                    item["Commitment to Transparency and Openness"] ??
                      item.commitmentTransparency
                  ),
                };
              case "Control Assessment":
                return {
                  ...base,
                  levelResponsibility:
                    item[
                      "Level of Responsibility-Operating Level (Entity / Activity)"
                    ] ?? item.levelResponsibility,
                  cosoPrinciple: item["COSO Principle #"] ?? item.cosoPrinciple,
                  operationalApproach:
                    item["Operational Approach (Automated / Manual)"] ??
                    item.operationalApproach,
                  operationalFrequency:
                    item["Operational Frequency"] ?? item.operationalFrequency,
                  controlClassification:
                    item[
                      "Control Classification (Preventive / Detective / Corrective)"
                    ] ?? item.controlClassification,
                };
              case "Risk Assessment (Inherent Risk)":
                return {
                  ...base,
                  riskType: item["Risk Type"] ?? item.riskType,
                  riskDescription:
                    item["Risk Description"] ?? item.riskDescription,
                  severityImpact:
                    item["Severity/ Impact"] ?? item.severityImpact,
                  probabilityLikelihood:
                    item["Probability/ Likelihood"] ??
                    item.probabilityLikelihood,
                  classification: item["Classification"] ?? item.classification,
                };
              case "Risk Assessment (Residual Risk)":
                return {
                  ...base,
                  riskType: item["Risk Type"] ?? item.riskType,
                  riskDescription:
                    item["Risk Description"] ?? item.riskDescription,
                  severityImpact:
                    item["Severity/ Impact"] ?? item.severityImpact,
                  probabilityLikelihood:
                    item["Probability/ Likelihood"] ??
                    item.probabilityLikelihood,
                  classification: item["Classification"] ?? item.classification,
                };
              case "SOX":
                return {
                  ...base,
                  soxControlActivity:
                    item["SOX Control Activity"] ?? item.soxControlActivity,
                };
              case "Internal Audit Test":
                return {
                  ...base,
                  check: item.Check === "P" ? true : item.check,
                  internalAuditTest:
                    item["Internal Audit Test"] ?? item.internalAuditTest,
                  sampleSize: item["Sample Size"] ?? item.sampleSize,
                };
              case "GRC Exception Log":
                return {
                  ...base,
                  grcAdequacy: item["GRC Adequacy"] ?? item.grcAdequacy,
                  grcEffectiveness:
                    item["GRC Effectiveness"] ?? item.grcEffectiveness,
                  explanation: item["Explanation"] ?? item.explanation,
                };
              case "Financial Statement Assertions":
                return {
                  ...base,
                  internalControlOverFinancialReporting:
                    item["Internal Control Over Financial Reporting?"] === "P"
                      ? true
                      : item["Internal Control Over Financial Reporting?"] ===
                        "O"
                      ? false
                      : item.internalControlOverFinancialReporting,
                  occurrence: item.Occurrence === "P" ? true : item.occurrence,
                  completeness:
                    item.Completeness === "P" ? true : item.completeness,
                  accuracy: item.Accuracy === "P" ? true : item.accuracy,
                  authorization:
                    item.Authorization === "P" ? true : item.authorization,
                  cutoff: item.Cutoff === "P" ? true : item.cutoff,
                  classificationAndUnderstandability:
                    item["Classification and Understandability"] === "P"
                      ? true
                      : item.classificationAndUnderstandability,
                  existence: item.Existence === "P" ? true : item.existence,
                  rightsAndObligations:
                    item["Rights and Obligations"] === "P"
                      ? true
                      : item.rightsAndObligations,
                  valuationAndAllocation:
                    item["Valuation and Allocation"] === "P"
                      ? true
                      : item.valuationAndAllocation,
                  presentationDisclosure:
                    item["Presentation / Disclosure"] === "P"
                      ? true
                      : item.presentationDisclosure,
                };
              case "Other- - Control Environment":
                return {
                  ...base,
                  responsibilityMatrix: toCheckboxBool(
                    item["Responsibility Delegation Matrix"]
                  ),
                  segregationDuties: toCheckboxBool(
                    item["Segregation of duties"]
                  ),
                  reportingLines: toCheckboxBool(item["Reporting Lines"]),
                  mission: toCheckboxBool(item["Mission"]),
                  visionValues: toCheckboxBool(item["Vision and Values"]),
                  goalsObjectives: toCheckboxBool(item["Goals and Objectives"]),
                  structuresSystems: toCheckboxBool(
                    item["Structures & Systems"]
                  ),
                  policiesProcedures: toCheckboxBool(
                    item["Policies and Procedures"]
                  ),
                  processes: toCheckboxBool(item["Processes"]),
                  integrityEthical: toCheckboxBool(
                    item["Integrity and Ethical Values"]
                  ),
                  oversightStructure: toCheckboxBool(
                    item["Oversight structure"]
                  ),
                  standards: toCheckboxBool(item["Standards"]),
                  methodologies: toCheckboxBool(item["Methodologies"]),
                  rulesRegulations: toCheckboxBool(
                    item["Rules and Regulations"]
                  ),
                };
              default:
                return base;
            }
          });

          // Sorting logic
          const parseNoParts = (noValue: any) => {
            const str = String(noValue ?? "");
            const [majorStr, minorStr] = str.split(".");
            return {
              major: parseInt(majorStr, 10) || 5,
              minor: parseInt(minorStr ?? "0", 10) || 0,
            };
          };

          const getSortableNo = (noValue: any) => {
            const { major, minor } = parseNoParts(noValue);
            return major * 1000 + minor;
          };

          const sortedItems = [...mappedItems].sort(
            (a, b) => getSortableNo(a.no) - getSortableNo(b.no)
          );

          setDataBySection((prev) => ({
            ...prev,
            [section]: sortedItems,
          }));
        } catch (error) {
          console.error(`Error preloading ${section}:`, error);
        }
      }
    };

    loadAllData();
  }, [dataBySection, setDataBySection]);
};
