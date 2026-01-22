// In sectionDataService.ts
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
import { apiClientDotNet } from "@/config/apiClientDotNet";
import { getEndpointForSection } from "./sectionMappings";
export const submitSectionData = async (
  section: string,
  data: any,
): Promise<ApiResponse> => {
  const endpoint = getEndpointForSection(section);
  if (!endpoint) {
    return {
      success: false,
      message: `No API endpoint found for section: ${section}`,
    };
  }
  try {
    // Transform data to match the expected API format
    const requestData = data.map((item: any) => {
      const transformed: any = {};
      // Copy all properties except the key
      Object.keys(item).forEach((key) => {
        if (key !== "key") {
          transformed[key] = item[key];
        }
      });
      return transformed;
    });
    const response = await apiClientDotNet.post(
      `/${endpoint}/bulk`,
      requestData,
    ); // Keep bulk post
    return {
      success: true,
      data: response.data,
      message: "Data submitted successfully",
    };
  } catch (error: any) {
    console.error(`Error submitting data for ${section}:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message || `Failed to submit data for ${section}`,
    };
  }
};
