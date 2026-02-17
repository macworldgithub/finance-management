import React from "react";
import { Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { DataType } from "../types";

export const renderActions = (record: DataType, handlers?: any) => {
  const isActive = record.isActive !== false;
  
  if (handlers?.editingKeys?.includes(record.key)) {
    return (
      <Button onClick={() => handlers?.onSaveRow?.(record.key)}>
        Save
      </Button>
    );
  } else {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {isActive && (
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handlers?.onEditRow?.(record.key);
            }}
          />
        )}
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handlers?.onDeleteRow?.(record.key)}
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
        <Button
          icon={isActive ? <LockOutlined /> : <UnlockOutlined />}
          onClick={() => handlers?.onToggleStatus?.(record.key)}
          type={isActive ? "default" : "primary"}
          title={isActive ? "Deactivate" : "Activate"}
        />
      </div>
    );
  }
};
