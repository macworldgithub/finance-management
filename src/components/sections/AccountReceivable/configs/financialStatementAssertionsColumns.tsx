// src/components/sections/AccountReceivable/financialStatementAssertionsColumns.tsx
import { ColumnsType } from "antd/es/table";

import { DataType } from "../types";
import { renderEditableCheckbox } from "../utils/editableRenderers";

// ── Main export ────────────────────────────────────────────────────────────

export const getFinancialStatementAssertionsColumns = (
  handlers: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => [
  {
    title: "Occurrence",
    dataIndex: "occurrence",
    key: "occurrence",
    width: 150,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "occurrence",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Completeness",
    dataIndex: "completeness",
    key: "completeness",
    width: 150,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "completeness",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Accuracy",
    dataIndex: "accuracy",
    key: "accuracy",
    width: 150,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "accuracy",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Authorization",
    dataIndex: "authorization",
    key: "authorization",
    width: 150,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "authorization",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Cutoff",
    dataIndex: "cutoff",
    key: "cutoff",
    width: 120,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "cutoff",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Classification and Understandability",
    dataIndex: "classificationSOX",
    key: "classificationSOX",
    width: 200,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "classificationAndUnderstandability", // ← note: dataIndex vs field name mismatch was in original
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Existence",
    dataIndex: "existence",
    key: "existence",
    width: 150,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "existence",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Rights and Obligations",
    dataIndex: "rightsAndObligations",
    key: "rightsAndObligations",
    width: 180,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "rightsAndObligations",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Valuation and Allocation",
    dataIndex: "valuationAndAllocation",
    key: "valuationAndAllocation",
    width: 200,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "valuationAndAllocation",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Presentation / Disclosure",
    dataIndex: "presentationDisclosure",
    key: "presentationDisclosure",
    width: 200,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "presentationDisclosure",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
];
