// src/components/sections/AccountReceivable/utils/editableRenderers.ts
import { Checkbox } from "antd";
import { DataType } from "../types";

export const renderEditableCheckbox = (
  value: boolean | string,
  record: DataType,
  field: keyof DataType,
  onCheckboxChange?: (
    rowKey: string,
    field: keyof DataType,
    checked: boolean,
  ) => void,
  editingKeys?: string[],
) => {
  if (editingKeys && editingKeys.includes(record.key)) {
    return (
      <Checkbox
        checked={value === true || value === "P"}
        onChange={(e) =>
          onCheckboxChange?.(record.key, field, e.target.checked)
        }
        className="flex justify-center"
      />
    );
  }
  if (value === true || value === "P") {
    return <span style={{ fontSize: 18, color: "#52c41a" }}>&#10003;</span>;
  }
  if (value === false || value === "O") {
    return <span style={{ fontSize: 18, color: "#d9d9d9" }}>&#10007;</span>;
  }
  return null;
};

// You can also move renderEditableInput, ValidatedEditableInput, EditableTextArea here later
