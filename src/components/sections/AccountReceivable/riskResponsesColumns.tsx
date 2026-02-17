import React from "react";
import type { ColumnsType } from "antd/es/table";
import { Button, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";

// const { Option } = Dropdown;

// Helper function to build menu
const buildMenu = (options: { label: string; key: string }[], onSelect: (key: string) => void) => (
  <div>
    {options.map((option) => (
      <div
        key={option.key}
        onClick={() => onSelect(option.key)}
        style={{
          padding: "8px 12px",
          cursor: "pointer",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {option.label}
      </div>
    ))}
  </div>
);

// Risk Response columns (Tab 25)
export const getRiskResponsesColumns = (
  handlers?: any,
  editingKeys: string[] = [],
): ColumnsType<any> => {
  const dynamicColumns = [
    {
      title: "Type of Risk Response",
      dataIndex: "riskResponseType",
      key: "riskResponseType",
      width: 300,
      render: (text: any, record: any) => {
        const responseOptions = [
          { label: "Avoid", key: "Avoid" },
          { label: "Mitigate", key: "Mitigate" },
          { label: "Transfer", key: "Transfer" },
          { label: "Share", key: "Share" },
          { label: "Accept", key: "Accept" },
        ];
        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(responseOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "riskResponseType"),
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                {text || "Select"}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }
        return text || "-";
      },
    },
    {
      title: "Risk Response Description",
      dataIndex: "riskResponseDescription",
      key: "riskResponseDescription",
      width: 400,
      render: (text: any, record: any) =>
        editingKeys.includes(record.key) ? (
          <input
            type="text"
            defaultValue={text}
            onChange={(e) =>
              handlers?.onChangeGeneric?.(
                e.target.value,
                record.key,
                "riskResponseDescription"
              )
            }
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <div>{text || "-"}</div>
        ),
    },
    {
      title: "Control Objective",
      dataIndex: "controlObjective",
      key: "controlObjective",
      width: 300,
      render: (text: any, record: any) =>
        editingKeys.includes(record.key) ? (
          <input
            type="text"
            defaultValue={text}
            onChange={(e) =>
              handlers?.onChangeGeneric?.(
                e.target.value,
                record.key,
                "controlObjective"
              )
            }
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <div>{text || "-"}</div>
        ),
    },
    {
      title: "Control Ref",
      dataIndex: "controlRef",
      key: "controlRef",
      width: 200,
      render: (text: any, record: any) =>
        editingKeys.includes(record.key) ? (
          <input
            type="text"
            defaultValue={text}
            onChange={(e) =>
              handlers?.onChangeGeneric?.(
                e.target.value,
                record.key,
                "controlRef"
              )
            }
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <div>{text || "-"}</div>
        ),
    },
    {
      title: "Control Definition",
      dataIndex: "controlDefinition",
      key: "controlDefinition",
      width: 400,
      render: (text: any, record: any) =>
        editingKeys.includes(record.key) ? (
          <textarea
            defaultValue={text}
            onChange={(e) =>
              handlers?.onChangeGeneric?.(
                e.target.value,
                record.key,
                "controlDefinition"
              )
            }
            className="w-full px-2 py-1 border rounded"
            rows={2}
          />
        ) : (
          <div>{text || "-"}</div>
        ),
    },
    {
      title: "Control Description",
      dataIndex: "controlDescription",
      key: "controlDescription",
      width: 400,
      render: (text: any, record: any) =>
        editingKeys.includes(record.key) ? (
          <textarea
            defaultValue={text}
            onChange={(e) =>
              handlers?.onChangeGeneric?.(
                e.target.value,
                record.key,
                "controlDescription"
              )
            }
            className="w-full px-2 py-1 border rounded"
            rows={2}
          />
        ) : (
          <div>{text || "-"}</div>
        ),
    },
    {
      title: "Control Responsibility",
      dataIndex: "controlResponsibility",
      key: "controlResponsibility",
      width: 300,
      render: (text: any, record: any) =>
        editingKeys.includes(record.key) ? (
          <input
            type="text"
            defaultValue={text}
            onChange={(e) =>
              handlers?.onChangeGeneric?.(
                e.target.value,
                record.key,
                "controlResponsibility"
              )
            }
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <div>{text || "-"}</div>
        ),
    },
    {
      title: "Key Control",
      dataIndex: "keyControl",
      key: "keyControl",
      width: 200,
      render: (text: any, record: any) => {
        const yesNoOptions = [
          { label: "Yes", key: "P" },
          { label: "No", key: "O" },
        ];
        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(yesNoOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "keyControl"),
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                {text === "P" ? "Yes" : text === "O" ? "No" : text || "Select"}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }
        return text === "P" ? "✓" : text === "O" ? "✗" : text || "-";
      },
    },
    {
      title: "Zero Tolerance",
      dataIndex: "zeroTolerance",
      key: "zeroTolerance",
      width: 200,
      render: (text: any, record: any) => {
        const yesNoOptions = [
          { label: "Yes", key: "P" },
          { label: "No", key: "O" },
        ];
        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(yesNoOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "zeroTolerance"),
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                {text === "P" ? "Yes" : text === "O" ? "No" : text || "Select"}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }
        return text === "P" ? "✓" : text === "O" ? "✗" : text || "-";
      },
    },
  ];

  return dynamicColumns;
};
