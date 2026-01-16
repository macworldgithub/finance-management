"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type ProcessSeverityItem = {
  Id: string;
  No: number | string;
  Process: string;
  Date: string;
  Scale: number;
  Rating: string;
};

interface Props {
  data: ProcessSeverityItem[];
}

export default function ProcessSeverityTable({ data }: Props) {
  const columns: ColumnsType<ProcessSeverityItem> = [
    {
      title: "No",
      dataIndex: "No",
      key: "No",
      width: 90,
      align: "center" as const,
    },
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      width: 420,
      ellipsis: true,
    },
    {
      title: "Scale(1-4)",
      dataIndex: "Scale",
      key: "Scale",
      width: 120,
      align: "center" as const,
      render: (v: number) => v ?? 0,
    },
    {
      title: "Process Severity Levels",
      dataIndex: "Rating",
      key: "Rating",
      width: 180,
      align: "center" as const,
      render: (rating: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            String(rating || "")
              .toLowerCase()
              .includes("critical")
              ? "bg-red-100 text-red-800"
              : String(rating || "")
                  .toLowerCase()
                  .includes("high")
              ? "bg-orange-100 text-orange-800"
              : String(rating || "")
                  .toLowerCase()
                  .includes("medium")
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {rating || "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Process Severity
      </h3>
      <div className="overflow-auto">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="Id"
          pagination={{
            pageSize: 12,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1000 }}
          size="small"
          bordered
          className="shadow-sm"
        />
      </div>
    </div>
  );
}
