import {
  getAdminDashboard,
  getTrendDataConfig,
} from "../../config/dashboardConfig/dashboard.config";

export const getAdminListData = async (params) => {
  const response = await getAdminDashboard(params);
  return response;
};
export const getTrendDataAction = async (params) => {
  const response = await getTrendDataConfig(params);
  return response;
};
