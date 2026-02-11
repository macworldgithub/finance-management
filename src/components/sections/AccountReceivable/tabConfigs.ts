// Dynamic tab configuration generator
export interface AssessmentField {
  type: "status" | "score" | "scale" | "rating";
  dataIndex: string;
  title?: string;
  width?: number;
}

export interface AssessmentSection {
  title: string;
  dataIndex: string;
  fields: AssessmentField[];
}

export interface TabConfig {
  sections: AssessmentSection[];
}

// Base field templates
const createStatusField = (dataIndex: string): AssessmentField => ({
  type: "status",
  dataIndex,
});

const createScoreField = (
  prefix: string,
  category: string,
  width: number = 80,
): AssessmentField => ({
  type: "score",
  dataIndex: `${prefix}${category}Score`,
  title: category.charAt(0).toUpperCase() + category.slice(1),
  width,
});

const createScaleField = (dataIndex: string): AssessmentField => ({
  type: "scale",
  dataIndex,
});

const createRatingField = (dataIndex: string): AssessmentField => ({
  type: "rating",
  dataIndex,
});

// Create assessment section with standard field pattern
const createAssessmentSection = (
  title: string,
  dataIndex: string,
  prefix: string,
): AssessmentSection => ({
  title,
  dataIndex,
  fields: [
    createStatusField(dataIndex),
    createScoreField(prefix, "design", 80),
    createScoreField(prefix, "performance", 100),
    createScoreField(prefix, "sustainability", 120),
    createScoreField(prefix, "total", 80),
    createScaleField(`${prefix}Scale`),
    createRatingField(`${prefix}Rating`),
  ],
});

// Generate tab configuration dynamically
export const generateTabConfig = (
  sections: Array<{
    title: string;
    dataIndex: string;
    prefix: string;
  }>,
): TabConfig => ({
  sections: sections.map(({ title, dataIndex, prefix }) =>
    createAssessmentSection(title, dataIndex, prefix),
  ),
});

// Generate "All Columns" tab configuration that combines all sections from all tabs
export const generateAllColumnsTabConfig = (
  tabConfigs: Record<string, TabConfig>,
): TabConfig => {
  const allSections: AssessmentSection[] = [];

  // Collect all sections from all tabs
  Object.values(tabConfigs).forEach((tabConfig) => {
    allSections.push(...tabConfig.sections);
  });

  
  return {
    sections: allSections,
  };
};

// Simple section definition - just the basic data needed
interface SectionDefinition {
  title: string;
  dataIndex: string;
  prefix: string;
}

// Tab definitions - simple data objects
interface TabDefinition {
  sections: SectionDefinition[];
}

// Define tabs with simple data structures
export const TAB_DEFINITIONS: Record<string, TabDefinition> = {
  "20": {
    sections: [
      {
        title: "Integrity & Ethical Values",
        dataIndex: "integrityEthicalValues",
        prefix: "integrity",
      },
      {
        title: "Commitment to Competence",
        dataIndex: "commitmentToCompetence",
        prefix: "competence",
      },
      {
        title: "Management Philosophy",
        dataIndex: "managementPhilosophy",
        prefix: "philosophy",
      },
      {
        title: "Organizational Structure",
        dataIndex: "organizationalStructure",
        prefix: "orgStructure",
      },
      {
        title: "Assignment of Authority and Responsibility",
        dataIndex: "assignmentOfAuthorityAndResponsibility",
        prefix: "authority",
      },
      {
        title: "Human Resource Policies and Practices",
        dataIndex: "humanResourcePoliciesAndPractices",
        prefix: "hr",
      },
      {
        title: "Board of Directors' or Audit Committee's Participation",
        dataIndex: "boardOfDirectorsOrAuditCommitteeParticipation",
        prefix: "board",
      },
      {
        title: "Management Control Methods",
        dataIndex: "managementControlMethods",
        prefix: "controlMethods",
      },
      {
        title: "External Influences",
        dataIndex: "externalInfluences",
        prefix: "external",
      },
      {
        title: "Management's Commitment to Internal Control",
        dataIndex: "managementsCommitmentToInternalControl",
        prefix: "commitmentIc",
      },
      {
        title: "Communication and Enforcement of Integrity and Ethical Values",
        dataIndex: "communicationAndEnforcementOfIntegrityAndEthicalValues",
        prefix: "commEthical",
      },
      {
        title: "Employee Awareness and Understanding",
        dataIndex: "employeeAwarenessAndUnderstanding",
        prefix: "awareness",
      },
      {
        title: "Accountability and Performance Measurement",
        dataIndex: "accountabilityAndPerformanceMeasurement",
        prefix: "accountability",
      },
      {
        title: "Commitment to Transparency and Openness",
        dataIndex: "commitmentToTransparencyAndOpenness",
        prefix: "transparency",
      },
    ],
  },
};

// Generate all tab configurations dynamically from definitions
export const generateAllTabConfigs = (): Record<string, TabConfig> => {
  const configs: Record<string, TabConfig> = {};

  Object.entries(TAB_DEFINITIONS).forEach(([tabKey, tabDef]) => {
    configs[tabKey] = generateTabConfig(tabDef.sections);
  });

  return configs;
};

// Dynamic tab configurations for all assessment tabs
export const ASSESSMENT_TAB_CONFIGS = generateAllTabConfigs();

// Generate "All Columns" tab configuration dynamically
export const getAllColumnsTabConfig = (): TabConfig => {
  return generateAllColumnsTabConfig(ASSESSMENT_TAB_CONFIGS);
};

// Pre-generated "All Columns" tab (combines all sections from all tabs)
export const ALL_COLUMNS_TAB_CONFIG = getAllColumnsTabConfig();
