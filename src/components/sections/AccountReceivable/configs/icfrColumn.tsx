// src/components/sections/AccountReceivable/configs/icfrColumn.tsx
import { ColumnsType } from "antd/es/table";
import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { DataType } from "../types";
import { yesNoOptions } from "../columns"; // or move yesNoOptions to shared file later

export const getIcfrColumn = (
  handlers: any,
  editingKeys: string[] = [],
): ColumnsType<DataType> => [
  {
    title: "Internal Control Over Financial Reporting",
    dataIndex: "internalControlOverFinancialReporting",
    key: "internalControlOverFinancialReporting",
    width: 320,
    render: (value: any, record: DataType) => {
      // Convert P/O to Yes/No for display
      const displayValue =
        value === "P" || value === true
          ? "Yes"
          : value === "O" || value === false
            ? "No"
            : value === "Yes" || value === "No"
              ? value
              : "";

      if (editingKeys.includes(record.key)) {
        const menu = (
          <Menu
            onClick={({ key }) =>
              handlers?.onSelectGeneric?.(
                key,
                record.key,
                "internalControlOverFinancialReporting",
              )
            }
          >
            {yesNoOptions.map((opt) => (
              <Menu.Item key={opt.key}>{opt.label}</Menu.Item>
            ))}
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="flex items-center cursor-pointer">
              {displayValue || "Select"}{" "}
              <DownOutlined className="ml-1 text-xs" />
            </div>
          </Dropdown>
        );
      }

      return <div>{displayValue || "—"}</div>;
    },
  },
];
