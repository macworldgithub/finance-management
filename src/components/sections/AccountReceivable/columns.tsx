"use client";
import React from "react";
import {
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { Menu, Dropdown, Checkbox, Button, Input, Popconfirm } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { DataType } from "./types";
import { Select } from "antd";
const { TextArea } = Input;
export const stageOptions = [
  { label: "Processing", key: "Processing" },
  { label: "Posting", key: "Posting" },
  { label: "Initiation", key: "Initiation" },
  { label: "Confirmation", key: "Confirmation" },
];
export const severityOptions = [
  { label: "Catastrophic", key: "Catastrophic" },
  { label: "Major", key: "Major" },
  { label: "Moderate", key: "Moderate" },
  { label: "Minor", key: "Minor" },
  { label: "Insignificant", key: "Insignificant" },
];
export const processSeverityLevelsOptions = [
  { label: "Critical", key: "Critical" },
  { label: "High", key: "High" },
  { label: "Medium", key: "Medium" },
  { label: "Low", key: "Low" },
];

// Assessment Rating Options
export const adequacyRatingOptions = [
  { label: "Fully Adequate", key: "Fully Adequate" },
  { label: "Adequate", key: "Adequate" },
  { label: "Partially Adequate", key: "Partially Adequate" },
  { label: "Inadequate", key: "Inadequate" },
  { label: "Critically Inadequate", key: "Critically Inadequate" },
];

export const effectivenessRatingOptions = [
  { label: "Highly Effective", key: "Highly Effective" },
  { label: "Effective", key: "Effective" },
  { label: "Moderately Effective", key: "Moderately Effective" },
  { label: "Ineffective", key: "Ineffective" },
  { label: "Highly Ineffective", key: "Highly Ineffective" },
];

export const totalScoreOptions = [
  { label: "20.1 - 25", key: "20.1 - 25" },
  { label: "15.1 - 20", key: "15.1 - 20" },
  { label: "10.1 - 15", key: "10.1 - 15" },
  { label: "5.1 - 10", key: "5.1 - 10" },
  { label: "0 - 5", key: "0 - 5" },
];

export const scale5Options = [
  { label: "5", key: "5" },
  { label: "4", key: "4" },
  { label: "3", key: "3" },
  { label: "2", key: "2" },
  { label: "1", key: "1" },
];

export const scale4Options = [
  { label: "4", key: "4" },
  { label: "3", key: "3" },
  { label: "2", key: "2" },
  { label: "1", key: "1" },
];
export const cosoPrincipleOptions = [
  {
    label: "1. Demonstrates commitment to integrity and ethical values",
    key: "1. Demonstrates commitment to integrity and ethical values",
  },
  {
    label: "2. Exercises oversight responsibility",
    key: "2. Exercises oversight responsibility",
  },
  {
    label: "3. Establishes structure, authority, and responsibility",
    key: "3. Establishes structure, authority, and responsibility",
  },
  {
    label: "4. Demonstrates commitment to competence",
    key: "4. Demonstrates commitment to competence",
  },
  { label: "5. Enforces accountability", key: "5. Enforces accountability" },
  {
    label: "6. Specifies suitable objectives",
    key: "6. Specifies suitable objectives",
  },
  {
    label: "7. Identifies and analyzes risk",
    key: "7. Identifies and analyzes risk",
  },
  { label: "8. Assesses fraud risk", key: "8. Assesses fraud risk" },
  {
    label: "9. Identifies and analyzes significant change",
    key: "9. Identifies and analyzes significant change",
  },
  {
    label: "10. Selects and develops control activities",
    key: "10. Selects and develops control activities",
  },
  {
    label: "11. Selects and develops general controls over technology",
    key: "11. Selects and develops general controls over technology",
  },
  {
    label: "12. Deploys through policies and procedures",
    key: "12. Deploys through policies and procedures",
  },
  {
    label: "13. Uses relevant information",
    key: "13. Uses relevant information",
  },
  { label: "14. Communicates internally", key: "14. Communicates internally" },
  { label: "15. Communicates externally", key: "15. Communicates externally" },
  {
    label: "16. Conducts ongoing and/or separate evaluations",
    key: "16. Conducts ongoing and/or separate evaluations",
  },
  {
    label: "17. Evaluates and communicates deficiencies",
    key: "17. Evaluates and communicates deficiencies",
  },
];
export const yesNoOptions = [
  { label: "Yes", key: "Yes" },
  { label: "No", key: "No" },
];
export const operationalFrequencyOptions = [
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
export const soxControlActivityOptions = [
  {
    label: "Financial Controller Activity",
    key: "Financial Controller Activity",
  },
  { label: "Other", key: "Other" },
];
const buildMenu = (
  items: { label: string; key: string }[],
  onClick?: (key: string) => void
) => {
  return (
    <Menu
      onClick={(info) => {
        onClick?.(String(info.key));
      }}
      items={items as any}
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        scrollbarWidth: "thin",
        msOverflowStyle: "none",
      }}
      className="custom-scrollbar"
    />
  );
};
const renderEditableCheckbox = (
  value: boolean | string,
  record: DataType,
  field: keyof DataType,
  onCheckboxChange?: (
    rowKey: string,
    field: keyof DataType,
    checked: boolean
  ) => void,
  editingKeys?: string[]
) => {
  if (editingKeys && editingKeys.includes(record.key)) {
    return (
      <Checkbox
        checked={value === true || value === "P"}
        onChange={(e) =>
          onCheckboxChange?.(record.key, field, e.target.checked)
        }
        className="flex justify-center"
      />
    );
  }
  if (value === true || value === "P") {
    return <span style={{ fontSize: 18, color: "#52c41a" }}>&#10003;</span>; // tick
  }
  if (value === false || value === "O") {
    return <span style={{ fontSize: 18, color: "#d9d9d9" }}>&#10007;</span>; // cross
  }
  return null;
};

const renderEditableInput = (
  value: string,
  recordKey: string,
  field: keyof DataType,
  handlers?: {
    onTextChange?: (
      rowKey: string,
      field: keyof DataType,
      value: string
    ) => void;
  },
  editingKeys: string[] = []
) => {
  if (editingKeys.includes(recordKey)) {
    return (
      <Input
        value={value}
        onChange={(e) =>
          handlers?.onTextChange?.(recordKey, field, e.target.value)
        }
      />
    );
  }
  return value;
};
//abc
// Helper function to get color based on severity/impact level
const getColorForSeverity = (
  value: string
): { bgColor: string; textColor: string; borderColor: string } => {
  switch (value) {
    case "Catastrophic":
      return {
        bgColor: "#FE0000",
        textColor: "#FFFFFF",
        borderColor: "#CC0000",
      };
    case "Major":
      return {
        bgColor: "#FFC000",
        textColor: "#000000",
        borderColor: "#CCAA00",
      };
    case "Moderate":
      return {
        bgColor: "#FFFD04",
        textColor: "#000000",
        borderColor: "#99CC00",
      };
    case "Minor":
      return {
        bgColor: "#8FD154",
        textColor: "#000000",
        borderColor: "#00AA00",
      };
    case "Insignificant":
      return {
        bgColor: "#00AF50",
        textColor: "#000000",
        borderColor: "#00AA44",
      };
    case "Critical":
      return {
        bgColor: "#FE0000",
        textColor: "#FFFFFF",
        borderColor: "#CC0000",
      };
    case "High":
      return {
        bgColor: "#FFC000",
        textColor: "#000000",
        borderColor: "#CCAA00",
      };
    case "Moderate":
      return {
        bgColor: "#FFFD04",
        textColor: "#000000",
        borderColor: "#99CC00",
      };
    case "Low":
      return {
        bgColor: "#8FD154",
        textColor: "#000000",
        borderColor: "#00AA00",
      };
    case "Lowest":
      return {
        bgColor: "#00AF50",
        textColor: "#000000",
        borderColor: "#00AA44",
      };
    // Probability/Likelihood colors
    case "Certain":
      return {
        bgColor: "#FE0000",
        textColor: "#FFFFFF",
        borderColor: "#CC0000",
      };
    case "Likely":
      return {
        bgColor: "#FFC000",
        textColor: "#000000",
        borderColor: "#CCAA00",
      };
    case "Possible":
      return {
        bgColor: "#FFFD04",
        textColor: "#000000",
        borderColor: "#99CC00",
      };
    case "Unlikely":
      return {
        bgColor: "#8FD154",
        textColor: "#000000",
        borderColor: "#00AA00",
      };
    case "Rare":
      return {
        bgColor: "#00AF50",
        textColor: "#000000",
        borderColor: "#00AA44",
      };
    default:
      return {
        bgColor: "#F5F5F5",
        textColor: "#000000",
        borderColor: "#D9D9D9",
      };
  }
};
export function getColumns(
  activeTab: string,
  activeSubTab: string,
  handlers?: {
    onStageChange?: (key: string, rowKey: string) => void;
    onSelectGeneric?: (key: string, rowKey: string, field?: string) => void;
    onCheckboxChange?: (
      rowKey: string,
      field: keyof DataType,
      checked: boolean
    ) => void;
    onTextChange?: (
      rowKey: string,
      field: keyof DataType,
      value: string
    ) => void;
    onAddRow?: () => void;
    onSaveRow?: (rowKey: string) => void;
    onEditRow?: (rowKey: string) => void;
    onDeleteRow?: (rowKey: string) => void;
    onToggleStatus?: (rowKey: string) => void;
  },
  editingKeys: string[] = []
): ColumnsType<DataType> {
  // No, Process, Actions columns for all tabs
  // Duplicate baseColumns removed above. Only one definition remains.
  const actionsColumn: ColumnsType<DataType>[0] = {
    title: "Actions",
    key: "actions",
    width: 200,
    render: (_, record: DataType) => {
      const isActive = record.isActive !== false;
      if (editingKeys.includes(record.key)) {
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
    },
  };
  // Special columns for the 4 new tabs
  const additionalTabsColumns: ColumnsType<DataType> = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 80,
      fixed: "left",
      render: (text: any, record: DataType) =>
        renderEditableInput(text, record.key, "no", handlers, editingKeys),
    },
    {
      title: "Process",
      dataIndex: "process",
      key: "process",
      width: 300,
      fixed: "left",
      render: (text: string) => text,
    },
  ];
  // Special Process Severity column
  const processSeverityColumn: ColumnsType<DataType>[0] = {
    title: (
      <div
        style={{
          background: "#1f4e79",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <div>Process Severity</div>
        <div
          style={{
            background: "#0070c0",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Scale(1-4)
        </div>
      </div>
    ),
    dataIndex: "processSeverityLevel",
    key: "processSeverityLevel",
    width: 180,
    render: (text: string) => (
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
        {text || "-"}
      </div>
    ),
  };
  const processSeverityLevelColumn: ColumnsType<DataType>[0] = {
    title: (
      <div
        style={{
          background: "#595959",
          color: "#fff",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Process Severity Levels
      </div>
    ),
    dataIndex: "processSeverityLevels",
    key: "processSeverityLevels",
    width: 180,
    render: (text: string) => (
      <div style={{ textAlign: "center" }}>{text || "-"}</div>
    ),
  };

  const formatNoValue = (value: any, index: number) => {
    if (value === undefined || value === null || value === "") {
      return `5.${index + 1}`;
    }

    const str = String(value);
    const [majorStr, minorStr] = str.split(".");
    const major = majorStr || "5";
    if (minorStr === undefined) return major;

    const minorNum = parseInt(minorStr, 10);
    return `${major}.${Number.isNaN(minorNum) ? minorStr : minorNum}`;
  };

  const baseColumns: ColumnsType<DataType> = [
    {
      title: () => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>No.</span>
          <Button
            style={{ marginLeft: 8 }}
            size="small"
            icon={<PlusOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handlers?.onAddRow?.();
            }}
          />
        </div>
      ),
      key: "no",
      width: 80,
      fixed: "left",

      render: (_: string, record: DataType, index: number) => {
        const displayNo = formatNoValue(record.no, index);
        return <span style={{ fontWeight: "500" }}>{displayNo}</span>;
      },
    },

    // {
    //   title: () => (
    //     <div style={{ display: "flex", alignItems: "center" }}>
    //       <span>No.</span>
    //       <Button
    //         style={{ marginLeft: 8 }}
    //         size="small"
    //         icon={<PlusOutlined />}
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           handlers?.onAddRow?.();
    //         }}
    //       />
    //     </div>
    //   ),
    //   dataIndex: "no", // Map to the actual field in data
    //   key: "no",
    //   width: 80,
    //   fixed: "left",
    //   render: (value: number) => (
    //     <span style={{ fontWeight: "500" }}>{value ?? "-"}</span>
    //   ),
    // },
    {
      title: "Processes",
      dataIndex: "process",
      key: "process",
      width: 300,
      fixed: "left",
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(record.key, "process", e.target.value)
              }
            />
          );
        }
        return text;
      },
    },
  ];
  const processColumns: ColumnsType<DataType> = [
    {
      title: "Process Description",
      dataIndex: "processDescription",
      key: "processDescription",
      width: 300,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "processDescription",
                  e.target.value
                )
              }
              autoSize={{ minRows: 2 }}
            />
          );
        }
        return text;
      },
    },
    {
      title: "Process Objective",
      dataIndex: "processObjective",
      key: "processObjective",
      width: 300,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "processObjective",
                  e.target.value
                )
              }
              autoSize={{ minRows: 2 }}
            />
          );
        }
        return text;
      },
    },
    // {
    //   title: "Process Severity Levels",
    //   dataIndex: "processSeverityLevels",
    //   key: "processSeverityLevels",
    //   width: 200,
    //   render: (text: any, record: DataType) => {
    //     const menu = buildMenu(processSeverityLevelsOptions, (key) =>
    //       handlers?.onSelectGeneric?.(key, record.key, "processSeverityLevels")
    //     );
    //     return (
    //       <Dropdown overlay={menu} trigger={["click"]}>
    //         <div className="flex items-center cursor-pointer">
    //           {text || "Select"}
    //           <DownOutlined className="ml-1 text-gray-500 text-xs" />
    //         </div>
    //       </Dropdown>
    //     );
    //   },
    // },
    {
      title: "Process Severity Levels",
      dataIndex: "processSeverityLevels",
      key: "processSeverityLevels",
      width: 200,
      render: (text: any, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(processSeverityLevelsOptions, (key) =>
            handlers?.onSelectGeneric?.(
              key,
              record.key,
              "processSeverityLevels"
            )
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
  ];
  const ownershipColumns: ColumnsType<DataType> = [
    {
      title: "Activity",
      dataIndex: "activity",
      key: "activity",
      width: 250,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(record.key, "activity", e.target.value)
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Process",
      dataIndex: "process2",
      key: "process2",
      width: 250,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(record.key, "process2", e.target.value)
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Process Stage",
      dataIndex: "stage",
      key: "stage",
      width: 180,
      render: (text: any, record: DataType) => {
        if (editingKeys && editingKeys.includes(record.key)) {
          const menu = buildMenu(stageOptions, (key) =>
            handlers?.onStageChange?.(key, record.key)
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                {text}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }
        return text || "-";
      },
    },
    {
      title: "Functions",
      dataIndex: "functions",
      key: "functions",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "functions",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Client Segment / Functional Segment",
      dataIndex: "clientSegment",
      key: "clientSegment",
      width: 180,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "clientSegment",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Operational Unit",
      dataIndex: "operationalUnit",
      key: "operationalUnit",
      width: 180,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "operationalUnit",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Division",
      dataIndex: "division",
      key: "division",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(record.key, "division", e.target.value)
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Entity",
      dataIndex: "entity",
      key: "entity",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(record.key, "entity", e.target.value)
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Unit / Department",
      dataIndex: "unitDepartment",
      key: "unitDepartment",
      width: 180,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "unitDepartment",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Product Class",
      dataIndex: "productClass",
      key: "productClass",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "productClass",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: 180,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "productName",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
  ];
  const cosoColumns: ColumnsType<DataType> = [
    {
      title: "Integrity & Ethical Values",
      dataIndex: "integrityEthical",
      key: "integrityEthical",
      width: 200,
      render: (checked: boolean | string, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "integrityEthical",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Board Oversight",
      dataIndex: "boardOversight",
      key: "boardOversight",
      width: 180,
      render: (checked: boolean | string, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "boardOversight",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Organizational Structure",
      dataIndex: "orgStructure",
      key: "orgStructure",
      width: 200,
      render: (checked: boolean | string, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "orgStructure",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Commitment to Competence",
      dataIndex: "commitmentCompetence",
      key: "commitmentCompetence",
      width: 220,
      render: (checked: boolean | string, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "commitmentCompetence",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Management Philosophy",
      dataIndex: "managementPhilosophy",
      key: "managementPhilosophy",
      width: 200,
      render: (checked: boolean | string, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "managementPhilosophy",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
  ];
  const intosaiColumns: ColumnsType<DataType> = [
    {
      title: "Integrity and Ethical Values",
      dataIndex: "integrityEthical",
      key: "integrityEthical",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "integrityEthical",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Commitment to Competence",
      dataIndex: "commitmentCompetence",
      key: "commitmentCompetence",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "commitmentCompetence",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Management's Philosophy and Operating Style",
      dataIndex: "managementPhilosophy",
      key: "managementPhilosophy",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "managementPhilosophy",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Organizational Structure",
      dataIndex: "orgStructure",
      key: "orgStructure",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "orgStructure",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Assignment of Authority",
      dataIndex: "assignmentAuthority",
      key: "assignmentAuthority",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "assignmentAuthority",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "HR Policies and Practices",
      dataIndex: "hrPolicies",
      key: "hrPolicies",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "hrPolicies",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Board/Audit Committee",
      dataIndex: "boardAudit",
      key: "boardAudit",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "boardAudit",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Management Control Methods",
      dataIndex: "managementControl",
      key: "managementControl",
      width: 220,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "managementControl",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "External Influences",
      dataIndex: "externalInfluences",
      key: "externalInfluences",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "externalInfluences",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Commitment to Internal Control",
      dataIndex: "commitmentInternal",
      key: "commitmentInternal",
      width: 220,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "commitmentInternal",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Enforcement of Integrity",
      dataIndex: "enforcementIntegrity",
      key: "enforcementIntegrity",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "enforcementIntegrity",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Employee Awareness",
      dataIndex: "employeeAwareness",
      key: "employeeAwareness",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "employeeAwareness",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Accountability & Performance",
      dataIndex: "accountability",
      key: "accountability",
      width: 220,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "accountability",
          handlers?.onCheckboxChange
        ),
    },
    {
      title: "Commitment to Transparency",
      dataIndex: "commitmentTransparency",
      key: "commitmentTransparency",
      width: 220,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "commitmentTransparency",
          handlers?.onCheckboxChange
        ),
    },
  ];
  const otherEnvColumns: ColumnsType<DataType> = [
    {
      title: "Responsibility Delegation Matrix",
      dataIndex: "responsibilityMatrix",
      key: "responsibilityMatrix",
      width: 220,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "responsibilityMatrix",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Segregation of Duties",
      dataIndex: "segregationDuties",
      key: "segregationDuties",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "segregationDuties",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Reporting Lines",
      dataIndex: "reportingLines",
      key: "reportingLines",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "reportingLines",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Mission",
      dataIndex: "mission",
      key: "mission",
      width: 120,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "mission",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Vision and Values",
      dataIndex: "visionValues",
      key: "visionValues",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "visionValues",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Goals and Objectives",
      dataIndex: "goalsObjectives",
      key: "goalsObjectives",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "goalsObjectives",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Structures & Systems",
      dataIndex: "structuresSystems",
      key: "structuresSystems",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "structuresSystems",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Policies and Procedures",
      dataIndex: "policiesProcedures",
      key: "policiesProcedures",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "policiesProcedures",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Processes",
      dataIndex: "processes",
      key: "processes",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "processes",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Integrity and Ethical Values",
      dataIndex: "integrityEthical",
      key: "integrityEthical",
      width: 220,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "integrityEthical",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Oversight Structure",
      dataIndex: "oversightStructure",
      key: "oversightStructure",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "oversightStructure",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Standards",
      dataIndex: "standards",
      key: "standards",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "standards",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Methodologies",
      dataIndex: "methodologies",
      key: "methodologies",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "methodologies",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Rules and Regulations",
      dataIndex: "rulesRegulations",
      key: "rulesRegulations",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "rulesRegulations",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
  ];
  const riskAssessmentInherentColumns: ColumnsType<DataType> = [
    {
      title: "Risk Type",
      dataIndex: "riskType",
      key: "riskType",
      width: 200,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(record.key, "riskType", e.target.value)
              }
            />
          );
        }
        return text;
      },
    },
    {
      title: "Risk Description",
      dataIndex: "riskDescription",
      key: "riskDescription",
      width: 300,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "riskDescription",
                  e.target.value
                )
              }
              autoSize={{ minRows: 2 }}
            />
          );
        }
        return text;
      },
    },
    {
      title: "Severity / Impact",
      dataIndex: "severityImpact",
      key: "severityImpact",
      width: 180,
      render: (text: any, record: DataType) => {
        const menu = buildMenu(severityOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "severityImpact")
        );
        const { bgColor, textColor, borderColor } = getColorForSeverity(text);
        if (editingKeys.includes(record.key)) {
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="flex items-center cursor-pointer p-2 rounded"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontWeight: "600",
                }}
              >
                {text || "Select"}
                <DownOutlined className="ml-2" style={{ color: textColor }} />
              </div>
            </Dropdown>
          );
        }
        return (
          <div
            className="flex items-center p-2 rounded"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
            }}
          >
            {text || ""}
          </div>
        );
      },
    },
    {
      title: "Probability / Likelihood",
      dataIndex: "probabilityLikelihood",
      key: "probabilityLikelihood",
      width: 200,
      render: (text: any, record: DataType) => {
        const probabilityOptions = [
          { label: "Certain", key: "Certain" },
          { label: "Likely", key: "Likely" },
          { label: "Possible", key: "Possible" },
          { label: "Unlikely", key: "Unlikely" },
          { label: "Rare", key: "Rare" },
        ];
        const menu = buildMenu(probabilityOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "probabilityLikelihood")
        );
        const { bgColor, textColor, borderColor } = getColorForSeverity(text);
        if (editingKeys.includes(record.key)) {
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="flex items-center cursor-pointer p-2 rounded"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontWeight: "600",
                }}
              >
                {text || "Select"}
                <DownOutlined className="ml-2" style={{ color: textColor }} />
              </div>
            </Dropdown>
          );
        }
        return (
          <div
            className="flex items-center p-2 rounded"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
            }}
          >
            {text || ""}
          </div>
        );
      },
    },
    {
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
      width: 150,
      render: (text: any, record: DataType) => {
        const classificationOptions = [
          { label: "Critical", key: "Critical" },
          { label: "High", key: "High" },
          { label: "Moderate", key: "Moderate" },
          { label: "Low", key: "Low" },
          { label: "Lowest", key: "Lowest" },
        ];
        const menu = buildMenu(classificationOptions, (key) =>
          handlers?.onSelectGeneric?.(key, record.key, "classification")
        );
        const { bgColor, textColor, borderColor } = getColorForSeverity(text);
        if (editingKeys.includes(record.key)) {
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div
                className="flex items-center cursor-pointer p-2 rounded"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  fontWeight: "600",
                }}
              >
                {text || "Select"}
                <DownOutlined className="ml-2" style={{ color: textColor }} />
              </div>
            </Dropdown>
          );
        }
        return (
          <div
            className="flex items-center p-2 rounded"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              fontWeight: "600",
            }}
          >
            {text || ""}
          </div>
        );
      },
    },
  ];
  const riskResponsesColumns: ColumnsType<DataType> = [
    {
      title: "Type of Risk Response",
      dataIndex: "riskResponseType",
      key: "riskResponseType",
      width: 300,
      render: (text: any, record: DataType) => {
        const responseOptions = [
          { label: "Avoid", key: "Avoid" },
          { label: "Mitigate", key: "Mitigate" },
          { label: "Transfer", key: "Transfer" },
          { label: "Share", key: "Share" },
          { label: "Accept", key: "Accept" },
        ];

        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(responseOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "riskResponseType")
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
  ];
  const controlActivitiesColumns: ColumnsType<DataType> = [
    {
      title: "Control Objectives",
      dataIndex: "controlObjectives",
      key: "controlObjectives",
      width: 320,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "controlObjectives",
                  e.target.value
                )
              }
              autoSize={{ minRows: 3 }}
            />
          );
        }
        return (
          <div style={{ whiteSpace: "pre-line", lineHeight: "1.4" }}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Control Ref",
      dataIndex: "controlRef",
      key: "controlRef",
      width: 100,
      align: "center" as const,
      render: (text: string, record: DataType) => {
        if (editingKeys && editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "controlRef",
                  e.target.value
                )
              }
            />
          );
        }
        return text || "—";
      },
    },
    {
      title: "Control Definition",
      dataIndex: "controlDefinition",
      key: "controlDefinition",
      width: 300,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "controlDefinition",
                  e.target.value
                )
              }
              autoSize={{ minRows: 3 }}
            />
          );
        }
        return (
          <div style={{ whiteSpace: "pre-line", lineHeight: "1.4" }}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Control Description",
      dataIndex: "controlDescription",
      key: "controlDescription",
      width: 320,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "controlDescription",
                  e.target.value
                )
              }
              autoSize={{ minRows: 3 }}
            />
          );
        }
        return (
          <div style={{ whiteSpace: "pre-line", lineHeight: "1.4" }}>
            {text}
          </div>
        );
      },
    },
    {
      title: "Control Responsibility",
      dataIndex: "controlResponsibility",
      key: "controlResponsibility",
      width: 180,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "controlResponsibility",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },

    {
      title: "Key Control",
      dataIndex: "keyControl",
      key: "keyControl",
      width: 110,
      align: "center" as const,
      render: (text: string, record: DataType) => {
        const normalizeYesNo = (value: any): "Yes" | "No" | "" => {
          if (value === true) return "Yes";
          if (value === false) return "No";
          const v = String(value ?? "")
            .trim()
            .toLowerCase();
          if (v === "p" || v === "yes") return "Yes";
          if (v === "o" || v === "no") return "No";
          return "";
        };

        if (editingKeys.includes(record.key)) {
          const yesNoOptions = [
            { label: "Yes", key: "Yes" },
            { label: "No", key: "No" },
          ];
          const menu = buildMenu(yesNoOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "keyControl")
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer justify-center">
                {normalizeYesNo(text) || "Select"}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }
        return normalizeYesNo(text);
      },
    },

    {
      title: "Zero Tolerance",
      dataIndex: "zeroTolerance",
      key: "zeroTolerance",
      width: 140,
      align: "center" as const,
      render: (text: string, record: DataType) => {
        const normalizeYesNo = (value: any): "Yes" | "No" | "" => {
          if (value === true) return "Yes";
          if (value === false) return "No";
          const v = String(value ?? "")
            .trim()
            .toLowerCase();
          if (v === "p" || v === "yes") return "Yes";
          if (v === "o" || v === "no") return "No";
          return "";
        };

        if (editingKeys.includes(record.key)) {
          const yesNoOptions = [
            { label: "Yes", key: "Yes" },
            { label: "No", key: "No" },
          ];
          const menu = buildMenu(yesNoOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "zeroTolerance")
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer justify-center">
                {normalizeYesNo(text) || "Select"}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }
        return normalizeYesNo(text);
      },
    },
  ];

  const controlAssessmentColumns: ColumnsType<DataType> = [
    {
      title: "Level of Responsibility",
      dataIndex: "levelResponsibility",
      key: "levelResponsibility",
      width: 200,
      render: (text: any, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          const levelOptions = [
            { label: "Process Level", key: "Process Level" },
            { label: "Functional Level", key: "Functional Level" },
            { label: "Operating Unit Level", key: "Operating Unit Level" },
            { label: "Division Level", key: "Division Level" },
            { label: "Entity Level", key: "Entity Level" },
          ];
          const menu = buildMenu(levelOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "levelResponsibility")
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
        return text || ""; // Simple text when not editing
      },
    },
    {
      title: "COSO Principle #",
      dataIndex: "cosoPrinciple",
      key: "cosoPrinciple",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          const cosoOptions = [
            {
              label:
                "1. Demonstrates commitment to integrity and ethical values",
              key: "1. Demonstrates commitment to integrity and ethical values",
            },
            {
              label: "2. Exercises oversight responsibility",
              key: "2. Exercises oversight responsibility",
            },
            {
              label: "3. Establishes structure, authority, and responsibility",
              key: "3. Establishes structure, authority, and responsibility",
            },
            {
              label: "4. Demonstrates commitment to competence",
              key: "4. Demonstrates commitment to competence",
            },
            {
              label: "5. Enforces accountability",
              key: "5. Enforces accountability",
            },
            {
              label: "6. Specifies suitable objectives",
              key: "6. Specifies suitable objectives",
            },
            {
              label: "7. Identifies and analyzes risk",
              key: "7. Identifies and analyzes risk",
            },
            { label: "8. Assesses fraud risk", key: "8. Assesses fraud risk" },
            {
              label: "9. Identifies and analyzes significant change",
              key: "9. Identifies and analyzes significant change",
            },
            {
              label: "10. Selects and develops control activities",
              key: "10. Selects and develops control activities",
            },
            {
              label:
                "11. Selects and develops general controls over technology",
              key: "11. Selects and develops general controls over technology",
            },
            {
              label: "12. Deploys through policies and procedures",
              key: "12. Deploys through policies and procedures",
            },
            {
              label: "13. Uses relevant information",
              key: "13. Uses relevant information",
            },
            {
              label: "14. Communicates internally",
              key: "14. Communicates internally",
            },
            {
              label: "15. Communicates externally",
              key: "15. Communicates externally",
            },
            {
              label: "16. Conducts ongoing and/or separate evaluations",
              key: "16. Conducts ongoing and/or separate evaluations",
            },
            {
              label: "17. Evaluates and communicates deficiencies",
              key: "17. Evaluates and communicates deficiencies",
            },
          ];
          const menu = buildMenu(cosoOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "cosoPrinciple")
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
        return text || "";
      },
    },
    {
      title: "Operational Approach",
      dataIndex: "operationalApproach",
      key: "operationalApproach",
      width: 200,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          const approachOptions = [
            { label: "Automated", key: "Automated" },
            { label: "Manual", key: "Manual" },
          ];
          const menu = buildMenu(approachOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "operationalApproach")
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
        return text || "";
      },
    },
    {
      title: "Operational Frequency",
      dataIndex: "operationalFrequency",
      key: "operationalFrequency",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
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
          const menu = buildMenu(frequencyOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "operationalFrequency")
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
        return text || "";
      },
    },
    {
      title: "Control Classification",
      dataIndex: "controlClassification",
      key: "controlClassification",
      width: 220,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          const classificationOptions = [
            { label: "Directive Control", key: "Directive Control" },
            { label: "Preventive Control", key: "Preventive Control" },
            { label: "Detective Control", key: "Detective Control" },
            { label: "Corrective Control", key: "Corrective Control" },
          ];
          const menu = buildMenu(classificationOptions, (key) =>
            handlers?.onSelectGeneric?.(
              key,
              record.key,
              "controlClassification"
            )
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
        return text || "";
      },
    },
  ];
  const riskAssessmentResidualColumns: ColumnsType<DataType> =
    riskAssessmentInherentColumns.map((col) => ({ ...col })); // copy to avoid reference issues
  // const soxSubTabColumns: ColumnsType<DataType> = [
  //   {
  //     title: "SOX Control Activity",
  //     dataIndex: "soxControlActivity",
  //     key: "soxControlActivity",
  //     width: 250,
  //     render: (text: any, record: DataType) => {
  //       const menu = buildMenu(soxControlActivityOptions, (key) =>
  //         handlers?.onSelectGeneric?.(key, record.key, "soxControlActivity")
  //       );
  //       return (
  //         <Dropdown overlay={menu} trigger={["click"]}>
  //           <div className="flex items-center cursor-pointer">
  //             {text || "Select"}
  //             <DownOutlined className="ml-1 text-gray-500 text-xs" />
  //           </div>
  //         </Dropdown>
  //       );
  //     },
  //   },
  // ];
  const soxSubTabColumns: ColumnsType<DataType> = [
    {
      title: "SOX Control Activity",
      dataIndex: "soxControlActivity",
      key: "soxControlActivity",
      width: 250,
      render: (text: any, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(soxControlActivityOptions, (key) =>
            handlers?.onSelectGeneric?.(key, record.key, "soxControlActivity")
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
        return text || "-"; // Simple text when not editing
      },
    },
  ];
  const financialStatementAssertionsColumns: ColumnsType<DataType> = [
    // REMOVED: Internal Control Over Financial Reporting? from here
    {
      title: "Occurrence",
      dataIndex: "occurrence",
      key: "occurrence",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "occurrence",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Completeness",
      dataIndex: "completeness",
      key: "completeness",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "completeness",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Accuracy",
      dataIndex: "accuracy",
      key: "accuracy",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "accuracy",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Authorization",
      dataIndex: "authorization",
      key: "authorization",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "authorization",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Cutoff",
      dataIndex: "cutoff",
      key: "cutoff",
      width: 120,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "cutoff",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Classification and Understandability",
      dataIndex: "classificationSOX",
      key: "classificationSOX",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "classificationAndUnderstandability",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Existence",
      dataIndex: "existence",
      key: "existence",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "existence",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Rights and Obligations",
      dataIndex: "rightsAndObligations",
      key: "rightsAndObligations",
      width: 180,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "rightsAndObligations",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Valuation and Allocation",
      dataIndex: "valuationAndAllocation",
      key: "valuationAndAllocation",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "valuationAndAllocation",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Presentation / Disclosure",
      dataIndex: "presentationDisclosure",
      key: "presentationDisclosure",
      width: 200,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "presentationDisclosure",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
  ];
  // NEW: Dedicated column for Internal Control Over Financial Reporting
  const icfrColumn: ColumnsType<DataType> = [
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

        // Only show dropdown when editing
        if (editingKeys.includes(record.key)) {
          const menu = buildMenu(yesNoOptions, (key) =>
            handlers?.onSelectGeneric?.(
              key,
              record.key,
              "internalControlOverFinancialReporting"
            )
          );
          return (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="flex items-center cursor-pointer">
                {displayValue || "Select"}
                <DownOutlined className="ml-1 text-gray-500 text-xs" />
              </div>
            </Dropdown>
          );
        }

        // Show just the text when not editing
        return <div>{displayValue || "-"}</div>;
      },
    },
  ];
  const internalAuditTestColumns: ColumnsType<DataType> = [
    {
      title: "Check",
      dataIndex: "check",
      key: "check",
      width: 150,
      render: (checked: boolean, record: DataType) =>
        renderEditableCheckbox(
          checked,
          record,
          "check",
          handlers?.onCheckboxChange,
          editingKeys
        ),
    },
    {
      title: "Internal Audit Test",
      dataIndex: "internalAuditTest",
      key: "internalAuditTest",
      width: 400,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "internalAuditTest",
                  e.target.value
                )
              }
              autoSize={{ minRows: 2 }}
            />
          );
        }
        return text;
      },
    },
    {
      title: "Sample Size",
      dataIndex: "sampleSize",
      key: "sampleSize",
      width: 150,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "sampleSize",
                  e.target.value
                )
              }
            />
          );
        }
        return text;
      },
    },
  ];
  const grcExceptionLogColumns: ColumnsType<DataType> = [
    {
      title: "GRC Adequacy",
      dataIndex: "grcAdequacy",
      key: "grcAdequacy",
      width: 200,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "grcAdequacy",
                  e.target.value
                )
              }
              placeholder="Enter GRC Adequacy"
            />
          );
        }
        return text || "-";
      },
    },
    {
      title: "GRC Effectiveness",
      dataIndex: "grcEffectiveness",
      key: "grcEffectiveness",
      width: 200,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <Input
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "grcEffectiveness",
                  e.target.value
                )
              }
              placeholder="Enter GRC Effectiveness"
            />
          );
        }
        return text || "-";
      },
    },
    {
      title: "Explanation",
      dataIndex: "explanation",
      key: "explanation",
      width: 400,
      render: (text: string, record: DataType) => {
        if (editingKeys.includes(record.key)) {
          return (
            <TextArea
              value={text}
              onChange={(e) =>
                handlers?.onTextChange?.(
                  record.key,
                  "explanation",
                  e.target.value
                )
              }
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder="Enter explanation..."
            />
          );
        }
        return <div style={{ whiteSpace: "pre-line" }}>{text || "-"}</div>;
      },
    },
  ];
  let dynamicColumns: ColumnsType<DataType> = processColumns;
  switch (activeTab) {
    case "1":
      dynamicColumns = processColumns;
      break;
    case "2":
      dynamicColumns = ownershipColumns;
      break;
    case "3":
      if (activeSubTab === "coso") dynamicColumns = cosoColumns;
      else if (activeSubTab === "intosai") dynamicColumns = intosaiColumns;
      else dynamicColumns = otherEnvColumns;
      break;
    case "4":
      dynamicColumns = riskAssessmentInherentColumns;
      break;
    case "5":
      dynamicColumns = riskResponsesColumns;
      break;
    case "6":
      dynamicColumns = controlActivitiesColumns;
      break;
    case "7":
      dynamicColumns = controlAssessmentColumns;
      break;
    case "8":
      dynamicColumns = riskAssessmentResidualColumns;
      break;
    case "9":
      if (activeSubTab === "sox") dynamicColumns = soxSubTabColumns;
      else if (activeSubTab === "financial")
        dynamicColumns = financialStatementAssertionsColumns;
      else if (activeSubTab === "icfr")
        dynamicColumns = icfrColumn; // New subtab
      else dynamicColumns = soxSubTabColumns;
      break;
    case "10":
      if (activeSubTab === "audit") dynamicColumns = internalAuditTestColumns;
      else if (activeSubTab === "grc") dynamicColumns = grcExceptionLogColumns;
      else dynamicColumns = internalAuditTestColumns; // default to audit
      break;
    case "11":
      dynamicColumns = [
        {
          title: "Design Adequacy Score(0-10)",
          dataIndex: "designAdequacyScore",
          key: "designAdequacyScore",
          width: 180,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "designAdequacyScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Sustainability Score(0-10)",
          dataIndex: "sustainabilityScore",
          key: "sustainabilityScore",
          width: 180,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "sustainabilityScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Scalability Score(0-5)",
          dataIndex: "scalabilityScore",
          key: "scalabilityScore",
          width: 160,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "scalabilityScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Adequacy Score(0-25)",
          dataIndex: "adequacyScore",
          key: "adequacyScore",
          width: 160,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "adequacyScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Total Score(0-25)",
          dataIndex: "totalScore",
          key: "totalScore",
          width: 140,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(totalScoreOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "totalScore")
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
            return text;
          },
        },
        {
          title: "Scale(1-5)",
          dataIndex: "scale",
          key: "scale",
          width: 100,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(scale5Options, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "scale")
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
            return text;
          },
        },
        {
          title: "Rating",
          dataIndex: "rating",
          key: "rating",
          width: 100,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(adequacyRatingOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "rating")
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
            return text;
          },
        },
      ];
      break;
    case "12":
      dynamicColumns = [
        {
          title: "Design Score(0-10)",
          dataIndex: "designScore",
          key: "designScore",
          width: 140,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "designScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Operating Score(0-10)",
          dataIndex: "operatingScore",
          key: "operatingScore",
          width: 160,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "operatingScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Sustainability Score(0-5)",
          dataIndex: "sustainabilityScore",
          key: "sustainabilityScore",
          width: 180,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "sustainabilityScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Effectiveness Score(0-25)",
          dataIndex: "effectivenessScore",
          key: "effectivenessScore",
          width: 180,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "effectivenessScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Total Score(0-25)",
          dataIndex: "totalScore",
          key: "totalScore",
          width: 140,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(totalScoreOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "totalScore")
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
            return text;
          },
        },
        {
          title: "Scale(1-5)",
          dataIndex: "scale",
          key: "scale",
          width: 100,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(scale5Options, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "scale")
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
            return text;
          },
        },
        {
          title: "Rating",
          dataIndex: "rating",
          key: "rating",
          width: 100,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(effectivenessRatingOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "rating")
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
            return text;
          },
        },
      ];
      break;
    case "13":
      dynamicColumns = [
        {
          title: "Objective Achievement Score(0-10)",
          dataIndex: "objectiveAchievementScore",
          key: "objectiveAchievementScore",
          width: 210,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "objectiveAchievementScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Process Timeliness & Throughput Score(0-10)",
          dataIndex: "timelinessThroughputScore",
          key: "timelinessThroughputScore",
          width: 260,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "timelinessThroughputScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Resource Consumption Score(0-5)",
          dataIndex: "resourceConsumptionScore",
          key: "resourceConsumptionScore",
          width: 210,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "resourceConsumptionScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Efficiency Score(0-25)",
          dataIndex: "efficiencyScore",
          key: "efficiencyScore",
          width: 160,
          render: (text: any, record: DataType) =>
            renderEditableInput(
              text,
              record.key,
              "efficiencyScore",
              handlers,
              editingKeys
            ),
        },
        {
          title: "Total Score(0-25)",
          dataIndex: "totalScore",
          key: "totalScore",
          width: 140,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(totalScoreOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "totalScore")
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
            return text;
          },
        },
        {
          title: "Scale(1-5)",
          dataIndex: "scale",
          key: "scale",
          width: 100,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(scale5Options, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "scale")
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
            return text;
          },
        },
        {
          title: "Rating",
          dataIndex: "rating",
          key: "rating",
          width: 100,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(effectivenessRatingOptions, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "rating")
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
            return text;
          },
        },
      ];
      break;
    case "14":
      dynamicColumns = [
        {
          title: "Scale(1-4)",
          dataIndex: "scale",
          key: "scale",
          width: 120,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(scale4Options, (key) =>
                handlers?.onSelectGeneric?.(key, record.key, "scale")
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
            return text;
          },
        },

        {
          title: "Process Severity Levels",
          dataIndex: "processSeverityLevels",
          key: "processSeverityLevels",
          width: 180,
          render: (text: any, record: DataType) => {
            if (editingKeys.includes(record.key)) {
              const menu = buildMenu(processSeverityLevelsOptions, (key) =>
                handlers?.onSelectGeneric?.(
                  key,
                  record.key,
                  "processSeverityLevels"
                )
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
            return text || "";
          },
        },
      ];
      break;
    default:
      dynamicColumns = processColumns;
  }
  // Duplicate actionsColumn removed above. Only one definition remains.
  return [...baseColumns, ...dynamicColumns, actionsColumn];
}
