import React from "react";
import { Input } from "antd";
import { DataType } from "../types";

interface EditableInputProps {
  initialValue: string;
  onSave: (value: string) => void;
  placeholder?: string;
}

export const EditableInput: React.FC<EditableInputProps> = ({
  initialValue,
  onSave,
  placeholder = "",
}) => {
  const [value, setValue] = React.useState(initialValue || "");

  const handleSave = () => {
    onSave(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
};

export const renderEditableInput = (
  value: string,
  recordKey: string,
  field: keyof DataType,
  handlers?: any,
  editingKeys?: string[]
) => {
  if (editingKeys?.includes(recordKey)) {
    return (
      <EditableInput
        initialValue={value || ""}
        onSave={(newValue) => handlers?.onTextChange?.(recordKey, field, newValue)}
      />
    );
  }
  return value || "-";
};
