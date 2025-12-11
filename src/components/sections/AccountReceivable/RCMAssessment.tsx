"use client";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Table, Tabs, Spin, Button, Popconfirm, Input } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getColumns } from "./columns";
import { DataType } from "./types";
import * as XLSX from "xlsx";
import type { ColumnType } from "antd/es/table";
import { useDebouncedCallback, useDebounce } from "use-debounce";
import ExcelUploadModal from "./ExcelUploadModal";
import { apiClientDotNet } from "@/config/apiClientDotNet";
import { SECTION_TO_BASE_ENDPOINT } from "@/utils/sectionMappings";
import ProcessFormModal from "./ProcessFormModal";
import { importSectionData } from "@/utils/importSectionDataService";

export interface RCMAssessmentRef {
  triggerImport: (file: File) => void;
}

interface RCMAssessmentProps {
  initialTabKey?: string;
  onBackToLanding?: () => void;
}

const defaultNewRow = (maxNo: number): DataType => {
  const newKey = String(Date.now());
  const newNo = (maxNo + 0.1).toFixed(1);
  return {
    key: newKey,
    no: newNo,
    process: "",
    isActive: true,
  };
};

const RCMAssessment = forwardRef<RCMAssessmentRef, RCMAssessmentProps>(
  (props, ref) => {
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const topScrollbarRef = useRef<HTMLDivElement>(null);
    const scrollSyncRef = useRef<boolean>(true);
    const [activeTab, setActiveTab] = useState(props.initialTabKey ?? "1");
    const [dataBySection, setDataBySection] = useState<
      Record<string, DataType[]>
    >({});
    const [editingKeys, setEditingKeys] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 500)[0];
    const [excelModalVisible, setExcelModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
    const [startSectionKey, setStartSectionKey] = useState<string | null>(null);

    // Sync with optional initial props when they change
    useEffect(() => {
      if (props.initialTabKey) {
        setActiveTab(props.initialTabKey);
      }
    }, [props.initialTabKey]);

    const getCurrentSection = useCallback((): string => {
      switch (activeTab) {
        case "1":
          return "Process";
        case "11":
          return "Assessment of Adequacy";
        case "12":
          return "Assessment of Effectiveness";
        case "13":
          return "Assessment of Efficiency";
        case "14":
          return "Process Severity";
        default:
          return "Process";
      }
    }, [activeTab]);

    const currentSection = getCurrentSection();
    const tableData = dataBySection[currentSection] || [];
    const setTableData = (newData: DataType[]) => {
      setDataBySection((prev) => ({ ...prev, [currentSection]: newData }));
    };

    const fetchData = useCallback(async () => {
      setLoading(true);
      const section = getCurrentSection();
      const endpoint = SECTION_TO_BASE_ENDPOINT[section];
      try {
        const response = await apiClientDotNet.get(`/${endpoint}`, {
          params: {
            page: 1,
            pageSize: 10000,
            search: debouncedSearchText,
            sortByNoAsc: true,
          },
        });

        const items: any[] = response.data.items || response.data.Items || [];

        const mappedItems = items.map((item: any) => {
          const base: any = {
            key: item.Id ?? String(item.id ?? item.key ?? Date.now()),
            id: item.Id ?? item.id,
            no: item.No ?? item.no ?? "",
            process:
              item["Main Process"] ??
              item.MainProcess ??
              item.Process ??
              item.process ??
              "",
          };

          switch (section) {
            case "Process": {
              return {
                ...base,
                processDescription:
                  item["Process Description"] ?? item.processDescription,
                processObjective:
                  item["Process Objectives"] ?? item.processObjective,
                processSeverityLevels:
                  item["Process Severity Levels"] ?? item.processSeverityLevels,
              };
            }
            case "Assessment of Adequacy": {
              return {
                ...base,
                date: item.Date ?? item.date ?? "",
                designAdequacyScore: item.DesignAdequacyScore ?? 0,
                sustainabilityScore: item.SustainabilityScore ?? 0,
                scalabilityScore: item.ScalabilityScore ?? 0,
                adequacyScore: item.AdequacyScore ?? 0,
                totalScore: item.TotalScore ?? 0,
                scale: item.Scale ?? 0,
                rating: item.Rating ?? "",
              };
            }
            case "Assessment of Effectiveness": {
              return {
                ...base,
                date: item.Date ?? item.date ?? "",
                designScore: item.DesignScore ?? 0,
                operatingScore: item.OperatingScore ?? 0,
                sustainabilityScore: item.SustainabilityScore ?? 0,
                effectivenessScore: item.EffectivenessScore ?? 0,
                totalScore: item.TotalScore ?? 0,
                scale: item.Scale ?? 0,
                rating: item.Rating ?? "",
              };
            }
            case "Assessment of Efficiency": {
              return {
                ...base,
                designScore: item.DesignScore ?? 0,
                operatingScore: item.OperatingScore ?? 0,
                sustainabilityScore: item.SustainabilityScore ?? 0,
                efficiencyScore: item.EfficiencyScore ?? 0,
                totalScore: item.TotalScore ?? 0,
                scale: item.Scale ?? 0,
                rating: item.Rating ?? "",
              };
            }
            case "Process Severity": {
              return {
                ...base,
                date: item.Date ?? item.date ?? "",
                scale: item.Scale ?? 0,
                rating: item.Rating ?? "",
                processSeverityLevels: item.Rating ?? "", // Map API Rating to processSeverityLevels column
              };
            }
            default:
              return base;
          }
        });

        setDataBySection((prev) => ({
          ...prev,
          [section]: mappedItems,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, [debouncedSearchText, getCurrentSection]);

    useEffect(() => {
      fetchData();
    }, [debouncedSearchText, activeTab, fetchData]);

    const tabKeys = ["1", "11", "12", "13", "14"];
    const currentTabIndex = tabKeys.indexOf(activeTab);
    const hasPrev = currentTabIndex > 0;
    const hasNext = currentTabIndex < tabKeys.length - 1;
    const goPrev = useCallback(() => {
      if (hasPrev) {
        setEditingKeys([]);
        setActiveTab(tabKeys[currentTabIndex - 1]);
      }
    }, [currentTabIndex, hasPrev]);
    const goNext = useCallback(() => {
      if (hasNext) {
        setEditingKeys([]);
        setActiveTab(tabKeys[currentTabIndex + 1]);
      }
    }, [currentTabIndex, hasNext]);

    const debouncedResize = useDebouncedCallback(() => {
      window.dispatchEvent(new Event("resize"));
    }, 50);

    useEffect(() => {
      debouncedResize();
    }, [tableData, activeTab, debouncedResize]);

    useEffect(() => {
      const updateWidth = () => {
        if (!topScrollbarRef.current || !tableWrapperRef.current) return;
        const table = tableWrapperRef.current.querySelector(
          ".ant-table"
        ) as HTMLElement;
        if (table) {
          const dummy = topScrollbarRef.current.querySelector("div");
          if (dummy) {
            dummy.style.width = `${table.scrollWidth}px`;
          }
        }
      };
      const timeoutId = setTimeout(updateWidth, 100);
      window.addEventListener("resize", updateWidth);
      return () => {
        window.removeEventListener("resize", updateWidth);
        clearTimeout(timeoutId);
      };
    }, [activeTab, tableData]);

    const tabConfigs = [
      { key: "1", label: "Processes" },
      { key: "11", label: "Assessment of Adequacy" },
      { key: "12", label: "Assessment of Effectiveness" },
      { key: "13", label: "Assessment of Efficiency" },
      { key: "14", label: "Process Severity" },
    ];

    const getSectionFromTabKey = (tabKey: string): string => {
      switch (tabKey) {
        case "1":
          return "Process";
        case "11":
          return "Assessment of Adequacy";
        case "12":
          return "Assessment of Effectiveness";
        case "13":
          return "Assessment of Efficiency";
        case "14":
          return "Process Severity";
        default:
          return "Process";
      }
    };

    const handleExport = () => {
      const wb = XLSX.utils.book_new();
      tabConfigs.forEach((config) => {
        const sheetName = config.label.slice(0, 31);
        const columnsRaw = getColumns(config.key, "", handlers, editingKeys);
        const fields = columnsRaw
          .filter(
            (c): c is ColumnType<DataType> =>
              "dataIndex" in c && c.dataIndex !== "actions"
          )
          .map((c) => c.dataIndex!);
        const section = getSectionFromTabKey(config.key);
        const exportDataSource = dataBySection[section] || [];
        const exportData = exportDataSource.map((row) => {
          const obj: any = {};
          //@ts-ignore
          fields.forEach((f) => (obj[f] = row[f as keyof DataType] ?? ""));
          return obj;
        });
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
      XLSX.writeFile(wb, "RCMAssessment_Export.xlsx");
    };

    const handleDelete = useCallback(
      async (key: string) => {
        const item = tableData.find((r) => r.key === key);
        if (!item) return;
        const section = getCurrentSection();
        const endpoint = SECTION_TO_BASE_ENDPOINT[section];
        try {
          if (item.id) {
            await apiClientDotNet.delete(`/${endpoint}/${item.id}`);
          }
          setDataBySection((prev) => ({
            ...prev,
            [section]: (prev[section] || []).filter((r) => r.key !== key),
          }));
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      },
      [tableData, getCurrentSection]
    );

    const handleSave = useCallback(
      async (key: string) => {
        const itemIndex = tableData.findIndex((r) => r.key === key);
        if (itemIndex === -1) return;
        const item = tableData[itemIndex];
        const section = getCurrentSection();
        const endpoint = SECTION_TO_BASE_ENDPOINT[section];

        // Remove extra fields from request body but keep Date for API
        const { key: itemKey, ...requestBody } = item;

        // Convert dropdown values for API - keep TotalScore as string, convert all others to numbers
        const apiRequestBody: any = {
          Id: requestBody.id, // Convert id to Id
          No: requestBody.no, // Convert no to No
          Process: requestBody.process, // Convert process to Process
          Scale:
            typeof requestBody.scale === "string"
              ? parseInt(requestBody.scale) || 0
              : requestBody.scale || 0,
        };

        // Add assessment-specific fields based on section and ensure all scores are numbers
        if (section === "Assessment of Adequacy") {
          Object.assign(apiRequestBody, {
            TotalScore: requestBody.totalScore, // Keep as string (exact range)
            Rating: requestBody.rating,
            DesignAdequacyScore:
              typeof requestBody.designAdequacyScore === "string"
                ? parseFloat(requestBody.designAdequacyScore) || 0
                : requestBody.designAdequacyScore || 0,
            SustainabilityScore:
              typeof requestBody.sustainabilityScore === "string"
                ? parseFloat(requestBody.sustainabilityScore) || 0
                : requestBody.sustainabilityScore || 0,
            ScalabilityScore:
              typeof requestBody.scalabilityScore === "string"
                ? parseFloat(requestBody.scalabilityScore) || 0
                : requestBody.scalabilityScore || 0,
            AdequacyScore:
              typeof requestBody.adequacyScore === "string"
                ? parseFloat(requestBody.adequacyScore) || 0
                : requestBody.adequacyScore || 0,
          });
        } else if (section === "Assessment of Effectiveness") {
          Object.assign(apiRequestBody, {
            TotalScore: requestBody.totalScore, // Keep as string (exact range)
            Rating: requestBody.rating,
            DesignScore:
              typeof requestBody.designScore === "string"
                ? parseFloat(requestBody.designScore) || 0
                : requestBody.designScore || 0,
            OperatingScore:
              typeof requestBody.operatingScore === "string"
                ? parseFloat(requestBody.operatingScore) || 0
                : requestBody.operatingScore || 0,
            SustainabilityScore:
              typeof requestBody.sustainabilityScore === "string"
                ? parseFloat(requestBody.sustainabilityScore) || 0
                : requestBody.sustainabilityScore || 0,
            EffectivenessScore:
              typeof requestBody.effectivenessScore === "string"
                ? parseFloat(requestBody.effectivenessScore) || 0
                : requestBody.effectivenessScore || 0,
          });
        } else if (section === "Assessment of Efficiency") {
          Object.assign(apiRequestBody, {
            TotalScore: requestBody.totalScore, // Keep as string (exact range)
            Rating: requestBody.rating,
            DesignScore:
              typeof requestBody.designScore === "string"
                ? parseFloat(requestBody.designScore) || 0
                : requestBody.designScore || 0,
            OperatingScore:
              typeof requestBody.operatingScore === "string"
                ? parseFloat(requestBody.operatingScore) || 0
                : requestBody.operatingScore || 0,
            SustainabilityScore:
              typeof requestBody.sustainabilityScore === "string"
                ? parseFloat(requestBody.sustainabilityScore) || 0
                : requestBody.sustainabilityScore || 0,
            EfficiencyScore:
              typeof requestBody.efficiencyScore === "string"
                ? parseFloat(requestBody.efficiencyScore) || 0
                : requestBody.efficiencyScore || 0,
          });
        } else if (section === "Process Severity") {
          Object.assign(apiRequestBody, {
            Rating: requestBody.processSeverityLevels, // Use Process Severity Levels column value for Rating
          });
        }

        try {
          let updatedItem;
          if (item.id) {
            await apiClientDotNet.put(
              `/${endpoint}/${item.id}`,
              apiRequestBody
            );
            updatedItem = { ...item };
          } else {
            const response = await apiClientDotNet.post(
              `/${endpoint}`,
              apiRequestBody
            );
            updatedItem = { ...response.data, key: response.data.Id };
          }
          const newData = [...tableData];
          newData[itemIndex] = updatedItem;
          setDataBySection((prev) => ({ ...prev, [section]: newData }));
        } catch (error) {
          console.error("Error saving item:", error);
        } finally {
          setEditingKeys((prev) => prev.filter((k) => k !== key));
        }
      },
      [tableData, getCurrentSection]
    );

    const handleCancel = useCallback((key: string) => {
      setEditingKeys((prev) => prev.filter((k) => k !== key));
    }, []);

    const handleCheckboxChange = useCallback(
      (rowKey: string, field: keyof DataType, checked: boolean) => {
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, [field]: checked } : r
        );
        setTableData(newData);
      },
      [tableData, setTableData]
    );

    const handleSelectGeneric = useCallback(
      (value: string, rowKey: string, field?: string) => {
        if (!field) return;
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, [field]: value } : r
        );
        setTableData(newData);
      },
      [tableData, setTableData]
    );

    const handleTextChange = useCallback(
      (rowKey: string, field: keyof DataType, value: string) => {
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, [field]: value } : r
        );
        setTableData(newData);
      },
      [tableData, setTableData]
    );

    const handleAddRow = useCallback(() => {
      const maxNo = tableData.reduce((max, r) => {
        const num = parseFloat(r.no as string) || 0;
        return num > max ? num : max;
      }, 0);
      const newRow = defaultNewRow(maxNo);
      const newData = [...tableData, newRow];
      setTableData(newData);
      setEditingKeys((prev) => [...prev, newRow.key]);
    }, [tableData, setTableData]);

    const handleEditRow = useCallback((key: string) => {
      setEditingKeys((prev) => [...prev, key]);
    }, []);

    const handleDeleteRow = useCallback(
      (key: string) => {
        handleDelete(key);
      },
      [handleDelete]
    );

    const handleToggleStatus = useCallback(
      (rowKey: string) => {
        const newData = tableData.map((r) =>
          r.key === rowKey ? { ...r, isActive: !(r.isActive !== false) } : r
        );
        setTableData(newData);
        setEditingKeys((prev) => prev.filter((k) => k !== rowKey));
      },
      [tableData]
    );

    const handleFormSubmit = () => {
      fetchData();
      setFormModalVisible(false);
      setEditingRecord(null);
    };

    const handleEdit = useCallback((record: DataType) => {
      setEditingRecord(record);
      setStartSectionKey(null);
      setFormModalVisible(true);
    }, []);

    const handlers = useMemo(
      () => ({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onSave: handleSave,
        onSaveRow: handleSave,
        onCancel: handleCancel,
        onCheckboxChange: handleCheckboxChange,
        onSelectGeneric: handleSelectGeneric,
        onTextChange: handleTextChange,
        onAddRow: () => {
          setEditingRecord(null);
          const section = getCurrentSection();
          switch (section) {
            case "Process":
              setStartSectionKey("processes");
              break;
            case "Assessment of Adequacy":
              setStartSectionKey("assessment-adequacies");
              break;
            case "Assessment of Effectiveness":
              setStartSectionKey("assessment-effectivenesses");
              break;
            case "Assessment of Efficiency":
              setStartSectionKey("assessment-efficiencies");
              break;
            case "Process Severity":
              setStartSectionKey("process-severities");
              break;
            default:
              setStartSectionKey("processes");
          }
          setFormModalVisible(true);
        },
        onEditRow: handleEditRow,
        onDeleteRow: handleDeleteRow,
        onToggleStatus: handleToggleStatus,
      }),
      [
        handleEdit,
        handleDelete,
        handleSave,
        handleCancel,
        handleCheckboxChange,
        handleSelectGeneric,
        handleTextChange,
        handleEditRow,
        handleDeleteRow,
        handleToggleStatus,
      ]
    );

    const columns = useMemo(() => {
      return getColumns(activeTab, "", handlers, editingKeys);
    }, [activeTab, editingKeys, handlers]);

    const handleTabChange = useCallback((key: string) => {
      setEditingKeys([]);
      setActiveTab(key);
    }, []);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      if (!scrollSyncRef.current) return;
      const target = e.target as HTMLDivElement;
      if (topScrollbarRef.current) {
        scrollSyncRef.current = false;
        topScrollbarRef.current.scrollLeft = target.scrollLeft;
        setTimeout(() => {
          scrollSyncRef.current = true;
        }, 50);
      }
    }, []);

    const handleTopScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      if (!scrollSyncRef.current) return;
      const target = e.target as HTMLDivElement;
      const body = tableWrapperRef.current?.querySelector(
        ".ant-table-body"
      ) as HTMLElement;
      if (body) {
        scrollSyncRef.current = false;
        body.scrollLeft = target.scrollLeft;
        setTimeout(() => {
          scrollSyncRef.current = true;
        }, 50);
      }
    }, []);

    const handleDataLoaded = async (data: DataType[]) => {
      await importSectionData(currentSection, data);
      fetchData();
    };

    useImperativeHandle(ref, () => ({
      triggerImport: (file: File) => {
        // Handle import if needed
      },
    }));

    return (
      <div className="flex flex-col h-screen bg-[#f8fafc]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={props.onBackToLanding}
                  className="text-xl font-bold text-black hover:text-blue-700 underline-offset-4 hover:underline text-left"
                >
                  RCM ASSESSMENT – Account Receivable
                </button>
                <Button type="primary" onClick={handleExport}>
                  Export Data
                </Button>
              </div>
              <div className="flex space-x-3 bg-white border border-black shadow-sm">
                <button
                  onClick={goPrev}
                  disabled={!hasPrev}
                  className={`p-2 rounded-md transition font-bold ${
                    hasPrev
                      ? "text-black hover:bg-gray-50 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <LeftOutlined />
                </button>
                <div className="bg-black w-[2px] h-6 my-auto" />
                <button
                  onClick={goNext}
                  disabled={!hasNext}
                  className={`p-2 rounded-md transition font-bold ${
                    hasNext
                      ? "text-black hover:bg-gray-50 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RightOutlined />
                </button>
              </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-t-xl shadow-sm">
              <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                className="text-lg"
                items={tabConfigs.map((c) => ({ key: c.key, label: c.label }))}
                destroyInactiveTabPane={true}
              />
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 pt-4">
            <div className="mb-4">
              <Input.Search
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Spin size="large" />
              </div>
            ) : (
              <div className="relative">
                {(() => {
                  if (!tableWrapperRef.current) return null;
                  const table = tableWrapperRef.current.querySelector(
                    ".ant-table"
                  ) as HTMLElement;
                  if (!table || table.scrollWidth <= table.clientWidth + 10)
                    return null;
                  return (
                    <div
                      ref={topScrollbarRef}
                      className="sticky top-0 z-20 overflow-x-auto bg-white border-b border-gray-200 -mx-6 px-6 mb-3"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "#787878 #121212",
                      }}
                      onScroll={handleTopScroll}
                    >
                      <div
                        style={{
                          width: `${table.scrollWidth}px`,
                          height: "1px",
                        }}
                      />
                    </div>
                  );
                })()}
                <div
                  ref={tableWrapperRef}
                  className="bg-white shadow-md rounded-b-lg overflow-hidden"
                  style={{
                    maxHeight: "calc(100vh - 280px)",
                    minHeight: "500px",
                  }}
                >
                  <style jsx>{`
                    .ant-table-body {
                      scrollbar-width: none;
                      -ms-overflow-style: none;
                    }
                    .ant-table-body::-webkit-scrollbar {
                      display: none;
                    }
                    .row-deactivated {
                      background-color: #e5e7eb !important;
                      color: #6b7280 !important;
                      opacity: 0.7;
                    }
                  `}</style>
                  <Table
                    key={`table-${activeTab}`}
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    scroll={{ x: 1300, y: "calc(100vh - 340px)" }}
                    bordered
                    rowKey={(r) => `${r.key}-${r.isActive?.toString()}`}
                    rowClassName={(r) =>
                      r.isActive === false ? "row-deactivated" : ""
                    }
                    onHeaderRow={() => ({
                      onScroll: handleScroll,
                    })}
                  />
                </div>
              </div>
            )}
            <ExcelUploadModal
              visible={excelModalVisible}
              onClose={() => setExcelModalVisible(false)}
              onDataLoaded={handleDataLoaded}
            />
            <ProcessFormModal
              visible={formModalVisible}
              onCancel={() => {
                setFormModalVisible(false);
                setEditingRecord(null);
              }}
              onSuccess={handleFormSubmit}
              initialValues={editingRecord}
              startSectionKey={startSectionKey || undefined}
            />
          </div>
        </div>
      </div>
    );
  }
);

RCMAssessment.displayName = "RCMAssessment";
export default RCMAssessment;
