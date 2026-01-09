// src/components/sections/AccountReceivable/MultipleTablesReviewModal.tsx
"use client";

import React, { useState } from "react";
import {
  Modal,
  Tabs,
  Table,
  Button,
  Input,
  Select,
  message,
  Typography,
  Space,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ProcessData {
  No: number;
  "Main Process": string;
  "Process Description": string;
  "Process Objectives": string;
  "Process Severity Levels": string;
  key?: string;
}

interface MultipleTablesData {
  [key: string]: ProcessData[]; // Dynamic keys for different sections
}

interface MultipleTablesReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: MultipleTablesData) => void;
  importedData: MultipleTablesData;
}

const MultipleTablesReviewModal: React.FC<MultipleTablesReviewModalProps> = ({
  visible,
  onClose,
  onConfirm,
  importedData,
}) => {
  const [editingData, setEditingData] = useState<MultipleTablesData>({});
  const [editingKey, setEditingKey] = useState<{
    [key: string]: string | null;
  }>({});
  const [activeTab, setActiveTab] = useState<string>("");

  // Initialize editing data when modal opens
  React.useEffect(() => {
    if (visible && importedData) {
      const processedData: MultipleTablesData = {};
      const initialEditingKeys: { [key: string]: string | null } = {};

      Object.keys(importedData).forEach((sectionKey) => {
        processedData[sectionKey] = importedData[sectionKey].map(
          (item, index) => ({
            ...item,
            key: `${sectionKey}-row-${index}`,
          })
        );
        initialEditingKeys[sectionKey] = null;
      });

      setEditingData(processedData);
      setEditingKey(initialEditingKeys);

      // Set first tab as active
      const firstSection = Object.keys(importedData)[0];
      if (firstSection) {
        setActiveTab(firstSection);
      }
    }
  }, [visible, importedData]);

  const handleEdit = (sectionKey: string, rowKey: string) => {
    setEditingKey((prev) => ({
      ...prev,
      [sectionKey]: rowKey,
    }));
  };

  const handleSave = (sectionKey: string, rowKey: string) => {
    setEditingKey((prev) => ({
      ...prev,
      [sectionKey]: null,
    }));
    message.success("Changes saved");
  };

  const handleCancel = (sectionKey: string) => {
    setEditingKey((prev) => ({
      ...prev,
      [sectionKey]: null,
    }));
    // Reset to original data for this section
    setEditingData((prev) => ({
      ...prev,
      [sectionKey]: importedData[sectionKey].map((item, index) => ({
        ...item,
        key: `${sectionKey}-row-${index}`,
      })),
    }));
  };

  const handleFieldChange = (
    sectionKey: string,
    rowKey: string,
    field: string,
    value: string
  ) => {
    setEditingData((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((item) =>
        item.key === rowKey ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleConfirm = () => {
    onConfirm(editingData);
    message.success("All data imported successfully!");
    onClose();
  };

  const severityLevels = ["Critical", "High", "Medium", "Low"];

  const getColumns = (sectionKey: string) => [
    {
      title: "No",
      dataIndex: "No",
      key: "No",
      width: 80,
      render: (text: number, record: ProcessData) =>
        editingKey[sectionKey] === record.key ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldChange(sectionKey, record.key!, "No", e.target.value)
            }
            type="number"
            step="0.1"
          />
        ) : (
          text
        ),
    },
    {
      title: "Main Process",
      dataIndex: "Main Process",
      key: "Main Process",
      render: (text: string, record: ProcessData) =>
        editingKey[sectionKey] === record.key ? (
          <Input
            value={text}
            onChange={(e) =>
              handleFieldChange(
                sectionKey,
                record.key!,
                "Main Process",
                e.target.value
              )
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Process Description",
      dataIndex: "Process Description",
      key: "Process Description",
      render: (text: string, record: ProcessData) =>
        editingKey[sectionKey] === record.key ? (
          <TextArea
            value={text}
            onChange={(e) =>
              handleFieldChange(
                sectionKey,
                record.key!,
                "Process Description",
                e.target.value
              )
            }
            rows={3}
          />
        ) : (
          <div style={{ maxWidth: 300 }}>{text}</div>
        ),
    },
    {
      title: "Process Objectives",
      dataIndex: "Process Objectives",
      key: "Process Objectives",
      render: (text: string, record: ProcessData) =>
        editingKey[sectionKey] === record.key ? (
          <TextArea
            value={text}
            onChange={(e) =>
              handleFieldChange(
                sectionKey,
                record.key!,
                "Process Objectives",
                e.target.value
              )
            }
            rows={3}
          />
        ) : (
          <div style={{ maxWidth: 300 }}>{text}</div>
        ),
    },
    {
      title: "Severity Levels",
      dataIndex: "Process Severity Levels",
      key: "Process Severity Levels",
      render: (text: string, record: ProcessData) =>
        editingKey[sectionKey] === record.key ? (
          <Select
            value={text}
            onChange={(value) =>
              handleFieldChange(
                sectionKey,
                record.key!,
                "Process Severity Levels",
                value
              )
            }
            style={{ width: 120 }}
          >
            {severityLevels.map((level) => (
              <Option key={level} value={level}>
                {level}
              </Option>
            ))}
          </Select>
        ) : (
          <span
            style={{
              color:
                text === "Critical"
                  ? "#ff4d4f"
                  : text === "High"
                  ? "#fa8c16"
                  : text === "Medium"
                  ? "#faad14"
                  : "#52c41a",
            }}
          >
            {text}
          </span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: ProcessData) => {
        const editable = editingKey[sectionKey] === record.key;
        return editable ? (
          <Space>
            <Button
              type="link"
              icon={<SaveOutlined />}
              onClick={() => handleSave(sectionKey, record.key!)}
              size="small"
            >
              Savevfgrf
            </Button>
            <Button
              type="link"
              danger
              onClick={() => handleCancel(sectionKey)}
              size="small"
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(sectionKey, record.key!)}
            size="small"
          >
            Edit
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <Title level={4} style={{ margin: 0 }}>
            Review All Imported Data
          </Title>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          Confirm All Imports
        </Button>,
      ]}
      width={1400}
      centered
      destroyOnClose
      style={{ top: 20 }}
    >
      <div className="space-y-4">
        <Text>
          Review and edit all imported data across different sections. Switch
          between tabs to review different data sets.
        </Text>

        {Object.keys(editingData).length > 0 && (
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            {Object.keys(editingData).map((sectionKey) => (
              <TabPane tab={sectionKey} key={sectionKey}>
                <Table
                  columns={getColumns(sectionKey)}
                  dataSource={editingData[sectionKey]}
                  pagination={false}
                  scroll={{ x: 800, y: 400 }}
                  bordered
                  size="small"
                />
              </TabPane>
            ))}
          </Tabs>
        )}

        <div className="bg-blue-50 p-3 rounded">
          <Text type="secondary">
            <strong>Note:</strong> Changes made here will be distributed across
            relevant tables after confirmation.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default MultipleTablesReviewModal;
