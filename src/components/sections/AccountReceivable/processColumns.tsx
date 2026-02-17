import React from "react";
import { ColumnsType } from "antd/es/table";
import { DataType } from "./types";
import { renderEditableInput } from "./utils/editableInput";
import { renderActions } from "./utils/actions";

export const getProcessColumns = (
  handlers?: any,
  editingKeys?: string[],
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
    title: "Process Description",
    dataIndex: "processDescription",
    key: "processDescription",
    width: 300,
    render: (text: string, record: DataType) =>
      renderEditableInput(
        text,
        record.key,
        "processDescription",
        handlers,
        editingKeys,
      ),
  },
  {
    title: "Process Objectives",
    dataIndex: "processObjectives",
    key: "processObjectives",
    width: 300,
    render: (text: string, record: DataType) =>
      renderEditableInput(
        text,
        record.key,
        "processObjectives",
        handlers,
        editingKeys,
      ),
  },
  {
    title: "Process Severity Levels",
    dataIndex: "processSeverityLevels",
    key: "processSeverityLevels",
    width: 200,
    render: (text: string, record: DataType) =>
      renderEditableInput(
        text,
        record.key,
        "processSeverityLevels",
        handlers,
        editingKeys,
      ),
  },
  {
    title: "Actions",
    key: "actions",
    width: 200,
    render: (_, record: DataType) =>
      renderActions(record, { ...handlers, editingKeys }),
  },
];
