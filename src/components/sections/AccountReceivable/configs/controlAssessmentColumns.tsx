// src/components/sections/AccountReceivable/controlAssessmentColumns.tsx
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

const levelOptions = [
  { label: "Process Level", key: "Process Level" },
  { label: "Functional Level", key: "Functional Level" },
  { label: "Operating Unit Level", key: "Operating Unit Level" },
  { label: "Division Level", key: "Division Level" },
  { label: "Entity Level", key: "Entity Level" },
];

const approachOptions = [
  { label: "Automated", key: "Automated" },
  { label: "Manual", key: "Manual" },
];

const frequencyOptions = [
  { label: "Daily", key: "Daily" },
  { label: "Weekly", key: "Weekly" },
  { label: "Monthly", key: "Monthly" },
  { label: "Quarterly", key: "Quarterly" },
  { label: "Semiannually", key: "Semiannually" },
  { label: "Annually", key: "Annually" },
  { label: "Every 2 Years", key: "Every 2 Years" },
  { label: "Every 3 Years", key: "Every 3 Years" },
  { label: "As and When", key: "As and When" },
];

const classificationOptions = [
  { label: "Directive Control", key: "Directive Control" },
  { label: "Preventive Control", key: "Preventive Control" },
  { label: "Detective Control", key: "Detective Control" },
  { label: "Corrective Control", key: "Corrective Control" },
];

// ── Main export ────────────────────────────────────────────────────────────

export const getControlAssessmentColumns = (
  handlers: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => [
  {
    title: "Level of Responsibility",
    dataIndex: "levelResponsibility",
    key: "levelResponsibility",
    width: 220,
    render: (text: string, record: DataType) => {
      if (editingKeys.includes(record.key)) {
        return (
          <Dropdown
            overlay={buildMenu(levelOptions, (k) =>
              handlers?.onSelectGeneric?.(k, record.key, "levelResponsibility"),
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

  {
    title: "COSO Principle #",
    dataIndex: "cosoPrinciple",
    key: "cosoPrinciple",
    width: 180,
    render: (text: string, record: DataType) => {
      // You can keep full list or move to separate constant if preferred
      const cosoOptions = [
        {
          label: "1. Demonstrates commitment to integrity and ethical values",
          key: "1. Demonstrates commitment to integrity and ethical values",
        },
        {
          label: "2. Exercises oversight responsibility",
          key: "2. Exercises oversight responsibility",
        },
        // ... all 17 items ...
        {
          label: "17. Evaluates and communicates deficiencies",
          key: "17. Evaluates and communicates deficiencies",
        },
      ];

      if (editingKeys.includes(record.key)) {
        return (
          <Dropdown
            overlay={buildMenu(cosoOptions, (k) =>
              handlers?.onSelectGeneric?.(k, record.key, "cosoPrinciple"),
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

  {
    title: "Operational Approach",
    dataIndex: "operationalApproach",
    key: "operationalApproach",
    width: 160,
    render: (text: string, record: DataType) => {
      if (editingKeys.includes(record.key)) {
        return (
          <Dropdown
            overlay={buildMenu(approachOptions, (k) =>
              handlers?.onSelectGeneric?.(k, record.key, "operationalApproach"),
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

  {
    title: "Operational Frequency",
    dataIndex: "operationalFrequency",
    key: "operationalFrequency",
    width: 180,
    render: (text: string, record: DataType) => {
      if (editingKeys.includes(record.key)) {
        return (
          <Dropdown
            overlay={buildMenu(frequencyOptions, (k) =>
              handlers?.onSelectGeneric?.(
                k,
                record.key,
                "operationalFrequency",
              ),
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

  {
    title: "Control Classification",
    dataIndex: "controlClassification",
    key: "controlClassification",
    width: 220,
    render: (text: string, record: DataType) => {
      if (editingKeys.includes(record.key)) {
        return (
          <Dropdown
            overlay={buildMenu(classificationOptions, (k) =>
              handlers?.onSelectGeneric?.(
                k,
                record.key,
                "controlClassification",
              ),
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
