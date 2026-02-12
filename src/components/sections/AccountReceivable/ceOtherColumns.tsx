import React from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { EditableInput } from "./columns";
import { ValidatedEditableInput } from "./columns";

// Import options from the main columns file
export const scale5Options = [
  { key: "5", label: "5" },
  { key: "4", label: "4" },
  { key: "3", label: "3" },
  { key: "2", label: "2" },
  { key: "1", label: "1" },
];

export const cosoRatingOptions = [
  { key: "Strong", label: "Strong" },
  { key: "Adequate", label: "Adequate" },
  { key: "Needs Improvement", label: "Needs Improvement" },
  { key: "Weak", label: "Weak" },
  { key: "Ineffective", label: "Ineffective" },
];

// Helper function to build dropdown menu
const buildMenu = (options: any[], onSelect: (key: string) => void) => (
  <div className="bg-white border border-gray-200 rounded-md shadow-lg">
    {options.map((option) => (
      <div
        key={option.key}
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        onClick={() => onSelect(option.key)}
      >
        {option.label}
      </div>
    ))}
  </div>
);

// Reuse the renderEditableInput function from main columns
const renderEditableInput = (
  value: string,
  recordKey: string,
  field: any,
  handlers?: {
    onTextChange?: (rowKey: string, field: any, value: string) => void;
  },
  editingKeys: string[] = [],
  validationType?: "design" | "performance" | "sustainability" | "total",
) => {
  if (editingKeys.includes(recordKey)) {
    if (validationType) {
      return (
        <ValidatedEditableInput
          initialValue={value}
          fieldType={validationType}
          onSave={(newValue: string) =>
            handlers?.onTextChange?.(recordKey, field, newValue)
          }
        />
      );
    }
    return (
      <EditableInput
        initialValue={value}
        onSave={(newValue: string) =>
          handlers?.onTextChange?.(recordKey, field, newValue)
        }
      />
    );
  }
  return value;
};

// Base columns for CE-Other tabs
const baseCEOtherColumns = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    width: 50,
    fixed: "left" as const,
  },
  {
    title: "Process",
    dataIndex: "process",
    key: "process",
    width: 200,
    fixed: "left" as const,
  },
];

// CE-Other columns (Tab 21)
export const getCEOtherColumns = (
  handlers?: any,
  editingKeys: string[] = [],
): ColumnsType<any> => {
  const dynamicColumns = [
    {
      title: "Other Control Environment",
      children: [
        {
          title: "Design",
          dataIndex: "otherDesignScore",
          key: "otherDesignScore",
          width: 80,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherDesignScore",
              handlers,
              editingKeys,
              "design",
            ),
        },
        {
          title: "Performance",
          dataIndex: "otherPerformanceScore",
          key: "otherPerformanceScore",
          width: 100,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherPerformanceScore",
              handlers,
              editingKeys,
              "performance",
            ),
        },
        {
          title: "Sustainability",
          dataIndex: "otherSustainabilityScore",
          key: "otherSustainabilityScore",
          width: 120,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherSustainabilityScore",
              handlers,
              editingKeys,
              "sustainability",
            ),
        },
        {
          title: "Total",
          dataIndex: "otherTotalScore",
          key: "otherTotalScore",
          width: 80,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherTotalScore",
              handlers,
              editingKeys,
              "total",
            ),
        },
        {
          title: "Scale",
          dataIndex: "otherScale",
          key: "otherScale",
          width: 60,
          render: (text: any, record: any) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(scale5Options, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "otherScale"),
              );
              return (
                <Dropdown overlay={menu} trigger={["click"]}>
                  <div className="flex items-center cursor-pointer">
                    {text || "Select"}
                    <DownOutlined className="ml-1 text-gray-500 text-xs" />
                  </div>
                </Dropdown>
              );
            }
            return text || "-";
          },
        },
        {
          title: "Rating",
          dataIndex: "otherRating",
          key: "otherRating",
          width: 120,
          render: (text: any, record: any) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(cosoRatingOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "otherRating"),
              );
              return (
                <Dropdown overlay={menu} trigger={["click"]}>
                  <div className="flex items-center cursor-pointer">
                    {text || "Select"}
                    <DownOutlined className="ml-1 text-gray-500 text-xs" />
                  </div>
                </Dropdown>
              );
            }
            return text || "-";
          },
        },
      ],
    },
  ];

  return [...baseCEOtherColumns, ...dynamicColumns];
};

// CE-Other Assessment columns (Tab 22)
export const getCEOtherAssessmentColumns = (
  handlers?: any,
  editingKeys: string[] = [],
): ColumnsType<any> => {
  const dynamicColumns = [
    {
      title: "Other Control Environment Assessment",
      children: [
        {
          title: "Design",
          dataIndex: "otherAssessmentDesignScore",
          key: "otherAssessmentDesignScore",
          width: 80,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherAssessmentDesignScore",
              handlers,
              editingKeys,
              "design",
            ),
        },
        {
          title: "Performance",
          dataIndex: "otherAssessmentPerformanceScore",
          key: "otherAssessmentPerformanceScore",
          width: 100,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherAssessmentPerformanceScore",
              handlers,
              editingKeys,
              "performance",
            ),
        },
        {
          title: "Sustainability",
          dataIndex: "otherAssessmentSustainabilityScore",
          key: "otherAssessmentSustainabilityScore",
          width: 120,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherAssessmentSustainabilityScore",
              handlers,
              editingKeys,
              "sustainability",
            ),
        },
        {
          title: "Total",
          dataIndex: "otherAssessmentTotalScore",
          key: "otherAssessmentTotalScore",
          width: 80,
          render: (text: string, record: any) =>
            renderEditableInput(
              text,
              record.key,
              "otherAssessmentTotalScore",
              handlers,
              editingKeys,
              "total",
            ),
        },
        {
          title: "Scale",
          dataIndex: "otherAssessmentScale",
          key: "otherAssessmentScale",
          width: 60,
          render: (text: any, record: any) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(scale5Options, (key) =>
                handlers?.onSelectGeneric?.(
                  key,
                  record.key,
                  "otherAssessmentScale",
                ),
              );
              return (
                <Dropdown overlay={menu} trigger={["click"]}>
                  <div className="flex items-center cursor-pointer">
                    {text || "Select"}
                    <DownOutlined className="ml-1 text-gray-500 text-xs" />
                  </div>
                </Dropdown>
              );
            }
            return text || "-";
          },
        },
        {
          title: "Rating",
          dataIndex: "otherAssessmentRating",
          key: "otherAssessmentRating",
          width: 120,
          render: (text: any, record: any) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(cosoRatingOptions, (key) =>
                handlers?.onSelectGeneric?.(
                  key,
                  record.key,
                  "otherAssessmentRating",
                ),
              );
              return (
                <Dropdown overlay={menu} trigger={["click"]}>
                  <div className="flex items-center cursor-pointer">
                    {text || "Select"}
                    <DownOutlined className="ml-1 text-gray-500 text-xs" />
                  </div>
                </Dropdown>
              );
            }
            return text || "-";
          },
        },
      ],
    },
  ];

  return [...baseCEOtherColumns, ...dynamicColumns];
};
