import axios from "axios";
import { apiConfig } from "../config/index";

const baseUrl = apiConfig.baseUrl;

export const updateAppHealth = async (appId: string, healthy: boolean) => {
  try {
    const requestBody = { appId, healthy };
    const response = await axios.post(
      `${baseUrl}/api/v1/application/health-update`,
      requestBody
    );
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data || error.message || "Unknown error",
    };
  }
};

export const createLog = async (
  appId: string,
  appName: string,
  logData: {
    logType: string;
    message: string;
    statusCode: number;
    responseTime?: number;
    endpoint: string;
    method: string;
    userAgent?: string;
    ip?: string;
    additionalData?: any;
  }
) => {
  const payload = {
    appId,
    appName,
    ...logData,
    userAgent: logData.userAgent || "System-Internal/1.0",
    ip: logData.ip || "127.0.0.1",
  };

  try {
    const response = await axios.post(`${baseUrl}/api/v1/log`, payload);
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message };
  }
};
