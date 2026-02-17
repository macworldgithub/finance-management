import React from "react";
import { ColumnsType } from "antd/es/table";
import { DataType } from "./types";
import { renderEditableInput } from "./utils/editableInput";
import { renderActions } from "./utils/actions";

export const getOwnershipColumns = (
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
    title: "Activity",
    dataIndex: "activity",
    key: "activity",
    width: 200,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "activity", handlers, editingKeys),
  },
  {
    title: "Main Process",
    dataIndex: "mainProcess",
    key: "mainProcess",
    width: 200,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "mainProcess", handlers, editingKeys),
  },
  {
    title: "Process Stage",
    dataIndex: "processStage",
    key: "processStage",
    width: 150,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "processStage", handlers, editingKeys),
  },
  {
    title: "Functions",
    dataIndex: "functions",
    key: "functions",
    width: 150,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "functions", handlers, editingKeys),
  },
  {
    title: "Client Segment and/or Functional Segment",
    dataIndex: "clientSegmentAndOrFunctionalSegment",
    key: "clientSegmentAndOrFunctionalSegment",
    width: 250,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "clientSegmentAndOrFunctionalSegment", handlers, editingKeys),
  },
  {
    title: "Operational Unit",
    dataIndex: "operationalUnit",
    key: "operationalUnit",
    width: 150,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "operationalUnit", handlers, editingKeys),
  },
  {
    title: "Division",
    dataIndex: "division",
    key: "division",
    width: 120,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "division", handlers, editingKeys),
  },
  {
    title: "Entity",
    dataIndex: "entity",
    key: "entity",
    width: 120,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "entity", handlers, editingKeys),
  },
  {
    title: "Unit / Department",
    dataIndex: "unitOrDepartment",
    key: "unitOrDepartment",
    width: 150,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "unitOrDepartment", handlers, editingKeys),
  },
  {
    title: "Product Class",
    dataIndex: "productClass",
    key: "productClass",
    width: 120,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "productClass", handlers, editingKeys),
  },
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
    width: 150,
    render: (text: string, record: DataType) =>
      renderEditableInput(text, record.key, "productName", handlers, editingKeys),
  },
  {
    title: "Actions",
    key: "actions",
    width: 200,
    render: (_, record: DataType) => renderActions(record, { ...handlers, editingKeys }),
  },
];
