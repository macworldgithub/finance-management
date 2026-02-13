"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { Table, Tabs, Spin, Button } from "antd";

import {
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { getColumns } from "./columns";

import { DataType } from "./types";

import * as XLSX from "xlsx";

import type { ColumnType } from "antd/es/table";

import { useDebouncedCallback, useDebounce } from "use-debounce";

import ExcelUploadModal from "./ExcelUploadModal";

import { apiClientDotNet } from "@/config/apiClientDotNet";

import { SECTION_TO_BASE_ENDPOINT } from "@/utils/sectionMappings";

import ProcessFormModal from "./ProcessFormModal";

import { importSectionData } from "@/utils/importSectionDataService";

import { useGlobalSearch } from "@/contexts/GlobalSearchContext";

export interface RCMAssessmentRef {
  triggerImport: (file: File) => void;
}

interface RCMAssessmentProps {
  initialTabKey?: string;

  onBackToLanding?: () => void;
}

const defaultNewRow = (maxNo: number): DataType => {
  const newKey = String(Date.now());

  const newNo = (maxNo + 0.1).toFixed(1);

  return {
    key: newKey,

    no: newNo,

    process: "",

    isActive: true,
  };
};

const RCMAssessment = forwardRef<RCMAssessmentRef, RCMAssessmentProps>(
  (props, ref) => {
    const tableWrapperRef = useRef<HTMLDivElement>(null);

    const topScrollbarRef = useRef<HTMLDivElement>(null);

    const scrollSyncRef = useRef<boolean>(true);

    const [activeTab, setActiveTab] = useState(props.initialTabKey ?? "1");

    const [dataBySection, setDataBySection] = useState<
      Record<string, DataType[]>
    >({});

    const [editingKeys, setEditingKeys] = useState<string[]>([]);

    const [originalData, setOriginalData] = useState<Record<string, DataType>>(
      {},
    );

    const [loading, setLoading] = useState(false);

    const { searchText } = useGlobalSearch();

    const debouncedSearchText = useDebounce(searchText, 500)[0];

    const [excelModalVisible, setExcelModalVisible] = useState(false);

    const [formModalVisible, setFormModalVisible] = useState(false);

    const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

    const [startSectionKey, setStartSectionKey] = useState<string | null>(null);

    const tableBodyRef = useRef<HTMLDivElement>(null);

    // Sync initial tab

    useEffect(() => {
      if (props.initialTabKey) setActiveTab(props.initialTabKey);
    }, [props.initialTabKey]);

    const getCurrentSection = useCallback(() => {
      const map: Record<string, string> = {
        "1": "Process",

        "11": "Assessment of Adequacy",

        "12": "Assessment of Effectiveness",

        "13": "Assessment of Efficiency",

        "14": "Process Severity",

        "15": "Ownership",

        "16": "OwnershipScorings",

        "17": "CECOSO",

        "18": "COSOEnvironmentScorings",

        "19": "CEINTOSAIIFACI",

        "20": "INTOSAIIFACIAssessment",
        "21": "CE-Other",
        "22": "CE-Other Assessment",
      };

      return map[activeTab] || "Process";
    }, [activeTab]);

    const currentSection = getCurrentSection();

    const tableData = dataBySection[currentSection] || [];

    const setTableData = (newData: DataType[]) =>
      setDataBySection((prev) => ({ ...prev, [currentSection]: newData }));

    const fetchData = useCallback(async () => {
      setLoading(true);

      const section = getCurrentSection();

      // Allow explicit overrides for CE-Other tabs
      let endpoint = SECTION_TO_BASE_ENDPOINT[section];
      if (activeTab === "21") endpoint = "OtherControlEnvironments";
      if (activeTab === "22") endpoint = "OtherControlEnvironmentScorings";

      try {
        const response = await apiClientDotNet.get(`/${endpoint}`, {
          params: {
            page: 1,

            pageSize: 10000,

            search: debouncedSearchText,

            sortByNoAsc: true,
          },
        });

        const items: any[] = response.data.items || response.data.Items || [];

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

          // Special mapping for CE-Other (tab 21) -> OtherControlEnvironments API response
          if (activeTab === "21" || section === "CE-Other") {
            return {
              ...base,
              date: item.Date ?? item.date ?? "",
              responsibilityMatrix:
                item["Responsibility Delegation Matrix"] ??
                item.responsibilityMatrix ??
                "",
              segregationDuties:
                item["Segregation of duties"] ?? item.segregationDuties ?? "",
              reportingLines:
                item["Reporting Lines"] ?? item.reportingLines ?? "",
              mission: item["Mission"] ?? item.mission ?? "",
              visionValues:
                item["Vision and Values"] ?? item.visionValues ?? "",
              goalsObjectives:
                item["Goals and Objectives"] ?? item.goalsObjectives ?? "",
              structuresSystems:
                item["Structures & Systems"] ?? item.structuresSystems ?? "",
              policiesProcedures:
                item["Policies and Procedures"] ??
                item.policiesProcedures ??
                "",
              processes: item["Processes"] ?? item.processes ?? "",
              integrityEthical:
                item["Integrity and Ethical Values"] ??
                item.integrityEthical ??
                "",
              oversightStructure:
                item["Oversight structure"] ?? item.oversightStructure ?? "",
              standards: item["Standards"] ?? item.standards ?? "",
              methodologies: item["Methodologies"] ?? item.methodologies ?? "",
              rulesRegulations:
                item["Rules and Regulations"] ?? item.rulesRegulations ?? "",
            } as DataType;
          }

          // Special mapping for CE-Other Assessment (tab 22) -> OtherControlEnvironmentScorings API response
          if (activeTab === "22" || section === "CE-Other Assessment") {
            return {
              ...base,
              date: item.Date ?? item.date ?? "",
              // Responsibility Delegation Matrix (RDM)
              responsibilityMatrix: item.ResponsibilityDelegationMatrix ?? "",
              rdmDesignScore: item.RdmDesignScore ?? 0,
              rdmPerformanceScore: item.RdmPerformanceScore ?? 0,
              rdmSustainabilityScore: item.RdmSustainabilityScore ?? 0,
              rdmTotalScore: item.RdmTotalScore ?? "",
              rdmScale: item.RdmScale ?? 0,
              rdmRating: item.RdmRating ?? "",
              // Segregation of Duties (SOD)
              segregationOfDuties: item.SegregationOfDuties ?? "",
              sodDesignScore: item.SodDesignScore ?? 0,
              sodPerformanceScore: item.SodPerformanceScore ?? 0,
              sodSustainabilityScore: item.SodSustainabilityScore ?? 0,
              sodTotalScore: item.SodTotalScore ?? "",
              sodScale: item.SodScale ?? 0,
              sodRating: item.SodRating ?? "",
              // Reporting Lines
              reportingLines: item.ReportingLines ?? "",
              reportingLinesDesignScore: item.ReportingLinesDesignScore ?? 0,
              reportingLinesPerformanceScore:
                item.ReportingLinesPerformanceScore ?? 0,
              reportingLinesSustainabilityScore:
                item.ReportingLinesSustainabilityScore ?? 0,
              reportingLinesTotalScore: item.ReportingLinesTotalScore ?? "",
              reportingLinesScale: item.ReportingLinesScale ?? 0,
              reportingLinesRating: item.ReportingLinesRating ?? "",
              // Mission
              mission: item.Mission ?? "",
              missionDesignScore: item.MissionDesignScore ?? 0,
              missionPerformanceScore: item.MissionPerformanceScore ?? 0,
              missionSustainabilityScore: item.MissionSustainabilityScore ?? 0,
              missionTotalScore: item.MissionTotalScore ?? "",
              missionScale: item.MissionScale ?? 0,
              missionRating: item.MissionRating ?? "",
              // Vision and Values
              visionAndValues: item.VisionAndValues ?? "",
              visionValuesDesignScore: item.VisionValuesDesignScore ?? 0,
              visionValuesPerformanceScore:
                item.VisionValuesPerformanceScore ?? 0,
              visionValuesSustainabilityScore:
                item.VisionValuesSustainabilityScore ?? 0,
              visionValuesTotalScore: item.VisionValuesTotalScore ?? "",
              visionValuesScale: item.VisionValuesScale ?? 0,
              visionValuesRating: item.VisionValuesRating ?? "",
              // Goals and Objectives
              goalsAndObjectives: item.GoalsAndObjectives ?? "",
              goalsObjectivesDesignScore: item.GoalsObjectivesDesignScore ?? 0,
              goalsObjectivesPerformanceScore:
                item.GoalsObjectivesPerformanceScore ?? 0,
              goalsObjectivesSustainabilityScore:
                item.GoalsObjectivesSustainabilityScore ?? 0,
              goalsObjectivesTotalScore: item.GoalsObjectivesTotalScore ?? "",
              goalsObjectivesScale: item.GoalsObjectivesScale ?? 0,
              goalsObjectivesRating: item.GoalsObjectivesRating ?? "",
              // Structures and Systems
              structuresAndSystems: item.StructuresAndSystems ?? "",
              structuresSystemsDesignScore:
                item.StructuresSystemsDesignScore ?? 0,
              structuresSystemsPerformanceScore:
                item.StructuresSystemsPerformanceScore ?? 0,
              structuresSystemsSustainabilityScore:
                item.StructuresSystemsSustainabilityScore ?? 0,
              structuresSystemsTotalScore:
                item.StructuresSystemsTotalScore ?? "",
              structuresSystemsScale: item.StructuresSystemsScale ?? 0,
              structuresSystemsRating: item.StructuresSystemsRating ?? "",
              // Policies and Procedures
              policiesAndProcedures: item.PoliciesAndProcedures ?? "",
              policiesProceduresDesignScore:
                item.PoliciesProceduresDesignScore ?? 0,
              policiesProceduresPerformanceScore:
                item.PoliciesProceduresPerformanceScore ?? 0,
              policiesProceduresSustainabilityScore:
                item.PoliciesProceduresSustainabilityScore ?? 0,
              policiesProceduresTotalScore:
                item.PoliciesProceduresTotalScore ?? "",
              policiesProceduresScale: item.PoliciesProceduresScale ?? 0,
              policiesProceduresRating: item.PoliciesProceduresRating ?? "",
              // Processes
              processes: item.Processes ?? "",
              processesDesignScore: item.ProcessesDesignScore ?? 0,
              processesPerformanceScore: item.ProcessesPerformanceScore ?? 0,
              processesSustainabilityScore:
                item.ProcessesSustainabilityScore ?? 0,
              processesTotalScore: item.ProcessesTotalScore ?? "",
              processesScale: item.ProcessesScale ?? 0,
              processesRating: item.ProcessesRating ?? "",
              // Integrity and Ethical Values
              integrityEthicalValues: item.IntegrityEthicalValues ?? "",
              integrityDesignScore: item.IntegrityDesignScore ?? 0,
              integrityPerformanceScore: item.IntegrityPerformanceScore ?? 0,
              integritySustainabilityScore:
                item.IntegritySustainabilityScore ?? 0,
              integrityTotalScore: item.IntegrityTotalScore ?? "",
              integrityScale: item.IntegrityScale ?? 0,
              integrityRating: item.IntegrityRating ?? "",
              // Oversight Structure
              oversightStructure: item.OversightStructure ?? "",
              oversightDesignScore: item.OversightDesignScore ?? 0,
              oversightPerformanceScore: item.OversightPerformanceScore ?? 0,
              oversightSustainabilityScore:
                item.OversightSustainabilityScore ?? 0,
              oversightTotalScore: item.OversightTotalScore ?? "",
              oversightScale: item.OversightScale ?? 0,
              oversightRating: item.OversightRating ?? "",
              // Standards
              standards: item.Standards ?? "",
              standardsDesignScore: item.StandardsDesignScore ?? 0,
              standardsPerformanceScore: item.StandardsPerformanceScore ?? 0,
              standardsSustainabilityScore:
                item.StandardsSustainabilityScore ?? 0,
              standardsTotalScore: item.StandardsTotalScore ?? "",
              standardsScale: item.StandardsScale ?? 0,
              standardsRating: item.StandardsRating ?? "",
              // Methodologies
              methodologies: item.Methodologies ?? "",
              methodologiesDesignScore: item.MethodologiesDesignScore ?? 0,
              methodologiesPerformanceScore:
                item.MethodologiesPerformanceScore ?? 0,
              methodologiesSustainabilityScore:
                item.MethodologiesSustainabilityScore ?? 0,
              methodologiesTotalScore: item.MethodologiesTotalScore ?? "",
              methodologiesScale: item.MethodologiesScale ?? 0,
              methodologiesRating: item.MethodologiesRating ?? "",
              // Rules and Regulations
              rulesAndRegulations: item.RulesAndRegulations ?? "",
              rulesRegsDesignScore: item.RulesRegsDesignScore ?? 0,
              rulesRegsPerformanceScore: item.RulesRegsPerformanceScore ?? 0,
              rulesRegsSustainabilityScore:
                item.RulesRegsSustainabilityScore ?? 0,
              rulesRegsTotalScore: item.RulesRegsTotalScore ?? "",
              rulesRegsScale: item.RulesRegsScale ?? 0,
              rulesRegsRating: item.RulesRegsRating ?? "",
            } as DataType;
          }

          switch (section) {
            case "Process":
              return {
                ...base,

                processDescription:
                  item["Process Description"] ?? item.processDescription,

                processObjective:
                  item["Process Objectives"] ?? item.processObjective,

                processSeverityLevels:
                  item["Process Severity Levels"] ?? item.processSeverityLevels,
              };

            case "Assessment of Adequacy":
              return {
                ...base,

                date: item.Date ?? item.date ?? "",

                designAdequacyScore: item.DesignAdequacyScore ?? 0,

                sustainabilityScore: item.SustainabilityScore ?? 0,

                scalabilityScore: item.ScalabilityScore ?? 0,

                adequacyScore: item.AdequacyScore ?? 0,

                totalScore: item.TotalScore ?? 0,

                scale: item.Scale ?? 0,

                rating: item.Rating ?? "",
              };

            case "Assessment of Effectiveness":
              return {
                ...base,

                date: item.Date ?? item.date ?? "",

                designScore: item.DesignScore ?? 0,

                operatingScore: item.OperatingScore ?? 0,

                sustainabilityScore: item.SustainabilityScore ?? 0,

                effectivenessScore: item.EffectivenessScore ?? 0,

                totalScore: item.TotalScore ?? 0,

                scale: item.Scale ?? 0,

                rating: item.Rating ?? "",
              };

            case "Assessment of Efficiency":
              return {
                ...base,

                date: item.Date ?? item.date ?? "",

                objectiveAchievementScore: item.ObjectiveAchievementScore ?? 0,

                timelinessThroughputScore: item.TimelinessThroughputScore ?? 0,

                resourceConsumptionScore: item.ResourceConsumptionScore ?? 0,

                efficiencyScore: item.EfficiencyScore ?? 0,

                totalScore: item.TotalScore ?? 0,

                scale: item.Scale ?? 0,

                rating: item.Rating ?? "",
              };

            case "Process Severity":
              return {
                ...base,

                date: item.Date ?? item.date ?? "",

                scale: item.Scale ?? 0,

                rating: item.Rating ?? "",

                processSeverityLevels: item.Rating ?? "",
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

            case "OwnershipScorings":
              return {
                ...base,

                date: item.Date ?? item.date ?? "",

                activity: item.Activity ?? "",

                activityScore: item.ActivityScore ?? 0,

                process2: item.Process ?? "",

                processScore: item.ProcessScore ?? 0,

                activationProcess: item.ActivationProcess ?? "",

                processStage: item.ProcessStage ?? "",

                processStageScore: item.ProcessStageScore ?? 0,

                totalScore: item.TotalScore ?? "",

                scale: item.Scale ?? 0,

                rating: item.Rating ?? "",

                function: item.Function ?? "",

                functionScore: item.FunctionScore ?? 0,

                clientSegmentAndOrFunctionalSegment:
                  item.ClientSegmentAndOrFunctionalSegment ?? "",

                clientSegmentScore: item.ClientSegmentScore ?? 0,

                operationalUnit: item.OperationalUnit ?? "",

                operationalUnitScore: item.OperationalUnitScore ?? 0,

                division: item.Division ?? "",

                divisionScore: item.DivisionScore ?? 0,

                entity: item.Entity ?? "",

                entityScore: item.EntityScore ?? 0,

                unitDepartment: item.UnitOrDepartment ?? "",

                unitDepartmentScore: item.UnitOrDepartmentScore ?? 0,

                productClass: item.ProductClass ?? "",

                productClassScore: item.ProductClassScore ?? 0,

                productName: item.ProductName ?? "",

                productNameScore: item.ProductNameScore ?? 0,
              };

            case "CECOSO":
              return {
                ...base,

                integrityEthical:
                  item["Integrity & Ethical Values"] ?? item.integrityEthical,

                boardOversight: item["Board Oversight"] ?? item.boardOversight,

                organizationalStructure:
                  item["Organizational Structure"] ??
                  item.organizationalStructure,

                commitmentToCompetence:
                  item["Commitment to Competence"] ??
                  item.commitmentToCompetence,

                managementPhilosophy:
                  item["Management Philosophy"] ?? item.managementPhilosophy,
              };

            case "COSOEnvironmentScorings":
              return {
                ...base,

                date: item.Date ?? item.date ?? "",

                integrityEthicalValues: item.IntegrityEthicalValues ?? "",

                integrityDesignScore: item.IntegrityDesignScore ?? 0,

                integrityPerformanceScore: item.IntegrityPerformanceScore ?? 0,

                integritySustainabilityScore:
                  item.IntegritySustainabilityScore ?? 0,

                integrityTotalScore: item.IntegrityTotalScore ?? "",

                integrityScale: item.IntegrityScale ?? 0,

                integrityRating: item.IntegrityRating ?? "",

                boardOversight: item.BoardOversight ?? "",

                boardDesignScore: item.BoardDesignScore ?? 0,

                boardPerformanceScore: item.BoardPerformanceScore ?? 0,

                boardSustainabilityScore: item.BoardSustainabilityScore ?? 0,

                boardTotalScore: item.BoardTotalScore ?? "",

                boardScale: item.BoardScale ?? 0,

                boardRating: item.BoardRating ?? "",

                organizationalStructure: item.OrganizationalStructure ?? "",

                orgStructureDesignScore: item.OrgStructureDesignScore ?? 0,

                orgStructurePerformanceScore:
                  item.OrgStructurePerformanceScore ?? 0,

                orgStructureSustainabilityScore:
                  item.OrgStructureSustainabilityScore ?? 0,

                orgStructureTotalScore: item.OrgStructureTotalScore ?? "",

                orgStructureScale: item.OrgStructureScale ?? 0,

                orgStructureRating: item.OrgStructureRating ?? "",

                commitmentToCompetence: item.CommitmentToCompetence ?? "",

                competenceDesignScore: item.CompetenceDesignScore ?? 0,

                competencePerformanceScore:
                  item.CompetencePerformanceScore ?? 0,

                competenceSustainabilityScore:
                  item.CompetenceSustainabilityScore ?? 0,

                competenceTotalScore: item.CompetenceTotalScore ?? "",

                competenceScale: item.CompetenceScale ?? 0,

                competenceRating: item.CompetenceRating ?? "",

                managementPhilosophy: item.ManagementPhilosophy ?? "",

                philosophyDesignScore: item.PhilosophyDesignScore ?? 0,

                philosophyPerformanceScore:
                  item.PhilosophyPerformanceScore ?? 0,

                philosophySustainabilityScore:
                  item.PhilosophySustainabilityScore ?? 0,

                philosophyTotalScore: item.PhilosophyTotalScore ?? "",

                philosophyScale: item.PhilosophyScale ?? 0,

                philosophyRating: item.PhilosophyRating ?? "",
              };

            case "CEINTOSAIIFACI":
              return {
                ...base,

                integrityAndEthicalValues:
                  item["Integrity and Ethical Values"] ?? "",

                commitmentToCompetence: item["Commitment to Competence"] ?? "",
                managementsPhilosophyAndOperatingStyle:
                  item["Management’s Philosophy and Operating Style"] ?? "",

                organizationalStructure: item["Organizational Structure"] ?? "",

                assignmentOfAuthorityAndResponsibility:
                  item["Assignment of Authority and Responsibility"] ?? "",

                humanResourcePoliciesAndPractices:
                  item["Human Resource Policies and Practices"] ?? "",

                boardOfDirectorsOrAuditCommitteeParticipation:
                  item[
                    "Board of Directors’ or Audit Committee’s Participation"
                  ] ?? "",

                managementControlMethods:
                  item["Management Control Methods"] ?? "",

                externalInfluences: item["External Influences"] ?? "",

                managementsCommitmentToInternalControl:
                  item["Management’s Commitment to Internal Control"] ?? "",

                communicationAndEnforcementOfIntegrityAndEthicalValues:
                  item[
                    "Communication and Enforcement of Integrity and Ethical Values"
                  ] ?? "",

                employeeAwarenessAndUnderstanding:
                  item["Employee Awareness and Understanding"] ?? "",

                accountabilityAndPerformanceMeasurement:
                  item["Accountability and Performance Measurement"] ?? "",

                commitmentToTransparencyAndOpenness:
                  item["Commitment to Transparency and Openness"] ?? "",
              };

            case "INTOSAIIFACIAssessment":
              return {
                ...base,
                integrityEthicalValues: item.IntegrityEthicalValues ?? "",
                integrityDesignScore: item.IntegrityDesignScore ?? 0,
                integrityPerformanceScore: item.IntegrityPerformanceScore ?? 0,
                integritySustainabilityScore:
                  item.IntegritySustainabilityScore ?? 0,
                integrityTotalScore: item.IntegrityTotalScore ?? "",
                integrityScale: item.IntegrityScale ?? 0,
                integrityRating: item.IntegrityRating ?? "",
                commitmentToCompetence: item.CommitmentToCompetence ?? "",
                competenceDesignScore: item.CompetenceDesignScore ?? 0,
                competencePerformanceScore:
                  item.CompetencePerformanceScore ?? 0,
                competenceSustainabilityScore:
                  item.CompetenceSustainabilityScore ?? 0,
                competenceTotalScore: item.CompetenceTotalScore ?? "",
                competenceScale: item.CompetenceScale ?? 0,
                competenceRating: item.CompetenceRating ?? "",
                managementPhilosophy: item.ManagementPhilosophy ?? "",
                philosophyDesignScore: item.PhilosophyDesignScore ?? 0,
                philosophyPerformanceScore:
                  item.PhilosophyPerformanceScore ?? 0,
                philosophySustainabilityScore:
                  item.PhilosophySustainabilityScore ?? 0,
                philosophyTotalScore: item.PhilosophyTotalScore ?? "",
                philosophyScale: item.PhilosophyScale ?? 0,
                philosophyRating: item.PhilosophyRating ?? "",
                organizationalStructure: item.OrganizationalStructure ?? "",
                orgStructureDesignScore: item.OrgStructureDesignScore ?? 0,
                orgStructurePerformanceScore:
                  item.OrgStructurePerformanceScore ?? 0,
                orgStructureSustainabilityScore:
                  item.OrgStructureSustainabilityScore ?? 0,
                orgStructureTotalScore: item.OrgStructureTotalScore ?? "",
                orgStructureScale: item.OrgStructureScale ?? 0,
                orgStructureRating: item.OrgStructureRating ?? "",
                assignmentOfAuthorityAndResponsibility:
                  item.AssignmentOfAuthorityAndResponsibility ?? "",
                authorityDesignScore: item.AuthorityDesignScore ?? 0,
                authorityPerformanceScore: item.AuthorityPerformanceScore ?? 0,
                authoritySustainabilityScore:
                  item.AuthoritySustainabilityScore ?? 0,
                authorityTotalScore: item.AuthorityTotalScore ?? "",
                authorityScale: item.AuthorityScale ?? 0,
                authorityRating: item.AuthorityRating ?? "",
                humanResourcePoliciesAndPractices:
                  item.HumanResourcePoliciesAndPractices ?? "",
                hrDesignScore: item.HrDesignScore ?? 0,
                hrPerformanceScore: item.HrPerformanceScore ?? 0,
                hrSustainabilityScore: item.HrSustainabilityScore ?? 0,
                hrTotalScore: item.HrTotalScore ?? "",
                hrScale: item.HrScale ?? 0,
                hrRating: item.HrRating ?? "",
                boardOfDirectorsOrAuditCommitteeParticipation:
                  item.BoardOrAuditCommitteeParticipation ?? "",
                boardDesignScore: item.BoardDesignScore ?? 0,
                boardPerformanceScore: item.BoardPerformanceScore ?? 0,
                boardSustainabilityScore: item.BoardSustainabilityScore ?? 0,
                boardTotalScore: item.BoardTotalScore ?? "",
                boardScale: item.BoardScale ?? 0,
                boardRating: item.BoardRating ?? "",
                managementControlMethods: item.ManagementControlMethods ?? "",
                controlMethodsDesignScore: item.ControlMethodsDesignScore ?? 0,
                controlMethodsPerformanceScore:
                  item.ControlMethodsPerformanceScore ?? 0,
                controlMethodsSustainabilityScore:
                  item.ControlMethodsSustainabilityScore ?? 0,
                controlMethodsTotalScore: item.ControlMethodsTotalScore ?? "",
                controlMethodsScale: item.ControlMethodsScale ?? 0,
                controlMethodsRating: item.ControlMethodsRating ?? "",
                externalInfluences: item.ExternalInfluences ?? "",
                externalDesignScore: item.ExternalDesignScore ?? 0,
                externalPerformanceScore: item.ExternalPerformanceScore ?? 0,
                externalSustainabilityScore:
                  item.ExternalSustainabilityScore ?? 0,
                externalTotalScore: item.ExternalTotalScore ?? "",
                externalScale: item.ExternalScale ?? 0,
                externalRating: item.ExternalRating ?? "",
                managementsCommitmentToInternalControl:
                  item.ManagementCommitmentToInternalControl ?? "",
                commitmentIcDesignScore: item.CommitmentIcDesignScore ?? 0,
                commitmentIcPerformanceScore:
                  item.CommitmentIcPerformanceScore ?? 0,
                commitmentIcSustainabilityScore:
                  item.CommitmentIcSustainabilityScore ?? 0,
                commitmentIcTotalScore: item.CommitmentIcTotalScore ?? "",
                commitmentIcScale: item.CommitmentIcScale ?? 0,
                commitmentIcRating: item.CommitmentIcRating ?? "",
                communicationAndEnforcementOfIntegrityAndEthicalValues:
                  item.CommunicationAndEnforcementOfIntegrityAndEthicalValues ??
                  "",
                commEthicalDesignScore: item.CommEthicalDesignScore ?? 0,
                commEthicalPerformanceScore:
                  item.CommEthicalPerformanceScore ?? 0,
                commEthicalSustainabilityScore:
                  item.CommEthicalSustainabilityScore ?? 0,
                commEthicalTotalScore: item.CommEthicalTotalScore ?? "",
                commEthicalScale: item.CommEthicalScale ?? 0,
                commEthicalRating: item.CommEthicalRating ?? "",
                employeeAwarenessAndUnderstanding:
                  item.EmployeeAwarenessAndUnderstanding ?? "",
                awarenessDesignScore: item.AwarenessDesignScore ?? 0,
                awarenessPerformanceScore: item.AwarenessPerformanceScore ?? 0,
                awarenessSustainabilityScore:
                  item.AwarenessSustainabilityScore ?? 0,
                awarenessTotalScore: item.AwarenessTotalScore ?? "",
                awarenessScale: item.AwarenessScale ?? 0,
                awarenessRating: item.AwarenessRating ?? "",
                accountabilityAndPerformanceMeasurement:
                  item.AccountabilityAndPerformanceMeasurement ?? "",
                accountabilityDesignScore: item.AccountabilityDesignScore ?? 0,
                accountabilityPerformanceScore:
                  item.AccountabilityPerformanceScore ?? 0,
                accountabilitySustainabilityScore:
                  item.AccountabilitySustainabilityScore ?? 0,
                accountabilityTotalScore: item.AccountabilityTotalScore ?? "",
                accountabilityScale: item.AccountabilityScale ?? 0,
                accountabilityRating: item.AccountabilityRating ?? "",
                commitmentToTransparencyAndOpenness:
                  item.CommitmentToTransparencyAndOpenness ?? "",
                transparencyDesignScore: item.TransparencyDesignScore ?? 0,
                transparencyPerformanceScore:
                  item.TransparencyPerformanceScore ?? 0,
                transparencySustainabilityScore:
                  item.TransparencySustainabilityScore ?? 0,
                transparencyTotalScore: item.TransparencyTotalScore ?? "",
                transparencyScale: item.TransparencyScale ?? 0,
                transparencyRating: item.TransparencyRating ?? "",
              };

            default:
              return base;
          }
        });

        const parseNoParts = (noValue: any) => {
          const str = String(noValue ?? "");

          const [majorStr, minorStr] = str.split(".");

          return {
            major: parseInt(majorStr, 10) || 5,

            minor: parseInt(minorStr ?? "0", 10) || 0,
          };
        };

        const normalizeNoValues = (records: any[]) => {
          if (!records.length) return records;

          const defaultMajor = parseNoParts(records[0].no).major || 5;

          const total = records.length;

          const seenMinors = new Set<number>();

          const missingMinors: number[] = [];

          const currentMinors = records.map((r) => parseNoParts(r.no).minor);

          for (let i = 1; i <= total; i++) {
            if (!currentMinors.includes(i)) missingMinors.push(i);
          }

          const consumeMissingMinor = () => {
            if (missingMinors.length > 0) return missingMinors.shift()!;

            let candidate = total + 1;

            while (seenMinors.has(candidate)) candidate++;

            return candidate;
          };

          return records.map((r) => {
            const { minor } = parseNoParts(r.no);

            if (!seenMinors.has(minor)) {
              seenMinors.add(minor);

              return { ...r, no: `${defaultMajor}.${minor}` };
            }

            const reassigned = consumeMissingMinor();

            seenMinors.add(reassigned);

            return { ...r, no: `${defaultMajor}.${reassigned}` };
          });
        };

        const getSortableNo = (noValue: any) => {
          const { major, minor } = parseNoParts(noValue);

          return major * 1000 + minor;
        };

        const normalizedItems = normalizeNoValues(mappedItems);

        const sortedItems = [...normalizedItems].sort(
          (a, b) => getSortableNo(a.no) - getSortableNo(b.no),
        );

        setDataBySection((prev) => ({
          ...prev,

          [section]: sortedItems,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, [debouncedSearchText, getCurrentSection, activeTab]);

    useEffect(() => {
      fetchData();
    }, [debouncedSearchText, activeTab, fetchData]);

    // ── Navigation ──────────────────────────────────────────────────

    const getTabKeys = () => {
      // Ownership tabs

      if (activeTab === "15" || activeTab === "16") {
        return ["15", "16"];
      }

      // COSO tabs

      if (activeTab === "17" || activeTab === "18") {
        return ["17", "18"];
      }

      // INTOSAI/IFAC tabs

      if (activeTab === "19" || activeTab === "20") {
        return ["19", "20"];
      }

      // Process tabs (default)

      return ["1", "11", "12", "13", "14"];
    };

    const tabKeys = getTabKeys();

    const currentTabIndex = tabKeys.indexOf(activeTab);

    const hasPrev = currentTabIndex > 0;

    const hasNext = currentTabIndex < tabKeys.length - 1;

    const goPrev = useCallback(() => {
      if (hasPrev) {
        setEditingKeys([]);

        const currentKeys = getTabKeys();

        const currentIndex = currentKeys.indexOf(activeTab);

        setActiveTab(currentKeys[currentIndex - 1]);
      }
    }, [activeTab, hasPrev]);

    const goNext = useCallback(() => {
      if (hasNext) {
        setEditingKeys([]);

        const currentKeys = getTabKeys();

        const currentIndex = currentKeys.indexOf(activeTab);

        setActiveTab(currentKeys[currentIndex + 1]);
      }
    }, [activeTab, hasNext]);

    // ── Scroll Sync Helpers ──────────────────────────────────────────────

    const syncScroll = useCallback(
      (from: HTMLElement, to: HTMLElement | null) => {
        if (!to || !scrollSyncRef.current) return;

        scrollSyncRef.current = false;

        to.scrollLeft = from.scrollLeft;

        // Use RAF + small delay to prevent infinite loop

        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollSyncRef.current = true;
          }, 30);
        });
      },

      [],
    );

    const handleBottomScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;

        syncScroll(target, topScrollbarRef.current);
      },

      [syncScroll],
    );

    const handleTopScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;

        const bottom = tableWrapperRef.current?.querySelector(
          ".ant-table-body",
        ) as HTMLElement | null;

        if (bottom) syncScroll(target, bottom);
      },

      [syncScroll],
    );

    // 3. Better update function + force re-calculation

    const updateTopScrollbar = useCallback(() => {
      if (!topScrollbarRef.current || !tableBodyRef.current) return;

      const body = tableBodyRef.current;

      const scrollWidth = body.scrollWidth;

      const clientWidth = body.clientWidth;

      const fakeDiv = topScrollbarRef.current.querySelector(
        "div",
      ) as HTMLElement;

      if (fakeDiv) {
        fakeDiv.style.width = `${Math.max(scrollWidth, clientWidth)}px`;
      }

      // Use visibility instead of display → much more stable

      const needsScroll = scrollWidth > clientWidth + 4;

      topScrollbarRef.current.style.visibility = needsScroll
        ? "visible"
        : "hidden";

      topScrollbarRef.current.style.height = needsScroll ? "16px" : "0px"; // ← makes grab area bigger
    }, []);

    useEffect(() => {
      updateTopScrollbar();

      const timer = setTimeout(updateTopScrollbar, 300);

      const timer2 = setTimeout(updateTopScrollbar, 800);

      window.addEventListener("resize", updateTopScrollbar);

      // Watch for any DOM changes inside table (very helpful!)

      const observer = new MutationObserver(updateTopScrollbar);

      if (tableBodyRef.current) {
        observer.observe(tableBodyRef.current, {
          childList: true,

          subtree: true,

          attributes: true,
        });
      }

      return () => {
        window.removeEventListener("resize", updateTopScrollbar);

        observer.disconnect();

        clearTimeout(timer);

        clearTimeout(timer2);
      };
    }, [activeTab, tableData, updateTopScrollbar]);

    // ── Your existing handlers (export, save, delete, etc.) ──────────────

    // Keeping all your original logic here unchanged

    // Conditional tab configurations based on active tab

    const getTabConfigs = () => {
      // Ownership tabs
      if (activeTab === "15" || activeTab === "16") {
        return [
          { key: "15", label: "Ownership" },
          { key: "16", label: "Ownership Assessment" },
        ];
      }

      // COSO tabs
      if (activeTab === "17" || activeTab === "18") {
        return [
          { key: "17", label: "CE-COSO" },
          { key: "18", label: "COSO Environment Assessment" },
        ];
      }

      // INTOSAI/IFAC tabs
      if (activeTab === "19" || activeTab === "20") {
        return [
          { key: "19", label: "CE-INTOSAI,IFACI" },
          { key: "20", label: "CE-INTOSAI,IFACI Assessment" },
        ];
      }

      // CE-Other tabs
      if (activeTab === "21" || activeTab === "22") {
        return [
          { key: "21", label: "CE-Other" },
          { key: "22", label: "CE-Other Assessment" },
        ];
      }

      // Process tabs (default)
      return [
        { key: "1", label: "Processes" },
        { key: "11", label: "Assessment of Adequacy" },
        { key: "12", label: "Assessment of Effectiveness" },

        { key: "13", label: "Assessment of Efficiency" },

        { key: "14", label: "Process Severity" },
      ];
    };

    const tabConfigs = getTabConfigs();

    const getSectionFromTabKey = (tabKey: string): string => {
      const map: Record<string, string> = {
        "1": "Process",

        "11": "Assessment of Adequacy",

        "12": "Assessment of Effectiveness",

        "13": "Assessment of Efficiency",

        "14": "Process Severity",

        "15": "Ownership",

        "16": "OwnershipScorings",

        "17": "CECOSO",

        "18": "COSOEnvironmentScorings",

        "19": "CEINTOSAIIFACI",

        "20": "INTOSAIIFACIAssessment",
      };

      return map[tabKey] || "Process";
    };

    const handleExport = () => {
      const wb = XLSX.utils.book_new();

      tabConfigs.forEach((config) => {
        const sheetName = config.label.slice(0, 31);

        const columnsRaw = getColumns(config.key, "", handlers, editingKeys);

        const fields = columnsRaw

          .filter(
            (c): c is ColumnType<DataType> =>
              "dataIndex" in c && c.dataIndex !== "actions",
          )

          .map((c) => c.dataIndex!);

        const section = getSectionFromTabKey(config.key);

        const exportDataSource = dataBySection[section] || [];

        const exportData = exportDataSource.map((row) => {
          const obj: any = {};

          //@ts-ignore

          fields.forEach((f) => (obj[f] = row[f as keyof DataType] ?? ""));

          return obj;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      XLSX.writeFile(wb, "RCMAssessment_Export.xlsx");
    };

    const handleDelete = useCallback(
      async (key: string) => {
        const item = tableData.find((r) => r.key === key);

        if (!item) return;

        const section = getCurrentSection();

        const endpoint = SECTION_TO_BASE_ENDPOINT[section];

        try {
          if (item.id) {
            await apiClientDotNet.delete(`/${endpoint}/${item.id}`);
          }

          setDataBySection((prev) => ({
            ...prev,

            [section]: (prev[section] || []).filter((r) => r.key !== key),
          }));

          // Refresh data to get latest from server after deletion

          await fetchData();
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      },

      [tableData, getCurrentSection],
    );

    const handleSave = useCallback(
      async (key: string) => {
        console.log("handleSave called for key:", key);

        const item = tableData.find((r) => r.key === key);

        console.log("Found item:", item);

        if (!item) {
          console.error("Item not found for key:", key);

          return;
        }

        const section = getCurrentSection();

        console.log("Current section:", section);

        // Check if item has ID for assessment tabs

        if (section !== "Process" && !item.id) {
          console.error("Item missing ID for assessment tab:", item);

          alert("Cannot save: Item missing ID. Please refresh and try again.");

          return;
        }

        // Check if there are any actual changes

        const originalItem = originalData[key];

        if (originalItem) {
          const hasChanges =
            JSON.stringify(item) !== JSON.stringify(originalItem);

          if (!hasChanges) {
            console.log("No changes detected, skipping API call");

            // Remove from editing keys and revert to normal state

            setEditingKeys((prev) => prev.filter((k) => k !== key));

            return;
          }
        }

        let endpoint: string;

        let requestBody: any = {};

        // Convert Yes/No to P/O for boolean fields

        const convertBooleanToPO = (value: any): string => {
          if (value === true || value === "P" || value === "Yes") return "P";

          if (value === false || value === "O" || value === "No") return "O";

          return value;
        };

        // Base fields for all requests

        const baseFields = {
          Id: item.id || item.key,

          No: parseFloat(String(item.no)) || 0,

          Process: item.process || "",
        };

        switch (section) {
          case "Process":
            endpoint = "Processes";

            requestBody = {
              ...baseFields,

              "Main Process": item.process,

              "Process Description": item.processDescription || "",

              "Process Objectives": item.processObjective || "",

              "Process Severity Levels": item.processSeverityLevels || "",
            };

            break;

          case "Assessment of Adequacy":
            endpoint = `AssessmentOfAdequacy/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              // Date removed as per your requirement

              DesignAdequacyScore:
                parseFloat(String(item.designAdequacyScore)) || 0,

              SustainabilityScore:
                parseFloat(String(item.sustainabilityScore)) || 0,

              ScalabilityScore: parseFloat(String(item.scalabilityScore)) || 0,

              AdequacyScore: parseFloat(String(item.adequacyScore)) || 0,

              TotalScore: String(item.totalScore || ""),

              Scale: parseFloat(String(item.scale)) || 0,

              Rating: item.rating || "",
            };

            break;

          case "Assessment of Effectiveness":
            endpoint = `AssessmentOfEffectiveness/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              // Date removed as per your requirement

              DesignScore: parseFloat(String(item.designScore)) || 0,

              OperatingScore: parseFloat(String(item.operatingScore)) || 0,

              SustainabilityScore:
                parseFloat(String(item.sustainabilityScore)) || 0,

              EffectivenessScore:
                parseFloat(String(item.effectivenessScore)) || 0,

              TotalScore: String(item.totalScore || ""),

              Scale: parseFloat(String(item.scale)) || 0,

              Rating: item.rating || "",
            };

            break;

          case "Assessment of Efficiency":
            endpoint = `AssessmentOfEfficiency/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              // Date removed as per your requirement

              ObjectiveAchievementScore:
                parseFloat(String(item.objectiveAchievementScore)) || 0,

              TimelinessThroughputScore:
                parseFloat(String(item.timelinessThroughputScore)) || 0,

              ResourceConsumptionScore:
                parseFloat(String(item.resourceConsumptionScore)) || 0,

              EfficiencyScore: parseFloat(String(item.efficiencyScore)) || 0,

              TotalScore: String(item.totalScore || ""),

              Scale: parseFloat(String(item.scale)) || 0,

              Rating: item.rating || "",
            };

            break;

          case "Process Severity":
            endpoint = `ProcessSeverity/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              // Date removed as per your requirement

              Scale: parseFloat(String(item.scale)) || 0,

              Rating: item.rating || "",
            };

            break;

          case "Ownership":
            endpoint = `Ownerships/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Activity: item.activity || "",

              Process: item.process2 || "",

              "Main Process": item.process || "",

              "Process Stage": item.stage || "",

              Functions: item.functions || "",

              "Client Segment and/or Functional Segment":
                item.clientSegment || "",

              "Operational Unit": item.operationalUnit || "",

              Division: item.division || "",

              Entity: item.entity || "",

              "Unit / Department": item.unitDepartment || "",

              "Product Class": item.productClass || "",

              "Product Name": item.productName || "",
            };

            break;

          case "OwnershipScorings":
            endpoint = `OwnershipScorings/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Activity: item.activity || "",

              ActivityScore: parseFloat(String(item.activityScore)) || 0,

              Process: item.process || "",

              ProcessScore: parseFloat(String(item.processScore)) || 0,

              ActivationProcess: item.activationProcess || "",

              ProcessStage: item.processStage || "",

              ProcessStageScore:
                parseFloat(String(item.processStageScore)) || 0,

              TotalScore: String(item.totalScore || ""),

              Scale: parseFloat(String(item.scale)) || 0,

              Rating: item.rating || "",

              Function: item.function || "",

              FunctionScore: parseFloat(String(item.functionScore)) || 0,

              ClientSegmentAndOrFunctionalSegment:
                item.clientSegmentAndOrFunctionalSegment || "",

              ClientSegmentScore:
                parseFloat(String(item.clientSegmentScore)) || 0,

              OperationalUnit: item.operationalUnit || "",

              OperationalUnitScore:
                parseFloat(String(item.operationalUnitScore)) || 0,

              Division: item.division || "",

              DivisionScore: parseFloat(String(item.divisionScore)) || 0,

              Entity: item.entity || "",

              EntityScore: parseFloat(String(item.entityScore)) || 0,

              UnitOrDepartment: item.unitDepartment || "",

              UnitOrDepartmentScore:
                parseFloat(String(item.unitDepartmentScore)) || 0,

              ProductClass: item.productClass || "",

              ProductClassScore:
                parseFloat(String(item.productClassScore)) || 0,

              ProductName: item.productName || "",

              ProductNameScore: parseFloat(String(item.productNameScore)) || 0,
            };

            break;

          case "CECOSO":
            endpoint = `CosoControlEnvironments/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              "Integrity & Ethical Values": item.integrityEthical || "",

              "Board Oversight": item.boardOversight || "",

              "Organizational Structure": item.organizationalStructure || "",

              "Commitment to Competence": item.commitmentToCompetence || "",

              "Management Philosophy": item.managementPhilosophy || "",
            };

            break;

          case "COSOEnvironmentScorings":
            endpoint = `CosoControlEnvironmentScorings`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              Date: item.date || "",

              IntegrityEthicalValues: item.integrityEthicalValues || "",

              IntegrityDesignScore:
                parseFloat(String(item.integrityDesignScore)) || 0,

              IntegrityPerformanceScore:
                parseFloat(String(item.integrityPerformanceScore)) || 0,

              IntegritySustainabilityScore:
                parseFloat(String(item.integritySustainabilityScore)) || 0,

              IntegrityTotalScore: String(item.integrityTotalScore || ""),

              IntegrityScale: parseFloat(String(item.integrityScale)) || 0,

              IntegrityRating: item.integrityRating || "",

              BoardOversight: item.boardOversight || "",

              BoardDesignScore: parseFloat(String(item.boardDesignScore)) || 0,

              BoardPerformanceScore:
                parseFloat(String(item.boardPerformanceScore)) || 0,

              BoardSustainabilityScore:
                parseFloat(String(item.boardSustainabilityScore)) || 0,

              BoardTotalScore: String(item.boardTotalScore || ""),

              BoardScale: parseFloat(String(item.boardScale)) || 0,

              BoardRating: item.boardRating || "",

              OrganizationalStructure: item.organizationalStructure || "",

              OrgStructureDesignScore:
                parseFloat(String(item.orgStructureDesignScore)) || 0,

              OrgStructurePerformanceScore:
                parseFloat(String(item.orgStructurePerformanceScore)) || 0,

              OrgStructureSustainabilityScore:
                parseFloat(String(item.orgStructureSustainabilityScore)) || 0,

              OrgStructureTotalScore: String(item.orgStructureTotalScore || ""),

              OrgStructureScale:
                parseFloat(String(item.orgStructureScale)) || 0,

              OrgStructureRating: item.orgStructureRating || "",

              CommitmentToCompetence: item.commitmentToCompetence || "",

              CompetenceDesignScore:
                parseFloat(String(item.competenceDesignScore)) || 0,

              CompetencePerformanceScore:
                parseFloat(String(item.competencePerformanceScore)) || 0,

              CompetenceSustainabilityScore:
                parseFloat(String(item.competenceSustainabilityScore)) || 0,

              CompetenceTotalScore: String(item.competenceTotalScore || ""),

              CompetenceScale: parseFloat(String(item.competenceScale)) || 0,

              CompetenceRating: item.competenceRating || "",

              ManagementPhilosophy: item.managementPhilosophy || "",

              PhilosophyDesignScore:
                parseFloat(String(item.philosophyDesignScore)) || 0,

              PhilosophyPerformanceScore:
                parseFloat(String(item.philosophyPerformanceScore)) || 0,

              PhilosophySustainabilityScore:
                parseFloat(String(item.philosophySustainabilityScore)) || 0,

              PhilosophyTotalScore: String(item.philosophyTotalScore || ""),

              PhilosophyScale: parseFloat(String(item.philosophyScale)) || 0,

              PhilosophyRating: item.philosophyRating || "",
            };

            break;

          case "CEINTOSAIIFACI":
            endpoint = `IntosaiIfacControlEnvironments/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              Date: item.date || "",

              "Integrity and Ethical Values":
                item.integrityAndEthicalValues || "",

              "Commitment to Competence": item.commitmentToCompetence || "",

              "Management's Philosophy and Operating Style":
                item.managementsPhilosophyAndOperatingStyle || "",

              "Organizational Structure": item.organizationalStructure || "",

              "Assignment of Authority and Responsibility":
                item.assignmentOfAuthorityAndResponsibility || "",

              "Human Resource Policies and Practices":
                item.humanResourcePoliciesAndPractices || "",

              "Board of Directors' or Audit Committee's Participation":
                item.boardOfDirectorsOrAuditCommitteeParticipation || "",

              "Management Control Methods": item.managementControlMethods || "",

              "External Influences": item.externalInfluences || "",

              "Management's Commitment to Internal Control":
                item.managementsCommitmentToInternalControl || "",

              "Communication and Enforcement of Integrity and Ethical Values":
                item.communicationAndEnforcementOfIntegrityAndEthicalValues ||
                "",

              "Employee Awareness and Understanding":
                item.employeeAwarenessAndUnderstanding || "",

              "Accountability and Performance Measurement":
                item.accountabilityAndPerformanceMeasurement || "",

              "Commitment to Transparency and Openness":
                item.commitmentToTransparencyAndOpenness || "",
            };

            break;

          case "INTOSAIIFACIAssessment":
            endpoint = `IntosaiIfacControlEnvironmentScorings/${item.id}`;

            requestBody = {
              Id: item.id,

              No: parseFloat(String(item.no)) || 0,

              Process: item.process || "",

              // Don't send Date field if empty to avoid validation error
              ...(item.date && item.date.trim() !== ""
                ? { Date: item.date }
                : {}),

              // Add required updated field with current timestamp
              updated: new Date().toISOString(),

              // Integrity and Ethical Values
              IntegrityEthicalValues: item.integrityEthicalValues || "",
              IntegrityDesignScore: item.integrityDesignScore || 0,
              IntegrityPerformanceScore: item.integrityPerformanceScore || 0,
              IntegritySustainabilityScore:
                item.integritySustainabilityScore || 0,
              IntegrityTotalScore: item.integrityTotalScore || "",
              IntegrityScale: item.integrityScale || 0,
              IntegrityRating: item.integrityRating || "",

              // Commitment to Competence
              CommitmentToCompetence: item.commitmentToCompetence || "",
              CompetenceDesignScore: item.competenceDesignScore || 0,
              CompetencePerformanceScore: item.competencePerformanceScore || 0,
              CompetenceSustainabilityScore:
                item.competenceSustainabilityScore || 0,
              CompetenceTotalScore: item.competenceTotalScore || "",
              CompetenceScale: item.competenceScale || 0,
              CompetenceRating: item.competenceRating || "",

              // Management Philosophy
              ManagementPhilosophy: item.managementPhilosophy || "",
              PhilosophyDesignScore: item.philosophyDesignScore || 0,
              PhilosophyPerformanceScore: item.philosophyPerformanceScore || 0,
              PhilosophySustainabilityScore:
                item.philosophySustainabilityScore || 0,
              PhilosophyTotalScore: item.philosophyTotalScore || "",
              PhilosophyScale: item.philosophyScale || 0,
              PhilosophyRating: item.philosophyRating || "",

              // Organizational Structure
              OrganizationalStructure: item.organizationalStructure || "",
              OrgStructureDesignScore: item.orgStructureDesignScore || 0,
              OrgStructurePerformanceScore:
                item.orgStructurePerformanceScore || 0,
              OrgStructureSustainabilityScore:
                item.orgStructureSustainabilityScore || 0,
              OrgStructureTotalScore: item.orgStructureTotalScore || "",
              OrgStructureScale: item.orgStructureScale || 0,
              OrgStructureRating: item.orgStructureRating || "",

              // Assignment of Authority and Responsibility
              AssignmentOfAuthorityAndResponsibility:
                item.assignmentOfAuthorityAndResponsibility || "",
              AuthorityDesignScore: item.authorityDesignScore || 0,
              AuthorityPerformanceScore: item.authorityPerformanceScore || 0,
              AuthoritySustainabilityScore:
                item.authoritySustainabilityScore || 0,
              AuthorityTotalScore: item.authorityTotalScore || "",
              AuthorityScale: item.authorityScale || 0,
              AuthorityRating: item.authorityRating || "",

              // Human Resource Policies and Practices
              HumanResourcePoliciesAndPractices:
                item.humanResourcePoliciesAndPractices || "",
              HrDesignScore: item.hrDesignScore || 0,
              HrPerformanceScore: item.hrPerformanceScore || 0,
              HrSustainabilityScore: item.hrSustainabilityScore || 0,
              HrTotalScore: item.hrTotalScore || "",
              HrScale: item.hrScale || 0,
              HrRating: item.hrRating || "",

              // Board or Audit Committee Participation
              BoardOrAuditCommitteeParticipation:
                item.boardOfDirectorsOrAuditCommitteeParticipation || "",
              BoardDesignScore: item.boardDesignScore || 0,
              BoardPerformanceScore: item.boardPerformanceScore || 0,
              BoardSustainabilityScore: item.boardSustainabilityScore || 0,
              BoardTotalScore: item.boardTotalScore || "",
              BoardScale: item.boardScale || 0,
              BoardRating: item.boardRating || "",

              // Management Control Methods
              ManagementControlMethods: item.managementControlMethods || "",
              ControlMethodsDesignScore: item.controlMethodsDesignScore || 0,
              ControlMethodsPerformanceScore:
                item.controlMethodsPerformanceScore || 0,
              ControlMethodsSustainabilityScore:
                item.controlMethodsSustainabilityScore || 0,
              ControlMethodsTotalScore: item.controlMethodsTotalScore || "",
              ControlMethodsScale: item.controlMethodsScale || 0,
              ControlMethodsRating: item.controlMethodsRating || "",

              // External Influences
              ExternalInfluences: item.externalInfluences || "",
              ExternalDesignScore: item.externalDesignScore || 0,
              ExternalPerformanceScore: item.externalPerformanceScore || 0,
              ExternalSustainabilityScore:
                item.externalSustainabilityScore || 0,
              ExternalTotalScore: item.externalTotalScore || "",
              ExternalScale: item.externalScale || 0,
              ExternalRating: item.externalRating || "",

              // Management's Commitment to Internal Control
              ManagementCommitmentToInternalControl:
                item.managementsCommitmentToInternalControl || "",
              CommitmentIcDesignScore: item.commitmentIcDesignScore || 0,
              CommitmentIcPerformanceScore:
                item.commitmentIcPerformanceScore || 0,
              CommitmentIcSustainabilityScore:
                item.commitmentIcSustainabilityScore || 0,
              CommitmentIcTotalScore: item.commitmentIcTotalScore || "",
              CommitmentIcScale: item.commitmentIcScale || 0,
              CommitmentIcRating: item.commitmentIcRating || "",

              // Communication and Enforcement of Integrity and Ethical Values
              CommunicationAndEnforcementOfIntegrityAndEthicalValues:
                item.communicationAndEnforcementOfIntegrityAndEthicalValues ||
                "",
              CommEthicalDesignScore: item.commEthicalDesignScore || 0,
              CommEthicalPerformanceScore:
                item.commEthicalPerformanceScore || 0,
              CommEthicalSustainabilityScore:
                item.commEthicalSustainabilityScore || 0,
              CommEthicalTotalScore: item.commEthicalTotalScore || "",
              CommEthicalScale: item.commEthicalScale || 0,
              CommEthicalRating: item.commEthicalRating || "",

              // Employee Awareness and Understanding
              EmployeeAwarenessAndUnderstanding:
                item.employeeAwarenessAndUnderstanding || "",
              AwarenessDesignScore: item.awarenessDesignScore || 0,
              AwarenessPerformanceScore: item.awarenessPerformanceScore || 0,
              AwarenessSustainabilityScore:
                item.awarenessSustainabilityScore || 0,
              AwarenessTotalScore: item.awarenessTotalScore || "",
              AwarenessScale: item.awarenessScale || 0,
              AwarenessRating: item.awarenessRating || "",

              // Accountability and Performance Measurement
              AccountabilityAndPerformanceMeasurement:
                item.accountabilityAndPerformanceMeasurement || "",
              AccountabilityDesignScore: item.accountabilityDesignScore || 0,
              AccountabilityPerformanceScore:
                item.accountabilityPerformanceScore || 0,
              AccountabilitySustainabilityScore:
                item.accountabilitySustainabilityScore || 0,
              AccountabilityTotalScore: item.accountabilityTotalScore || "",
              AccountabilityScale: item.accountabilityScale || 0,
              AccountabilityRating: item.accountabilityRating || "",

              // Commitment to Transparency and Openness
              CommitmentToTransparencyAndOpenness:
                item.commitmentToTransparencyAndOpenness || "",
              TransparencyDesignScore: item.transparencyDesignScore || 0,
              TransparencyPerformanceScore:
                item.transparencyPerformanceScore || 0,
              TransparencySustainabilityScore:
                item.transparencySustainabilityScore || 0,
              TransparencyTotalScore: item.transparencyTotalScore || "",
              TransparencyScale: item.transparencyScale || 0,
              TransparencyRating: item.transparencyRating || "",
            };

            break;

          case "CE-Other":
            endpoint = `OtherControlEnvironments/${item.id}`;

            requestBody = {
              Id: item.id,
              No: parseFloat(String(item.no)) || 0,
              Process: item.process || "",
              ResponsibilityDelegationMatrix: item.responsibilityMatrix || "",
              SegregationOfDuties: item.segregationDuties || "",
              ReportingLines: item.reportingLines || "",
              Mission: item.mission || "",
              VisionAndValues: item.visionValues || "",
              GoalsAndObjectives: item.goalsObjectives || "",
              StructuresAndSystems: item.structuresSystems || "",
              PoliciesAndProcedures: item.policiesProcedures || "",
              Processes: item.processes || "",
              IntegrityEthicalValues: item.integrityEthical || "",
              OversightStructure: item.oversightStructure || "",
              Standards: item.standards || "",
              Methodologies: item.methodologies || "",
              RulesAndRegulations: item.rulesRegulations || "",
            };

            break;

          case "CE-Other Assessment":
            endpoint = `OtherControlEnvironmentScorings/${item.id}`;

            requestBody = {
              Id: item.id,
              No: parseFloat(String(item.no)) || 0,
              Process: item.process || "",
              // Don't send Date field if empty to avoid validation error
              ...(item.date && item.date.trim() !== ""
                ? { Date: item.date }
                : {}),
              // Add required updated field with current timestamp
              updated: new Date().toISOString(),

              // Responsibility Delegation Matrix
              ResponsibilityDelegationMatrix: item.responsibilityMatrix || "",
              RdmDesignScore: parseFloat(String(item.rdmDesignScore)) || 0,
              RdmPerformanceScore:
                parseFloat(String(item.rdmPerformanceScore)) || 0,
              RdmSustainabilityScore:
                parseFloat(String(item.rdmSustainabilityScore)) || 0,
              RdmTotalScore: String(item.rdmTotalScore || ""),
              RdmScale: parseFloat(String(item.rdmScale)) || 0,
              RdmRating: item.rdmRating || "",

              // Segregation of Duties
              SegregationOfDuties: item.segregationDuties || "",
              SodDesignScore: parseFloat(String(item.sodDesignScore)) || 0,
              SodPerformanceScore:
                parseFloat(String(item.sodPerformanceScore)) || 0,
              SodSustainabilityScore:
                parseFloat(String(item.sodSustainabilityScore)) || 0,
              SodTotalScore: String(item.sodTotalScore || ""),
              SodScale: parseFloat(String(item.sodScale)) || 0,
              SodRating: item.sodRating || "",

              // Reporting Lines
              ReportingLines: item.reportingLines || "",
              ReportingLinesDesignScore:
                parseFloat(String(item.reportingLinesDesignScore)) || 0,
              ReportingLinesPerformanceScore:
                parseFloat(String(item.reportingLinesPerformanceScore)) || 0,
              ReportingLinesSustainabilityScore:
                parseFloat(String(item.reportingLinesSustainabilityScore)) || 0,
              ReportingLinesTotalScore: String(
                item.reportingLinesTotalScore || "",
              ),
              ReportingLinesScale:
                parseFloat(String(item.reportingLinesScale)) || 0,
              ReportingLinesRating: item.reportingLinesRating || "",

              // Mission
              Mission: item.mission || "",
              MissionDesignScore:
                parseFloat(String(item.missionDesignScore)) || 0,
              MissionPerformanceScore:
                parseFloat(String(item.missionPerformanceScore)) || 0,
              MissionSustainabilityScore:
                parseFloat(String(item.missionSustainabilityScore)) || 0,
              MissionTotalScore: String(item.missionTotalScore || ""),
              MissionScale: parseFloat(String(item.missionScale)) || 0,
              MissionRating: item.missionRating || "",

              // Vision and Values
              VisionAndValues: item.visionValues || "",
              VisionValuesDesignScore:
                parseFloat(String(item.visionValuesDesignScore)) || 0,
              VisionValuesPerformanceScore:
                parseFloat(String(item.visionValuesPerformanceScore)) || 0,
              VisionValuesSustainabilityScore:
                parseFloat(String(item.visionValuesSustainabilityScore)) || 0,
              VisionValuesTotalScore: String(item.visionValuesTotalScore || ""),
              VisionValuesScale:
                parseFloat(String(item.visionValuesScale)) || 0,
              VisionValuesRating: item.visionValuesRating || "",

              // Goals and Objectives
              GoalsAndObjectives: item.goalsObjectives || "",
              GoalsObjectivesDesignScore:
                parseFloat(String(item.goalsObjectivesDesignScore)) || 0,
              GoalsObjectivesPerformanceScore:
                parseFloat(String(item.goalsObjectivesPerformanceScore)) || 0,
              GoalsObjectivesSustainabilityScore:
                parseFloat(String(item.goalsObjectivesSustainabilityScore)) ||
                0,
              GoalsObjectivesTotalScore: String(
                item.goalsObjectivesTotalScore || "",
              ),
              GoalsObjectivesScale:
                parseFloat(String(item.goalsObjectivesScale)) || 0,
              GoalsObjectivesRating: item.goalsObjectivesRating || "",

              // Structures and Systems
              StructuresAndSystems: item.structuresSystems || "",
              StructuresSystemsDesignScore:
                parseFloat(String(item.structuresSystemsDesignScore)) || 0,
              StructuresSystemsPerformanceScore:
                parseFloat(String(item.structuresSystemsPerformanceScore)) || 0,
              StructuresSystemsSustainabilityScore:
                parseFloat(String(item.structuresSystemsSustainabilityScore)) ||
                0,
              StructuresSystemsTotalScore: String(
                item.structuresSystemsTotalScore || "",
              ),
              StructuresSystemsScale:
                parseFloat(String(item.structuresSystemsScale)) || 0,
              StructuresSystemsRating: item.structuresSystemsRating || "",

              // Policies and Procedures
              PoliciesAndProcedures: item.policiesProcedures || "",
              PoliciesProceduresDesignScore:
                parseFloat(String(item.policiesProceduresDesignScore)) || 0,
              PoliciesProceduresPerformanceScore:
                parseFloat(String(item.policiesProceduresPerformanceScore)) ||
                0,
              PoliciesProceduresSustainabilityScore:
                parseFloat(
                  String(item.policiesProceduresSustainabilityScore),
                ) || 0,
              PoliciesProceduresTotalScore: String(
                item.policiesProceduresTotalScore || "",
              ),
              PoliciesProceduresScale:
                parseFloat(String(item.policiesProceduresScale)) || 0,
              PoliciesProceduresRating: item.policiesProceduresRating || "",

              // Processes
              Processes: item.processes || "",
              ProcessesDesignScore:
                parseFloat(String(item.processesDesignScore)) || 0,
              ProcessesPerformanceScore:
                parseFloat(String(item.processesPerformanceScore)) || 0,
              ProcessesSustainabilityScore:
                parseFloat(String(item.processesSustainabilityScore)) || 0,
              ProcessesTotalScore: String(item.processesTotalScore || ""),
              ProcessesScale: parseFloat(String(item.processesScale)) || 0,
              ProcessesRating: item.processesRating || "",

              // Integrity Ethical Values
              IntegrityEthicalValues: item.integrityEthical || "",
              IntegrityDesignScore:
                parseFloat(String(item.integrityDesignScore)) || 0,
              IntegrityPerformanceScore:
                parseFloat(String(item.integrityPerformanceScore)) || 0,
              IntegritySustainabilityScore:
                parseFloat(String(item.integritySustainabilityScore)) || 0,
              IntegrityTotalScore: String(item.integrityTotalScore || ""),
              IntegrityScale: parseFloat(String(item.integrityScale)) || 0,
              IntegrityRating: item.integrityRating || "",

              // Oversight Structure
              OversightStructure: item.oversightStructure || "",
              OversightDesignScore:
                parseFloat(String(item.oversightDesignScore)) || 0,
              OversightPerformanceScore:
                parseFloat(String(item.oversightPerformanceScore)) || 0,
              OversightSustainabilityScore:
                parseFloat(String(item.oversightSustainabilityScore)) || 0,
              OversightTotalScore: String(item.oversightTotalScore || ""),
              OversightScale: parseFloat(String(item.oversightScale)) || 0,
              OversightRating: item.oversightRating || "",

              // Standards
              Standards: item.standards || "",
              StandardsDesignScore:
                parseFloat(String(item.standardsDesignScore)) || 0,
              StandardsPerformanceScore:
                parseFloat(String(item.standardsPerformanceScore)) || 0,
              StandardsSustainabilityScore:
                parseFloat(String(item.standardsSustainabilityScore)) || 0,
              StandardsTotalScore: String(item.standardsTotalScore || ""),
              StandardsScale: parseFloat(String(item.standardsScale)) || 0,
              StandardsRating: item.standardsRating || "",

              // Methodologies
              Methodologies: item.methodologies || "",
              MethodologiesDesignScore:
                parseFloat(String(item.methodologiesDesignScore)) || 0,
              MethodologiesPerformanceScore:
                parseFloat(String(item.methodologiesPerformanceScore)) || 0,
              MethodologiesSustainabilityScore:
                parseFloat(String(item.methodologiesSustainabilityScore)) || 0,
              MethodologiesTotalScore: String(
                item.methodologiesTotalScore || "",
              ),
              MethodologiesScale:
                parseFloat(String(item.methodologiesScale)) || 0,
              MethodologiesRating: item.methodologiesRating || "",

              // Rules and Regulations
              RulesAndRegulations: item.rulesRegulations || "",
              RulesRegsDesignScore:
                parseFloat(String(item.rulesRegsDesignScore)) || 0,
              RulesRegsPerformanceScore:
                parseFloat(String(item.rulesRegsPerformanceScore)) || 0,
              RulesRegsSustainabilityScore:
                parseFloat(String(item.rulesRegsSustainabilityScore)) || 0,
              RulesRegsTotalScore: String(item.rulesRegsTotalScore || ""),
              RulesRegsScale: parseFloat(String(item.rulesRegsScale)) || 0,
              RulesRegsRating: item.rulesRegsRating || "",
            };

            break;

          default:
            console.error("Unknown section:", section);

            return;
        }

        try {
          console.log("Making API call to:", `/${endpoint}`);

          console.log("Request body:", requestBody);

          // Convert boolean fields to P/O for all boolean fields in the request

          const convertedBody = { ...requestBody };

          Object.keys(convertedBody).forEach((key) => {
            if (typeof convertedBody[key] === "boolean") {
              convertedBody[key] = convertBooleanToPO(convertedBody[key]);
            }
          });

          console.log("Final request body:", convertedBody);

          let response;

          if (section === "Process") {
            // For Process tab, use POST for new items or PUT for existing

            if (item.id) {
              response = await apiClientDotNet.put(
                `/Processes/${item.id}`,

                convertedBody,
              );
            } else {
              response = await apiClientDotNet.post(
                "/Processes",

                convertedBody,
              );
            }
          } else {
            // For assessment tabs, use PUT with correct endpoint

            if (section === "COSOEnvironmentScorings") {
              response = await apiClientDotNet.put(
                `/${endpoint}/${item.id}`,

                convertedBody,
              );
            } else {
              response = await apiClientDotNet.put(
                `/${endpoint}`,

                convertedBody,
              );
            }
          }

          console.log("API response:", response);

          // Remove from editing keys after successful save

          setEditingKeys((prev) => prev.filter((k) => k !== key));

          // Refresh data to get latest from server

          await fetchData();

          console.log("Save successful:", response.data);
        } catch (error) {
          console.error("Error saving item:", error);

          // Don't show alert for no changes scenario

          if (
            (error as Error).message.includes("Failed to update") &&
            originalItem &&
            JSON.stringify(item) === JSON.stringify(originalItem)
          ) {
            console.log("No changes made, treating as success");

            // Remove from editing keys and revert to normal state

            setEditingKeys((prev) => prev.filter((k) => k !== key));

            return;
          }

          alert("Error saving item: " + (error as Error).message);

          // Revert to normal state even on error

          setEditingKeys((prev) => prev.filter((k) => k !== key));
        }
      },

      [tableData, getCurrentSection, fetchData, originalData],
    );

    const handleCancel = useCallback(
      (key: string) => {
        // Restore original data if available

        const originalItem = originalData[key];

        if (originalItem) {
          const newData = tableData.map((r) =>
            r.key === key ? originalItem : r,
          );

          setTableData(newData);

          // Clean up original data

          setOriginalData((prev) => {
            const newData = { ...prev };

            delete newData[key];

            return newData;
          });
        }

        setEditingKeys((prev) => prev.filter((k) => k !== key));
      },

      [originalData, setTableData, tableData],
    );

    const handleCheckboxChange = useCallback(
      (rowKey: string, field: keyof DataType, checked: boolean) => {
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, [field]: checked } : r,
        );

        setTableData(newData);
      },

      [tableData, setTableData],
    );

    const handleSelectGeneric = useCallback(
      (value: string, rowKey: string, field?: string) => {
        if (!field) return;

        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, [field]: value } : r,
        );

        setTableData(newData);
      },

      [tableData, setTableData],
    );

    const handleTextChange = useCallback(
      (rowKey: string, field: keyof DataType, value: string) => {
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, [field]: value } : r,
        );

        setTableData(newData);
      },

      [tableData, setTableData],
    );

    const handleAddRow = useCallback(() => {
      const maxNo = tableData.reduce((max, r) => {
        const num = parseFloat(r.no as string) || 0;

        return num > max ? num : max;
      }, 0);

      const newRow = defaultNewRow(maxNo);

      const newData = [...tableData, newRow];

      setTableData(newData);

      setEditingKeys((prev) => [...prev, newRow.key]);
    }, [tableData, setTableData]);

    const handleEditRow = useCallback(
      (key: string) => {
        // Store original data before editing

        const item = tableData.find((r) => r.key === key);

        if (item) {
          setOriginalData((prev) => ({ ...prev, [key]: { ...item } }));
        }

        setEditingKeys((prev) => [...prev, key]);
      },

      [tableData],
    );

    const handleDeleteRow = useCallback(
      (key: string) => {
        handleDelete(key);
      },

      [handleDelete],
    );

    const handleToggleStatus = useCallback(
      (rowKey: string) => {
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, isActive: !(r.isActive !== false) } : r,
        );

        setTableData(newData);

        setEditingKeys((prev) => prev.filter((k) => k !== rowKey));
      },

      [tableData],
    );

    const handleFormSubmit = () => {
      fetchData();

      setFormModalVisible(false);

      setEditingRecord(null);
    };

    const handleEdit = useCallback((record: DataType) => {
      setEditingRecord(record);

      setStartSectionKey(null);

      setFormModalVisible(true);
    }, []);

    const handlers = useMemo(
      () => ({
        onEdit: handleEdit,

        onDelete: handleDelete,

        onSave: handleSave,

        onSaveRow: handleSave,

        onCancel: handleCancel,

        onCheckboxChange: handleCheckboxChange,

        onSelectGeneric: handleSelectGeneric,

        onTextChange: handleTextChange,

        onAddRow: () => {
          setEditingRecord(null);

          const section = getCurrentSection();

          const map: Record<string, string> = {
            Process: "processes",

            "Assessment of Adequacy": "assessment-adequacies",

            "Assessment of Effectiveness": "assessment-effectivenesses",

            "Assessment of Efficiency": "assessment-efficiencies",

            "Process Severity": "process-severities",

            Ownership: "ownerships",

            OwnershipScorings: "ownership-scorings",

            "COSO Environment Assessment": "control-environment-scorings",
          };

          setStartSectionKey(map[section] || "processes");

          setFormModalVisible(true);
        },

        onEditRow: handleEditRow,

        onDeleteRow: handleDeleteRow,

        onToggleStatus: handleToggleStatus,
      }),

      [
        handleEdit,

        handleDelete,

        handleSave,

        handleCancel,

        handleCheckboxChange,

        handleSelectGeneric,

        handleTextChange,

        handleEditRow,

        handleDeleteRow,

        handleToggleStatus,

        getCurrentSection,
      ],
    );

    const columns = useMemo(
      () => getColumns(activeTab, "", handlers, editingKeys),

      [activeTab, editingKeys, handlers],
    );

    const handleTabChange = useCallback((key: string) => {
      setEditingKeys([]);

      setActiveTab(key);
    }, []);

    const handleDataLoaded = async (data: DataType[]) => {
      await importSectionData(currentSection, data);

      fetchData();
    };

    useImperativeHandle(ref, () => ({
      triggerImport: (file: File) => {
        // Handle import if needed
      },
    }));

    return (
      <div className="flex flex-col h-screen bg-[#f8fafc]">
        {/* Header */}

        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={props.onBackToLanding}
                  className="text-xl font-bold text-black hover:text-blue-700 underline-offset-4 hover:underline text-left"
                >
                  RCM ASSESSMENT – Account Receivable
                </button>

                <Button type="primary" onClick={handleExport}>
                  Export Data
                </Button>
              </div>

              <div className="flex space-x-3 bg-white border border-black shadow-sm">
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className={`p-2 rounded-md transition font-bold ${
                    hasPrev
                      ? "text-black hover:bg-gray-50 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <LeftOutlined />
                </button>

                <div className="bg-black w-[2px] h-6 my-auto" />

                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className={`p-2 rounded-md transition font-bold ${
                    hasNext
                      ? "text-black hover:bg-gray-50 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RightOutlined />
                </button>
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-t-xl shadow-sm">
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                className="text-lg"
                items={tabConfigs.map((c) => ({ key: c.key, label: c.label }))}
                destroyInactiveTabPane={true}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}

        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-4">
          {loading ? (
            <div className="flex justify-center items-center flex-1">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* === TOP SCROLLBAR === */}

              <div
                ref={topScrollbarRef}
                className="overflow-x-auto bg-white border-t border-l border-r border-gray-200 rounded-t-lg"
                style={{
                  height: "16px", // ← bigger clickable area

                  visibility: "hidden", // ← controlled by JS

                  scrollbarWidth: "thin",

                  scrollbarColor: "#6b7280 #e5e7eb",
                }}
                onScroll={handleTopScroll}
              >
                <div style={{ height: "1px", minWidth: "100%" }} />
              </div>

              {/* === TABLE CONTAINER === */}

              <div
                ref={tableWrapperRef}
                className="flex-1 bg-white shadow-md rounded-b-lg overflow-hidden border border-gray-200"
              >
                <style jsx global>{`
                  /* Modern scrollbar styling - bigger & easier to grab */

                  .ant-table-body {
                    overflow: auto !important;
                  }

                  .ant-table-body::-webkit-scrollbar {
                    height: 16px; /* ← bigger height */
                  }

                  .ant-table-body::-webkit-scrollbar-thumb {
                    background-color: #6b7280;

                    border-radius: 8px;

                    border: 4px solid #f3f4f6; /* ← better hover area */
                  }

                  .ant-table-body::-webkit-scrollbar-thumb:hover {
                    background-color: #4b5563;
                  }

                  .ant-table-body::-webkit-scrollbar-track {
                    background: #f3f4f6;

                    border-radius: 8px;
                  }

                  /* Your deactivated row styles remain the same */

                  .row-deactivated {
                    background-color: #e5e7eb !important;

                    color: #6b7280 !important;

                    opacity: 0.75;
                  }

                  .row-deactivated .ant-table-cell-fix-left,
                  .row-deactivated .ant-table-cell-fix-left-last {
                    background-color: #e5e7eb !important;
                  }

                  .row-deactivated:hover > td {
                    background-color: #e5e7eb !important;
                  }
                `}</style>

                <Table
                  key={`table-${activeTab}`}
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
                  bordered
                  rowKey={(r) => `${r.key}-${r.isActive ?? true}`}
                  rowClassName={(r) =>
                    r.isActive === false ? "row-deactivated" : ""
                  }
                  onScroll={handleBottomScroll}
                  // Important: we get ref to the scrollable div

                  ref={(tableInstance) => {
                    if (tableInstance) {
                      //@ts-ignore

                      tableBodyRef.current =
                        tableInstance?.nativeElement?.querySelector(
                          ".ant-table-body",
                        );
                    }
                  }}
                />
              </div>
            </>
          )}

          {/* Your modals remain the same */}

          <ExcelUploadModal
            visible={excelModalVisible}
            onClose={() => setExcelModalVisible(false)}
            onDataLoaded={handleDataLoaded}
          />

          <ProcessFormModal
            visible={formModalVisible}
            onCancel={() => {
              setFormModalVisible(false);

              setEditingRecord(null);
            }}
            onSuccess={handleFormSubmit}
            initialValues={editingRecord}
            startSectionKey={startSectionKey || undefined}
          />
        </div>
      </div>
    );
  },
);

RCMAssessment.displayName = "RCMAssessment";

export default RCMAssessment;
