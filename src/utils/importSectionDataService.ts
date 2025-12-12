// src/utils/importSectionDataService.ts
import { apiClientDotNet } from "@/config/apiClientDotNet";
import { getEndpointForSection } from "./sectionMappings";
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
// Define field mappings for each section to transform response to API request format
// NOTE: Excludes Id and Date as per API requirements
const SECTION_FIELD_MAPPINGS: Record<string, string[]> = {
  Process: [
    "No",
    "Process",
    "Process Description",
    "Process Objectives",
    "Process Severity Levels",
  ],
  Ownership: [
    "No",
    "Main Process",
    "Process",
    "Activity",
    "Process Stage",
    "Functions",
    "Client Segment and/or Functional Segment",
    "Operational Unit",
    "Division",
    "Entity",
    "Unit / Department",
    "Product Class",
    "Product Name",
  ],
  "COSO-Control Environment": [
    "No",
    "Process",
    "Integrity & Ethical Values",
    "Board Oversight",
    "Organizational Structure",
    "Commitment to Competence",
    "Management Philosophy",
  ],
  "INTOSAI, IFAC, and Government Audit Standards - Control Environment": [
    "No",
    "Process",
    "Integrity and Ethical Values",
    "Commitment to Competence",
    "Management's Philosophy and Operating Style",
    "Organizational Structure",
    "Assignment of Authority and Responsibility",
    "Human Resource Policies and Practices",
    "Board of Directors' or Audit Committee's Participation",
    "Management Control Methods",
    "External Influences",
    "Management's Commitment to Internal Control",
    "Communication and Enforcement of Integrity and Ethical Values",
    "Employee Awareness and Understanding",
    "Accountability and Performance Measurement",
    "Commitment to Transparency and Openness",
  ],
  "Other- - Control Environment": [
    "No",
    "Process",
    "Responsibility Delegation Matrix",
    "Segregation of duties",
    "Reporting Lines",
    "Mission",
    "Vision and Values",
    "Goals and Objectives",
    "Structures & Systems",
    "Policies and Procedures",
    "Processes",
    "Integrity and Ethical Values",
    "Oversight structure",
    "Standards",
    "Methodologies",
    "Rules and Regulations",
  ],
  "Risk Assessment  (Inherent Risk)": [
    "No",
    "Process",
    "Risk Type",
    "Risk Description",
    "Severity/ Impact",
    "Probability/ Likelihood",
    "Classification",
  ],
  "Risk Responses": ["No", "Process", "Type of Risk Response"],
  "Control Activities": [
    "No",
    "Process",
    "Control Objectives",
    "Control Ref",
    "Control Definition",
    "Control Description",
    "Control Responsibility",
    "Key Control",
    "Zero Tolerance",
  ],
  "Control Assessment": [
    "No",
    "Process",
    "Level of Responsibility-Operating Level (Entity / Activity)",
    "COSO Principle #",
    "Operational Approach (Automated / Manual)",
    "Operational Frequency",
    "Control Classification (Preventive / Detective / Corrective)",
  ],
  "Risk Assessment (Residual Risk)": [
    "No",
    "Process",
    "Risk Type",
    "Risk Description",
    "Severity/ Impact",
    "Probability/ Likelihood",
    "Classification",
  ],
  SOX: ["No", "Process", "SOX Control Activity"],
  "Financial Statement Assertions": [
    "No",
    "Process",
    "Internal Control Over Financial Reporting?",
    "Occurrence",
    "Completeness",
    "Accuracy",
    "Authorization",
    "Cutoff",
    "Classification and Understandability",
    "Existence",
    "Rights and Obligations",
    "Valuation and Allocation",
    "Presentation / Disclosure",
  ],
  "Internal Audit Test": [
    "No",
    "Process",
    "Check",
    "Internal Audit Test",
    "Sample Size",
  ],
  "GRC Exception Log": [
    "No",
    "Process",
    "GRC Adequacy",
    "GRC Effectiveness",
    "Explanation",
  ],
};
/**
 * Transform imported data to match the API request format for a specific section
 * Excludes Id and Date fields as per API requirements
 */
const transformDataForSection = (sectionName: string, data: any[]): any[] => {
  const fieldMapping = SECTION_FIELD_MAPPINGS[sectionName] || [];
  return data.map((item, index) => {
    const transformed: any = {};
    // Include all fields from mapping
    fieldMapping.forEach((field) => {
      // Handle special mappings for Ownership
      if (sectionName === "Ownership") {
        if (field === "Main Process") {
          // In Ownership, Main Process should use the "Main Process" column or fallback to first "Process" value
          transformed[field] = item["Main Process"] || "";
        } else if (field === "Process") {
          // In Ownership, Process should use the "Process" column
          transformed[field] = item["Process"] || "";
        } else if (field === "No") {
          // Ensure No is a number
          transformed[field] = item.No || item.no || 0;
        } else {
          // Copy value or empty string for all other fields
          transformed[field] = item[field] || "";
        }
      } else {
        // For other sections, use the original logic
        if (field === "Process") {
          // For Process field, use "Main Process" if available, otherwise "Process"
          transformed[field] = item["Main Process"] || item["Process"] || "";
        } else if (field === "No") {
          // Ensure No is a number
          transformed[field] = item.No || item.no || 0;
        } else {
          // Copy value or empty string for all other fields
          transformed[field] = item[field] || "";
        }
      }
    });
    
    // Log the transformation for Ownership to debug
    if (sectionName === "Ownership" && index === 0) {
      console.log("[transformDataForSection] Ownership mapping example:", {
        original: item,
        transformed,
        fieldMapping,
      });
    }
    
    return transformed;
  });
};
/**
 * Import section data to the backend
 * Reusable function that handles all section types
 */
export const importSectionData = async (
  sectionName: string,
  data: any[]
): Promise<ApiResponse> => {
  console.log("[importSectionData] Called with:", {
    sectionName,
    dataLength: data.length,
  });
  const baseEndpoint = getEndpointForSection(sectionName);
  console.log("[importSectionData] Endpoint resolved:", baseEndpoint);
  if (!baseEndpoint) {
    const errorMsg = `No API endpoint found for section: ${sectionName}`;
    console.error("[importSectionData]", errorMsg);
    return {
      success: false,
      message: errorMsg,
    };
  }
  try {
    // Transform data to match API format
    const transformedData = transformDataForSection(sectionName, data);
    console.log("[importSectionData] Transformed data:", {
      sectionName,
      dataCount: transformedData.length,
      firstRecord: transformedData[0],
      allRecords: transformedData,
    });
    // Send POST request to the appropriate endpoint
    const url = `/${baseEndpoint}/bulk`;
    console.log("[importSectionData] Sending POST request to:", url);
    const response = await apiClientDotNet.post(url, transformedData);
    console.log("[importSectionData] Success response:", response.data);
    return {
      success: true,
      data: response.data,
      message: `Data imported successfully for ${sectionName}`,
    };
  } catch (error: any) {
    console.error(`[importSectionData] Error importing ${sectionName}:`, error);
    console.error("[importSectionData] Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return {
      success: false,
      message:
        error.response?.data?.message ||
        `Failed to import data for ${sectionName}`,
    };
  }
};
