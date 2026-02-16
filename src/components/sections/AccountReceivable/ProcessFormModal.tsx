// src/components/sections/AccountReceivable/ProcessFormModal.tsx
import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Steps, Select, message, Button } from "antd";
import { processService } from "@/services/processService";

const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

interface ProcessFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialValues?: any;
  startSectionKey?: string; // which additional section to open first
}

const ProcessFormModal: React.FC<ProcessFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  initialValues,
  startSectionKey,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0); // 0 = Basic, 1 = Additional
  const [loading, setLoading] = useState(false);
  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(
    null,
  );
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    () => new Set(),
  );

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (visible) {
      console.log("Modal opening, startSectionKey:", startSectionKey);
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
      setCurrentStep(0);
      setCompletedSections(new Set());
      setSelectedSectionKey(startSectionKey ?? null);
      console.log("Set selectedSectionKey to:", startSectionKey ?? null);
    }
  }, [visible, initialValues, form, startSectionKey]);

  // Ordered list of section keys for multi-section creation
  const sectionOrder: { key: string; title: string }[] = [
    { key: "processes", title: "Processes" },
    { key: "ownerships", title: "Ownership" },
    { key: "coso-control-environments", title: "COSO Control Environment" },
    {
      key: "control-environment-scorings",
      title: "Control Environment scoring",
    },
    {
      key: "risk-assessment-inherent-risks",
      title: "Risk Assessment (Inherent)",
    },
    { key: "risk-responses", title: "Risk Responses" },
    { key: "control-activities", title: "Control Activities" },
    { key: "control-assessments", title: "Control Assessment" },
    {
      key: "risk-assessment-residual-risks",
      title: "Risk Assessment (Residual)",
    },
    {
      key: "financial-statement-assertions",
      title: "Financial Statement Assertions",
    },
    { key: "sox", title: "SOX" },
    { key: "grc-exception-logs", title: "GRC Exception Logs" },
    { key: "assessment-adequacies", title: "Assessment of Adequacy" },
    { key: "assessment-effectivenesses", title: "Assessment of Effectiveness" },
    { key: "assessment-efficiencies", title: "Assessment of Efficiency" },
    { key: "process-severities", title: "Process Severity" },
    { key: "ownership-scorings", title: "Ownership Scoring" },
    { key: "internal-audit-tests", title: "Internal Audit Tests" },
    {
      key: "intosai-ifac-control-environments",
      title: "INTOSAI/IFAC Control Environment",
    },
    { key: "other-control-environments", title: "Other Control Environment" },
    { key: "other-control-environment-scorings", title: "CE-Other Assessment" },
    {
      key: "risk-assessment-inherent-risk-assessment",
      title: "Risk Assessment-Inherent Risk Assessment",
    },
  ];

  useEffect(() => {
    if (selectedSectionKey === "ownerships") {
      const commonProcess = form.getFieldValue("Process");
      form.setFieldsValue({ "Main Process": commonProcess });
    }
  }, [selectedSectionKey, form]);

  const submitSection = async (sectionKey: string) => {
    const noValue = form.getFieldValue("No");
    const commonProcess = form.getFieldValue("Process"); // shared for all tabs
    const stepValues = form.getFieldsValue();

    // Debug logging for Control Activities
    if (sectionKey === "control-activities") {
      console.log("Form Values for Control Activities:", stepValues);
      console.log("Key Control value:", stepValues["Key Control"]);
      console.log("Zero Tolerance value:", stepValues["Zero Tolerance"]);
    }

    let fullValues: any;

    if (sectionKey === "ownerships") {
      const {
        Process: mainProcessField,
        "Main Process": processField,
        ...restStepValues
      } = stepValues;

      console.log("[ProcessFormModal] Ownership submission:", {
        noValue,
        commonProcess,
        mainProcessField,
        processField,
        restStepValues,
      });

      fullValues = {
        No: noValue,
        Process: processField, // Process field → API Process
        "Main Process": mainProcessField, // Main Process field → API Main Process
        ...restStepValues,
      };

      console.log("[ProcessFormModal] Ownership fullValues:", fullValues);
    } else if (sectionKey === "ownership-scorings") {
      // For OwnershipScorings, map form fields to API fields
      const {
        Activity,
        ActivityScore,
        Process: processField,
        ProcessScore,
        ActivationProcess,
        ProcessStage,
        ProcessStageScore,
        TotalScore,
        Scale,
        Rating,
        Function,
        FunctionScore,
        ClientSegmentAndOrFunctionalSegment,
        ClientSegmentScore,
        OperationalUnit,
        OperationalUnitScore,
        Division,
        DivisionScore,
        Entity,
        EntityScore,
        UnitOrDepartment,
        UnitOrDepartmentScore,
        ProductClass,
        ProductClassScore,
        ProductName,
        ProductNameScore,
        ...restStepValues
      } = stepValues;

      fullValues = {
        No: noValue,
        Process: processField || commonProcess || "", // Use the form Process field if available, otherwise common process
        Activity: Activity || "",
        ActivityScore: parseFloat(String(ActivityScore || 0)),
        ProcessScore: parseFloat(String(ProcessScore || 0)),
        ActivationProcess: ActivationProcess || "",
        ProcessStage: ProcessStage || "",
        ProcessStageScore: parseFloat(String(ProcessStageScore || 0)),
        TotalScore: TotalScore || "",
        Scale: parseFloat(String(Scale || 0)),
        Rating: Rating || "",
        Function: Function || "",
        FunctionScore: parseFloat(String(FunctionScore || 0)),
        ClientSegmentAndOrFunctionalSegment:
          ClientSegmentAndOrFunctionalSegment || "",
        ClientSegmentScore: parseFloat(String(ClientSegmentScore || 0)),
        OperationalUnit: OperationalUnit || "",
        OperationalUnitScore: parseFloat(String(OperationalUnitScore || 0)),
        Division: Division || "",
        DivisionScore: parseFloat(String(DivisionScore || 0)),
        Entity: Entity || "",
        EntityScore: parseFloat(String(EntityScore || 0)),
        UnitOrDepartment: UnitOrDepartment || "",
        UnitOrDepartmentScore: parseFloat(String(UnitOrDepartmentScore || 0)),
        ProductClass: ProductClass || "",
        ProductClassScore: parseFloat(String(ProductClassScore || 0)),
        ProductName: ProductName || "",
        ProductNameScore: parseFloat(String(ProductNameScore || 0)),
        ...restStepValues,
      };

      console.log(
        "[ProcessFormModal] OwnershipScorings fullValues:",
        fullValues,
      );
    } else if (sectionKey === "other-control-environment-scorings") {
      // For Other Control Environment Scorings, map form fields to API fields
      const {
        ResponsibilityDelegationMatrix,
        RdmDesignScore,
        RdmPerformanceScore,
        RdmSustainabilityScore,
        RdmTotalScore,
        RdmScale,
        RdmRating,
        SegregationOfDuties,
        SodDesignScore,
        SodPerformanceScore,
        SodSustainabilityScore,
        SodTotalScore,
        SodScale,
        SodRating,
        ReportingLines,
        ReportingLinesDesignScore,
        ReportingLinesPerformanceScore,
        ReportingLinesSustainabilityScore,
        ReportingLinesTotalScore,
        ReportingLinesScale,
        ReportingLinesRating,
        Mission,
        MissionDesignScore,
        MissionPerformanceScore,
        MissionSustainabilityScore,
        MissionTotalScore,
        MissionScale,
        MissionRating,
        VisionAndValues,
        VisionValuesDesignScore,
        VisionValuesPerformanceScore,
        VisionValuesSustainabilityScore,
        VisionValuesTotalScore,
        VisionValuesScale,
        VisionValuesRating,
        GoalsAndObjectives,
        GoalsObjectivesDesignScore,
        GoalsObjectivesPerformanceScore,
        GoalsObjectivesSustainabilityScore,
        GoalsObjectivesTotalScore,
        GoalsObjectivesScale,
        GoalsObjectivesRating,
        StructuresAndSystems,
        StructuresSystemsDesignScore,
        StructuresSystemsPerformanceScore,
        StructuresSystemsSustainabilityScore,
        StructuresSystemsTotalScore,
        StructuresSystemsScale,
        StructuresSystemsRating,
        PoliciesAndProcedures,
        PoliciesProceduresDesignScore,
        PoliciesProceduresPerformanceScore,
        PoliciesProceduresSustainabilityScore,
        PoliciesProceduresTotalScore,
        PoliciesProceduresScale,
        PoliciesProceduresRating,
        Processes,
        ProcessesDesignScore,
        ProcessesPerformanceScore,
        ProcessesSustainabilityScore,
        ProcessesTotalScore,
        ProcessesScale,
        ProcessesRating,
        IntegrityEthicalValues,
        IntegrityDesignScore,
        IntegrityPerformanceScore,
        IntegritySustainabilityScore,
        IntegrityTotalScore,
        IntegrityScale,
        IntegrityRating,
        OversightStructure,
        OversightDesignScore,
        OversightPerformanceScore,
        OversightSustainabilityScore,
        OversightTotalScore,
        OversightScale,
        OversightRating,
        Standards,
        StandardsDesignScore,
        StandardsPerformanceScore,
        StandardsSustainabilityScore,
        StandardsTotalScore,
        StandardsScale,
        StandardsRating,
        Methodologies,
        MethodologiesDesignScore,
        MethodologiesPerformanceScore,
        MethodologiesSustainabilityScore,
        MethodologiesTotalScore,
        MethodologiesScale,
        MethodologiesRating,
        RulesAndRegulations,
        RulesRegsDesignScore,
        RulesRegsPerformanceScore,
        RulesRegsSustainabilityScore,
        RulesRegsTotalScore,
        RulesRegsScale,
        RulesRegsRating,
        ...restStepValues
      } = stepValues;

      fullValues = {
        No: parseFloat(String(noValue)) || 0,
        Process: commonProcess,
        ResponsibilityDelegationMatrix: ResponsibilityDelegationMatrix || "",
        RdmDesignScore: parseFloat(String(RdmDesignScore)) || 0,
        RdmPerformanceScore: parseFloat(String(RdmPerformanceScore)) || 0,
        RdmSustainabilityScore: parseFloat(String(RdmSustainabilityScore)) || 0,
        RdmTotalScore: String(RdmTotalScore || ""),
        RdmScale: parseFloat(String(RdmScale)) || 0,
        RdmRating: RdmRating || "",
        SegregationOfDuties: SegregationOfDuties || "",
        SodDesignScore: parseFloat(String(SodDesignScore)) || 0,
        SodPerformanceScore: parseFloat(String(SodPerformanceScore)) || 0,
        SodSustainabilityScore: parseFloat(String(SodSustainabilityScore)) || 0,
        SodTotalScore: String(SodTotalScore || ""),
        SodScale: parseFloat(String(SodScale)) || 0,
        SodRating: SodRating || "",
        ReportingLines: ReportingLines || "",
        ReportingLinesDesignScore:
          parseFloat(String(ReportingLinesDesignScore)) || 0,
        ReportingLinesPerformanceScore:
          parseFloat(String(ReportingLinesPerformanceScore)) || 0,
        ReportingLinesSustainabilityScore:
          parseFloat(String(ReportingLinesSustainabilityScore)) || 0,
        ReportingLinesTotalScore: String(ReportingLinesTotalScore || ""),
        ReportingLinesScale: parseFloat(String(ReportingLinesScale)) || 0,
        ReportingLinesRating: ReportingLinesRating || "",
        Mission: Mission || "",
        MissionDesignScore: parseFloat(String(MissionDesignScore)) || 0,
        MissionPerformanceScore:
          parseFloat(String(MissionPerformanceScore)) || 0,
        MissionSustainabilityScore:
          parseFloat(String(MissionSustainabilityScore)) || 0,
        MissionTotalScore: String(MissionTotalScore || ""),
        MissionScale: parseFloat(String(MissionScale)) || 0,
        MissionRating: MissionRating || "",
        VisionAndValues: VisionAndValues || "",
        VisionValuesDesignScore:
          parseFloat(String(VisionValuesDesignScore)) || 0,
        VisionValuesPerformanceScore:
          parseFloat(String(VisionValuesPerformanceScore)) || 0,
        VisionValuesSustainabilityScore:
          parseFloat(String(VisionValuesSustainabilityScore)) || 0,
        VisionValuesTotalScore: String(VisionValuesTotalScore || ""),
        VisionValuesScale: parseFloat(String(VisionValuesScale)) || 0,
        VisionValuesRating: VisionValuesRating || "",
        GoalsAndObjectives: GoalsAndObjectives || "",
        GoalsObjectivesDesignScore:
          parseFloat(String(GoalsObjectivesDesignScore)) || 0,
        GoalsObjectivesPerformanceScore:
          parseFloat(String(GoalsObjectivesPerformanceScore)) || 0,
        GoalsObjectivesSustainabilityScore:
          parseFloat(String(GoalsObjectivesSustainabilityScore)) || 0,
        GoalsObjectivesTotalScore: String(GoalsObjectivesTotalScore || ""),
        GoalsObjectivesScale: parseFloat(String(GoalsObjectivesScale)) || 0,
        GoalsObjectivesRating: GoalsObjectivesRating || "",
        StructuresAndSystems: StructuresAndSystems || "",
        StructuresSystemsDesignScore:
          parseFloat(String(StructuresSystemsDesignScore)) || 0,
        StructuresSystemsPerformanceScore:
          parseFloat(String(StructuresSystemsPerformanceScore)) || 0,
        StructuresSystemsSustainabilityScore:
          parseFloat(String(StructuresSystemsSustainabilityScore)) || 0,
        StructuresSystemsTotalScore: String(StructuresSystemsTotalScore || ""),
        StructuresSystemsScale: parseFloat(String(StructuresSystemsScale)) || 0,
        StructuresSystemsRating: StructuresSystemsRating || "",
        PoliciesAndProcedures: PoliciesAndProcedures || "",
        PoliciesProceduresDesignScore:
          parseFloat(String(PoliciesProceduresDesignScore)) || 0,
        PoliciesProceduresPerformanceScore:
          parseFloat(String(PoliciesProceduresPerformanceScore)) || 0,
        PoliciesProceduresSustainabilityScore:
          parseFloat(String(PoliciesProceduresSustainabilityScore)) || 0,
        PoliciesProceduresTotalScore: String(
          PoliciesProceduresTotalScore || "",
        ),
        PoliciesProceduresScale:
          parseFloat(String(PoliciesProceduresScale)) || 0,
        PoliciesProceduresRating: PoliciesProceduresRating || "",
        Processes: Processes || "",
        ProcessesDesignScore: parseFloat(String(ProcessesDesignScore)) || 0,
        ProcessesPerformanceScore:
          parseFloat(String(ProcessesPerformanceScore)) || 0,
        ProcessesSustainabilityScore:
          parseFloat(String(ProcessesSustainabilityScore)) || 0,
        ProcessesTotalScore: String(ProcessesTotalScore || ""),
        ProcessesScale: parseFloat(String(ProcessesScale)) || 0,
        ProcessesRating: ProcessesRating || "",
        IntegrityEthicalValues: IntegrityEthicalValues || "",
        IntegrityDesignScore: parseFloat(String(IntegrityDesignScore)) || 0,
        IntegrityPerformanceScore:
          parseFloat(String(IntegrityPerformanceScore)) || 0,
        IntegritySustainabilityScore:
          parseFloat(String(IntegritySustainabilityScore)) || 0,
        IntegrityTotalScore: String(IntegrityTotalScore || ""),
        IntegrityScale: parseFloat(String(IntegrityScale)) || 0,
        IntegrityRating: IntegrityRating || "",
        OversightStructure: OversightStructure || "",
        OversightDesignScore: parseFloat(String(OversightDesignScore)) || 0,
        OversightPerformanceScore:
          parseFloat(String(OversightPerformanceScore)) || 0,
        OversightSustainabilityScore:
          parseFloat(String(OversightSustainabilityScore)) || 0,
        OversightTotalScore: String(OversightTotalScore || ""),
        OversightScale: parseFloat(String(OversightScale)) || 0,
        OversightRating: OversightRating || "",
        Standards: Standards || "",
        StandardsDesignScore: parseFloat(String(StandardsDesignScore)) || 0,
        StandardsPerformanceScore:
          parseFloat(String(StandardsPerformanceScore)) || 0,
        StandardsSustainabilityScore:
          parseFloat(String(StandardsSustainabilityScore)) || 0,
        StandardsTotalScore: String(StandardsTotalScore || ""),
        StandardsScale: parseFloat(String(StandardsScale)) || 0,
        StandardsRating: StandardsRating || "",
        Methodologies: Methodologies || "",
        MethodologiesDesignScore:
          parseFloat(String(MethodologiesDesignScore)) || 0,
        MethodologiesPerformanceScore:
          parseFloat(String(MethodologiesPerformanceScore)) || 0,
        MethodologiesSustainabilityScore:
          parseFloat(String(MethodologiesSustainabilityScore)) || 0,
        MethodologiesTotalScore: String(MethodologiesTotalScore || ""),
        MethodologiesScale: parseFloat(String(MethodologiesScale)) || 0,
        MethodologiesRating: MethodologiesRating || "",
        RulesAndRegulations: RulesAndRegulations || "",
        RulesRegsDesignScore: parseFloat(String(RulesRegsDesignScore)) || 0,
        RulesRegsPerformanceScore:
          parseFloat(String(RulesRegsPerformanceScore)) || 0,
        RulesRegsSustainabilityScore:
          parseFloat(String(RulesRegsSustainabilityScore)) || 0,
        RulesRegsTotalScore: String(RulesRegsTotalScore || ""),
        RulesRegsScale: parseFloat(String(RulesRegsScale)) || 0,
        RulesRegsRating: RulesRegsRating || "",
        ...restStepValues,
      };

      console.log(
        "[ProcessFormModal] Other Control Environment Scorings fullValues:",
        fullValues,
      );
    } else if (sectionKey === "control-environment-scorings") {
      // For Control Environment scoring, map form fields to API fields
      const {
        IntegrityEthicalValues,
        IntegrityDesignScore,
        IntegrityPerformanceScore,
        IntegritySustainabilityScore,
        IntegrityTotalScore,
        IntegrityScale,
        IntegrityRating,
        BoardOversight,
        BoardDesignScore,
        BoardPerformanceScore,
        BoardSustainabilityScore,
        BoardTotalScore,
        BoardScale,
        BoardRating,
        OrganizationalStructure,
        OrgStructureDesignScore,
        OrgStructurePerformanceScore,
        OrgStructureSustainabilityScore,
        OrgStructureTotalScore,
        OrgStructureScale,
        OrgStructureRating,
        CommitmentToCompetence,
        CompetenceDesignScore,
        CompetencePerformanceScore,
        CompetenceSustainabilityScore,
        CompetenceTotalScore,
        CompetenceScale,
        CompetenceRating,
        ManagementPhilosophy,
        PhilosophyDesignScore,
        PhilosophyPerformanceScore,
        PhilosophySustainabilityScore,
        PhilosophyTotalScore,
        PhilosophyScale,
        PhilosophyRating,
        ...restStepValues
      } = stepValues;

      fullValues = {
        No: parseFloat(String(noValue)) || 0,
        Process: commonProcess,
        IntegrityEthicalValues: IntegrityEthicalValues || "",
        IntegrityDesignScore: parseFloat(String(IntegrityDesignScore)) || 0,
        IntegrityPerformanceScore:
          parseFloat(String(IntegrityPerformanceScore)) || 0,
        IntegritySustainabilityScore:
          parseFloat(String(IntegritySustainabilityScore)) || 0,
        IntegrityTotalScore: String(IntegrityTotalScore || ""),
        IntegrityScale: parseFloat(String(IntegrityScale)) || 0,
        IntegrityRating: IntegrityRating || "",
        BoardOversight: BoardOversight || "",
        BoardDesignScore: parseFloat(String(BoardDesignScore)) || 0,
        BoardPerformanceScore: parseFloat(String(BoardPerformanceScore)) || 0,
        BoardSustainabilityScore:
          parseFloat(String(BoardSustainabilityScore)) || 0,
        BoardTotalScore: String(BoardTotalScore || ""),
        BoardScale: parseFloat(String(BoardScale)) || 0,
        BoardRating: BoardRating || "",
        OrganizationalStructure: OrganizationalStructure || "",
        OrgStructureDesignScore:
          parseFloat(String(OrgStructureDesignScore)) || 0,
        OrgStructurePerformanceScore:
          parseFloat(String(OrgStructurePerformanceScore)) || 0,
        OrgStructureSustainabilityScore:
          parseFloat(String(OrgStructureSustainabilityScore)) || 0,
        OrgStructureTotalScore: String(OrgStructureTotalScore || ""),
        OrgStructureScale: parseFloat(String(OrgStructureScale)) || 0,
        OrgStructureRating: OrgStructureRating || "",
        CommitmentToCompetence: CommitmentToCompetence || "",
        CompetenceDesignScore: parseFloat(String(CompetenceDesignScore)) || 0,
        CompetencePerformanceScore:
          parseFloat(String(CompetencePerformanceScore)) || 0,
        CompetenceSustainabilityScore:
          parseFloat(String(CompetenceSustainabilityScore)) || 0,
        CompetenceTotalScore: String(CompetenceTotalScore || ""),
        CompetenceScale: parseFloat(String(CompetenceScale)) || 0,
        CompetenceRating: CompetenceRating || "",
        ManagementPhilosophy: ManagementPhilosophy || "",
        PhilosophyDesignScore: parseFloat(String(PhilosophyDesignScore)) || 0,
        PhilosophyPerformanceScore:
          parseFloat(String(PhilosophyPerformanceScore)) || 0,
        PhilosophySustainabilityScore:
          parseFloat(String(PhilosophySustainabilityScore)) || 0,
        PhilosophyTotalScore: String(PhilosophyTotalScore || ""),
        PhilosophyScale: parseFloat(String(PhilosophyScale)) || 0,
        PhilosophyRating: PhilosophyRating || "",
        ...restStepValues,
      };

      console.log(
        "[ProcessFormModal] Control Environment scoring fullValues:",
        fullValues,
      );
    } else {
      fullValues = {
        No: noValue,
        Process: commonProcess,
        ...stepValues,
      };
    }

    const { Id, Date, ...submitValues } = fullValues;

    // Debug logging for Control Activities
    if (sectionKey === "control-activities") {
      console.log("Final submitValues for Control Activities:", submitValues);
      console.log("Key Control in submitValues:", submitValues["Key Control"]);
      console.log(
        "Zero Tolerance in submitValues:",
        submitValues["Zero Tolerance"],
      );
    }

    if (initialValues && initialValues.Id) {
      await processService.update(sectionKey, {
        ...submitValues,
        Id: initialValues.Id,
      });
    } else {
      await processService.create(sectionKey, submitValues);
    }
  };
  const commonFields = (
    <>
      <Form.Item
        name="No"
        label="No"
        rules={[{ required: true, message: "Please enter the number" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="Process"
        label="Process"
        rules={[{ required: true, message: "Please enter the process" }]}
      >
        <Input />
      </Form.Item>
    </>
  );

  // Define dropdown options
  const probabilityOptions = [
    "Certain",
    "Likely",
    "Possible",
    "Unlikely",
    "Rare",
  ];
  const severityOptions = [
    "Catastrophic",
    "Major",
    "Moderate",
    "Minor",
    "Insignificant",
  ];
  const classificationOptions = [
    "Critical",
    "High",
    "Moderate",
    "Low",
    "Lowest",
  ];
  const yesNoOptions = [
    { value: "P", label: "Yes" },
    { value: "O", label: "No" },
  ]; // P for Yes, O for No

  // COSO Principle options
  const cosoPrincipleOptions = [
    "1. Demonstrates commitment to integrity and ethical values",
    "2. Exercises oversight responsibility",
    "3. Establishes structure, authority, and responsibility",
    "4. Demonstrates commitment to competence",
    "5. Enforces accountability",
    "6. Specifies suitable objectives",
    "7. Identifies and analyzes risk",
    "8. Assesses fraud risk",
    "9. Identifies and analyzes significant change",
    "10. Selects and develops control activities",
    "11. Selects and develops general controls over technology",
    "12. Deploys through policies and procedures",
    "13. Uses relevant information",
    "14. Communicates internally",
    "15. Communicates externally",
    "16. Conducts ongoing and/or separate evaluations",
    "17. Evaluates and communicates deficiencies",
  ];

  // Operational Approach options
  const operationalApproachOptions = ["Automated", "Manual"];

  // Operational Frequency options
  const operationalFrequencyOptions = [
    "Daily",
    "Weekly",
    "Monthly",
    "Quarterly",
    "Semiannually",
    "Annually",
    "Every 2 Years",
    "Every 3 Years",
    "As and When",
  ];

  // Level of Responsibility options
  const levelResponsibilityOptions = [
    "Process Level",
    "Functional Level",
    "Operating Unit Level",
    "Division Level",
    "Entity Level",
  ];

  // Control Classification options
  const controlClassificationOptions = [
    "Directive Control",
    "Preventive Control",
    "Detective Control",
    "Corrective Control",
  ];

  // Tab-specific form fields (match single-row API request bodies)
  //@ts-ignore
  const tabForms: { [key: string]: JSX.Element } = {
    // /Processes
    processes: (
      <>
        <Form.Item name="Process Description" label="Process Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="Process Objectives" label="Process Objectives">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="Process Severity Levels"
          label="Process Severity Levels"
        >
          <Select>
            {severityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /ControlActivities
    "control-activities": (
      <>
        <Form.Item name="Control Objectives" label="Control Objectives">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="Control Ref" label="Control Ref">
          <Input />
        </Form.Item>
        <Form.Item name="Control Definition" label="Control Definition">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="Control Description" label="Control Description">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="Control Responsibility" label="Control Responsibility">
          <Input />
        </Form.Item>
        <Form.Item name="Key Control" label="Key Control">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Zero Tolerance" label="Zero Tolerance">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /ControlAssessments
    "control-assessments": (
      <>
        <Form.Item
          name="Level of Responsibility-Operating Level (Entity / Activity)"
          label="Level of Responsibility-Operating Level (Entity / Activity)"
        >
          <Select>
            {levelResponsibilityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="COSO Principle #" label="COSO Principle #">
          <Select>
            {cosoPrincipleOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Operational Approach (Automated / Manual)"
          label="Operational Approach (Automated / Manual)"
        >
          <Select>
            {operationalApproachOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Operational Frequency" label="Operational Frequency">
          <Select>
            {operationalFrequencyOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Control Classification (Preventive / Detective / Corrective)"
          label="Control Classification (Preventive / Detective / Corrective)"
        >
          <Select>
            {controlClassificationOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /CosoControlEnvironments
    "coso-control-environments": (
      <>
        <Form.Item
          name="Integrity & Ethical Values"
          label="Integrity & Ethical Values"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Board Oversight" label="Board Oversight">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Organizational Structure"
          label="Organizational Structure"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Commitment to Competence"
          label="Commitment to Competence"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Management Philosophy" label="Management Philosophy">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // Control Environment scoring
    "control-environment-scorings": (
      <>
        {/* Integrity & Ethical Values Section */}
        <Form.Item
          name="IntegrityEthicalValues"
          label="Integrity & Ethical Values"
        >
          <Select placeholder="Select Yes or No">
            <Option value="P">Yes</Option>
            <Option value="O">No</Option>
          </Select>
        </Form.Item>
        <Form.Item name="IntegrityDesignScore" label="Integrity Design Score">
          <Input type="number" placeholder="Enter design score" />
        </Form.Item>
        <Form.Item
          name="IntegrityPerformanceScore"
          label="Integrity Performance Score"
        >
          <Input type="number" placeholder="Enter performance score" />
        </Form.Item>
        <Form.Item
          name="IntegritySustainabilityScore"
          label="Integrity Sustainability Score"
        >
          <Input type="number" placeholder="Enter sustainability score" />
        </Form.Item>
        <Form.Item name="IntegrityTotalScore" label="Integrity Total Score">
          <Input placeholder="Enter total score" />
        </Form.Item>
        <Form.Item name="IntegrityScale" label="Integrity Scale">
          <Select placeholder="Select scale">
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="IntegrityRating" label="Integrity Rating">
          <Select placeholder="Select rating">
            <Option value="Strong">Strong</Option>
            <Option value="Adequate">Adequate</Option>
            <Option value="Needs Improvement">Needs Improvement</Option>
            <Option value="Weak">Weak</Option>
            <Option value="Ineffective">Ineffective</Option>
          </Select>
        </Form.Item>

        {/* Board Oversight Section */}
        <Form.Item name="BoardOversight" label="Board Oversight">
          <Select placeholder="Select Yes or No">
            <Option value="P">Yes</Option>
            <Option value="O">No</Option>
          </Select>
        </Form.Item>
        <Form.Item name="BoardDesignScore" label="Board Design Score">
          <Input type="number" placeholder="Enter design score" />
        </Form.Item>
        <Form.Item name="BoardPerformanceScore" label="Board Performance Score">
          <Input type="number" placeholder="Enter performance score" />
        </Form.Item>
        <Form.Item
          name="BoardSustainabilityScore"
          label="Board Sustainability Score"
        >
          <Input type="number" placeholder="Enter sustainability score" />
        </Form.Item>
        <Form.Item name="BoardTotalScore" label="Board Total Score">
          <Input placeholder="Enter total score" />
        </Form.Item>
        <Form.Item name="BoardScale" label="Board Scale">
          <Select placeholder="Select scale">
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="BoardRating" label="Board Rating">
          <Select placeholder="Select rating">
            <Option value="Strong">Strong</Option>
            <Option value="Adequate">Adequate</Option>
            <Option value="Needs Improvement">Needs Improvement</Option>
            <Option value="Weak">Weak</Option>
            <Option value="Ineffective">Ineffective</Option>
          </Select>
        </Form.Item>

        {/* Organizational Structure Section */}
        <Form.Item
          name="OrganizationalStructure"
          label="Organizational Structure"
        >
          <Select placeholder="Select Yes or No">
            <Option value="P">Yes</Option>
            <Option value="O">No</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="OrgStructureDesignScore"
          label="Org Structure Design Score"
        >
          <Input type="number" placeholder="Enter design score" />
        </Form.Item>
        <Form.Item
          name="OrgStructurePerformanceScore"
          label="Org Structure Performance Score"
        >
          <Input type="number" placeholder="Enter performance score" />
        </Form.Item>
        <Form.Item
          name="OrgStructureSustainabilityScore"
          label="Org Structure Sustainability Score"
        >
          <Input type="number" placeholder="Enter sustainability score" />
        </Form.Item>
        <Form.Item
          name="OrgStructureTotalScore"
          label="Org Structure Total Score"
        >
          <Input placeholder="Enter total score" />
        </Form.Item>
        <Form.Item name="OrgStructureScale" label="Org Structure Scale">
          <Select placeholder="Select scale">
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="OrgStructureRating" label="Org Structure Rating">
          <Select placeholder="Select rating">
            <Option value="Strong">Strong</Option>
            <Option value="Adequate">Adequate</Option>
            <Option value="Needs Improvement">Needs Improvement</Option>
            <Option value="Weak">Weak</Option>
            <Option value="Ineffective">Ineffective</Option>
          </Select>
        </Form.Item>

        {/* Commitment to Competence Section */}
        <Form.Item
          name="CommitmentToCompetence"
          label="Commitment to Competence"
        >
          <Select placeholder="Select Yes or No">
            <Option value="P">Yes</Option>
            <Option value="O">No</Option>
          </Select>
        </Form.Item>
        <Form.Item name="CompetenceDesignScore" label="Competence Design Score">
          <Input type="number" placeholder="Enter design score" />
        </Form.Item>
        <Form.Item
          name="CompetencePerformanceScore"
          label="Competence Performance Score"
        >
          <Input type="number" placeholder="Enter performance score" />
        </Form.Item>
        <Form.Item
          name="CompetenceSustainabilityScore"
          label="Competence Sustainability Score"
        >
          <Input type="number" placeholder="Enter sustainability score" />
        </Form.Item>
        <Form.Item name="CompetenceTotalScore" label="Competence Total Score">
          <Input placeholder="Enter total score" />
        </Form.Item>
        <Form.Item name="CompetenceScale" label="Competence Scale">
          <Select placeholder="Select scale">
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="CompetenceRating" label="Competence Rating">
          <Select placeholder="Select rating">
            <Option value="Strong">Strong</Option>
            <Option value="Adequate">Adequate</Option>
            <Option value="Needs Improvement">Needs Improvement</Option>
            <Option value="Weak">Weak</Option>
            <Option value="Ineffective">Ineffective</Option>
          </Select>
        </Form.Item>

        {/* Management Philosophy Section */}
        <Form.Item name="ManagementPhilosophy" label="Management Philosophy">
          <Select placeholder="Select Yes or No">
            <Option value="P">Yes</Option>
            <Option value="O">No</Option>
          </Select>
        </Form.Item>
        <Form.Item name="PhilosophyDesignScore" label="Philosophy Design Score">
          <Input type="number" placeholder="Enter design score" />
        </Form.Item>
        <Form.Item
          name="PhilosophyPerformanceScore"
          label="Philosophy Performance Score"
        >
          <Input type="number" placeholder="Enter performance score" />
        </Form.Item>
        <Form.Item
          name="PhilosophySustainabilityScore"
          label="Philosophy Sustainability Score"
        >
          <Input type="number" placeholder="Enter sustainability score" />
        </Form.Item>
        <Form.Item name="PhilosophyTotalScore" label="Philosophy Total Score">
          <Input placeholder="Enter total score" />
        </Form.Item>
        <Form.Item name="PhilosophyScale" label="Philosophy Scale">
          <Select placeholder="Select scale">
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="PhilosophyRating" label="Philosophy Rating">
          <Select placeholder="Select rating">
            <Option value="Strong">Strong</Option>
            <Option value="Adequate">Adequate</Option>
            <Option value="Needs Improvement">Needs Improvement</Option>
            <Option value="Weak">Weak</Option>
            <Option value="Ineffective">Ineffective</Option>
          </Select>
        </Form.Item>
      </>
    ),
    // /FinancialStatementAssertions
    "financial-statement-assertions": (
      <>
        <Form.Item
          name="Internal Control Over Financial Reporting?"
          label="Internal Control Over Financial Reporting?"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Occurrence" label="Occurrence">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Completeness" label="Completeness">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Accuracy" label="Accuracy">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Authorization" label="Authorization">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Cutoff" label="Cutoff">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Classification and Understandability"
          label="Classification and Understandability"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Existence" label="Existence">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Rights and Obligations" label="Rights and Obligations">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Valuation and Allocation"
          label="Valuation and Allocation"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Presentation / Disclosure"
          label="Presentation / Disclosure"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /GrcExceptionLogs
    "grc-exception-logs": (
      <>
        <Form.Item name="GRC Adequacy" label="GRC Adequacy">
          <Input />
        </Form.Item>
        <Form.Item name="GRC Effectiveness" label="GRC Effectiveness">
          <Input />
        </Form.Item>
        <Form.Item name="Explanation" label="Explanation">
          <TextArea rows={3} />
        </Form.Item>
      </>
    ),
    // /InternalAuditTests
    "internal-audit-tests": (
      <>
        <Form.Item name="Check" label="Check">
          <Input />
        </Form.Item>
        <Form.Item name="Internal Audit Test" label="Internal Audit Test">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name="Sample Size" label="Sample Size">
          <Input />
        </Form.Item>
      </>
    ),
    // /IntosaiIfacControlEnvironments
    "intosai-ifac-control-environments": (
      <>
        <Form.Item
          name="Integrity and Ethical Values"
          label="Integrity and Ethical Values"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Commitment to Competence"
          label="Commitment to Competence"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Management’s Philosophy and Operating Style"
          label="Management’s Philosophy and Operating Style"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Organizational Structure"
          label="Organizational Structure"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Assignment of Authority and Responsibility"
          label="Assignment of Authority and Responsibility"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Human Resource Policies and Practices"
          label="Human Resource Policies and Practices"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Board of Directors’ or Audit Committee’s Participation"
          label="Board of Directors’ or Audit Committee’s Participation"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Management Control Methods"
          label="Management Control Methods"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="External Influences" label="External Influences">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Management’s Commitment to Internal Control"
          label="Management’s Commitment to Internal Control"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Communication and Enforcement of Integrity and Ethical Values"
          label="Communication and Enforcement of Integrity and Ethical Values"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Employee Awareness and Understanding"
          label="Employee Awareness and Understanding"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Accountability and Performance Measurement"
          label="Accountability and Performance Measurement"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Commitment to Transparency and Openness"
          label="Commitment to Transparency and Openness"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /OtherControlEnvironmentScorings (CE-Other Assessment - Tab 22)
    "other-control-environment-scorings": (
      <>
        {/* Responsibility Delegation Matrix */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Responsibility Delegation Matrix</h4>
          <Form.Item name="ResponsibilityDelegationMatrix" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="RdmDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="RdmPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="RdmSustainabilityScore" label="Sustainability Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="RdmTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="RdmScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="RdmRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Segregation of Duties */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Segregation of Duties</h4>
          <Form.Item name="SegregationOfDuties" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="SodDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="SodPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="SodSustainabilityScore" label="Sustainability Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="SodTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="SodScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="SodRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Reporting Lines */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Reporting Lines</h4>
          <Form.Item name="ReportingLines" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ReportingLinesDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="ReportingLinesPerformanceScore"
            label="Performance Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="ReportingLinesSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="ReportingLinesTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="ReportingLinesScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ReportingLinesRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Mission */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Mission</h4>
          <Form.Item name="Mission" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="MissionDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="MissionPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="MissionSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="MissionTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="MissionScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="MissionRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Vision and Values */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Vision and Values</h4>
          <Form.Item name="VisionAndValues" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="VisionValuesDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="VisionValuesPerformanceScore"
            label="Performance Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="VisionValuesSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="VisionValuesTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="VisionValuesScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="VisionValuesRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Goals and Objectives */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Goals and Objectives</h4>
          <Form.Item name="GoalsAndObjectives" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="GoalsObjectivesDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="GoalsObjectivesPerformanceScore"
            label="Performance Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="GoalsObjectivesSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="GoalsObjectivesTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="GoalsObjectivesScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="GoalsObjectivesRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Structures and Systems */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Structures and Systems</h4>
          <Form.Item name="StructuresAndSystems" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="StructuresSystemsDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="StructuresSystemsPerformanceScore"
            label="Performance Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="StructuresSystemsSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="StructuresSystemsTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="StructuresSystemsScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="StructuresSystemsRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Policies and Procedures */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Policies and Procedures</h4>
          <Form.Item name="PoliciesAndProcedures" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="PoliciesProceduresDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="PoliciesProceduresPerformanceScore"
            label="Performance Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="PoliciesProceduresSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="PoliciesProceduresTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="PoliciesProceduresScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="PoliciesProceduresRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Processes */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Processes</h4>
          <Form.Item name="Processes" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ProcessesDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="ProcessesPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="ProcessesSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="ProcessesTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="ProcessesScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ProcessesRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Integrity Ethical Values */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Integrity Ethical Values</h4>
          <Form.Item name="IntegrityEthicalValues" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="IntegrityDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="IntegrityPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="IntegritySustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="IntegrityTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="IntegrityScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="IntegrityRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Oversight Structure */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Oversight Structure</h4>
          <Form.Item name="OversightStructure" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="OversightDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="OversightPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="OversightSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="OversightTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="OversightScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="OversightRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Standards */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Standards</h4>
          <Form.Item name="Standards" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="StandardsDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="StandardsPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="StandardsSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="StandardsTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="StandardsScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="StandardsRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Methodologies */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Methodologies</h4>
          <Form.Item name="Methodologies" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="MethodologiesDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="MethodologiesPerformanceScore"
            label="Performance Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="MethodologiesSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="MethodologiesTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="MethodologiesScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="MethodologiesRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Rules and Regulations */}
        <div
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          <h4>Rules and Regulations</h4>
          <Form.Item name="RulesAndRegulations" label="Status">
            <Select placeholder="Select Yes or No">
              <Option value="P">Yes</Option>
              <Option value="O">No</Option>
            </Select>
          </Form.Item>
          <Form.Item name="RulesRegsDesignScore" label="Design Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="RulesRegsPerformanceScore" label="Performance Score">
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="RulesRegsSustainabilityScore"
            label="Sustainability Score"
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="RulesRegsTotalScore" label="Total Score">
            <Input />
          </Form.Item>
          <Form.Item name="RulesRegsScale" label="Scale">
            <Select placeholder="Select scale">
              <Option value="5">5</Option>
              <Option value="4">4</Option>
              <Option value="3">3</Option>
              <Option value="2">2</Option>
              <Option value="1">1</Option>
            </Select>
          </Form.Item>
          <Form.Item name="RulesRegsRating" label="Rating">
            <Select placeholder="Select rating">
              <Option value="Strong">Strong</Option>
              <Option value="Adequate">Adequate</Option>
              <Option value="Needs Improvement">Needs Improvement</Option>
              <Option value="Weak">Weak</Option>
              <Option value="Ineffective">Ineffective</Option>
            </Select>
          </Form.Item>
        </div>
      </>
    ),
    // /OtherControlEnvironments
    "other-control-environments": (
      <>
        <Form.Item
          name="Responsibility Delegation Matrix"
          label="Responsibility Delegation Matrix"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Segregation of duties" label="Segregation of duties">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Reporting Lines" label="Reporting Lines">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Mission" label="Mission">
          <Input />
        </Form.Item>
        <Form.Item name="Vision and Values" label="Vision and Values">
          <Input />
        </Form.Item>
        <Form.Item name="Goals and Objectives" label="Goals and Objectives">
          <Input />
        </Form.Item>
        <Form.Item name="Structures & Systems" label="Structures & Systems">
          <Input />
        </Form.Item>
        <Form.Item
          name="Policies and Procedures"
          label="Policies and Procedures"
        >
          <Input />
        </Form.Item>
        <Form.Item name="Processes" label="Processes">
          <Input />
        </Form.Item>
        <Form.Item
          name="Integrity and Ethical Values"
          label="Integrity and Ethical Values"
        >
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Oversight structure" label="Oversight structure">
          <Select>
            {yesNoOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Standards" label="Standards">
          <Input />
        </Form.Item>
        <Form.Item name="Methodologies" label="Methodologies">
          <Input />
        </Form.Item>
        <Form.Item name="Rules and Regulations" label="Rules and Regulations">
          <Input />
        </Form.Item>
      </>
    ),
    // /Ownerships
    ownerships: (
      <>
        <Form.Item name="Process" label="Main Process">
          <Input disabled />
        </Form.Item>
        <Form.Item name="Activity" label="Activity">
          <Input />
        </Form.Item>
        <Form.Item name="Main Process" label="Process">
          <Input />
        </Form.Item>

        <Form.Item name="Process Stage" label="Process Stage">
          <Input />
        </Form.Item>
        <Form.Item name="Functions" label="Functions">
          <Input />
        </Form.Item>
        <Form.Item
          name="Client Segment and/or Functional Segment"
          label="Client Segment and/or Functional Segment"
        >
          <Input />
        </Form.Item>
        <Form.Item name="Operational Unit" label="Operational Unit">
          <Input />
        </Form.Item>
        <Form.Item name="Division" label="Division">
          <Input />
        </Form.Item>
        <Form.Item name="Entity" label="Entity">
          <Input />
        </Form.Item>
        <Form.Item name="Unit / Department" label="Unit / Department">
          <Input />
        </Form.Item>
        <Form.Item name="Product Class" label="Product Class">
          <Input />
        </Form.Item>
        <Form.Item name="Product Name" label="Product Name">
          <Input />
        </Form.Item>
      </>
    ),
    // /RiskAssessmentInherentRisks
    "risk-assessment-inherent-risks": (
      <>
        <Form.Item name="Risk Type" label="Risk Type">
          <Input />
        </Form.Item>
        <Form.Item name="Risk Description" label="Risk Description">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="Severity/ Impact" label="Severity/ Impact">
          <Select>
            {severityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Probability/ Likelihood"
          label="Probability/ Likelihood"
        >
          <Select>
            {probabilityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Classification" label="Classification">
          <Select>
            {classificationOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /RiskAssessmentResidualRisks
    "risk-assessment-residual-risks": (
      <>
        <Form.Item name="Risk Type" label="Risk Type">
          <Input />
        </Form.Item>
        <Form.Item name="Risk Description" label="Risk Description">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="Severity/ Impact" label="Severity/ Impact">
          <Select>
            {severityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="Probability/ Likelihood"
          label="Probability/ Likelihood"
        >
          <Select>
            {probabilityOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="Classification" label="Classification">
          <Select>
            {classificationOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /RiskResponses
    "risk-responses": (
      <>
        <Form.Item name="Type of Risk Response" label="Type of Risk Response">
          <Select>
            {["Mitigate", "Accept", "Transfer", "Avoid"].map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    ),
    // /Sox
    sox: (
      <>
        <Form.Item name="SOX Control Activity" label="SOX Control Activity">
          <TextArea rows={3} />
        </Form.Item>
      </>
    ),
    // Assessment of Adequacy
    "assessment-adequacies": (
      <>
        {commonFields}
        <Form.Item
          name="DesignAdequacyScore"
          label="Design Adequacy Score(0-10)"
        >
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item
          name="SustainabilityScore"
          label="Sustainability Score(0-10)"
        >
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item name="ScalabilityScore" label="Scalability Score(0-5)">
          <Input type="number" min={0} max={5} />
        </Form.Item>
        <Form.Item name="AdequacyScore" label="Adequacy Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="TotalScore" label="Total Score(0-25)">
          <Select>
            <Option value="20.1 - 25">20.1 - 25</Option>
            <Option value="15.1 - 20">15.1 - 20</Option>
            <Option value="10.1 - 15">10.1 - 15</Option>
            <Option value="5.1 - 10">5.1 - 10</Option>
            <Option value="0 - 5">0 - 5</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Scale" label="Scale(1-5)">
          <Select>
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Rating" label="Rating">
          <Select>
            <Option value="Fully Adequate">Fully Adequate</Option>
            <Option value="Adequate">Adequate</Option>
            <Option value="Partially Adequate">Partially Adequate</Option>
            <Option value="Inadequate">Inadequate</Option>
            <Option value="Critically Inadequate">Critically Inadequate</Option>
          </Select>
        </Form.Item>
      </>
    ),
    // Assessment of Effectiveness
    "assessment-effectivenesses": (
      <>
        {commonFields}
        <Form.Item name="DesignScore" label="Design Score(0-10)">
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item name="OperatingScore" label="Operating Score(0-10)">
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item name="SustainabilityScore" label="Sustainability Score(0-5)">
          <Input type="number" min={0} max={5} />
        </Form.Item>
        <Form.Item name="EffectivenessScore" label="Effectiveness Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="TotalScore" label="Total Score(0-25)">
          <Select>
            <Option value="20.1 - 25">20.1 - 25</Option>
            <Option value="15.1 - 20">15.1 - 20</Option>
            <Option value="10.1 - 15">10.1 - 15</Option>
            <Option value="5.1 - 10">5.1 - 10</Option>
            <Option value="0 - 5">0 - 5</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Scale" label="Scale(1-5)">
          <Select>
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Rating" label="Rating">
          <Select>
            <Option value="Highly Effective">Highly Effective</Option>
            <Option value="Effective">Effective</Option>
            <Option value="Moderately Effective">Moderately Effective</Option>
            <Option value="Ineffective">Ineffective</Option>
            <Option value="Highly Ineffective">Highly Ineffective</Option>
          </Select>
        </Form.Item>
      </>
    ),
    // Assessment of Efficiency
    "assessment-efficiencies": (
      <>
        {commonFields}
        <Form.Item
          name="ObjectiveAchievementScore"
          label="Objective Achievement Score(0-10)"
        >
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item
          name="TimelinessThroughputScore"
          label="Process Timeliness & Throughput Score(0-10)"
        >
          <Input type="number" min={0} max={10} />
        </Form.Item>
        <Form.Item
          name="ResourceConsumptionScore"
          label="Resource Consumption Score(0-5)"
        >
          <Input type="number" min={0} max={5} />
        </Form.Item>
        <Form.Item name="EfficiencyScore" label="Efficiency Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="TotalScore" label="Total Score(0-25)">
          <Select>
            <Option value="20.1 - 25">20.1 - 25</Option>
            <Option value="15.1 - 20">15.1 - 20</Option>
            <Option value="10.1 - 15">10.1 - 15</Option>
            <Option value="5.1 - 10">5.1 - 10</Option>
            <Option value="0 - 5">0 - 5</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Scale" label="Scale(1-5)">
          <Select>
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Rating" label="Rating">
          <Select>
            <Option value="Highly Effective">Highly Effective</Option>
            <Option value="Effective">Effective</Option>
            <Option value="Moderately Effective">Moderately Effective</Option>
            <Option value="Ineffective">Ineffective</Option>
            <Option value="Highly Ineffective">Highly Ineffective</Option>
          </Select>
        </Form.Item>
      </>
    ),
    // Process Severity
    "process-severities": (
      <>
        {commonFields}
        <Form.Item name="Scale" label="Scale(1-4)">
          <Select>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Rating" label="Process Severity Levels">
          <Select>
            <Option value="Critical">Critical</Option>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
      </>
    ),
    // OwnershipScorings
    "ownership-scorings": (
      <>
        {commonFields}
        <Form.Item name="Activity" label="Activity">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="ActivityScore" label="Activity Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="Process" label="Process">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="ProcessScore" label="Process Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="ActivationProcess" label="Activation Process">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="ProcessStage" label="Process Stage">
          <Select>
            <Option value="Processing">Processing</Option>
            <Option value="Posting">Posting</Option>
            <Option value="Initiation">Initiation</Option>
            <Option value="Confirmation">Confirmation</Option>
            <Option value="Validation">Validation</Option>
          </Select>
        </Form.Item>
        <Form.Item name="ProcessStageScore" label="Process Stage Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="TotalScore" label="Total Score(0-25)">
          <Select>
            <Option value="20.1 – 25">20.1 – 25</Option>
            <Option value="15.1 – 20">15.1 – 20</Option>
            <Option value="10.1 – 15">10.1 – 15</Option>
            <Option value="5.1 – 10">5.1 – 10</Option>
            <Option value="0 – 5">0 – 5</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Scale" label="Scale">
          <Select>
            <Option value="5">5</Option>
            <Option value="4">4</Option>
            <Option value="3">3</Option>
            <Option value="2">2</Option>
            <Option value="1">1</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Rating" label="Rating">
          <Select>
            <Option value="Optimized / Mature">Optimized / Mature</Option>
            <Option value="Managed / Controlled">Managed / Controlled</Option>
            <Option value="Defined / Developing">Defined / Developing</Option>
            <Option value="Basic / Partially Implemented">
              Basic / Partially Implemented
            </Option>
            <Option value="Initial / Ad-hoc">Initial / Ad-hoc</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Function" label="Function">
          <Input />
        </Form.Item>
        <Form.Item name="FunctionScore" label="Function Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item
          name="ClientSegmentAndOrFunctionalSegment"
          label="Client Segment and/or Functional Segment"
        >
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="ClientSegmentScore" label="Client Segment Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="OperationalUnit" label="Operational Unit">
          <Input />
        </Form.Item>
        <Form.Item
          name="OperationalUnitScore"
          label="Operational Unit Score(0-25)"
        >
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="Division" label="Division">
          <Input />
        </Form.Item>
        <Form.Item name="DivisionScore" label="Division Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="Entity" label="Entity">
          <Input />
        </Form.Item>
        <Form.Item name="EntityScore" label="Entity Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="UnitOrDepartment" label="Unit / Department">
          <Input />
        </Form.Item>
        <Form.Item
          name="UnitOrDepartmentScore"
          label="Unit / Department Score(0-25)"
        >
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="ProductClass" label="Product Class">
          <Input />
        </Form.Item>
        <Form.Item name="ProductClassScore" label="Product Class Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
        <Form.Item name="ProductName" label="Product Name">
          <Select>
            <Option value="Others">Others</Option>
            <Option value="Non-Product">Non-Product</Option>
          </Select>
        </Form.Item>
        <Form.Item name="ProductNameScore" label="Product Name Score(0-25)">
          <Input type="number" min={0} max={25} />
        </Form.Item>
      </>
    ),
    // Risk Assessment-Inherent Risk Assessment
    "risk-assessment-inherent-risk-assessment": (
      <>
        <Form.Item name="RiskId" label="Risk ID">
          <Input />
        </Form.Item>
        <Form.Item name="RiskType" label="Risk Type">
          <Input />
        </Form.Item>
        <Form.Item name="RiskDescription" label="Risk Description">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="SeverityImpact" label="Severity/Impact">
          <Select>
            <Option value="Catastrophic">Catastrophic</Option>
            <Option value="Major">Major</Option>
            <Option value="Moderate">Moderate</Option>
            <Option value="Minor">Minor</Option>
            <Option value="Insignificant">Insignificant</Option>
          </Select>
        </Form.Item>
        <Form.Item name="ProbabilityLikelihood" label="Probability/Likelihood">
          <Select>
            <Option value="Certain">Certain</Option>
            <Option value="Likely">Likely</Option>
            <Option value="Possible">Possible</Option>
            <Option value="Unlikely">Unlikely</Option>
            <Option value="Rare">Rare</Option>
          </Select>
        </Form.Item>
        <Form.Item name="Classification" label="Classification">
          <Select>
            <Option value="Critical">Critical</Option>
            <Option value="High">High</Option>
            <Option value="Moderate">Moderate</Option>
            <Option value="Low">Low</Option>
            <Option value="Lowest">Lowest</Option>
          </Select>
        </Form.Item>
        <Form.Item name="RiskIdSeverityImpact" label="Risk ID Severity Impact">
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="RiskIdProbabilityLikelihood"
          label="Risk ID Probability Likelihood"
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item name="RiskIdClassification" label="Risk ID Classification">
          <Input type="number" />
        </Form.Item>
      </>
    ),
  };

  const steps = [
    {
      key: "basic",
      title: "Basic Information",
    },
    {
      key: "additional",
      title: "Additional Fields",
    },
  ];

  const next = async () => {
    try {
      setLoading(true);
      // Step 0: validate basic info only and move to additional fields
      if (currentStep === 0) {
        await form.validateFields(["No", "Process"]);
        setCurrentStep(1);
        // Set the selected section key when moving to step 1
        console.log("Moving to step 1, startSectionKey:", startSectionKey);
        if (startSectionKey) {
          console.log("Setting selectedSectionKey to:", startSectionKey);
          setSelectedSectionKey(startSectionKey);
        } else {
          // If no startSectionKey, select the first uncompleted section
          const remaining = sectionOrder.find(
            (s) => !completedSections.has(s.key),
          );
          if (remaining) {
            console.log(
              "No startSectionKey, setting to first remaining:",
              remaining.key,
            );
            setSelectedSectionKey(remaining.key);
          }
        }
        return;
      }

      // Step 1: optional behavior – move to next uncompleted section (no API)
      if (currentStep === 1) {
        const remaining = sectionOrder.find(
          (s) => !completedSections.has(s.key),
        );
        if (remaining) {
          setSelectedSectionKey(remaining.key);
        } else {
          message.info("All sections for this record are already completed.");
        }
      }
    } catch (e) {
      // validation error already surfaced
    } finally {
      setLoading(false);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddRow = async () => {
    if (!selectedSectionKey) {
      message.error("Please select a section to add a row.");
      return;
    }

    try {
      setLoading(true);
      await form.validateFields();
      await submitSection(selectedSectionKey);

      setCompletedSections((prev) => {
        const next = new Set(prev);
        next.add(selectedSectionKey);
        return next;
      });

      const remaining = sectionOrder.find(
        (s) => !completedSections.has(s.key) && s.key !== selectedSectionKey,
      );

      if (remaining) {
        const noValue = form.getFieldValue("No");
        const processValue = form.getFieldValue("Process");
        form.resetFields();
        form.setFieldsValue({ No: noValue, Process: processValue });
        setSelectedSectionKey(remaining.key);
      } else {
        message.success(
          initialValues
            ? "Record updated successfully"
            : "Record created successfully",
        );
        onSuccess();
        onCancel();
      }
    } catch (e) {
      // validation or submit error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${initialValues ? "Edit" : "Add New"} Record - ${
        steps[currentStep].title
      }`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        currentStep > 0 && (
          <Button key="prev" onClick={prev} disabled={loading}>
            Previous
          </Button>
        ),
        <Button key="next" onClick={next} disabled={loading}>
          Next
        </Button>,
        currentStep === 1 && (
          <Button
            key="add-row"
            type="primary"
            onClick={handleAddRow}
            loading={loading}
          >
            Add Row
          </Button>
        ),
      ]}
    >
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <Steps current={currentStep} style={{ marginBottom: 16 }} size="small">
          {steps.map((item) => (
            <Step key={item.key} title={item.title} />
          ))}
        </Steps>
      </div>
      <Form form={form} layout="vertical" initialValues={initialValues}>
        {currentStep === 0 && commonFields}
        {currentStep === 1 && (
          <>
            <Form.Item label="Select Section">
              <Select
                value={selectedSectionKey || undefined}
                onChange={(value) => setSelectedSectionKey(value)}
                placeholder="Choose section"
              >
                {sectionOrder.map((section) => (
                  <Option key={section.key} value={section.key}>
                    {section.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedSectionKey &&
              (tabForms[selectedSectionKey] || (
                <div>Form for this tab is not implemented yet</div>
              ))}
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ProcessFormModal;
