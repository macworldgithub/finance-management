import {
  createStatusColumn,
  createScoreColumn,
  createScaleColumn,
  createRatingColumn,
} from "./columnFactories";
import { ASSESSMENT_TAB_CONFIGS, getAllColumnsTabConfig } from "./tabConfigs";
import type { AssessmentField, AssessmentSection } from "./tabConfigs";

// Dynamic column generator function
export const generateDynamicColumns = (
  tabKey: string,
  handlers?: any,
  editingKeys?: string[],
  scaleOptions?: any[],
  ratingOptions?: any[],
) => {
  const config =
    ASSESSMENT_TAB_CONFIGS[tabKey as keyof typeof ASSESSMENT_TAB_CONFIGS];

  if (!config) {
    console.warn(`No configuration found for tab: ${tabKey}`);
    return [];
  }

  return config.sections.map((section) => {
    const sectionTitle = section.title;
    const children = section.fields.map((field) => {
      switch (field.type) {
        case "status":
          return createStatusColumn(field.dataIndex, field.width);

        case "score":
          return createScoreColumn(
            field.dataIndex,
            field.title || field.dataIndex,
            field.width,
            handlers,
            editingKeys,
          );

        case "scale":
          return createScaleColumn(
            field.dataIndex,
            scaleOptions || [],
            handlers,
            editingKeys,
          );

        case "rating":
          return createRatingColumn(
            field.dataIndex,
            ratingOptions || [],
            handlers,
            editingKeys,
          );

        default:
          return {
            title: field.title || field.dataIndex,
            dataIndex: field.dataIndex,
            key: field.dataIndex,
            width: field.width || 100,
            render: (text: any) => text || "-",
          };
      }
    });

    return {
      title: sectionTitle,
      children: children,
    };
  });
};

// Helper function to add new assessment section dynamically
export const addAssessmentSection = (
  tabKey: string,
  sectionTitle: string,
  statusDataIndex: string,
  fieldPrefix: string,
) => {
  const config =
    ASSESSMENT_TAB_CONFIGS[tabKey as keyof typeof ASSESSMENT_TAB_CONFIGS];

  if (!config) {
    console.error(`Tab ${tabKey} not found in configuration`);
    return;
  }

  const newSection: AssessmentSection = {
    title: sectionTitle,
    dataIndex: statusDataIndex,
    fields: [
      { type: "status", dataIndex: statusDataIndex },
      {
        type: "score",
        dataIndex: `${fieldPrefix}DesignScore`,
        title: "Design",
        width: 80,
      },
      {
        type: "score",
        dataIndex: `${fieldPrefix}PerformanceScore`,
        title: "Performance",
        width: 100,
      },
      {
        type: "score",
        dataIndex: `${fieldPrefix}SustainabilityScore`,
        title: "Sustainability",
        width: 120,
      },
      {
        type: "score",
        dataIndex: `${fieldPrefix}TotalScore`,
        title: "Total",
        width: 80,
      },
      { type: "scale", dataIndex: `${fieldPrefix}Scale` },
      { type: "rating", dataIndex: `${fieldPrefix}Rating` },
    ],
  };

  config.sections.push(newSection);
  console.log(`Added new section "${sectionTitle}" to tab ${tabKey}`);
};
