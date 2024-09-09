import AxiosCreator from "../axios.config";

export const getAdminDashboard = async (params) => {
  try {
    const response = await AxiosCreator.get("/api/dashboard", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getTrendDataConfig = async (params) => {
  try {
    const response = await AxiosCreator.get("/api/dashboard/jobcard-trend", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
