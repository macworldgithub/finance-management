import React from "react";
import { ColumnsType } from "antd/es/table";
import { Menu, Dropdown, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { DataType } from "./types";
import { renderEditableInput } from "./utils/editableInput";
import { renderActions } from "./utils/actions";

const { Option } = Select;

const buildMenu = (options: { label: string; key: string }[], onSelect: (key: string) => void) => (
  <Menu onClick={({ key }) => onSelect(key)}>
    {options.map((option) => (
      <Menu.Item key={option.key}>{option.label}</Menu.Item>
    ))}
  </Menu>
);

const severityOptions = [
  { label: "Catastrophic", key: "Catastrophic" },
  { label: "Major", key: "Major" },
  { label: "Moderate", key: "Moderate" },
  { label: "Minor", key: "Minor" },
  { label: "Insignificant", key: "Insignificant" },
];

const probabilityOptions = [
  { label: "Certain", key: "Certain" },
  { label: "Likely", key: "Likely" },
  { label: "Possible", key: "Possible" },
  { label: "Unlikely", key: "Unlikely" },
  { label: "Rare", key: "Rare" },
];

const classificationOptions = [
  { label: "Critical", key: "Critical" },
  { label: "High", key: "High" },
  { label: "Moderate", key: "Moderate" },
  { label: "Low", key: "Low" },
  { label: "Lowest", key: "Lowest" },
];

const getColorForSeverity = (value: string) => {
  switch (value) {
    case "Catastrophic":
      return { bgColor: "#FE0000", textColor: "#FFFFFF", borderColor: "#CC0000" };
    case "Major":
      return { bgColor: "#FFC000", textColor: "#000000", borderColor: "#CCAA00" };
    case "Moderate":
      return { bgColor: "#FFFD04", textColor: "#000000", borderColor: "#99CC00" };
    case "Minor":
      return { bgColor: "#8FD154", textColor: "#000000", borderColor: "#00AA00" };
    case "Insignificant":
      return { bgColor: "#00AF50", textColor: "#000000", borderColor: "#00AA44" };
    case "Critical":
      return { bgColor: "#FE0000", textColor: "#FFFFFF", borderColor: "#CC0000" };
    case "High":
      return { bgColor: "#FFC000", textColor: "#000000", borderColor: "#CCAA00" };
    case "Low":
      return { bgColor: "#8FD154", textColor: "#000000", borderColor: "#00AA00" };
    case "Lowest":
      return { bgColor: "#00AF50", textColor: "#000000", borderColor: "#00AA44" };
    default:
      return { bgColor: "#FFFFFF", textColor: "#000000", borderColor: "#D9D9D9" };
  }
};

const getColorForProbability = (value: string) => {
  switch (value) {
    case "Certain":
      return { bgColor: "#FE0000", textColor: "#FFFFFF", borderColor: "#CC0000" };
    case "Likely":
      return { bgColor: "#FFC000", textColor: "#000000", borderColor: "#CCAA00" };
    case "Possible":
      return { bgColor: "#FFFD04", textColor: "#000000", borderColor: "#99CC00" };
    case "Unlikely":
      return { bgColor: "#8FD154", textColor: "#000000", borderColor: "#00AA00" };
    case "Rare":
      return { bgColor: "#00AF50", textColor: "#000000", borderColor: "#00AA44" };
    default:
      return { bgColor: "#FFFFFF", textColor: "#000000", borderColor: "#D9D9D9" };
  }
};

const getColorForClassification = (value: string) => {
  switch (value) {
    case "Critical":
      return { bgColor: "#FE0000", textColor: "#FFFFFF", borderColor: "#CC0000" };
    case "High":
      return { bgColor: "#FFC000", textColor: "#000000", borderColor: "#CCAA00" };
    case "Moderate":
      return { bgColor: "#FFFD04", textColor: "#000000", borderColor: "#99CC00" };
    case "Low":
      return { bgColor: "#8FD154", textColor: "#000000", borderColor: "#00AA00" };
    case "Lowest":
      return { bgColor: "#00AF50", textColor: "#000000", borderColor: "#00AA44" };
    default:
      return { bgColor: "#FFFFFF", textColor: "#000000", borderColor: "#D9D9D9" };
  }
};

export const getRiskAssessmentInherentColumns = (
  handlers?: any,
  editingKeys?: string[]
): ColumnsType<DataType> => [
  {
    title: "No.",
    dataIndex: "no",
    key: "no",
    width: 80,
    fixed: "left",
    render: (text: any, record: DataType) =>
      renderEditableInput(text, record.key, "no", handlers, editingKeys),
  },
  {
    title: "Process",
    dataIndex: "process",
    key: "process",
    width: 200,
    fixed: "left",
    render: (text: any, record: DataType) =>
      renderEditableInput(text, record.key, "process", handlers, editingKeys),
  },
  {
    title: "Risk Type",
    dataIndex: "riskType",
    key: "riskType",
    width: 150,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "riskType", handlers, editingKeys),
  },
  {
    title: "Risk Description",
    dataIndex: "riskDescription",
    key: "riskDescription",
    width: 300,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "riskDescription", handlers, editingKeys),
  },
  {
    title: "Severity/Impact",
    dataIndex: "severityImpact",
    key: "severityImpact",
    width: 150,
    render: (text: any, record: DataType) => {
      const menu = buildMenu(severityOptions, (key) =>
        handlers?.onSelectGeneric?.(key, record.key, "severityImpact")
      );
      const { bgColor, textColor, borderColor } = getColorForSeverity(text);
      
      if (editingKeys?.includes(record.key)) {
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div 
              className="flex items-center cursor-pointer p-2 rounded" 
              style={{ 
                backgroundColor: bgColor, 
                color: textColor, 
                borderColor: borderColor, 
                borderStyle: "solid", 
                borderWidth: 1 
              }}
            >
              {text || ""}
            </div>
          </Dropdown>
        );
      }
      return (
        <div 
          style={{ 
            backgroundColor: bgColor, 
            color: textColor, 
            borderColor: borderColor, 
            borderStyle: "solid", 
            borderWidth: 1, 
            padding: 4, 
            borderRadius: 4 
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
    render: (text: any, record: DataType) => {
      const menu = buildMenu(probabilityOptions, (key) =>
        handlers?.onSelectGeneric?.(key, record.key, "probabilityLikelihood")
      );
      const { bgColor, textColor, borderColor } = getColorForProbability(text);
      
      if (editingKeys?.includes(record.key)) {
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div 
              className="flex items-center cursor-pointer p-2 rounded" 
              style={{ 
                backgroundColor: bgColor, 
                color: textColor, 
                borderColor: borderColor, 
                borderStyle: "solid", 
                borderWidth: 1 
              }}
            >
              {text || ""}
            </div>
          </Dropdown>
        );
      }
      return (
        <div 
          style={{ 
            backgroundColor: bgColor, 
            color: textColor, 
            borderColor: borderColor, 
            borderStyle: "solid", 
            borderWidth: 1, 
            padding: 4, 
            borderRadius: 4 
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
    render: (text: any, record: DataType) => {
      const menu = buildMenu(classificationOptions, (key) =>
        handlers?.onSelectGeneric?.(key, record.key, "classification")
      );
      const { bgColor, textColor, borderColor } = getColorForClassification(text);
      
      if (editingKeys?.includes(record.key)) {
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div 
              className="flex items-center cursor-pointer p-2 rounded" 
              style={{ 
                backgroundColor: bgColor, 
                color: textColor, 
                borderColor: borderColor, 
                borderStyle: "solid", 
                borderWidth: 1 
              }}
            >
              {text || ""}
            </div>
          </Dropdown>
        );
      }
      return (
        <div 
          style={{ 
            backgroundColor: bgColor, 
            color: textColor, 
            borderColor: borderColor, 
            borderStyle: "solid", 
            borderWidth: 1, 
            padding: 4, 
            borderRadius: 4 
          }}
        >
          {text || ""}
        </div>
      );
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 200,
    render: (_, record: DataType) => renderActions(record, { ...handlers, editingKeys }),
  },
];
