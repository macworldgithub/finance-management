"use client";

import React from "react";
import { Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface AssessmentModalProps {
  type: "adequacy" | "effectiveness" | "efficiency";
  visible: boolean;
  onClose: () => void;
}

interface AssessmentRow {
  key: string;
  no?: number | string;
  process?: string;
  // Generic numeric/score fields; concrete meaning depends on type
  col1?: number | string;
  col2?: number | string;
  col3?: number | string;
  col4?: number | string;
  col5?: number | string;
  scale?: number | string;
  rating?: string;
}

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  type,
  visible,
  onClose,
}) => {
  const commonColumns = {
    adequacy: [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 70,
        fixed: "left" as const,
      },
      {
        title: "Process",
        dataIndex: "process",
        key: "process",
        width: 260,
        fixed: "left" as const,
      },
      {
        title: "Design Adequacy Score(0-10)",
        dataIndex: "col1",
        key: "col1",
        width: 160,
      },
      {
        title: "Sustainability Score(0-10)",
        dataIndex: "col2",
        key: "col2",
        width: 170,
      },
      {
        title: "Scalability Score(0-5)",
        dataIndex: "col3",
        key: "col3",
        width: 150,
      },
      {
        title: "Adequacy Score(0-25)",
        dataIndex: "col4",
        key: "col4",
        width: 150,
      },
      {
        title: "Total Score(0-25)",
        dataIndex: "col5",
        key: "col5",
        width: 150,
      },
      {
        title: "Scale(1-5)",
        dataIndex: "scale",
        key: "scale",
        width: 100,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        width: 140,
      },
    ],
    effectiveness: [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 70,
        fixed: "left" as const,
      },
      {
        title: "Process",
        dataIndex: "process",
        key: "process",
        width: 260,
        fixed: "left" as const,
      },
      {
        title: "Design Score(0-10)",
        dataIndex: "col1",
        key: "col1",
        width: 140,
      },
      {
        title: "Operating Score(0-10)",
        dataIndex: "col2",
        key: "col2",
        width: 160,
      },
      {
        title: "Sustainability Score(0-5)",
        dataIndex: "col3",
        key: "col3",
        width: 170,
      },
      {
        title: "Effectiveness Score(0-25)",
        dataIndex: "col4",
        key: "col4",
        width: 180,
      },
      {
        title: "Total Score(0-25)",
        dataIndex: "col5",
        key: "col5",
        width: 150,
      },
      {
        title: "Scale(1-5)",
        dataIndex: "scale",
        key: "scale",
        width: 100,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        width: 140,
      },
    ],
    efficiency: [
      {
        title: "Objective Achievement Score(0-10)",
        dataIndex: "col1",
        key: "col1",
        width: 210,
      },
      {
        title: "Process Timeliness & Throughput Score(0-10)",
        dataIndex: "col2",
        key: "col2",
        width: 260,
      },
      {
        title: "Resource Consumption Score(0-5)",
        dataIndex: "col3",
        key: "col3",
        width: 210,
      },
      {
        title: "Efficiency Score(0-25)",
        dataIndex: "col4",
        key: "col4",
        width: 170,
      },
      {
        title: "Total Score(0-25)",
        dataIndex: "col5",
        key: "col5",
        width: 150,
      },
      {
        title: "Scale(1-5)",
        dataIndex: "scale",
        key: "scale",
        width: 100,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        width: 140,
      },
    ],
  } as const;

  const titleMap: Record<AssessmentModalProps["type"], string> = {
    adequacy: "Assessment of Adequacy",
    effectiveness: "Assessment of Effectiveness",
    efficiency: "Assessment of Efficiency",
  };

  const columns: ColumnsType<AssessmentRow> = [...commonColumns[type]];

  // Placeholder empty data for now. This can later be wired to backend or derived data.
  const data: AssessmentRow[] = [];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      title={titleMap[type]}
      destroyOnClose
    >
      <Table<AssessmentRow>
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 900, y: 500 }}
        bordered
        size="small"
      />
    </Modal>
  );
};

export default AssessmentModal;
