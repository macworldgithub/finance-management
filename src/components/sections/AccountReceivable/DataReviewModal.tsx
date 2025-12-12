// src/components/sections/AccountReceivable/DataReviewModal.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Input,
  Select,
  message,
  Typography,
  Space,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { submitSectionData } from "@/utils/sectionDataService";
import { importSectionData } from "@/utils/importSectionDataService";
import { getEditableColumns } from "@/utils/columnConfigs";

const { Text } = Typography;

// Update the interface to be more generic
interface DataItem {
  [key: string]: any;
  key?: string;
  No?: number | string;
}

interface DataReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: any[]) => void;
  importedData: any;
  sectionName: string;
}

const DataReviewModal: React.FC<DataReviewModalProps> = ({
  visible,
  onClose,
  onConfirm,
  importedData,
  sectionName,
}) => {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);

  // Initialize data when modal opens or importedData changes
  useEffect(() => {
    console.log("[DataReviewModal] Initializing data", {
      visible,
      importedData,
      sectionName,
      importedDataType: typeof importedData,
      isArray: Array.isArray(importedData),
    });

    if (visible && importedData) {
      let sectionData: any[] = [];

      // Handle multiple response formats
      if (Array.isArray(importedData)) {
        // Direct array response
        sectionData = importedData;
        console.log("[DataReviewModal] Detected direct array response");
      } else if (importedData.data && Array.isArray(importedData.data)) {
        // Response wrapped in { data: [...] }
        sectionData = importedData.data;
        console.log("[DataReviewModal] Detected { data: [...] } format");
      } else if (importedData[sectionName]) {
        // Response with section name as key
        sectionData = Array.isArray(importedData[sectionName])
          ? importedData[sectionName]
          : [];
        console.log(
          `[DataReviewModal] Found data at key "${sectionName}":`,
          sectionData
        );
      } else {
        // Try to find any array in the response
        const firstArrayKey = Object.keys(importedData).find(
          (key) =>
            Array.isArray(importedData[key]) && importedData[key].length > 0
        );
        if (firstArrayKey) {
          sectionData = importedData[firstArrayKey];
          console.warn(
            `[DataReviewModal] No data at "${sectionName}", but found array at "${firstArrayKey}"`
          );
        }
      }

      // If still empty, log the structure
      if (sectionData.length === 0) {
        console.warn(
          "[DataReviewModal] No data extracted. Response structure:",
          {
            isArray: Array.isArray(importedData),
            keys: !Array.isArray(importedData)
              ? Object.keys(importedData)
              : "N/A",
            importedData,
          }
        );
      }

      const formattedData = sectionData.map((item: any, index: number) => ({
        ...item,
        key: `row-${index}`,
      }));
      console.log(
        "[DataReviewModal] Formatted data (count):",
        formattedData.length
      );
      setData(formattedData);
    } else if (visible && !importedData) {
      console.warn("[DataReviewModal] Modal visible but no importedData");
      setData([]);
    }
  }, [visible, importedData, sectionName]);

  const handleFieldChange = (key: string, field: string, value: any) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData[index][field] = value;
      setData(newData);
    }
  };

  const handleSave = async (key: string) => {
    try {
      setLoading(true);
      const index = data.findIndex((item) => key === item.key);
      if (index > -1) {
        const record = data[index];
        const response = await submitSectionData(sectionName, [record]);
        if (response.success) {
          message.success("Record updated successfully");
          setEditingKey(null);
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      message.error("Failed to update record");
      console.error("Error updating record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key: string) => {
    setEditingKey(key);
  };

  const handleCancel = () => {
    setEditingKey(null);
  };

  const handleConfirm = async () => {
    try {
      console.log("[DataReviewModal] ===== CONFIRM BUTTON CLICKED =====");
      console.log("[DataReviewModal] handleConfirm fired with:", {
        sectionName,
        dataLength: data.length,
        hasData: data && data.length > 0,
      });

      // Log the actual data structure for Ownership
      if (sectionName === "Ownership" && data.length > 0) {
        console.log("[DataReviewModal] Ownership data sample:", {
          firstRecord: data[0],
          allKeys: Object.keys(data[0]),
        });
      }

      if (data.length === 0) {
        console.warn("[DataReviewModal] No data in array, showing warning");
        message.warning("No data to import");
        return;
      }

      console.log("[DataReviewModal] Setting loading to true");
      setLoading(true);

      // Call the import API with transformed data
      console.log("[DataReviewModal] About to call importSectionData");
      const response = await importSectionData(sectionName, data);

      console.log(
        "[DataReviewModal] Got response from importSectionData:",
        response
      );

      if (response.success) {
        message.success(response.message);
        // Pass data to parent component callback
        onConfirm(data);
        onClose();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to import data");
      console.error("Error importing data:", error);
    } finally {
      console.log("[DataReviewModal] Setting loading to false");
      setLoading(false);
    }
  };
  const columns = useMemo(() => {
    const severityLevels =
      sectionName === "Risk Assessment  (Inherent Risk)" ||
      sectionName === "Risk Assessment (Residual Risk)"
        ? undefined
        : ["Critical", "High", "Medium", "Low"];

    const baseColumns = getEditableColumns({
      editingKey,
      handleFieldChange,
      handleSave,
      handleEdit,
      handleCancel,
      sectionName,
      data,
      severityLevels,
    });

    // For Ownership section, ensure Main Process column comes before Process column
    if (sectionName === "Ownership") {
      // Reorder columns: put Main Process after No, and Process after Main Process
      const reorderedColumns = baseColumns.sort((a, b) => {
        const columnOrder = ["No", "Main Process", "Process"];
        const aIndex = columnOrder.indexOf(a.dataIndex);
        const bIndex = columnOrder.indexOf(b.dataIndex);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0;
      });
      return reorderedColumns;
    }

    return baseColumns;
  }, [
    editingKey,
    data,
    sectionName,
    handleFieldChange,
    handleSave,
    handleEdit,
    handleCancel,
  ]);

  return (
    <Modal
      title={`Review ${sectionName} Data`}
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ top: 20 }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            console.log("[DataReviewModal] Cancel button clicked");
            onClose();
          }}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            console.log(
              "[DataReviewModal] Confirm Import button clicked - calling handleConfirm"
            );
            handleConfirm();
          }}
          loading={loading}
        >
          Confirm Import
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: true }}
        rowKey="key"
      />
    </Modal>
  );
};

export default DataReviewModal;
