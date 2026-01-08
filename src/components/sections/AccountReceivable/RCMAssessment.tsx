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
import { Table, Tabs, Spin, Button } from "antd";
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
import { useGlobalSearch } from "@/contexts/GlobalSearchContext";

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
    const { searchText } = useGlobalSearch();
    const debouncedSearchText = useDebounce(searchText, 500)[0];
    const [excelModalVisible, setExcelModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
    const [startSectionKey, setStartSectionKey] = useState<string | null>(null);
    const tableBodyRef = useRef<HTMLDivElement>(null);
    // Sync initial tab
    useEffect(() => {
      if (props.initialTabKey) setActiveTab(props.initialTabKey);
    }, [props.initialTabKey]);

    const getCurrentSection = useCallback(() => {
      const map: Record<string, string> = {
        "1": "Process",
        "11": "Assessment of Adequacy",
        "12": "Assessment of Effectiveness",
        "13": "Assessment of Efficiency",
        "14": "Process Severity",
      };
      return map[activeTab] || "Process";
    }, [activeTab]);

    const currentSection = getCurrentSection();
    const tableData = dataBySection[currentSection] || [];
    const setTableData = (newData: DataType[]) =>
      setDataBySection((prev) => ({ ...prev, [currentSection]: newData }));

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
            case "Process":
              return {
                ...base,
                processDescription:
                  item["Process Description"] ?? item.processDescription,
                processObjective:
                  item["Process Objectives"] ?? item.processObjective,
                processSeverityLevels:
                  item["Process Severity Levels"] ?? item.processSeverityLevels,
              };
            case "Assessment of Adequacy":
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
            case "Assessment of Effectiveness":
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
            case "Assessment of Efficiency":
              return {
                ...base,
                date: item.Date ?? item.date ?? "",
                objectiveAchievementScore: item.ObjectiveAchievementScore ?? 0,
                timelinessThroughputScore: item.TimelinessThroughputScore ?? 0,
                resourceConsumptionScore: item.ResourceConsumptionScore ?? 0,
                efficiencyScore: item.EfficiencyScore ?? 0,
                totalScore: item.TotalScore ?? 0,
                scale: item.Scale ?? 0,
                rating: item.Rating ?? "",
              };
            case "Process Severity":
              return {
                ...base,
                date: item.Date ?? item.date ?? "",
                scale: item.Scale ?? 0,
                rating: item.Rating ?? "",
                processSeverityLevels: item.Rating ?? "",
              };
            default:
              return base;
          }
        });

        const parseNoParts = (noValue: any) => {
          const str = String(noValue ?? "");
          const [majorStr, minorStr] = str.split(".");
          return {
            major: parseInt(majorStr, 10) || 5,
            minor: parseInt(minorStr ?? "0", 10) || 0,
          };
        };

        const normalizeNoValues = (records: any[]) => {
          if (!records.length) return records;

          const defaultMajor = parseNoParts(records[0].no).major || 5;
          const total = records.length;
          const seenMinors = new Set<number>();
          const missingMinors: number[] = [];

          const currentMinors = records.map((r) => parseNoParts(r.no).minor);
          for (let i = 1; i <= total; i++) {
            if (!currentMinors.includes(i)) missingMinors.push(i);
          }

          const consumeMissingMinor = () => {
            if (missingMinors.length > 0) return missingMinors.shift()!;
            let candidate = total + 1;
            while (seenMinors.has(candidate)) candidate++;
            return candidate;
          };

          return records.map((r) => {
            const { minor } = parseNoParts(r.no);
            if (!seenMinors.has(minor)) {
              seenMinors.add(minor);
              return { ...r, no: `${defaultMajor}.${minor}` };
            }
            const reassigned = consumeMissingMinor();
            seenMinors.add(reassigned);
            return { ...r, no: `${defaultMajor}.${reassigned}` };
          });
        };

        const getSortableNo = (noValue: any) => {
          const { major, minor } = parseNoParts(noValue);
          return major * 1000 + minor;
        };

        const normalizedItems = normalizeNoValues(mappedItems);
        const sortedItems = [...normalizedItems].sort(
          (a, b) => getSortableNo(a.no) - getSortableNo(b.no)
        );

        setDataBySection((prev) => ({
          ...prev,
          [section]: sortedItems,
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

    // ── Navigation ───────────────────────────────────────────────────────
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

    // ── Scroll Sync Helpers ──────────────────────────────────────────────
    const syncScroll = useCallback(
      (from: HTMLElement, to: HTMLElement | null) => {
        if (!to || !scrollSyncRef.current) return;
        scrollSyncRef.current = false;
        to.scrollLeft = from.scrollLeft;
        // Use RAF + small delay to prevent infinite loop
        requestAnimationFrame(() => {
          setTimeout(() => {
            scrollSyncRef.current = true;
          }, 30);
        });
      },
      []
    );

    const handleBottomScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        syncScroll(target, topScrollbarRef.current);
      },
      [syncScroll]
    );

    const handleTopScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const bottom = tableWrapperRef.current?.querySelector(
          ".ant-table-body"
        ) as HTMLElement | null;
        if (bottom) syncScroll(target, bottom);
      },
      [syncScroll]
    );

    // 3. Better update function + force re-calculation
    const updateTopScrollbar = useCallback(() => {
      if (!topScrollbarRef.current || !tableBodyRef.current) return;

      const body = tableBodyRef.current;
      const scrollWidth = body.scrollWidth;
      const clientWidth = body.clientWidth;

      const fakeDiv = topScrollbarRef.current.querySelector(
        "div"
      ) as HTMLElement;
      if (fakeDiv) {
        fakeDiv.style.width = `${Math.max(scrollWidth, clientWidth)}px`;
      }

      // Use visibility instead of display → much more stable
      const needsScroll = scrollWidth > clientWidth + 4;
      topScrollbarRef.current.style.visibility = needsScroll
        ? "visible"
        : "hidden";
      topScrollbarRef.current.style.height = needsScroll ? "16px" : "0px"; // ← makes grab area bigger
    }, []);
    useEffect(() => {
      updateTopScrollbar();
      const timer = setTimeout(updateTopScrollbar, 300);
      const timer2 = setTimeout(updateTopScrollbar, 800);

      window.addEventListener("resize", updateTopScrollbar);

      // Watch for any DOM changes inside table (very helpful!)
      const observer = new MutationObserver(updateTopScrollbar);
      if (tableBodyRef.current) {
        observer.observe(tableBodyRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }

      return () => {
        window.removeEventListener("resize", updateTopScrollbar);
        observer.disconnect();
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }, [activeTab, tableData, updateTopScrollbar]);

    // ── Your existing handlers (export, save, delete, etc.) ──────────────
    // Keeping all your original logic here unchanged

    const tabConfigs = [
      { key: "1", label: "Processes" },
      { key: "11", label: "Assessment of Adequacy" },
      { key: "12", label: "Assessment of Effectiveness" },
      { key: "13", label: "Assessment of Efficiency" },
      { key: "14", label: "Process Severity" },
    ];

    const getSectionFromTabKey = (tabKey: string): string => {
      const map: Record<string, string> = {
        "1": "Process",
        "11": "Assessment of Adequacy",
        "12": "Assessment of Effectiveness",
        "13": "Assessment of Efficiency",
        "14": "Process Severity",
      };
      return map[tabKey] || "Process";
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
        // ... your original handleSave logic remains unchanged ...
        // (omitted here for brevity - copy your original one)
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
          const map: Record<string, string> = {
            Process: "processes",
            "Assessment of Adequacy": "assessment-adequacies",
            "Assessment of Effectiveness": "assessment-effectivenesses",
            "Assessment of Efficiency": "assessment-efficiencies",
            "Process Severity": "process-severities",
          };
          setStartSectionKey(map[section] || "processes");
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
        getCurrentSection,
      ]
    );

    const columns = useMemo(
      () => getColumns(activeTab, "", handlers, editingKeys),
      [activeTab, editingKeys, handlers]
    );

    const handleTabChange = useCallback((key: string) => {
      setEditingKeys([]);
      setActiveTab(key);
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

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-4">
          {loading ? (
            <div className="flex justify-center items-center flex-1">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* === TOP SCROLLBAR === */}
              <div
                ref={topScrollbarRef}
                className="overflow-x-auto bg-white border-t border-l border-r border-gray-200 rounded-t-lg"
                style={{
                  height: "16px", // ← bigger clickable area
                  visibility: "hidden", // ← controlled by JS
                  scrollbarWidth: "thin",
                  scrollbarColor: "#6b7280 #e5e7eb",
                }}
                onScroll={handleTopScroll}
              >
                <div style={{ height: "1px", minWidth: "100%" }} />
              </div>

              {/* === TABLE CONTAINER === */}
              <div
                ref={tableWrapperRef}
                className="flex-1 bg-white shadow-md rounded-b-lg overflow-hidden border border-gray-200"
              >
                <style jsx global>{`
                  /* Modern scrollbar styling - bigger & easier to grab */
                  .ant-table-body {
                    overflow: auto !important;
                  }

                  .ant-table-body::-webkit-scrollbar {
                    height: 16px; /* ← bigger height */
                  }

                  .ant-table-body::-webkit-scrollbar-thumb {
                    background-color: #6b7280;
                    border-radius: 8px;
                    border: 4px solid #f3f4f6; /* ← better hover area */
                  }

                  .ant-table-body::-webkit-scrollbar-thumb:hover {
                    background-color: #4b5563;
                  }

                  .ant-table-body::-webkit-scrollbar-track {
                    background: #f3f4f6;
                    border-radius: 8px;
                  }

                  /* Your deactivated row styles remain the same */
                  .row-deactivated {
                    background-color: #e5e7eb !important;
                    color: #6b7280 !important;
                    opacity: 0.75;
                  }
                  .row-deactivated .ant-table-cell-fix-left,
                  .row-deactivated .ant-table-cell-fix-left-last {
                    background-color: #e5e7eb !important;
                  }
                  .row-deactivated:hover > td {
                    background-color: #e5e7eb !important;
                  }
                `}</style>

                <Table
                  key={`table-${activeTab}`}
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
                  bordered
                  rowKey={(r) => `${r.key}-${r.isActive ?? true}`}
                  rowClassName={(r) =>
                    r.isActive === false ? "row-deactivated" : ""
                  }
                  onScroll={handleBottomScroll}
                  // Important: we get ref to the scrollable div
                  ref={(tableInstance) => {
                    if (tableInstance) {
                      //@ts-ignore
                      tableBodyRef.current =
                        tableInstance?.nativeElement?.querySelector(
                          ".ant-table-body"
                        );
                    }
                  }}
                />
              </div>
            </>
          )}

          {/* Your modals remain the same */}
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
    );
  }
);

RCMAssessment.displayName = "RCMAssessment";
export default RCMAssessment;
