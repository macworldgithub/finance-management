"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type EffectivenessItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  DesignScore: number;
  OperatingScore: number;
  SustainabilityScore: number;
  EffectivenessScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
};

interface EffectivenessTableProps {
  data: EffectivenessItem[];
}

export default function EffectivenessTable({ data }: EffectivenessTableProps) {
  const columns: ColumnsType<EffectivenessItem> = [
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Design Score",
      children: [
        {
          title: "Actual",
          dataIndex: "DesignScore",
          key: "DesignScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardDesign",
          width: 80,
          align: "center" as const,
          render: () => "10",
        },
      ],
    },
    {
      title: "Operating Score",
      children: [
        {
          title: "Actual",
          dataIndex: "OperatingScore",
          key: "OperatingScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardOperating",
          width: 80,
          align: "center" as const,
          render: () => "10",
        },
      ],
    },
    {
      title: "Sustainability Score",
      children: [
        {
          title: "Actual",
          dataIndex: "SustainabilityScore",
          key: "SustainabilityScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardSustainability",
          width: 80,
          align: "center" as const,
          render: () => "5",
        },
      ],
    },
    {
      title: "Effectiveness Score",
      children: [
        {
          title: "Actual",
          dataIndex: "EffectivenessScore",
          key: "EffectivenessScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardEffectiveness",
          width: 80,
          align: "center" as const,
          render: () => "25",
        },
      ],
    },
    {
      title: "Rating",
      dataIndex: "Rating",
      key: "Rating",
      width: 100,
      align: "center" as const,
      render: (rating: string) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            rating === "Excellent"
              ? "bg-green-100 text-green-800"
              : rating === "Good"
              ? "bg-blue-100 text-blue-800"
              : rating === "Average"
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
        Effectiveness Assessment Data
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
          scroll={{ x: 1200 }}
          size="small"
          bordered
          className="shadow-sm"
        />
      </div>
    </div>
  );
}
