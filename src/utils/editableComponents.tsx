// utils/editableComponents.tsx
import React, { useState, useEffect } from "react";
import { Input } from "antd";
const { TextArea } = Input;

export const EditableInput = ({
  initialValue,
  onSave,
  ...props
}: {
  initialValue: string;
  onSave: (v: string) => void;
  [key: string]: any;
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => setValue(initialValue), [initialValue]);

  const handleBlur = () => {
    if (value !== initialValue) onSave(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (newValue !== initialValue) onSave(newValue);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
      {...props}
    />
  );
};

export const EditableTextArea = ({
  initialValue,
  onSave,
  ...props
}: {
  initialValue: string;
  onSave: (v: string) => void;
  [key: string]: any;
}) => {
  const [value, setValue] = useState(initialValue);
  useEffect(() => setValue(initialValue), [initialValue]);

  const handleBlur = () => {
    if (value !== initialValue) onSave(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (newValue !== initialValue) onSave(newValue);
  };

  return (
    <TextArea
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      autoFocus
      {...props}
    />
  );
};

// You can also move ValidatedEditableInput here later
