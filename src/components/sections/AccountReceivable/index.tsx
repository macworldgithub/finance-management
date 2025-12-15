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
import { apiClientDotNet } from "@/config/apiClientDotNet"; // Assuming this is your API client
import { importSectionData } from "@/utils/importSectionDataService";
import { SECTION_TO_BASE_ENDPOINT } from "@/utils/sectionMappings";
import ProcessFormModal from "./ProcessFormModal";
const { TextArea } = Input;
export interface AccountReceivableRef {
  triggerImport: (file: File) => void;
}
interface AccountReceivableProps {
  excelModalVisible?: boolean;
  onExcelModalClose?: () => void;
  onExcelModalOpen?: () => void;
  initialTabKey?: string;
  initialSubTabKey?: string;
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
const AccountReceivable = forwardRef<
  AccountReceivableRef,
  AccountReceivableProps
>((props, ref) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const topScrollbarRef = useRef<HTMLDivElement>(null);
  const scrollSyncRef = useRef<boolean>(true);
  const [activeTab, setActiveTab] = useState(props.initialTabKey ?? "1");
  const [activeSubTab, setActiveSubTab] = useState(
    props.initialSubTabKey ?? "coso"
  );
  const [dataBySection, setDataBySection] = useState<
    Record<string, DataType[]>
  >({});
  const [editingKeys, setEditingKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500)[0];
  // Add this state to your component
  const [excelModalVisible, setExcelModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);
  const [startSectionKey, setStartSectionKey] = useState<string | null>(null);
  // After your existing states (around line 40), add:
  const [tableScrollWidth, setTableScrollWidth] = useState(0);
  const [fixedLeftWidth, setFixedLeftWidth] = useState(0);

  // Reset sub-tab when switching main tabs
  useEffect(() => {
    if (activeTab === "3") setActiveSubTab("coso");
    else if (activeTab === "9") setActiveSubTab("sox");
    else if (activeTab === "10") setActiveSubTab("audit");
  }, [activeTab]);

  // Sync with optional initial props when they change (e.g. navigating from landing page)
  useEffect(() => {
    if (props.initialTabKey) {
      setActiveTab(props.initialTabKey);
    }
  }, [props.initialTabKey]);

  useEffect(() => {
    if (props.initialSubTabKey) {
      setActiveSubTab(props.initialSubTabKey);
    }
  }, [props.initialSubTabKey]);
  const getCurrentSection = useCallback((): string => {
    switch (activeTab) {
      case "1":
        return "Process";
      case "2":
        return "Ownership";
      case "3":
        if (activeSubTab === "coso") return "COSO-Control Environment";
        if (activeSubTab === "intosai")
          return "INTOSAI, IFAC, and Government Audit Standards - Control Environment";
        if (activeSubTab === "other") return "Other- - Control Environment";
        return "COSO-Control Environment"; // default
      case "4":
        return "Risk Assessment (Inherent Risk)";
      case "5":
        return "Risk Responses";
      case "6":
        return "Control Activities";
      case "7":
        return "Control Assessment";
      case "8":
        return "Risk Assessment (Residual Risk)";
      case "9":
        if (activeSubTab === "sox") return "SOX";
        if (activeSubTab === "financial" || activeSubTab === "icfr")
          return "Financial Statement Assertions";
        return "SOX"; // default
      case "10":
        if (activeSubTab === "audit") return "Internal Audit Test";
        if (activeSubTab === "grc") return "GRC Exception Log";
        return "Internal Audit Test"; // default
      default:
        return "Process";
    }
  }, [activeTab, activeSubTab]);
  const currentSection = getCurrentSection();
  const tableData = dataBySection[currentSection] || [];
  const setTableData = (newData: DataType[]) => {
    setDataBySection((prev) => ({ ...prev, [currentSection]: newData }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const section = getCurrentSection();
    const endpoint = SECTION_TO_BASE_ENDPOINT[section]; // From sectionMappings.ts
    try {
      const response = await apiClientDotNet.get(`/${endpoint}`, {
        params: {
          page: 1,
          pageSize: 10000,
          search: debouncedSearchText,
          sortByNoAsc: true, // always sort by No ascending on backend
        },
      });

      // NOTE: .items (lowercase) matches the API responses you shared
      const items: any[] = response.data.items || response.data.Items || [];

      const mappedItems = items.map((item: any) => {
        const base: any = {
          key: item.Id ?? String(item.id ?? item.key ?? Date.now()),
          id: item.Id ?? item.id, // keep backend Id so delete API can use it
          no: item.No ?? item.no ?? "",
          // process: item.Process ?? item.process ?? "",
          process:
            item["Main Process"] ??
            item.MainProcess ??
            item.Process ??
            item.process ??
            "",
        };

        // Helper: map P/O flags for checkboxes (P = true, everything else = false)
        const toCheckboxBool = (v: any) => v === "P";

        // Helper: map P/O flags into Yes/No strings where needed
        const toYesNo = (v: any) => (v === "P" ? "Yes" : v === "O" ? "No" : v);

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

          case "Ownership": {
            return {
              ...base,
              activity: item.Activity ?? item.activity,
              // process2: item.Process ?? item.process2 ?? base.process,
              process2: item.Process ?? item.process2 ?? "",
              stage: item["Process Stage"] ?? item.stage,
              functions: item.Functions ?? item.functions,
              clientSegment:
                item["Client Segment and/or Functional Segment"] ??
                item.clientSegment,
              operationalUnit: item["Operational Unit"] ?? item.operationalUnit,
              division: item.Division ?? item.division,
              entity: item.Entity ?? item.entity,
              unitDepartment: item["Unit / Department"] ?? item.unitDepartment,
              productClass: item["Product Class"] ?? item.productClass,
              productName: item["Product Name"] ?? item.productName,
            };
          }

          case "COSO-Control Environment": {
            const integrityVal =
              item["Integrity & Ethical Values"] ?? item.integrityEthical;
            const boardVal = item["Board Oversight"] ?? item.boardOversight;
            const orgVal =
              item["Organizational Structure"] ?? item.orgStructure;
            const commitVal =
              item["Commitment to Competence"] ?? item.commitmentCompetence;
            const mgmtVal =
              item["Management Philosophy"] ?? item.managementPhilosophy;

            return {
              ...base,
              integrityEthical: toCheckboxBool(integrityVal),
              boardOversight: toCheckboxBool(boardVal),
              orgStructure: toCheckboxBool(orgVal),
              commitmentCompetence: toCheckboxBool(commitVal),
              managementPhilosophy: toCheckboxBool(mgmtVal),
            };
          }

          case "Risk Responses": {
            return {
              ...base,
              riskResponseType:
                item["Type of Risk Response"] ?? item.riskResponseType ?? "",
            };
          }

          case "Control Activities": {
            return {
              ...base,
              controlObjectives:
                item["Control Objectives"] ?? item.controlObjectives ?? "",
              controlRef: item["Control Ref"] ?? item.controlRef ?? "",
              controlDefinition:
                item["Control Definition"] ?? item.controlDefinition ?? "",
              controlDescription:
                item["Control Description"] ?? item.controlDescription ?? "",
              controlResponsibility:
                item["Control Responsibility"] ??
                item.controlResponsibility ??
                "",
              // If backend uses P/O here, convert to Yes/No for display
              keyControl: toYesNo(item["Key Control"] ?? item.keyControl),
              zeroTolerance: toYesNo(
                item["Zero Tolerance"] ?? item.zeroTolerance
              ),
            };
          }

          case "INTOSAI, IFAC, and Government Audit Standards - Control Environment": {
            return {
              ...base,
              integrityEthical: toCheckboxBool(
                item["Integrity and Ethical Values"] ?? item.integrityEthical
              ),
              commitmentCompetence: toCheckboxBool(
                item["Commitment to Competence"] ?? item.commitmentCompetence
              ),
              managementPhilosophy: toCheckboxBool(
                item["Management’s Philosophy and Operating Style"] ??
                  item.managementPhilosophy
              ),
              orgStructure: toCheckboxBool(
                item["Organizational Structure"] ?? item.orgStructure
              ),
              assignmentAuthority: toCheckboxBool(
                item["Assignment of Authority and Responsibility"] ??
                  item.assignmentAuthority
              ),
              hrPolicies: toCheckboxBool(
                item["Human Resource Policies and Practices"] ?? item.hrPolicies
              ),
              boardAudit: toCheckboxBool(
                item[
                  "Board of Directors’ or Audit Committee’s Participation"
                ] ?? item.boardAudit
              ),
              managementControl: toCheckboxBool(
                item["Management Control Methods"] ?? item.managementControl
              ),
              externalInfluences: toCheckboxBool(
                item["External Influences"] ?? item.externalInfluences
              ),
              commitmentInternal: toCheckboxBool(
                item["Management’s Commitment to Internal Control"] ??
                  item.commitmentInternal
              ),
              enforcementIntegrity: toCheckboxBool(
                item[
                  "Communication and Enforcement of Integrity and Ethical Values"
                ] ?? item.enforcementIntegrity
              ),
              employeeAwareness: toCheckboxBool(
                item["Employee Awareness and Understanding"] ??
                  item.employeeAwareness
              ),
              accountability: toCheckboxBool(
                item["Accountability and Performance Measurement"] ??
                  item.accountability
              ),
              commitmentTransparency: toCheckboxBool(
                item["Commitment to Transparency and Openness"] ??
                  item.commitmentTransparency
              ),
            };
          }

          case "Control Assessment": {
            return {
              ...base,
              levelResponsibility:
                item[
                  "Level of Responsibility-Operating Level (Entity / Activity)"
                ] ?? item.levelResponsibility,
              cosoPrinciple: item["COSO Principle #"] ?? item.cosoPrinciple,
              operationalApproach:
                item["Operational Approach (Automated / Manual)"] ??
                item.operationalApproach,
              operationalFrequency:
                item["Operational Frequency"] ?? item.operationalFrequency,
              controlClassification:
                item[
                  "Control Classification (Preventive / Detective / Corrective)"
                ] ?? item.controlClassification,
            };
          }

          case "Risk Assessment (Inherent Risk)": {
            return {
              ...base,
              riskType: item["Risk Type"] ?? item.riskType,
              riskDescription: item["Risk Description"] ?? item.riskDescription,
              severityImpact: item["Severity/ Impact"] ?? item.severityImpact,
              probabilityLikelihood:
                item["Probability/ Likelihood"] ?? item.probabilityLikelihood,
              classification: item["Classification"] ?? item.classification,
            };
          }

          case "Risk Assessment (Residual Risk)": {
            return {
              ...base,
              riskType: item["Risk Type"] ?? item.riskType,
              riskDescription: item["Risk Description"] ?? item.riskDescription,
              severityImpact: item["Severity/ Impact"] ?? item.severityImpact,
              probabilityLikelihood:
                item["Probability/ Likelihood"] ?? item.probabilityLikelihood,
              classification: item["Classification"] ?? item.classification,
            };
          }

          case "SOX": {
            return {
              ...base,
              soxControlActivity:
                item["SOX Control Activity"] ?? item.soxControlActivity,
            };
          }

          case "Internal Audit Test": {
            return {
              ...base,
              // API fields: "Internal Audit Test", "Sample Size", "Check"
              check: item.Check === "P" ? true : item.check,
              internalAuditTest:
                item["Internal Audit Test"] ?? item.internalAuditTest,
              sampleSize: item["Sample Size"] ?? item.sampleSize,
            };
          }

          case "GRC Exception Log": {
            return {
              ...base,
              grcAdequacy: item["GRC Adequacy"] ?? item.grcAdequacy,
              grcEffectiveness:
                item["GRC Effectiveness"] ?? item.grcEffectiveness,
              explanation: item["Explanation"] ?? item.explanation,
            };
          }

          case "Financial Statement Assertions": {
            const mappedData = {
              ...base,
              internalControlOverFinancialReporting:
                item["Internal Control Over Financial Reporting?"] === "P"
                  ? true
                  : item["Internal Control Over Financial Reporting?"] === "O"
                  ? false
                  : item.internalControlOverFinancialReporting,
              occurrence: item.Occurrence === "P" ? true : item.occurrence,
              completeness:
                item.Completeness === "P" ? true : item.completeness,
              accuracy: item.Accuracy === "P" ? true : item.accuracy,
              authorization:
                item.Authorization === "P" ? true : item.authorization,
              cutoff: item.Cutoff === "P" ? true : item.cutoff,
              classificationAndUnderstandability:
                item["Classification and Understandability"] === "P"
                  ? true
                  : item.classificationAndUnderstandability,
              existence: item.Existence === "P" ? true : item.existence,
              rightsAndObligations:
                item["Rights and Obligations"] === "P"
                  ? true
                  : item.rightsAndObligations,
              valuationAndAllocation:
                item["Valuation and Allocation"] === "P"
                  ? true
                  : item.valuationAndAllocation,
              presentationDisclosure:
                item["Presentation / Disclosure"] === "P"
                  ? true
                  : item.presentationDisclosure,
            };
            return mappedData;
          }

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

      // Ensure unique, properly ordered No values (handles backend 5.10 -> 5.1 truncation)
      const normalizeNoValues = (records: any[]) => {
        if (!records.length) return records;

        const defaultMajor = parseNoParts(records[0].no).major || 5;
        const total = records.length;
        const seenMinors = new Set<number>();
        const missingMinors: number[] = [];

        // Collect current minors and find missing sequence slots 1..total
        const currentMinors = records.map((r) => parseNoParts(r.no).minor);
        for (let i = 1; i <= total; i += 1) {
          if (!currentMinors.includes(i)) missingMinors.push(i);
        }

        const consumeMissingMinor = () => {
          if (missingMinors.length > 0) return missingMinors.shift()!;
          let candidate = total + 1;
          while (seenMinors.has(candidate)) candidate += 1;
          return candidate;
        };

        return records.map((r) => {
          const { minor } = parseNoParts(r.no);
          if (!seenMinors.has(minor)) {
            seenMinors.add(minor);
            return { ...r, no: `${defaultMajor}.${minor}` };
          }
          const reassignedMinor = consumeMissingMinor();
          seenMinors.add(reassignedMinor);
          return { ...r, no: `${defaultMajor}.${reassignedMinor}` };
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
  }, [debouncedSearchText, activeTab, activeSubTab, fetchData]);

  useEffect(() => {
    const updateWidths = () => {
      const wrapper = tableWrapperRef.current;
      if (!wrapper) return;

      const tableBody = wrapper.querySelector(".ant-table-body") as HTMLElement;
      const table = wrapper.querySelector(".ant-table") as HTMLElement;

      if (!tableBody || !table) return;

      const leftCells = Array.from(
        table.querySelectorAll(".ant-table-cell-fix-left")
      ) as HTMLElement[];

      const leftWidths = new Set<number>();
      for (const cell of leftCells) {
        const w = cell?.offsetWidth ?? 0;
        if (w > 0) leftWidths.add(w);
      }
      const leftWidth = Array.from(leftWidths).reduce((s, w) => s + w, 0);

      setFixedLeftWidth(leftWidth);
      setTableScrollWidth(Math.max(0, tableBody.scrollWidth - leftWidth));
    };

    updateWidths();
    const t = window.setTimeout(updateWidths, 50);
    window.addEventListener("resize", updateWidths);

    return () => {
      window.removeEventListener("resize", updateWidths);
      window.clearTimeout(t);
    };
  }, [activeTab, activeSubTab, tableData, editingKeys]);

  const tabKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const currentTabIndex = tabKeys.indexOf(activeTab);
  const hasPrev = currentTabIndex > 0;
  const hasNext = currentTabIndex < tabKeys.length - 1;
  const goPrev = useCallback(() => {
    if (hasPrev) {
      setEditingKeys([]); // Clear editing state
      setActiveTab(tabKeys[currentTabIndex - 1]);
    }
  }, [currentTabIndex, hasPrev]);
  const goNext = useCallback(() => {
    if (hasNext) {
      setEditingKeys([]); // Clear editing state
      setActiveTab(tabKeys[currentTabIndex + 1]);
    }
  }, [currentTabIndex, hasNext]);
  const debouncedResize = useDebouncedCallback(() => {
    window.dispatchEvent(new Event("resize"));
  }, 50);
  // Fixed useEffect
  useEffect(() => {
    debouncedResize();
  }, [tableData, activeTab, activeSubTab, debouncedResize]);
  // Keep top scrollbar width in sync with table content (excluding Process column)

  const tabConfigs = [
    { key: "1", label: "Processes" },
    { key: "2", label: "Ownership" },
    {
      key: "3",
      label: "Control Environment",
      subTabs: ["coso", "intosai", "other"],
    },
    { key: "4", label: "Risk Assessment (Inherent Risk)" },
    { key: "5", label: "Risk Responses" },
    { key: "6", label: "Control Activities" },
    { key: "7", label: "Control Assessment" },
    { key: "8", label: "Risk Assessment (Residual Risk)" },
    {
      key: "9",
      label: "Compliance Management",
      subTabs: ["sox", "financial", "icfr"],
    },
    {
      key: "10",
      label: "Internal Audit Management",
      subTabs: ["audit", "grc"],
    },
  ];
  const getSectionFromTabKey = (tabKey: string): string => {
    switch (tabKey) {
      case "1":
        return "Process";
      case "2":
        return "Ownership";
      case "3":
        return "COSO-Control Environment";
      case "4":
        return "Risk Assessment (Inherent Risk)";
      case "5":
        return "Risk Responses";
      case "6":
        return "Control Activities";
      case "7":
        return "Control Assessment";
      case "8":
        return "Risk Assessment (Residual Risk)";
      case "9":
        return "SOX"; // Simplified
      case "10":
        return "Internal Audit Test"; // Simplified
      default:
        return "Process";
    }
  };
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    tabConfigs.forEach((config) => {
      const sheetName = config.label.slice(0, 31);
      //@ts-ignore
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
    XLSX.writeFile(wb, "AccountReceivable_Export.xlsx");
  };

  const handleDelete = useCallback(
    async (key: string) => {
      const item = tableData.find((r) => r.key === key);
      if (!item) return;
      const section = getCurrentSection();
      const endpoint = SECTION_TO_BASE_ENDPOINT[section];
      try {
        if (item.id) {
          // Use RESTful pattern: DELETE /{endpoint}/{id}
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
  // Transform data to match API format before sending
  const transformDataForAPI = (item: DataType, section: string): any => {
    const basePayload = {
      Id: item.id,
      Date: new Date().toISOString(),
      No: parseFloat(item.no as string) || 0,
      Process: item.process,
    };

    switch (section) {
      case "Risk Assessment (Inherent Risk)":
        return {
          ...basePayload,
          "Risk Type": item.riskType,
          "Risk Description": item.riskDescription,
          "Severity/ Impact": item.severityImpact,
          "Probability/ Likelihood": item.probabilityLikelihood,
          Classification: item.classification,
        };

      case "Risk Assessment (Residual Risk)":
        return {
          ...basePayload,
          "Risk Type": item.riskType,
          "Risk Description": item.riskDescription,
          "Severity/ Impact": item.severityImpact,
          "Probability/ Likelihood": item.probabilityLikelihood,
          Classification: item.classification,
        };

      case "Process":
        return {
          ...basePayload,
          "Process Description": item.processDescription,
          "Process Objectives": item.processObjective,
          "Process Severity Levels": item.processSeverityLevels,
        };

      case "Ownership":
        return {
          ...basePayload,
          "Main Process": item.process2,
          Activity: item.activity,
          "Process Stage": item.stage,
          Functions: item.functions,
          "Client Segment and/or Functional Segment": item.clientSegment,
          "Operational Unit": item.operationalUnit,
          Division: item.division,
          Entity: item.entity,
          "Unit / Department": item.unitDepartment,
          "Product Class": item.productClass,
          "Product Name": item.productName,
        };

      case "COSO-Control Environment":
        return {
          ...basePayload,
          "Integrity & Ethical Values": item.integrityEthical ? "P" : "O",
          "Board Oversight": item.boardOversight ? "P" : "O",
          "Organizational Structure": item.orgStructure ? "P" : "O",
          "Commitment to Competence": item.commitmentCompetence ? "P" : "O",
          "Management Philosophy": item.managementPhilosophy ? "P" : "O",
        };

      case "Risk Responses":
        return {
          ...basePayload,
          "Type of Risk Response": item.riskResponseType,
        };

      case "Control Activities":
        return {
          ...basePayload,
          "Control Objectives": item.controlObjectives,
          "Control Ref": item.controlRef,
          "Control Definition": item.controlDefinition,
          "Control Description": item.controlDescription,
          "Control Responsibility": item.controlResponsibility,
          "Key Control": item.keyControl ? "P" : "O",
          "Zero Tolerance": item.zeroTolerance ? "P" : "O",
        };

      case "SOX":
        return {
          ...basePayload,
          "SOX Control Activity": item.soxControlActivity,
        };

      case "Internal Audit Test":
        return {
          ...basePayload,
          Check: item.check ? "P" : "O",
          "Internal Audit Test": item.internalAuditTest,
          "Sample Size": item.sampleSize,
        };

      case "GRC Exception Log":
        return {
          ...basePayload,
          "GRC Adequacy": item.grcAdequacy,
          "GRC Effectiveness": item.grcEffectiveness,
          Explanation: item.explanation,
        };

      case "Financial Statement Assertions":
        return {
          ...basePayload,
          "Internal Control Over Financial Reporting?":
            item.internalControlOverFinancialReporting ? "P" : "O",
          Occurrence: item.occurrence ? "P" : "O",
          Completeness: item.completeness ? "P" : "O",
          Accuracy: item.accuracy ? "P" : "O",
          Authorization: item.authorization ? "P" : "O",
          Cutoff: item.cutoff ? "P" : "O",
          "Classification and Understandability":
            item.classificationAndUnderstandability ? "P" : "O",
          Existence: item.existence ? "P" : "O",
          "Rights and Obligations": item.rightsAndObligations ? "P" : "O",
          "Valuation and Allocation": item.valuationAndAllocation ? "P" : "O",
          "Presentation / Disclosure": item.presentationDisclosure ? "P" : "O",
        };

      case "Control Assessment":
        return {
          ...basePayload,
          "Level of Responsibility-Operating Level (Entity / Activity)":
            item.levelResponsibility,
          "COSO Principle #": item.cosoPrinciple,
          "Operational Approach (Automated / Manual)": item.operationalApproach,
          "Operational Frequency": item.operationalFrequency,
          "Control Classification (Preventive / Detective / Corrective)":
            item.controlClassification,
        };

      // Add other sections as needed
      default:
        return basePayload;
    }
  };

  const handleSave = useCallback(
    async (key: string) => {
      const itemIndex = tableData.findIndex((r) => r.key === key);
      if (itemIndex === -1) return;
      const item = tableData[itemIndex];
      const section = getCurrentSection();
      const endpoint = SECTION_TO_BASE_ENDPOINT[section];
      try {
        let updatedItem;
        if (item.id) {
          // Transform data to match API format before sending
          const payload = transformDataForAPI(item, section);
          await apiClientDotNet.put(`/${endpoint}/${item.id}`, payload);
          updatedItem = { ...item };
        } else {
          // Transform data to match API format before sending
          const payload = transformDataForAPI(item, section);
          const response = await apiClientDotNet.post(`/${endpoint}`, payload);
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
    [tableData, getCurrentSection, transformDataForAPI]
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

      // Convert Yes/No to boolean for ICFR field
      let processedValue = value;
      if (field === "internalControlOverFinancialReporting") {
        //@ts-ignore
        processedValue =
          value === "Yes" ? true : value === "No" ? false : value;
      }

      const newData = tableData.map((r) =>
        r.key === rowKey ? { ...r, [field]: processedValue } : r
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
  const handleStageChange = useCallback(
    (value: string, rowKey: string) => {
      const newData = tableData.map((r) =>
        r.key === rowKey ? { ...r, stage: value } : r
      );
      setTableData(newData);
    },
    [tableData, setTableData]
  );
  const handleToggleStatus = useCallback(
    (rowKey: string) => {
      const newData = tableData.map((r) =>
        r.key === rowKey ? { ...r, isActive: !(r.isActive !== false) } : r
      );
      setTableData(newData);
      setEditingKeys((prev) => prev.filter((k) => k !== rowKey));
    },
    [tableData, setTableData]
  );

  // Add this function with other handler functions
  const handleFormSubmit = () => {
    fetchData(); // This will refresh the table data
    setFormModalVisible(false);
    setEditingRecord(null);
  };

  const handleEdit = useCallback((record: DataType) => {
    setEditingRecord(record);
    setStartSectionKey(null);
    setFormModalVisible(true);
  }, []);
  // Memoized handlers object
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
      // onAddRow: handleAddRow,
      // onEditRow: handleEditRow,
      onAddRow: () => {
        setEditingRecord(null);
        const section = getCurrentSection();
        switch (section) {
          case "Process":
            setStartSectionKey("processes");
            break;
          case "Ownership":
            setStartSectionKey("ownerships");
            break;
          case "COSO-Control Environment":
            setStartSectionKey("coso-control-environments");
            break;
          case "INTOSAI, IFAC, and Government Audit Standards - Control Environment":
            setStartSectionKey("intosai-ifac-control-environments");
            break;
          case "Other- - Control Environment":
            setStartSectionKey("other-control-environments");
            break;
          case "Risk Assessment (Inherent Risk)":
            setStartSectionKey("risk-assessment-inherent-risks");
            break;
          case "Risk Responses":
            setStartSectionKey("risk-responses");
            break;
          case "Control Activities":
            setStartSectionKey("control-activities");
            break;
          case "Control Assessment":
            setStartSectionKey("control-assessments");
            break;
          case "Risk Assessment (Residual Risk)":
            setStartSectionKey("risk-assessment-residual-risks");
            break;
          case "SOX":
            setStartSectionKey("sox");
            break;
          case "Internal Audit Test":
            setStartSectionKey("internal-audit-tests");
            break;
          case "GRC Exception Log":
            setStartSectionKey("grc-exception-logs");
            break;
          default:
            setStartSectionKey("processes");
        }
        setFormModalVisible(true);
      },
      onEditRow: handleEditRow,
      onDeleteRow: handleDeleteRow,
      onStageChange: handleStageChange,
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
      handleAddRow,
      handleEditRow,
      handleDeleteRow,
      handleStageChange,
      handleToggleStatus,
    ]
  );
  // Improved columns memo with cleanup
  const columns = useMemo(() => {
    // Clear any pending edits when tab changes
    //@ts-ignore
    return getColumns(activeTab, activeSubTab, handlers, editingKeys);
  }, [activeTab, activeSubTab, editingKeys, handlers]);
  // Handle tab changes with cleanup
  const handleTabChange = useCallback((key: string) => {
    setEditingKeys([]); // Clear editing state
    setActiveTab(key);
  }, []);
  const handleSubTabChange = useCallback((key: string) => {
    setEditingKeys([]); // Clear editing state
    setActiveSubTab(key);
  }, []);
  // Scroll handler with cleanup
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollSyncRef.current) return;

    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;

    if (topScrollbarRef.current) {
      scrollSyncRef.current = false;
      topScrollbarRef.current.scrollLeft = scrollLeft;
      setTimeout(() => {
        scrollSyncRef.current = true;
      }, 50);
    }

    const header = tableWrapperRef.current?.querySelector(
      ".ant-table-header"
    ) as HTMLElement;
    if (header) {
      header.scrollLeft = scrollLeft;
    }
  }, []);

  const handleTopScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!scrollSyncRef.current) return;

    const target = e.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;

    const body = tableWrapperRef.current?.querySelector(
      ".ant-table-body"
    ) as HTMLElement;
    if (body) {
      scrollSyncRef.current = false;
      body.scrollLeft = scrollLeft;
    }

    const header = tableWrapperRef.current?.querySelector(
      ".ant-table-header"
    ) as HTMLElement;
    if (header) {
      header.scrollLeft = scrollLeft;
    }

    setTimeout(() => {
      scrollSyncRef.current = true;
    }, 50);
  }, []);
  const handleDataLoaded = async (data: DataType[]) => {
    // Existing bulk post functionality remains unchanged
    // But refresh data after import
    await importSectionData(currentSection, data); // Assuming this posts bulk
    fetchData();
  };
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
                RCM – Account Receivable
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
              popupClassName="tabs-overflow-dropdown"
              destroyInactiveTabPane={true} // Add this to properly clean up
            />
          </div>
          {/* Sub-tabs */}
          {activeTab === "3" && (
            <div className="bg-white/50 backdrop-blur-sm rounded-b-xl shadow-sm mb-4">
              <Tabs
                activeKey={activeSubTab}
                onChange={handleSubTabChange}
                className="text-sm"
                items={[
                  { key: "coso", label: "COSO" },
                  {
                    key: "intosai",
                    label: "INTOSAI, IFAC, and Government Audit Standards",
                  },
                  { key: "other", label: "Other" },
                ]}
                popupClassName="tabs-overflow-dropdown"
                destroyInactiveTabPane={true}
              />
            </div>
          )}
          {activeTab === "9" && (
            <div className="bg-white/50 backdrop-blur-sm rounded-b-xl shadow-sm mb-4">
              <Tabs
                activeKey={activeSubTab}
                onChange={handleSubTabChange}
                className="text-sm"
                items={[
                  { key: "sox", label: "SOX" },
                  { key: "financial", label: "Financial Statement Assertions" },
                  {
                    key: "icfr",
                    label: "Internal Control Over Financial Reporting",
                  },
                ]}
                popupClassName="tabs-overflow-dropdown"
                destroyInactiveTabPane={true}
              />
            </div>
          )}
          {activeTab === "10" && (
            <div className="bg-white/50 backdrop-blur-sm rounded-b-xl shadow-sm mb-4">
              <Tabs
                activeKey={activeSubTab}
                onChange={handleSubTabChange}
                className="text-sm"
                items={[
                  { key: "audit", label: "Internal Audit Test" },
                  { key: "grc", label: "GRC Exception Logs" },
                ]}
                popupClassName="tabs-overflow-dropdown"
                destroyInactiveTabPane={true}
              />
            </div>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 pt-4">
          <style jsx global>{`
            /* Keep tabs overflow dropdown visible and clickable */
            .tabs-overflow-dropdown {
              z-index: 3000 !important;
            }

            /* Hide native horizontal scrollbars for the table; use custom top scrollbar instead */
            .ant-table-body::-webkit-scrollbar {
              display: none;
            }
            .ant-table-body {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .ant-table-header::-webkit-scrollbar {
              display: none;
            }
            .ant-table-header {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .row-deactivated {
              background-color: #e5e7eb !important;
              color: #6b7280 !important;
              opacity: 0.7;
            }
            .top-scrollbar::-webkit-scrollbar {
              height: 8px;
            }

            .top-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }

            .top-scrollbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 4px;
            }

            .top-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555;
            }

            /* Hide table's horizontal scrollbar */
            .ant-table-body::-webkit-scrollbar:horizontal {
              display: none !important;
              height: 0 !important;
            }

            .ant-table-body {
              scrollbar-width: none !important;
            }
          `}</style>
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
              {/* Custom Top Scrollbar for all columns except 'Processes' */}
              <div
                className="sticky top-0 z-20 overflow-x-auto bg-white border-b border-gray-200 -mx-6 px-6 mb-3 top-scrollbar"
                style={{
                  height: "15px",
                  marginLeft: fixedLeftWidth,
                  width: `calc(100% - ${fixedLeftWidth}px)`,
                  scrollbarWidth: "thin",
                  scrollbarColor: "#787878 #e5e7eb",
                }}
                onScroll={handleTopScroll}
                ref={topScrollbarRef}
              >
                <div
                  style={{
                    width: `${tableScrollWidth}px`,
                    height: "100%",
                    background: "transparent",
                  }}
                />
              </div>

              <div
                ref={tableWrapperRef}
                className="bg-white shadow-md rounded-b-lg"
                style={{ maxHeight: "calc(100vh - 280px)", minHeight: "500px" }}
              >
                <Table
                  key={`table-${activeTab}-${activeSubTab}`}
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  // scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
                  bordered
                  rowKey={(r) => `${r.key}-${r.isActive?.toString()}`}
                  rowClassName={(r) =>
                    r.isActive === false ? "row-deactivated" : ""
                  }
                  scroll={{
                    x: "max-content",
                    // y: "calc(100vh - 340px)"
                  }}
                  onScroll={handleScroll}
                />
              </div>

              <div
                className="sticky bottom-0 z-20 overflow-x-auto bg-white border-t border-gray-200 -mx-6 px-6 mt-3 top-scrollbar"
                style={{
                  height: "15px",
                  marginLeft: fixedLeftWidth,
                  width: `calc(100% - ${fixedLeftWidth}px)`,
                  scrollbarWidth: "thin",
                  scrollbarColor: "#787878 #e5e7eb",
                }}
                onScroll={handleTopScroll}
              >
                <div
                  style={{
                    width: `${tableScrollWidth}px`,
                    height: "100%",
                    background: "transparent",
                  }}
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
});
AccountReceivable.displayName = "AccountReceivable";
export default AccountReceivable;
