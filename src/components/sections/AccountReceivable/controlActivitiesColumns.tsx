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

const yesNoOptions = [
  { label: "Yes", key: "P" },
  { label: "No", key: "O" },
];

export const getControlActivitiesColumns = (
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
    title: "Control Objectives",
    dataIndex: "controlObjectives",
    key: "controlObjectives",
    width: 250,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "controlObjectives", handlers, editingKeys),
  },
  {
    title: "Control Ref",
    dataIndex: "controlRef",
    key: "controlRef",
    width: 120,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "controlRef", handlers, editingKeys),
  },
  {
    title: "Control Definition",
    dataIndex: "controlDefinition",
    key: "controlDefinition",
    width: 300,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "controlDefinition", handlers, editingKeys),
  },
  {
    title: "Control Description",
    dataIndex: "controlDescription",
    key: "controlDescription",
    width: 300,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "controlDescription", handlers, editingKeys),
  },
  {
    title: "Control Responsibility",
    dataIndex: "controlResponsibility",
    key: "controlResponsibility",
    width: 180,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "controlResponsibility", handlers, editingKeys),
  },
  {
    title: "Key Control",
    dataIndex: "keyControl",
    key: "keyControl",
    width: 120,
    render: (text: any, record: DataType) => {
      if (editingKeys?.includes(record.key)) {
        const menu = buildMenu(yesNoOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "keyControl")
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="cursor-pointer p-2 rounded border">
              {text === "P" ? "Yes" : text === "O" ? "No" : text || ""}
            </div>
          </Dropdown>
        );
      }
      return text === "P" ? "Yes" : text === "O" ? "No" : text || "";
    },
  },
  {
    title: "Zero Tolerance",
    dataIndex: "zeroTolerance",
    key: "zeroTolerance",
    width: 120,
    render: (text: any, record: DataType) => {
      if (editingKeys?.includes(record.key)) {
        const menu = buildMenu(yesNoOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "zeroTolerance")
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="cursor-pointer p-2 rounded border">
              {text === "P" ? "Yes" : text === "O" ? "No" : text || ""}
            </div>
          </Dropdown>
        );
      }
      return text === "P" ? "Yes" : text === "O" ? "No" : text || "";
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 200,
    render: (_, record: DataType) => renderActions(record, { ...handlers, editingKeys }),
  },
];
