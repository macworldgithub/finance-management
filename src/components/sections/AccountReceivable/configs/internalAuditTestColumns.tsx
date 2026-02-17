// src/components/sections/AccountReceivable/configs/internalAuditTestColumns.tsx
import { ColumnsType } from "antd/es/table";

import { DataType } from "../types";
import { renderEditableCheckbox } from "../utils/editableRenderers";
import { EditableInput } from "../columns"; // or move to shared utils later
import { EditableTextArea } from "@/utils/editableComponents";

export const getInternalAuditTestColumns = (
  handlers: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => [
  {
    title: "Check",
    dataIndex: "check",
    key: "check",
    width: 150,
    render: (checked: boolean, record: DataType) =>
      renderEditableCheckbox(
        checked,
        record,
        "check",
        handlers?.onCheckboxChange,
        editingKeys,
      ),
  },
  {
    title: "Internal Audit Test",
    dataIndex: "internalAuditTest",
    key: "internalAuditTest",
    width: 400,
    render: (text: string, record: DataType) =>
      editingKeys.includes(record.key) ? (
        <EditableTextArea
          initialValue={text}
          //@ts-ignore
          onSave={(v) =>
            handlers?.onTextChange?.(record.key, "internalAuditTest", v)
          }
          autoSize={{ minRows: 2 }}
        />
      ) : (
        text
      ),
  },
  {
    title: "Sample Size",
    dataIndex: "sampleSize",
    key: "sampleSize",
    width: 150,
    render: (text: string, record: DataType) =>
      editingKeys.includes(record.key) ? (
        <EditableInput
          initialValue={text}
          onSave={(v) => handlers?.onTextChange?.(record.key, "sampleSize", v)}
        />
      ) : (
        text
      ),
  },
];
