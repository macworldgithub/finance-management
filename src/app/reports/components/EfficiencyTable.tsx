"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type EfficiencyItem = {
  Id: string;
  No: string | number;
  Process: string;
  Date: string;
  ObjectiveAchievementScore: number;
  TimelinessThroughputScore: number;
  ResourceConsumptionScore: number;
  EfficiencyScore: number;
  TotalScore: string;
  Scale: number;
  Rating: string;
};

interface EfficiencyTableProps {
  data: EfficiencyItem[];
}

export default function EfficiencyTable({ data }: EfficiencyTableProps) {
  const columns: ColumnsType<EfficiencyItem> = [
    {
      title: "Process",
      dataIndex: "Process",
      key: "Process",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Objective Achievement Score",
      children: [
        {
          title: "Actual",
          dataIndex: "ObjectiveAchievementScore",
          key: "ObjectiveAchievementScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardObjectiveAchievement",
          width: 80,
          align: "center" as const,
          render: () => "10",
        },
      ],
    },
    {
      title: "Process Timeliness & Throughput Score",
      children: [
        {
          title: "Actual",
          dataIndex: "TimelinessThroughputScore",
          key: "TimelinessThroughputScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardTimelinessThroughput",
          width: 80,
          align: "center" as const,
          render: () => "10",
        },
      ],
    },
    {
      title: "Resource Consumption Score",
      children: [
        {
          title: "Actual",
          dataIndex: "ResourceConsumptionScore",
          key: "ResourceConsumptionScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardResourceConsumption",
          width: 80,
          align: "center" as const,
          render: () => "5",
        },
      ],
    },
    {
      title: "Efficiency Score",
      children: [
        {
          title: "Actual",
          dataIndex: "EfficiencyScore",
          key: "EfficiencyScore",
          width: 80,
          align: "center" as const,
          render: (value: number) => value || 0,
        },
        {
          title: "Standard",
          key: "StandardEfficiency",
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
      width: 120,
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
        Efficiency Assessment Data
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
