import React from "react";
import { Input, Dropdown, Menu } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownOutlined } from "@ant-design/icons";
import { DataType } from "./types";
import { EditableInput, ValidatedEditableInput } from "./columns";

// Rating options
const cosoRatingOptions = [
  { key: "Strong", label: "Strong" },
  { key: "Adequate", label: "Adequate" },
  { key: "Needs Improvement", label: "Needs Improvement" },
  { key: "Weak", label: "Weak" },
  { key: "Ineffective", label: "Ineffective" },
];

const scale5Options = [
  { key: "5", label: "5" },
  { key: "4", label: "4" },
  { key: "3", label: "3" },
  { key: "2", label: "2" },
  { key: "1", label: "1" },
];

// Helper to build dropdown menu
const buildMenu = (options: any[], onSelect: (key: string) => void) => (
  <Menu
    onClick={(info) => {
      onSelect(info.key);
    }}
    items={options.map((opt) => ({
      label: opt.label,
      key: opt.key,
    }))}
    style={{
      maxHeight: "300px",
      overflowY: "auto",
      scrollbarWidth: "thin",
      msOverflowStyle: "none",
    }}
  />
);

// Helper to render editable input
const renderEditableInput = (
  value: string | number,
  recordKey: string,
  field: keyof DataType,
  handlers?: {
    onTextChange?: (
      rowKey: string,
      field: keyof DataType,
      value: string,
    ) => void;
  },
  editingKeys: string[] = [],
) => {
  if (editingKeys.includes(recordKey)) {
    return (
      <EditableInput
        initialValue={String(value ?? "")}
        onSave={(newValue: string) =>
          handlers?.onTextChange?.(recordKey, field, newValue)
        }
      />
    );
  }
  return value;
};

// Helper to render dropdown select
const renderEditableSelect = (
  value: string,
  recordKey: string,
  field: keyof DataType,
  options: any[],
  handlers?: {
    onSelectGeneric?: (key: string, rowKey: string, field?: string) => void;
  },
  editingKeys: string[] = [],
) => {
  if (editingKeys.includes(recordKey)) {
    const menu = buildMenu(options, (key) =>
      handlers?.onSelectGeneric?.(key, recordKey, field as string),
    );
    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <div className="flex items-center cursor-pointer">
          {value || "Select"}
          <DownOutlined className="ml-1 text-gray-500 text-xs" />
        </div>
      </Dropdown>
    );
  }
  return value || "-";
};

/**
 * Generate dynamic columns for CE-Other Assessment (Tab 22)
 * Based on OtherControlEnvironmentScorings API response structure
 * Includes 13 scoring groups with Design/Performance/Sustainability/Total/Scale/Rating
 */
export const getCEOtherAssessmentColumns = (
  handlers?: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => {
  // Base columns that appear in all rows
  const baseColumns: ColumnsType<DataType> = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 70,
      fixed: "left",
      render: (text: any) => text,
    },
    {
      title: "Process",
      dataIndex: "process",
      key: "process",
      width: 300,
      fixed: "left",
      render: (text: string) => text,
    },
  ];

  // Dynamic scoring groups for OtherControlEnvironmentScorings API - 13 groups total
  const scoringGroups = [
    {
      groupTitle: "Responsibility Delegation Matrix",
      fields: [
        { key: "rdmDesignScore", label: "Design Score", width: 120 },
        { key: "rdmPerformanceScore", label: "Performance Score", width: 140 },
        {
          key: "rdmSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "rdmTotalScore", label: "Total Score", width: 120 },
        { key: "rdmScale", label: "Scale", width: 80 },
        { key: "rdmRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Segregation of Duties",
      fields: [
        { key: "sodDesignScore", label: "Design Score", width: 120 },
        { key: "sodPerformanceScore", label: "Performance Score", width: 140 },
        {
          key: "sodSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "sodTotalScore", label: "Total Score", width: 120 },
        { key: "sodScale", label: "Scale", width: 80 },
        { key: "sodRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Reporting Lines",
      fields: [
        { key: "reportingLinesDesignScore", label: "Design Score", width: 120 },
        {
          key: "reportingLinesPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "reportingLinesSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "reportingLinesTotalScore", label: "Total Score", width: 120 },
        { key: "reportingLinesScale", label: "Scale", width: 80 },
        { key: "reportingLinesRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Mission",
      fields: [
        { key: "missionDesignScore", label: "Design Score", width: 120 },
        {
          key: "missionPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "missionSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "missionTotalScore", label: "Total Score", width: 120 },
        { key: "missionScale", label: "Scale", width: 80 },
        { key: "missionRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Vision and Values",
      fields: [
        { key: "visionValuesDesignScore", label: "Design Score", width: 120 },
        {
          key: "visionValuesPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "visionValuesSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "visionValuesTotalScore", label: "Total Score", width: 120 },
        { key: "visionValuesScale", label: "Scale", width: 80 },
        { key: "visionValuesRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Goals and Objectives",
      fields: [
        {
          key: "goalsObjectivesDesignScore",
          label: "Design Score",
          width: 120,
        },
        {
          key: "goalsObjectivesPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "goalsObjectivesSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "goalsObjectivesTotalScore", label: "Total Score", width: 120 },
        { key: "goalsObjectivesScale", label: "Scale", width: 80 },
        { key: "goalsObjectivesRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Structures and Systems",
      fields: [
        {
          key: "structuresSystemsDesignScore",
          label: "Design Score",
          width: 120,
        },
        {
          key: "structuresSystemsPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "structuresSystemsSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        {
          key: "structuresSystemsTotalScore",
          label: "Total Score",
          width: 120,
        },
        { key: "structuresSystemsScale", label: "Scale", width: 80 },
        { key: "structuresSystemsRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Policies and Procedures",
      fields: [
        {
          key: "policiesProceduresDesignScore",
          label: "Design Score",
          width: 120,
        },
        {
          key: "policiesProceduresPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "policiesProceduresSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        {
          key: "policiesProceduresTotalScore",
          label: "Total Score",
          width: 120,
        },
        { key: "policiesProceduresScale", label: "Scale", width: 80 },
        { key: "policiesProceduresRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Processes",
      fields: [
        { key: "processesDesignScore", label: "Design Score", width: 120 },
        {
          key: "processesPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "processesSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "processesTotalScore", label: "Total Score", width: 120 },
        { key: "processesScale", label: "Scale", width: 80 },
        { key: "processesRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Integrity Ethical Values",
      fields: [
        { key: "integrityDesignScore", label: "Design Score", width: 120 },
        {
          key: "integrityPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "integritySustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "integrityTotalScore", label: "Total Score", width: 120 },
        { key: "integrityScale", label: "Scale", width: 80 },
        { key: "integrityRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Oversight Structure",
      fields: [
        { key: "oversightDesignScore", label: "Design Score", width: 120 },
        {
          key: "oversightPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "oversightSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "oversightTotalScore", label: "Total Score", width: 120 },
        { key: "oversightScale", label: "Scale", width: 80 },
        { key: "oversightRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Standards",
      fields: [
        { key: "standardsDesignScore", label: "Design Score", width: 120 },
        {
          key: "standardsPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "standardsSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "standardsTotalScore", label: "Total Score", width: 120 },
        { key: "standardsScale", label: "Scale", width: 80 },
        { key: "standardsRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Methodologies",
      fields: [
        { key: "methodologiesDesignScore", label: "Design Score", width: 120 },
        {
          key: "methodologiesPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "methodologiesSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "methodologiesTotalScore", label: "Total Score", width: 120 },
        { key: "methodologiesScale", label: "Scale", width: 80 },
        { key: "methodologiesRating", label: "Rating", width: 150 },
      ],
    },
    {
      groupTitle: "Rules and Regulations",
      fields: [
        { key: "rulesRegsDesignScore", label: "Design Score", width: 120 },
        {
          key: "rulesRegsPerformanceScore",
          label: "Performance Score",
          width: 140,
        },
        {
          key: "rulesRegsSustainabilityScore",
          label: "Sustainability Score",
          width: 150,
        },
        { key: "rulesRegsTotalScore", label: "Total Score", width: 120 },
        { key: "rulesRegsScale", label: "Scale", width: 80 },
        { key: "rulesRegsRating", label: "Rating", width: 150 },
      ],
    },
  ];

  // Generate columns for each scoring group
  const dynamicColumns = scoringGroups.map((group) => ({
    title: group.groupTitle,
    children: group.fields.map((field) => {
      const isScore = field.key.includes("Score");
      const isScale = field.key.includes("Scale");
      const isRating = field.key.includes("Rating");

      return {
        title: field.label,
        dataIndex: field.key,
        key: field.key,
        width: field.width || 100,
        render: (text: any, record: DataType) => {
          if (isScore) {
            return renderEditableInput(
              text,
              record.key,
              field.key as keyof DataType,
              handlers,
              editingKeys,
            );
          }
          if (isScale) {
            return renderEditableSelect(
              String(text ?? ""),
              record.key,
              field.key as keyof DataType,
              scale5Options,
              handlers,
              editingKeys,
            );
          }
          if (isRating) {
            return renderEditableSelect(
              String(text ?? ""),
              record.key,
              field.key as keyof DataType,
              cosoRatingOptions,
              handlers,
              editingKeys,
            );
          }
          return text || "-";
        },
      };
    }),
  }));

  return [...baseColumns, ...dynamicColumns] as ColumnsType<DataType>;
};
