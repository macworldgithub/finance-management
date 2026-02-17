// src/components/sections/AccountReceivable/configs/grcExceptionLogColumns.tsx
import { ColumnsType } from "antd/es/table";

import { DataType } from "../types";
import { EditableInput } from "../columns";
import { EditableTextArea } from "@/utils/editableComponents";

export const getGrcExceptionLogColumns = (
  handlers: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => [
  {
    title: "GRC Adequacy",
    dataIndex: "grcAdequacy",
    key: "grcAdequacy",
    width: 200,
    render: (text: string, record: DataType) =>
      editingKeys.includes(record.key) ? (
        <EditableInput
          initialValue={text}
          onSave={(v) => handlers?.onTextChange?.(record.key, "grcAdequacy", v)}
          placeholder="Enter GRC Adequacy"
        />
      ) : (
        text || "—"
      ),
  },
  {
    title: "GRC Effectiveness",
    dataIndex: "grcEffectiveness",
    key: "grcEffectiveness",
    width: 200,
    render: (text: string, record: DataType) =>
      editingKeys.includes(record.key) ? (
        <EditableInput
          initialValue={text}
          onSave={(v) =>
            handlers?.onTextChange?.(record.key, "grcEffectiveness", v)
          }
          placeholder="Enter GRC Effectiveness"
        />
      ) : (
        text || "—"
      ),
  },
  {
    title: "Explanation",
    dataIndex: "explanation",
    key: "explanation",
    width: 400,
    render: (text: string, record: DataType) =>
      editingKeys.includes(record.key) ? (
        <EditableTextArea
          initialValue={text}
          onSave={(v) => handlers?.onTextChange?.(record.key, "explanation", v)}
          autoSize={{ minRows: 2, maxRows: 6 }}
          placeholder="Enter explanation..."
        />
      ) : (
        <div style={{ whiteSpace: "pre-line" }}>{text || "—"}</div>
      ),
  },
];
