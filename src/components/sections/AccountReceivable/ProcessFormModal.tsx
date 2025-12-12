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
    null
  );
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    () => new Set()
  );

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
      setCurrentStep(0);
      setCompletedSections(new Set());
      setSelectedSectionKey(startSectionKey ?? null);
    }
  }, [visible, initialValues, form, startSectionKey]);

  // Ordered list of section keys for multi-section creation
  const sectionOrder: { key: string; title: string }[] = [
    { key: "processes", title: "Processes" },
    { key: "ownerships", title: "Ownership" },
    { key: "coso-control-environments", title: "COSO Control Environment" },
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
    { key: "internal-audit-tests", title: "Internal Audit Tests" },
    {
      key: "intosai-ifac-control-environments",
      title: "INTOSAI/IFAC Control Environment",
    },
    { key: "other-control-environments", title: "Other Control Environment" },
  ];

  useEffect(() => {
    if (selectedSectionKey === "ownerships") {
      const commonProcess = form.getFieldValue("Process");
      form.setFieldsValue({ "Main Process": commonProcess });
    }
  }, [selectedSectionKey, form]);

  // const submitSection = async (sectionKey: string) => {
  //   // Get shared basic values
  //   const noValue = form.getFieldValue("No");
  //   const processValue = form.getFieldValue("Process");
  //   const stepValues = form.getFieldsValue();

  //   const fullValues = {
  //     No: noValue,
  //     Process: processValue,
  //     ...stepValues,
  //   };

  //   const { Id, Date, ...submitValues } = fullValues;

  //   // Decide create vs update based on initialValues.Id
  //   if (initialValues && initialValues.Id) {
  //     await processService.update(sectionKey, {
  //       ...submitValues,
  //       Id: initialValues.Id,
  //     });
  //   } else {
  //     await processService.create(sectionKey, submitValues);
  //   }
  // };
  const submitSection = async (sectionKey: string) => {
    const noValue = form.getFieldValue("No");
    const commonProcess = form.getFieldValue("Process"); // shared for all tabs
    const stepValues = form.getFieldsValue();

    let fullValues: any;

    if (sectionKey === "ownerships") {
      const { Process: ownershipProcess, ...restStepValues } = stepValues;

      fullValues = {
        No: noValue,
        Process: ownershipProcess, // Ownership-specific
        "Main Process": commonProcess, // same as basic Process, autofilled
        ...restStepValues,
      };
    } else {
      fullValues = {
        No: noValue,
        Process: commonProcess,
        ...stepValues,
      };
    }

    const { Id, Date, ...submitValues } = fullValues;

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
        <Form.Item name="Main Process" label="Main Process">
          <Input disabled />
        </Form.Item>
        <Form.Item name="Activity" label="Activity">
          <Input />
        </Form.Item>
        {/* <Form.Item name="Process" label="Process">
          <Input />
        </Form.Item> */}
        <Form.Item name="Ownership Process" label="Process">
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
        return;
      }

      // Step 1: optional behavior – move to next uncompleted section (no API)
      if (currentStep === 1) {
        const remaining = sectionOrder.find(
          (s) => !completedSections.has(s.key)
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
        (s) => !completedSections.has(s.key) && s.key !== selectedSectionKey
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
            : "Record created successfully"
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
                value={selectedSectionKey ?? undefined}
                onChange={(value) => setSelectedSectionKey(value)}
                placeholder="Choose section"
              >
                {sectionOrder.map((section) => (
                  <Option
                    key={section.key}
                    value={section.key}
                    disabled={completedSections.has(section.key)}
                  >
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
