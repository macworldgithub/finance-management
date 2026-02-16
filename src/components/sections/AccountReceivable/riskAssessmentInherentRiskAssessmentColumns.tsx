import React from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { EditableInput } from "./columns";

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

// Helper function for editable inputs
const renderEditableInput = (
  value: string,
  recordKey: string,
  field: any,
  handlers?: {
    onTextChange?: (rowKey: string, field: any, value: string) => void;
  },
  editingKeys: string[] = [],
) => {
  if (editingKeys.includes(recordKey)) {
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

// Helper function for dropdown selects
const renderDropdown = (
  text: any,
  record: any,
  recordKey: string,
  field: any,
  options: any[],
  handlers?: {
    onSelectGeneric?: (key: string, rowKey: string, field: any) => void;
  },
  editingKeys: string[] = [],
) => {
  if (editingKeys.includes(recordKey)) {
    const menu = buildMenu(options, (key) =>
      handlers?.onSelectGeneric?.(key, recordKey, field),
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
};

// Risk Assessment-Inherent Risk Assessment columns (Tab 24)
export const getRiskAssessmentInherentRiskAssessmentColumns = (
  handlers?: any,
  editingKeys: string[] = [],
): ColumnsType<any> => {
  const dynamicColumns = [
    {
      title: "Risk ID",
      dataIndex: "riskId",
      key: "riskId",
      width: 120,
      render: (text: string, record: any) =>
        renderEditableInput(text, record.key, "riskId", handlers, editingKeys),
    },
    {
      title: "Risk Type",
      dataIndex: "riskType",
      key: "riskType",
      width: 180,
      render: (text: string, record: any) =>
        renderEditableInput(
          text,
          record.key,
          "riskType",
          handlers,
          editingKeys,
        ),
    },
    {
      title: "Risk Description",
      dataIndex: "riskDescription",
      key: "riskDescription",
      width: 300,
      render: (text: string, record: any) =>
        renderEditableInput(
          text,
          record.key,
          "riskDescription",
          handlers,
          editingKeys,
        ),
    },
    {
      title: "Severity/Impact",
      dataIndex: "severityImpact",
      key: "severityImpact",
      width: 150,
      render: (text: any, record: any) => {
        const severityOptions = [
          { label: "Critical", key: "Critical" },
          { label: "High", key: "High" },
          { label: "Medium", key: "Medium" },
          { label: "Low", key: "Low" },
        ];
        const menu = buildMenu(severityOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "severityImpact"),
        );
        const { bgColor, textColor, borderColor } = getColorForSeverity(text);
        if (editingKeys.includes(record.key)) {
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="flex items-center cursor-pointer p-2 rounded"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontWeight: "600",
                }}
              >
                {text || "Select"}
                <DownOutlined className="ml-2" style={{ color: textColor }} />
              </div>
            </Dropdown>
          );
        }
        return (
          <div
            className="flex items-center p-2 rounded"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
            }}
          >
            {text || ""}
          </div>
        );
      },
    },
    {
      title: "Probability/Likelihood",
      dataIndex: "probabilityLikelihood",
      key: "probabilityLikelihood",
      width: 180,
      render: (text: any, record: any) => {
        const probabilityOptions = [
          { label: "Certain", key: "Certain" },
          { label: "Likely", key: "Likely" },
          { label: "Possible", key: "Possible" },
          { label: "Unlikely", key: "Unlikely" },
          { label: "Rare", key: "Rare" },
        ];
        const menu = buildMenu(probabilityOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "probabilityLikelihood"),
        );
        const { bgColor, textColor, borderColor } = getColorForSeverity(text);
        if (editingKeys.includes(record.key)) {
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="flex items-center cursor-pointer p-2 rounded"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontWeight: "600",
                }}
              >
                {text || "Select"}
                <DownOutlined className="ml-2" style={{ color: textColor }} />
              </div>
            </Dropdown>
          );
        }
        return (
          <div
            className="flex items-center p-2 rounded"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
            }}
          >
            {text || ""}
          </div>
        );
      },
    },
    {
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
      width: 150,
      render: (text: any, record: any) => {
        const classificationOptions = [
          { label: "Critical", key: "Critical" },
          { label: "Major", key: "Major" },
          { label: "Moderate", key: "Moderate" },
          { label: "Minor", key: "Minor" },
        ];
        const menu = buildMenu(classificationOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "classification"),
        );
        const { bgColor, textColor, borderColor } = getColorForSeverity(text);
        if (editingKeys.includes(record.key)) {
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="flex items-center cursor-pointer p-2 rounded"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontWeight: "600",
                }}
              >
                {text || "Select"}
                <DownOutlined className="ml-2" style={{ color: textColor }} />
              </div>
            </Dropdown>
          );
        }
        return (
          <div
            className="flex items-center p-2 rounded"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
            }}
          >
            {text || ""}
          </div>
        );
      },
    },
    {
      title: "Risk ID Severity Impact",
      dataIndex: "riskIdSeverityImpact",
      key: "riskIdSeverityImpact",
      width: 150,
      render: (text: any, record: any) =>
        renderEditableInput(
          text,
          record.key,
          "riskIdSeverityImpact",
          handlers,
          editingKeys,
        ),
    },
    {
      title: "Risk ID Probability Likelihood",
      dataIndex: "riskIdProbabilityLikelihood",
      key: "riskIdProbabilityLikelihood",
      width: 180,
      render: (text: any, record: any) =>
        renderEditableInput(
          text,
          record.key,
          "riskIdProbabilityLikelihood",
          handlers,
          editingKeys,
        ),
    },
    {
      title: "Risk ID Classification",
      dataIndex: "riskIdClassification",
      key: "riskIdClassification",
      width: 150,
      render: (text: any, record: any) =>
        renderEditableInput(
          text,
          record.key,
          "riskIdClassification",
          handlers,
          editingKeys,
        ),
    },
  ];

  return dynamicColumns;
};

// Helper function to get colors based on severity
const getColorForSeverity = (severity: string) => {
  const colorMap: {
    [key: string]: { bgColor: string; textColor: string; borderColor: string };
  } = {
    Critical: {
      bgColor: "#fee2e2",
      textColor: "#991b1b",
      borderColor: "#dc2626",
    },
    High: {
      bgColor: "#fef2f2",
      textColor: "#991b1b",
      borderColor: "#fca5a5",
    },
    Medium: {
      bgColor: "#fef3c7",
      textColor: "#92400e",
      borderColor: "#fbbf24",
    },
    Low: {
      bgColor: "#f0f9ff",
      textColor: "#1e40af",
      borderColor: "#bae6fd",
    },
  };

  return colorMap[severity] || colorMap.Medium;
};
