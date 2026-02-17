// src/components/sections/AccountReceivable/soxControlActivityColumns.tsx
import { ColumnsType } from "antd/es/table";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { DataType } from "../types";

// ── Helpers ────────────────────────────────────────────────────────────────

const buildMenu = (
  items: { label: string; key: string }[],
  onClick: (key: string) => void,
) => (
  <Menu onClick={({ key }) => onClick(key)}>
    {items.map((item) => (
      <Menu.Item key={item.key}>{item.label}</Menu.Item>
    ))}
  </Menu>
);

const soxControlActivityOptions = [
  {
    label: "Financial Controller Activity",
    key: "Financial Controller Activity",
  },
  { label: "Other", key: "Other" },
];

// ── Main export ────────────────────────────────────────────────────────────

export const getSoxControlActivityColumns = (
  handlers: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => [
  {
    title: "SOX Control Activity",
    dataIndex: "soxControlActivity",
    key: "soxControlActivity",
    width: 250,
    render: (text: string, record: DataType) => {
      if (editingKeys.includes(record.key)) {
        return (
          <Dropdown
            overlay={buildMenu(soxControlActivityOptions, (k) =>
              handlers?.onSelectGeneric?.(k, record.key, "soxControlActivity"),
            )}
            trigger={["click"]}
          >
            <div className="flex items-center justify-between cursor-pointer border rounded px-2 py-1 min-h-[32px]">
              {text || "Select"} <DownOutlined className="ml-1 text-xs" />
            </div>
          </Dropdown>
        );
      }
      return text || "—";
    },
  },
];
