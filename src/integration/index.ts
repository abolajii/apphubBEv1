import axios from "axios";
import { apiConfig, appConfig } from "../config/index";

const baseUrl = apiConfig.baseUrl;

export const updateAppHealth = async (appId: number, healthy: boolean) => {
  try {
    const requestBody = { appId, healthy };
    const response = await axios.post(`${baseUrl}/applications/health-update`, requestBody);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message || "Unknown error",
    };
  }
};

export const createLog = async (
  appId: number,
  appName: string,
  logData: {
    logType: string;
    message: string;
    statusCode: number;
    responseTime?: number;
    endpoint: string;
    method: string;
    additionalData?: any;
  }
) => {
  const payload = { appId, appName, ...logData };
  
  try {
    const response = await axios.post(`${baseUrl}/logs`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
